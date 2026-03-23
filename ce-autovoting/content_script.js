// ============================================================
// CONSTANTS
// ============================================================

const FIRST_NAMES = ['James', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Thomas', 'Charles', 'Daniel', 'Matthew'];
const LAST_NAMES  = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor'];

const TARGET_ORIGINS = [
  'embed-1142836.secondstreetapp.com',
  'thehuntsvilleitem.secondstreetapp.com',
];

// ============================================================
// GUARD — only run when background explicitly enables this tab
// ============================================================

(async () => {
  const { autoVoteEnabled } = await chrome.storage.local.get('autoVoteEnabled');
  if (!autoVoteEnabled) return;
  await autoVote();
})();

// ============================================================
// DEBUG LOG — persists to chrome.storage for post-mortem analysis
// ============================================================

const _debugLog = [];
async function dbg(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}`;
  _debugLog.push(entry);
  console.log('[autoVote]', msg);
  await chrome.storage.local.set({ debugLog: _debugLog }).catch(() => {});
}

// ============================================================
// HELPERS
// ============================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for button.voting-button via MutationObserver — runs as soon as it hits the DOM
 * (or when ssButtonDisabled is removed). No fixed Ember sleep before this.
 */
function waitForVoteButton(timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let firstSeenAt = null;
    let disabledFallbackTimer = null;
    const DISABLED_GRACE_MS = 12000;
    let hardTimeout;
    let observer;

    const cleanup = () => {
      if (disabledFallbackTimer) {
        clearTimeout(disabledFallbackTimer);
        disabledFallbackTimer = null;
      }
      if (observer) observer.disconnect();
    };

    const finish = (btn, warnDisabled) => {
      if (settled) return;
      settled = true;
      cleanup();
      clearTimeout(hardTimeout);
      btn.scrollIntoView({ block: 'center', behavior: 'instant' });
      if (warnDisabled) {
        console.warn('[autoVote] voting-button still ssButtonDisabled after wait — clicking anyway');
      }
      resolve(btn);
    };

    const tryPick = () => {
      if (settled) return;
      const enabled = document.querySelector('button.voting-button:not(.ssButtonDisabled)');
      if (enabled) {
        finish(enabled, false);
        return;
      }
      const any = document.querySelector('button.voting-button');
      if (!any) return;

      if (firstSeenAt === null) {
        firstSeenAt = Date.now();
        if (any.classList.contains('ssButtonDisabled') && !disabledFallbackTimer) {
          disabledFallbackTimer = setTimeout(() => tryPick(), DISABLED_GRACE_MS);
        }
      }

      if (firstSeenAt !== null && Date.now() - firstSeenAt >= DISABLED_GRACE_MS) {
        finish(any, true);
      }
    };

    hardTimeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      const vb = document.querySelectorAll('button.voting-button');
      console.warn(`[autoVote] Timeout. button.voting-button count=${vb.length}`);
      vb.forEach((b, i) => console.warn(`  [${i}] class="${b.className}"`));
      reject(new Error('[autoVote] Timeout waiting for button.voting-button'));
    }, timeoutMs);

    observer = new MutationObserver(() => { tryPick(); });
    const obsOpts = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'disabled'],
    };

    const attach = () => {
      const root = document.body;
      if (root) observer.observe(root, obsOpts);
      else {
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, obsOpts);
          tryPick();
        }, { once: true });
      }
    };
    attach();
    tryPick();
  });
}

function waitForElement(selector, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) { resolve(existing); return; }

    const timer = setTimeout(() => {
      observer.disconnect();

      const allBtns = document.querySelectorAll('button');
      console.warn(`[autoVote] Timeout. Found ${allBtns.length} button(s) on page:`);
      allBtns.forEach((b, i) => {
        console.warn(`  [${i}] class="${b.className}" text="${b.innerText.trim().slice(0, 60)}"`);
      });
      const bodySnippet = document.body ? document.body.innerHTML.slice(0, 500) : '(no body)';
      console.warn('[autoVote] body snippet:', bodySnippet);

      reject(new Error(`[autoVote] Timeout waiting for element: ${selector}`));
    }, timeoutMs);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(el);
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  });
}

function fillInput(inputElement, value) {
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  nativeSetter.call(inputElement, value);
  inputElement.dispatchEvent(new Event('input',  { bubbles: true }));
  inputElement.dispatchEvent(new Event('change', { bubbles: true }));
}

async function getNextEmail() {
  const { emailMode = 'pool' } = await chrome.storage.local.get('emailMode');

  if (emailMode === 'temp') {
    const { currentTempEmail } = await chrome.storage.local.get('currentTempEmail');
    if (!currentTempEmail || !currentTempEmail.address) {
      throw new Error('No temp email available — background should have generated one.');
    }
    console.log(`[autoVote] Using temp email: ${currentTempEmail.address}`);
    return currentTempEmail.address;
  }

  // Pool mode: read from uploaded JSON pool
  const { emailPool = [] } = await chrome.storage.local.get('emailPool');
  if (emailPool.length === 0) {
    throw new Error('Email pool exhausted. Load more emails via the popup.');
  }
  const email = emailPool[0];
  console.log(`[autoVote] Email from pool: ${email} (${emailPool.length} remaining)`);
  return email;
}

// ============================================================
// CAPTCHA — solveTurnstile()
// ============================================================

async function solveTurnstile() {
  try {
    const { capsolverKey } = await chrome.storage.local.get('capsolverKey');
    if (!capsolverKey) throw new Error('CapSolver API key not set. Configure it in the extension popup.');

    const sitekeyEl = document.querySelector('.cf-turnstile');
    if (!sitekeyEl) throw new Error('[autoVote] .cf-turnstile element not found');
    const websiteKey = sitekeyEl.dataset.sitekey;

    const createRes = await fetch('https://api.capsolver.com/createTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientKey: capsolverKey,
        task: {
          type: 'AntiTurnstileTaskProxyLess',
          websiteURL: window.location.href,
          websiteKey
        }
      })
    });
    const createData = await createRes.json();
    if (!createData.taskId) throw new Error(`[autoVote] CapSolver createTask failed: ${JSON.stringify(createData)}`);
    const taskId = createData.taskId;

    const deadline = Date.now() + 60000;
    let token = null;
    while (Date.now() < deadline) {
      await sleep(3000);
      const resultRes = await fetch('https://api.capsolver.com/getTaskResult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientKey: capsolverKey, taskId })
      });
      if (!resultRes.ok) {
        console.warn(`[autoVote] CapSolver poll HTTP ${resultRes.status} — retrying`);
        continue;
      }
      const resultData = await resultRes.json();
      if (resultData.status === 'ready') {
        token = resultData.solution.token;
        break;
      }
    }
    if (!token) throw new Error('[autoVote] CapSolver timed out after 60s');

    const tokenInput = document.querySelector('input[name="cf-turnstile-response"]');
    if (tokenInput) {
      fillInput(tokenInput, token);
      tokenInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    console.log('[autoVote] ✓ Turnstile token injected');
    return token;
  } catch (err) {
    console.error('[autoVote] solveTurnstile error:', err.message);
    throw err;
  }
}

// ============================================================
// MAIN — autoVote()
// ============================================================

async function autoVote() {
  try {
    // ----------------------------------------------------------
    // Step 1 — Identity
    // ----------------------------------------------------------
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName  = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const email     = await getNextEmail();
    await dbg(`Identity: ${firstName} ${lastName} <${email}>`);

    // No fixed Ember/scroll delay — MutationObserver starts as soon as voting-button exists
    await dbg('Watching DOM for vote button (observer)...');

    // ----------------------------------------------------------
    // Step 2 — Click vote button
    // ----------------------------------------------------------
    const voteBtn = await waitForVoteButton(45000);
    voteBtn.click();
    await dbg('Vote button clicked');
    await sleep(2000);

    // ==========================================================
    // FORM PAGE 1 — Email (field_id 39)
    // ==========================================================

    let emailInput = null;
    const emailSelectors = [
      'input[type="email"]', 'input[name*="email"]',
      'input[placeholder*="email" i]', 'ss-form-field[data-field-id="39"] input',
    ];
    const emailDeadline = Date.now() + 15000;
    outer: while (Date.now() < emailDeadline) {
      for (const sel of emailSelectors) {
        const el = document.querySelector(sel);
        if (el) { emailInput = el; break outer; }
      }
      await sleep(500);
    }
    if (!emailInput) throw new Error('[autoVote] Could not find email input after 15s');
    fillInput(emailInput, email);
    await dbg(`Email filled: ${email}`);
    await sleep(800);

    const hasCaptcha = !!document.querySelector('.cf-turnstile');
    if (hasCaptcha) {
      await dbg('Turnstile detected on page 1, solving...');
      await solveTurnstile();
      await sleep(800);
    } else {
      await dbg('No CAPTCHA on page 1');
    }

    const page1SubmitSelectors = [
      'button.ssButtonContinue', 'button.ssFormVoteButton',
      'form.form button[type="submit"]',
    ];
    let page1Btn = null;
    for (const sel of page1SubmitSelectors) {
      page1Btn = document.querySelector(sel);
      if (page1Btn) break;
    }
    if (!page1Btn) {
      page1Btn = await waitForElement(page1SubmitSelectors.join(', '), 10000);
    }
    page1Btn.click();
    await dbg('Page 1 (email) submitted');
    await sleep(3000);

    // ==========================================================
    // FORM PAGE 2 — Registration
    // ==========================================================

    const firstNameInput = await waitForElement('ss-form-field[data-field-id="40"] input.ember-text-field', 15000);
    fillInput(firstNameInput, firstName);
    await dbg(`First name filled: ${firstName}`);
    await sleep(600);

    const lastNameInput = document.querySelector('ss-form-field[data-field-id="41"] input.ember-text-field');
    if (lastNameInput) { fillInput(lastNameInput, lastName); await sleep(600); }
    await dbg(`Last name filled: ${lastName}`);

    const zipInput = document.querySelector('ss-form-field[data-field-id="43"] input.ember-text-field');
    if (zipInput) { fillInput(zipInput, '77340'); await sleep(600); }
    await dbg('Zip filled: 77340');

    const checkboxInput = document.querySelector('ss-form-field[data-field-id="594"] input.ssCheckboxField');
    if (checkboxInput && !checkboxInput.checked) {
      checkboxInput.checked = true;
      checkboxInput.dispatchEvent(new Event('click',  { bubbles: true }));
      checkboxInput.dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(600);
    }

    await dbg('Page 2 form fields filled');
    await sleep(800);

    const page2SubmitSelectors = [
      'button.ssFormVoteButton', 'button.ssButtonContinue',
      'form.form button[type="submit"]',
    ];
    let page2Btn = null;
    for (const sel of page2SubmitSelectors) {
      page2Btn = document.querySelector(sel);
      if (page2Btn) break;
    }
    if (!page2Btn) {
      page2Btn = await waitForElement(page2SubmitSelectors.join(', '), 10000);
    }
    page2Btn.click();
    await dbg('Page 2 (vote) submitted');
    await sleep(2000);

    // Step 7b — Turnstile after page 2 submit
    let turnstileFound = false;
    const turnstileDeadline = Date.now() + 10000;
    while (Date.now() < turnstileDeadline) {
      if (document.querySelector('.cf-turnstile')) {
        turnstileFound = true;
        break;
      }
      await sleep(500);
    }
    if (turnstileFound) {
      await dbg('Turnstile detected after page 2 submit, solving...');
      await solveTurnstile();
      await sleep(3000);
      await dbg('Turnstile solved, waiting for page transition...');
    } else {
      await dbg('No Turnstile after page 2 submit');
    }

    // ----------------------------------------------------------
    // Step 8 — Detect: email verification OR direct success
    // ----------------------------------------------------------
    await dbg('Step 8: Scanning for confirmation/verification screen...');
    let result = null; // 'needs_verification' | 'success'
    const confirmDeadline = Date.now() + 30000;
    let scanCount = 0;

    while (Date.now() < confirmDeadline) {
      const pageText = (document.body?.innerText || '').toLowerCase();
      scanCount++;

      // Log first scan and every 10th scan for diagnostics
      if (scanCount === 1 || scanCount % 10 === 0) {
        const snippet = pageText.slice(0, 300).replace(/\n/g, ' ');
        await dbg(`Scan #${scanCount} — page text (first 300): "${snippet}"`);
      }

      // Check for email verification screen FIRST (higher priority)
      if (pageText.includes('we sent an email') ||
          pageText.includes('we\'ve sent') ||
          pageText.includes('link you must click') ||
          pageText.includes('check your email') ||
          pageText.includes('verify your email') ||
          pageText.includes('continue participating') ||
          pageText.includes('confirmation email') ||
          pageText.includes('sent you an email') ||
          pageText.includes('email with a link')) {
        result = 'needs_verification';
        await dbg('DETECTED: Email verification screen');
        break;
      }

      // Then check for direct success
      const successSelectors = ['.success', '.confirmation', '[class*="success"]', '[class*="thank"]'];
      let directSuccess = false;
      for (const sel of successSelectors) {
        if (document.querySelector(sel)) { directSuccess = true; break; }
      }
      if (!directSuccess) {
        if (pageText.includes('thank you') || pageText.includes('thanks for entering') ||
            pageText.includes('voted') || pageText.includes('vote has been') ||
            pageText.includes('your entry') || pageText.includes('successfully entered')) {
          directSuccess = true;
        }
      }
      if (directSuccess) {
        result = 'success';
        await dbg('DETECTED: Direct success screen');
        break;
      }

      await sleep(500);
    }

    if (result === 'needs_verification') {
      await dbg('Email verification required — handing off to background');
      chrome.runtime.sendMessage({ type: 'VOTE_NEEDS_VERIFICATION', email }).catch(() => {});
    } else if (result === 'success') {
      await dbg('✓ Direct success confirmed');
      chrome.runtime.sendMessage({ type: 'VOTE_SUCCESS', email }).catch(() => {});
    } else {
      const finalText = (document.body?.innerText || '').slice(0, 500).replace(/\n/g, ' ');
      await dbg(`TIMEOUT — page text (first 500): "${finalText}"`);
      await dbg('No confirmation or verification screen detected after 30s');
      chrome.runtime.sendMessage({ type: 'VOTE_ERROR', error: 'No confirmation or verification detected after 30s' }).catch(() => {});
    }

    // ----------------------------------------------------------
    // Step 9 — Clear domain data
    // ----------------------------------------------------------
    for (const origin of TARGET_ORIGINS) {
      await chrome.runtime.sendMessage({ type: 'CLEAR_DATA', origin }).catch(() => {});
    }
    console.log('[autoVote] Cache and cookies cleared for all origins');

  } catch (err) {
    await dbg(`FATAL ERROR: ${err.message}`);
    chrome.runtime.sendMessage({ type: 'VOTE_ERROR', error: err.message }).catch(() => {});
    for (const origin of TARGET_ORIGINS) {
      await chrome.runtime.sendMessage({ type: 'CLEAR_DATA', origin }).catch(() => {});
    }
    console.log('[autoVote] Cache cleared after error');
    throw err;
  }
}
