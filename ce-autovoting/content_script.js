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
// HELPERS
// ============================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForElement(selector, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    // Resolve immediately if already in DOM
    const existing = document.querySelector(selector);
    if (existing) { resolve(existing); return; }

    // Use MutationObserver — fires the instant Ember inserts the element, no polling lag
    const timer = setTimeout(() => {
      observer.disconnect();

      // Diagnostics: dump all buttons and their classes so we can find the right selector
      const allBtns = document.querySelectorAll('button');
      console.warn(`[autoVote] Timeout. Found ${allBtns.length} button(s) on page:`);
      allBtns.forEach((b, i) => {
        console.warn(`  [${i}] class="${b.className}" text="${b.innerText.trim().slice(0, 60)}"`);
      });
      // Also log first 3 levels of body class structure for context
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

    // Guard: if body isn't ready yet, wait for it
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  });
}

/**
 * Use native HTMLInputElement prototype setter so Ember.js observes the change.
 * Never do element.value = x directly.
 */
function fillInput(inputElement, value) {
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  nativeSetter.call(inputElement, value);
  inputElement.dispatchEvent(new Event('input',  { bubbles: true }));
  inputElement.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Peek at the next email in the pool — does NOT remove it.
 * Removal only happens on VOTE_SUCCESS via background.js.
 * On failure the email stays at the front of the pool for the next attempt.
 */
async function getNextEmail() {
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
    // Read API key from storage (never hardcoded)
    const { capsolverKey } = await chrome.storage.local.get('capsolverKey');
    if (!capsolverKey) throw new Error('CapSolver API key not set. Configure it in the extension popup.');

    const sitekeyEl = document.querySelector('.cf-turnstile');
    if (!sitekeyEl) throw new Error('[autoVote] .cf-turnstile element not found');
    const websiteKey = sitekeyEl.dataset.sitekey;

    // Create task
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

    // Poll for result
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

    // Inject token
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
    console.log(`[autoVote] Identity: ${firstName} ${lastName} <${email}>`);

    // Wait for Ember.js to bootstrap and render components before querying the DOM
    console.log('[autoVote] Waiting for Ember render...');
    await sleep(3000);

    // Scroll down to trigger lazy-rendering of gallery items, then back to top
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    await sleep(1500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await sleep(500);
    console.log('[autoVote] Scroll complete');

    // ----------------------------------------------------------
    // Step 2 — Click vote button (initial trigger, NOT the form submit)
    // The initial vote trigger has class "voting-button".
    // "vote-button" only appears on the form submit button after the form opens.
    // ----------------------------------------------------------
    const voteBtn = await waitForElement('button.voting-button:not(.ssButtonDisabled)', 30000);
    voteBtn.click();
    console.log('[autoVote] Vote button clicked');
    await sleep(2000);

    // ==========================================================
    // FORM PAGE 1 — Email (field_id 39)
    // ==========================================================

    // Step 3 — Fill email
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
    console.log(`[autoVote] Email filled: ${email}`);
    await sleep(800);

    // Step 4 — Handle Turnstile on page 1 (optional)
    const hasCaptcha = !!document.querySelector('.cf-turnstile');
    if (hasCaptcha) {
      console.log('[autoVote] Turnstile detected, solving...');
      await solveTurnstile();
      await sleep(800);
    } else {
      console.log('[autoVote] No CAPTCHA on page 1');
    }

    // Step 5 — Submit page 1 (email) to advance to page 2
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
    console.log('[autoVote] Page 1 (email) submitted');
    await sleep(3000);

    // ==========================================================
    // FORM PAGE 2 — Registration (first name, last name, zip, checkbox)
    // Wait for page 2 fields to render after page 1 submission
    // ==========================================================

    // Step 6 — Wait for page 2 to load, then fill registration fields
    const firstNameInput = await waitForElement('ss-form-field[data-field-id="40"] input.ember-text-field', 15000);
    fillInput(firstNameInput, firstName);
    console.log(`[autoVote] First name filled: ${firstName}`);
    await sleep(600);

    const lastNameInput = document.querySelector('ss-form-field[data-field-id="41"] input.ember-text-field');
    if (lastNameInput) { fillInput(lastNameInput, lastName); await sleep(600); }
    console.log(`[autoVote] Last name filled: ${lastName}`);

    const zipInput = document.querySelector('ss-form-field[data-field-id="43"] input.ember-text-field');
    if (zipInput) { fillInput(zipInput, '77340'); await sleep(600); }
    console.log('[autoVote] Zip filled: 77340');

    const checkboxInput = document.querySelector('ss-form-field[data-field-id="594"] input.ssCheckboxField');
    if (checkboxInput && !checkboxInput.checked) {
      checkboxInput.checked = true;
      checkboxInput.dispatchEvent(new Event('click',  { bubbles: true }));
      checkboxInput.dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(600);
    }

    console.log('[autoVote] Page 2 form fields filled');
    await sleep(800);

    // Step 7 — Submit page 2 (final vote)
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
    console.log('[autoVote] Page 2 (vote) submitted');
    await sleep(2000);

    // Step 7b — Turnstile appears AFTER page 2 submit, not before
    // Poll for up to 10s — it may take a moment to render
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
      console.log('[autoVote] Turnstile detected after page 2 submit, solving...');
      await solveTurnstile();
      await sleep(3000);
    } else {
      console.log('[autoVote] No Turnstile after page 2 submit');
    }

    // ----------------------------------------------------------
    // Step 8 — Confirm success
    // ----------------------------------------------------------
    let confirmed = false;
    const confirmDeadline = Date.now() + 15000;
    while (Date.now() < confirmDeadline) {
      const successSelectors = ['.success', '.confirmation', '[class*="success"]', '[class*="thank"]'];
      for (const sel of successSelectors) {
        if (document.querySelector(sel)) { confirmed = true; break; }
      }
      if (!confirmed) {
        const allEls = document.querySelectorAll('*');
        for (const el of allEls) {
          const text = el.innerText ? el.innerText.toLowerCase() : '';
          if (text.includes('thank you') || text.includes('thanks for entering') || text.includes('voted') || text.includes('success')) {
            confirmed = true;
            break;
          }
        }
      }
      if (confirmed) break;
      await sleep(500);
    }

    if (confirmed) {
      console.log('[autoVote] ✓ Confirmed');
      chrome.runtime.sendMessage({ type: 'VOTE_SUCCESS', email }).catch(() => {});
    } else {
      console.warn('[autoVote] No confirmation detected after 15s');
      chrome.runtime.sendMessage({ type: 'VOTE_ERROR', error: 'No confirmation detected after 15s' }).catch(() => {});
    }

    // ----------------------------------------------------------
    // Step 9 — Clear domain data (both embed and wrapper subdomains)
    // ----------------------------------------------------------
    for (const origin of TARGET_ORIGINS) {
      await chrome.runtime.sendMessage({ type: 'CLEAR_DATA', origin }).catch(() => {});
    }
    console.log('[autoVote] Cache and cookies cleared for all origins');

  } catch (err) {
    console.error('[autoVote] Fatal error:', err.message);
    chrome.runtime.sendMessage({ type: 'VOTE_ERROR', error: err.message }).catch(() => {});
    // Clear data even on failure so next attempt starts fresh
    for (const origin of TARGET_ORIGINS) {
      await chrome.runtime.sendMessage({ type: 'CLEAR_DATA', origin }).catch(() => {});
    }
    console.log('[autoVote] Cache cleared after error');
    throw err;
  }
}
