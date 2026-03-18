// ============================================================
// CONSTANTS
// ============================================================

const FIRST_NAMES = ['James', 'Michael', 'Robert', 'David', 'William', 'Richard', 'Thomas', 'Charles', 'Daniel', 'Matthew'];
const LAST_NAMES  = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor'];

const TARGET_ORIGIN = 'thehuntsvilleitem.secondstreetapp.com';

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
    const start = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
        return;
      }
      if (Date.now() - start >= timeoutMs) {
        clearInterval(interval);
        reject(new Error(`[autoVote] Timeout waiting for element: ${selector}`));
      }
    }, 500);
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

function randomEmail(firstName, lastName) {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${suffix}@gmail.com`;
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
    const email     = randomEmail(firstName, lastName);
    console.log(`[autoVote] Identity: ${firstName} ${lastName} <${email}>`);

    // ----------------------------------------------------------
    // Step 2 — Click vote button
    // ----------------------------------------------------------
    const voteBtn = await waitForElement('button.vote-button', 15000);
    voteBtn.click();
    console.log('[autoVote] Vote button clicked');
    await sleep(1500);

    // ----------------------------------------------------------
    // Step 3 — Fill email
    // ----------------------------------------------------------
    let emailInput = null;
    const emailSelectors = ['input[type="email"]', 'input[name*="email"]', 'input[placeholder*="email" i]'];
    const emailDeadline = Date.now() + 10000;
    outer: while (Date.now() < emailDeadline) {
      for (const sel of emailSelectors) {
        const el = document.querySelector(sel);
        if (el) { emailInput = el; break outer; }
      }
      await sleep(500);
      if (Date.now() >= emailDeadline - 500) {
        console.warn('[autoVote] Email input not found after 5s — still searching...');
      }
    }
    if (!emailInput) throw new Error('[autoVote] Could not find email input after 10s');
    fillInput(emailInput, email);
    console.log(`[autoVote] Email filled: ${email}`);
    await sleep(800);

    // ----------------------------------------------------------
    // Step 4 — Handle Turnstile (optional)
    // ----------------------------------------------------------
    const hasCaptcha = !!document.querySelector('.cf-turnstile');
    if (hasCaptcha) {
      console.log('[autoVote] Turnstile detected, solving...');
      await solveTurnstile();
      await sleep(800);
    } else {
      console.log('[autoVote] No CAPTCHA, continuing');
    }

    // ----------------------------------------------------------
    // Step 5 — Fill registration form
    // ----------------------------------------------------------
    const firstNameInput = document.querySelector('ss-form-field[data-field-id="40"] input.ember-text-field');
    if (firstNameInput) { fillInput(firstNameInput, firstName); await sleep(600); }

    const lastNameInput = document.querySelector('ss-form-field[data-field-id="41"] input.ember-text-field');
    if (lastNameInput) { fillInput(lastNameInput, lastName); await sleep(600); }

    const zipInput = document.querySelector('ss-form-field[data-field-id="43"] input.ember-text-field');
    if (zipInput) { fillInput(zipInput, '77340'); await sleep(600); }

    const checkboxInput = document.querySelector('ss-form-field[data-field-id="594"] input.ssCheckboxField');
    if (checkboxInput && !checkboxInput.checked) {
      checkboxInput.checked = true;
      checkboxInput.dispatchEvent(new Event('click',  { bubbles: true }));
      checkboxInput.dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(600);
    }

    console.log('[autoVote] Form fields filled');
    await sleep(800);

    // ----------------------------------------------------------
    // Step 6 — Submit
    // ----------------------------------------------------------
    const submitSelectors = ['button.ssFormVoteButton', 'button.ssButtonContinue', 'form.form button[type="submit"]'];
    let submitBtn = null;
    for (const sel of submitSelectors) {
      submitBtn = document.querySelector(sel);
      if (submitBtn) break;
    }
    if (!submitBtn) {
      submitBtn = await waitForElement(submitSelectors.join(', '), 10000);
    }
    submitBtn.click();
    console.log('[autoVote] Submit button clicked');
    await sleep(2000);

    // ----------------------------------------------------------
    // Step 7 — Confirm success
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
          if (text.includes('thank you') || text.includes('voted') || text.includes('success')) {
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
      chrome.runtime.sendMessage({ type: 'VOTE_SUCCESS' }).catch(() => {});
    } else {
      console.warn('[autoVote] No confirmation detected after 15s');
      chrome.runtime.sendMessage({ type: 'VOTE_ERROR', error: 'No confirmation detected after 15s' }).catch(() => {});
    }

    // ----------------------------------------------------------
    // Step 8 — Clear domain data
    // ----------------------------------------------------------
    await chrome.runtime.sendMessage({ type: 'CLEAR_DATA', origin: TARGET_ORIGIN }).catch(() => {});
    console.log('[autoVote] Cache and cookies cleared');

  } catch (err) {
    console.error('[autoVote] Fatal error:', err.message);
    chrome.runtime.sendMessage({ type: 'VOTE_ERROR', error: err.message }).catch(() => {});
    throw err;
  }
}
