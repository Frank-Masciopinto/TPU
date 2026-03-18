// ============================================================
// POPUP.JS — SecondStreet Vote Bot
// ============================================================

// ---- DOM refs ----
const voteCountEl       = document.getElementById('voteCount');
const errorCountEl      = document.getElementById('errorCount');
const sessionProgressEl = document.getElementById('sessionProgress');
const statusDot         = document.getElementById('statusDot');
const statusText        = document.getElementById('statusText');
const scheduleInfo      = document.getElementById('scheduleInfo');
const startLoopBtn      = document.getElementById('startLoopBtn');
const stopLoopBtn       = document.getElementById('stopLoopBtn');
const singleVoteBtn     = document.getElementById('singleVoteBtn');
const totalVotesInput   = document.getElementById('totalVotesInput');
const resetStatsBtn     = document.getElementById('resetStats');
const errorsToggleBtn   = document.getElementById('errorsToggleBtn');
const errorList         = document.getElementById('errorList');
const settingsSection   = document.getElementById('settingsSection');
const capsolverKeyInput = document.getElementById('capsolverKeyInput');
const saveKeyBtn        = document.getElementById('saveKeyBtn');
const keySavedMsg       = document.getElementById('keySavedMsg');

// ============================================================
// INITIALISE
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  await initSettingsSection();
  await loadStats();

  // Live updates from background
  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'STATS_UPDATE') {
      singleVoteBtn.disabled = false; // re-enable after any vote outcome
      loadStats();
    }
  });
});

// ============================================================
// SETTINGS — API Key
// ============================================================

async function initSettingsSection() {
  const { capsolverKey } = await chrome.storage.local.get('capsolverKey');
  if (capsolverKey) {
    capsolverKeyInput.placeholder = '••••••••••••••••';
  } else {
    // Block voting until key is configured
    singleVoteBtn.disabled = true;
    startLoopBtn.disabled  = true;
    const warn = document.createElement('div');
    warn.id = 'keyWarning';
    warn.style.cssText = 'font-size:10px;color:#ef4444;margin-top:4px';
    warn.textContent = 'Set API key above to enable voting';
    document.getElementById('settingsSection').appendChild(warn);
  }
}

saveKeyBtn.addEventListener('click', async () => {
  const key = capsolverKeyInput.value.trim();
  if (!key) return;
  await chrome.storage.local.set({ capsolverKey: key });
  capsolverKeyInput.value       = '';
  capsolverKeyInput.placeholder = '••••••••••••••••';
  keySavedMsg.style.display     = 'block';
  setTimeout(() => { keySavedMsg.style.display = 'none'; }, 2500);
  // Unblock vote buttons now that key is saved
  singleVoteBtn.disabled = false;
  startLoopBtn.disabled  = false;
  document.getElementById('keyWarning')?.remove();
});

// ============================================================
// LOAD STATS
// ============================================================

async function loadStats() {
  let stats;
  try {
    stats = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
  } catch (_) {
    return; // background not ready yet
  }
  if (!stats) return;

  // Numbers
  voteCountEl.textContent       = stats.voteCount   ?? 0;
  errorCountEl.textContent      = stats.errorCount  ?? 0;
  sessionProgressEl.textContent = `${stats.sessionTotal ?? 0} / ${stats.sessionTarget ?? 0}`;

  // Loop state
  if (stats.loopActive) {
    startLoopBtn.style.display = 'none';
    stopLoopBtn.style.display  = 'block';
    setStatus('yellow', 'Running loop...');
  } else {
    startLoopBtn.style.display = 'block';
    stopLoopBtn.style.display  = 'none';
    setStatus('green', 'Idle');
  }

  // Next scheduled vote
  const votes = stats.scheduledVotes ?? [];
  if (votes.length > 0) {
    const nextMs     = Math.min(...votes.map(v => new Date(v).getTime()));
    const nextLocal  = new Date(nextMs).toLocaleString();
    scheduleInfo.textContent = `Next vote: ${nextLocal}`;
  } else {
    scheduleInfo.textContent = '';
  }

  // Error list
  const errors    = stats.errors ?? [];
  const errorCnt  = errors.length;
  const lastTen   = [...errors].reverse().slice(0, 10);

  errorsToggleBtn.textContent = errorList.style.display === 'block'
    ? `\u25B2 Hide Errors`
    : `\u25BC Show Errors (${errorCnt})`;

  errorList.replaceChildren();
  if (lastTen.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'color:#555;font-size:11px';
    empty.textContent = 'No errors';
    errorList.appendChild(empty);
  } else {
    lastTen.forEach(e => {
      const entry = document.createElement('div');
      entry.className = 'error-entry';
      const ts = document.createElement('span');
      ts.className = 'error-ts';
      ts.textContent = e.timestamp;
      entry.appendChild(ts);
      entry.appendChild(document.createElement('br'));
      entry.appendChild(document.createTextNode(e.message));
      errorList.appendChild(entry);
    });
  }
}

function setStatus(state, text) {
  statusDot.className  = `status-dot${state !== 'green' ? ' ' + state : ''}`;
  statusText.textContent = text;
}

// ============================================================
// SINGLE VOTE
// ============================================================

singleVoteBtn.addEventListener('click', async () => {
  singleVoteBtn.disabled = true;
  setStatus('yellow', 'Opening tab...');
  try {
    await chrome.runtime.sendMessage({ type: 'SINGLE_VOTE' });
  } catch (_) {
    // Send failed immediately — re-enable right away
    singleVoteBtn.disabled = false;
    setStatus('red', 'Error sending message');
  }
  // Button is re-enabled by the STATS_UPDATE listener below (on VOTE_SUCCESS/VOTE_ERROR)
  // Safety fallback: re-enable after 3 minutes if no message ever arrives
  setTimeout(() => {
    if (singleVoteBtn.disabled) {
      singleVoteBtn.disabled = false;
      loadStats();
    }
  }, 3 * 60 * 1000);
});

// ============================================================
// LOOP CONTROLS
// ============================================================

startLoopBtn.addEventListener('click', async () => {
  const raw        = totalVotesInput.value.trim();
  const totalVotes = parseInt(raw, 10) || 1400;

  if (totalVotes < 1) {
    alert('Total votes must be at least 1.');
    return;
  }

  const confirmed = confirm(`Schedule ${totalVotes} votes (up to 100/day)?`);
  if (!confirmed) return;

  try {
    await chrome.runtime.sendMessage({ type: 'START_LOOP', totalVotes, timezone: 'America/Chicago' });
  } catch (_) {}
  await loadStats();
});

stopLoopBtn.addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ type: 'STOP_LOOP' });
  } catch (_) {}
  await loadStats();
});

// ============================================================
// RESET STATS
// ============================================================

resetStatsBtn.addEventListener('click', async () => {
  const confirmed = confirm('Reset all stats?');
  if (!confirmed) return;
  try {
    await chrome.runtime.sendMessage({ type: 'RESET_STATS' });
  } catch (_) {}
  await loadStats();
});

// ============================================================
// ERROR TOGGLE
// ============================================================

errorsToggleBtn.addEventListener('click', () => {
  const isVisible = errorList.style.display === 'block';
  errorList.style.display = isVisible ? 'none' : 'block';
  loadStats(); // re-render toggle label
});
