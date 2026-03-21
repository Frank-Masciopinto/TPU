// ============================================================
// CONSTANTS
// ============================================================

const TARGET_URL    = 'https://embed-1142836.secondstreetapp.com/embed/16a05f9b-0bff-4657-8d74-414c5a771dc1/gallery/531033351';
const TARGET_ORIGINS = [
  'embed-1142836.secondstreetapp.com',
  'thehuntsvilleitem.secondstreetapp.com',
];
const VOTE_WINDOW   = { start: 8, end: 22 };
const TIMEZONE      = 'America/Chicago';
const MAX_PER_DAY   = 100;
const MIN_GAP_MS    = 5 * 60 * 1000;

// ============================================================
// TEMP EMAIL CONFIG (mail.tm)
// ============================================================

const MAIL_TM_API = 'https://api.mail.tm';
const TEMP_FIRST = ['james','mike','sarah','emma','john','anna','david','lisa','chris','kate',
                    'tom','mark','amy','nicole','ryan','brian','laura','rachel','kevin','megan'];
const TEMP_LAST  = ['smith','jones','brown','white','green','hill','clark','hall','lee','king',
                    'walker','young','allen','scott','adams','baker','turner','nelson','carter','morris'];

// ============================================================
// SERVICE-WORKER KEEPALIVE
// Chrome terminates idle service workers after ~30 s.
// A repeating alarm fires every 25 s to keep it alive while
// a vote is in progress (long-running: captcha + email poll).
// ============================================================

const KEEPALIVE_ALARM = 'sw_keepalive';

async function startKeepalive() {
  await chrome.alarms.create(KEEPALIVE_ALARM, { periodInMinutes: 0.4 });
}

async function stopKeepalive() {
  await chrome.alarms.clear(KEEPALIVE_ALARM);
}

// ============================================================
// STORAGE HELPERS
// ============================================================

async function getStats() {
  const defaults = {
    voteCount: 0, errorCount: 0, errors: [],
    sessionTotal: 0, sessionTarget: 0, loopActive: false,
    scheduledVotes: [], schedulingLock: false,
    activeTabId: null, verificationStatus: null,
  };
  const stored = await chrome.storage.local.get(Object.keys(defaults));
  return { ...defaults, ...stored };
}

async function saveStats(updates) {
  await chrome.storage.local.set(updates);
}

function broadcastStatsUpdate() {
  chrome.runtime.sendMessage({ type: 'STATS_UPDATE' }).catch(() => {});
}

async function recordError(message) {
  const stats = await getStats();
  const errors = [...stats.errors, { message, timestamp: new Date().toISOString() }].slice(-100);
  await saveStats({ errorCount: stats.errorCount + 1, errors });
  broadcastStatsUpdate();
}

async function clearAllOriginData() {
  const removeOpts = {
    cookies: true, cache: true, localStorage: true,
    indexedDB: true, serviceWorkers: true, cacheStorage: true,
  };
  for (const origin of TARGET_ORIGINS) {
    try {
      await chrome.browsingData.remove({ origins: [`https://${origin}`] }, removeOpts);
    } catch (err) {
      console.warn(`[bg] browsingData.remove failed for ${origin}:`, err.message);
    }
  }
}

async function clearVoteAlarms() {
  const all = await chrome.alarms.getAll();
  await Promise.all(
    all.filter(a => a.name.startsWith('vote_') || a.name.startsWith('tab_timeout_'))
       .map(a => chrome.alarms.clear(a.name))
  );
}

function naturalDelay(baseMinutes) {
  return baseMinutes * (0.8 + Math.random() * 0.4) * 60 * 1000;
}

// ============================================================
// TEMP EMAIL FUNCTIONS
// ============================================================

function randomTempLogin() {
  const first = TEMP_FIRST[Math.floor(Math.random() * TEMP_FIRST.length)];
  const last  = TEMP_LAST[Math.floor(Math.random() * TEMP_LAST.length)];
  const num   = Math.floor(Math.random() * 9000) + 1000;
  return `${first}.${last}${num}`;
}

async function getMailTmDomain() {
  const res = await fetch(`${MAIL_TM_API}/domains`);
  if (!res.ok) throw new Error(`mail.tm /domains HTTP ${res.status}`);
  const data = await res.json();
  const active = (data['hydra:member'] || []).filter(d => d.isActive);
  if (active.length === 0) throw new Error('mail.tm has no active domains');
  return active[Math.floor(Math.random() * active.length)].domain;
}

async function generateTempEmail() {
  const domain   = await getMailTmDomain();
  const login    = randomTempLogin();
  const address  = `${login}@${domain}`;
  const password = 'VB_' + Math.random().toString(36).slice(2, 14);

  const createRes = await fetch(`${MAIL_TM_API}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(`mail.tm account ${createRes.status}: ${body}`);
  }
  const account = await createRes.json();

  // mail.tm normalizes addresses (e.g. strips dots), use the actual address it returns
  const actualAddress = account.address || address;

  const tokenRes = await fetch(`${MAIL_TM_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: actualAddress, password }),
  });
  if (!tokenRes.ok) throw new Error(`mail.tm token HTTP ${tokenRes.status}`);
  const { token } = await tokenRes.json();

  const tempEmail = { login, domain, address: actualAddress, password, token, accountId: account.id };
  await chrome.storage.local.set({ currentTempEmail: tempEmail });
  console.log('[bg] Temp email ready:', actualAddress);
  return tempEmail;
}

async function generateTempEmailWithRetry() {
  const errors = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await generateTempEmail();
    } catch (err) {
      const detail = `attempt ${attempt}: ${err.message}`;
      console.warn(`[bg] generateTempEmail ${detail}`);
      errors.push(detail);
      if (attempt < 3) await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Failed to generate temp email after 3 attempts: ' + errors.join('; '));
}

async function pollTempEmailInbox(token, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${MAIL_TM_API}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const messages = data['hydra:member'] || [];
        if (messages.length > 0) {
          const msgRes = await fetch(`${MAIL_TM_API}/messages/${messages[0].id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (msgRes.ok) {
            const msg = await msgRes.json();
            console.log('[bg] Email received:', msg.subject);
            return msg;
          }
        }
      }
    } catch (err) {
      console.warn('[bg] pollTempEmailInbox:', err.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  return null;
}

function extractVerificationLink(html) {
  if (!html) return null;
  const decoded = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  const textPat = /href=["'](https?:\/\/[^"']+)["'][^>]*>[^<]*(?:verify|confirm|vote|click\s+here|continue|participate)[^<]*/gi;
  let m = textPat.exec(decoded);
  if (m) return m[1];

  const urlPat = /href=["'](https?:\/\/[^"']*(?:verify|confirm|vote|token|auth|activate|click|entry)[^"']*?)["']/gi;
  m = urlPat.exec(decoded);
  if (m) return m[1];

  const all = /href=["'](https?:\/\/[^"']+)["']/gi;
  const links = [];
  while ((m = all.exec(decoded)) !== null) {
    const u = m[1];
    if (/(unsubscribe|privacy|support|mailto:|facebook|twitter|instagram|linkedin|youtube|terms|opt-out|#)/.test(u)) continue;
    links.push(u);
  }
  return links[0] || null;
}

// ============================================================
// ALARM RESTORE
// ============================================================

async function restoreAlarms() {
  const stats = await getStats();
  if (!stats.loopActive || !stats.scheduledVotes.length) return;
  const now = Date.now();
  const existingNames = new Set((await chrome.alarms.getAll()).map(a => a.name));
  const futureVotes = stats.scheduledVotes.filter(iso => new Date(iso).getTime() > now);
  await saveStats({ scheduledVotes: futureVotes });
  for (const iso of futureVotes) {
    const when = new Date(iso).getTime();
    const name = `vote_${when}`;
    if (!existingNames.has(name)) chrome.alarms.create(name, { when });
  }
  console.log('[bg] restoreAlarms:', futureVotes.length, 'future votes');
}

// ============================================================
// SCHEDULING
// ============================================================

async function scheduleNextBatch() {
  const stats = await getStats();
  if (stats.schedulingLock) return;
  if (!stats.loopActive || stats.sessionTotal >= stats.sessionTarget) {
    await saveStats({ loopActive: false }); broadcastStatsUpdate(); return;
  }
  if ((await chrome.alarms.getAll()).filter(a => a.name.startsWith('vote_')).length > 0) return;

  await saveStats({ schedulingLock: true });
  try {
    const remaining  = stats.sessionTarget - stats.sessionTotal;
    const todayBatch = Math.min(MAX_PER_DAY, remaining);
    const nowMs      = Date.now();
    const centralNow = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE, hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date(nowMs));
    const centralHour   = parseInt(centralNow.find(p => p.type === 'hour').value, 10);
    const centralMinute = parseInt(centralNow.find(p => p.type === 'minute').value, 10);
    const windowEnd = VOTE_WINDOW.end * 60, curMins = centralHour * 60 + centralMinute, windowStart = VOTE_WINDOW.start * 60;

    let startFromNow;
    if (curMins >= windowEnd) {
      startFromNow = (24 * 60 - curMins) + windowStart;
    } else {
      startFromNow = 1;
    }
    const avail = Math.max(1, windowEnd - Math.max(curMins, windowStart));
    const baseInterval = Math.max(5, avail / todayBatch);
    const times = [];
    let cursor = nowMs + startFromNow * 60000;
    for (let i = 0; i < todayBatch; i++) {
      cursor += Math.max(naturalDelay(baseInterval), MIN_GAP_MS, 60000);
      const cp = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE, hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date(cursor));
      const cH = parseInt(cp.find(p => p.type === 'hour').value, 10);
      const cM = parseInt(cp.find(p => p.type === 'minute').value, 10);
      if (cH * 60 + cM >= windowEnd) {
        cursor += ((24 * 60 - (cH * 60 + cM)) + windowStart) * 60000;
      }
      times.push(new Date(cursor).toISOString());
    }
    await saveStats({ scheduledVotes: times, schedulingLock: false });
    for (const t of times) chrome.alarms.create(`vote_${new Date(t).getTime()}`, { when: new Date(t).getTime() });
    console.log('[bg] Scheduled', todayBatch, 'votes');
    broadcastStatsUpdate();
  } catch (err) {
    console.error('[bg] scheduleNextBatch:', err);
    await saveStats({ schedulingLock: false });
  }
}

// ============================================================
// TAB VOTE EXECUTION
// When called from popup: tabId is provided (popup already opened tab)
// When called from alarm loop: no tabId, we open it ourselves
// ============================================================

async function executeVoteInTab() {
  await startKeepalive();

  let tabId;
  try {
    const tab = await chrome.tabs.create({ url: TARGET_URL, active: true });
    tabId = tab.id;
    console.log(`[bg] Tab ${tabId} opened`);

    await saveStats({ autoVoteEnabled: true, verificationStatus: null, activeTabId: tabId });

    const emailPromise = generateTempEmailWithRetry();
    const clearPromise = clearAllOriginData().catch(e => console.warn('[bg] clear:', e.message));
    const pagePromise  = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { chrome.tabs.onUpdated.removeListener(fn); reject(new Error('page load 60s timeout')); }, 60000);
      function fn(id, info) {
        if (id === tabId && info.status === 'complete') { clearTimeout(timer); chrome.tabs.onUpdated.removeListener(fn); resolve(); }
      }
      chrome.tabs.onUpdated.addListener(fn);
      // Check immediately if already loaded
      chrome.tabs.get(tabId).then(t => { if (t.status === 'complete') { clearTimeout(timer); chrome.tabs.onUpdated.removeListener(fn); resolve(); } }).catch(() => {});
    });

    await Promise.all([emailPromise, clearPromise, pagePromise]);

    await chrome.scripting.executeScript({ target: { tabId }, files: ['content_script.js'] });
    chrome.alarms.create(`tab_timeout_${tabId}`, { delayInMinutes: 5 });
    console.log(`[bg] Tab ${tabId} script injected`);

  } catch (err) {
    console.error('[bg] executeVoteInTab failed:', err.message);
    await recordError(`executeVoteInTab: ${err.message}`);
    if (tabId) { try { await chrome.tabs.remove(tabId); } catch (_) {} }
    await saveStats({ activeTabId: null, autoVoteEnabled: false, verificationStatus: null });
    await stopKeepalive();
  }
}

// ============================================================
// STORAGE-BASED VOTE TRIGGER  (from popup — wakes SW reliably)
// ============================================================

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.voteCommand) return;
  const cmd = changes.voteCommand.newValue;
  if (!cmd || cmd.action !== 'execute') return;
  console.log('[bg] voteCommand received via storage');
  executeVoteInTab();
});

async function closeVoteTab(tabId) {
  if (!tabId) return;
  chrome.alarms.clear(`tab_timeout_${tabId}`).catch(() => {});
  try { await chrome.tabs.remove(tabId); } catch (_) {}
  await saveStats({ activeTabId: null, autoVoteEnabled: false, verificationStatus: null });
  await stopKeepalive();
}

// ============================================================
// EMAIL VERIFICATION FLOW
// ============================================================

async function handleEmailVerification(stats) {
  const { currentTempEmail } = await chrome.storage.local.get('currentTempEmail');
  if (!currentTempEmail) throw new Error('Temp email data missing');

  if (stats.activeTabId) {
    chrome.alarms.clear(`tab_timeout_${stats.activeTabId}`).catch(() => {});
    try { await chrome.tabs.remove(stats.activeTabId); } catch (_) {}
  }

  await saveStats({ verificationStatus: 'waiting_for_email', activeTabId: null });
  broadcastStatsUpdate();
  console.log(`[bg] Polling inbox for ${currentTempEmail.address}...`);

  const emailMsg = await pollTempEmailInbox(currentTempEmail.token, 90000);
  if (!emailMsg) throw new Error(`Verification email not received within 90s (${currentTempEmail.address})`);

  await saveStats({ verificationStatus: 'clicking_link' });
  broadcastStatsUpdate();

  const htmlParts = emailMsg.html || [];
  const htmlBody  = Array.isArray(htmlParts) ? htmlParts.join('') : (htmlParts || '');
  const link = extractVerificationLink(htmlBody || emailMsg.text || '');
  if (!link) throw new Error('No verification link found in email');

  console.log('[bg] Verification link:', link);
  const vTab = await chrome.tabs.create({ url: link, active: false });
  await new Promise(resolve => {
    const timer = setTimeout(() => { chrome.tabs.onUpdated.removeListener(fn); resolve(); }, 30000);
    function fn(id, info) {
      if (id === vTab.id && info.status === 'complete') { clearTimeout(timer); chrome.tabs.onUpdated.removeListener(fn); resolve(); }
    }
    chrome.tabs.onUpdated.addListener(fn);
  });
  await new Promise(r => setTimeout(r, 3000));
  try { await chrome.tabs.remove(vTab.id); } catch (_) {}
  await clearAllOriginData();
}

// ============================================================
// MESSAGE HANDLER
// ============================================================

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    const stats = await getStats();

    switch (msg.type) {

      case 'VOTE_SUCCESS': {
        await saveStats({ voteCount: stats.voteCount + 1, sessionTotal: stats.sessionTotal + 1, verificationStatus: null });
        await closeVoteTab(stats.activeTabId);
        broadcastStatsUpdate();
        const u = await getStats();
        if (u.loopActive && u.sessionTotal >= u.sessionTarget) await saveStats({ loopActive: false });
        sendResponse({ ok: true });
        break;
      }

      case 'VOTE_NEEDS_VERIFICATION': {
        try {
          await handleEmailVerification(stats);
          const f = await getStats();
          await saveStats({ voteCount: f.voteCount + 1, sessionTotal: f.sessionTotal + 1, verificationStatus: null, activeTabId: null, autoVoteEnabled: false });
          broadcastStatsUpdate();
          console.log('[bg] ✓ Vote verified!');
          const u = await getStats();
          if (u.loopActive && u.sessionTotal >= u.sessionTarget) await saveStats({ loopActive: false });
          await stopKeepalive();
          sendResponse({ ok: true });
        } catch (err) {
          console.error('[bg] Verification failed:', err.message);
          await recordError(err.message);
          await saveStats({ activeTabId: null, autoVoteEnabled: false, verificationStatus: null });
          await stopKeepalive();
          sendResponse({ ok: false, error: err.message });
        }
        break;
      }

      case 'VOTE_ERROR': {
        await recordError(msg.error || 'Unknown error');
        await saveStats({ sessionTotal: stats.sessionTotal + 1 });
        await closeVoteTab(stats.activeTabId);
        sendResponse({ ok: true });
        break;
      }

      case 'CLEAR_DATA':    { await clearAllOriginData(); sendResponse({ success: true }); break; }
      case 'GET_STATS':     { sendResponse(stats); break; }
      case 'GET_DEBUG_LOG': { const { debugLog = [] } = await chrome.storage.local.get('debugLog'); sendResponse(debugLog); break; }

      case 'START_LOOP': {
        const total = parseInt(msg.totalVotes, 10);
        if (!total || total < 1) { sendResponse({ ok: false }); break; }
        await saveStats({ sessionTarget: total, sessionTotal: 0, loopActive: true, schedulingLock: false, scheduledVotes: [], verificationStatus: null });
        await scheduleNextBatch();
        sendResponse({ ok: true });
        break;
      }

      case 'STOP_LOOP': {
        await closeVoteTab(stats.activeTabId);
        await clearVoteAlarms();
        await saveStats({ loopActive: false, scheduledVotes: [], schedulingLock: false, verificationStatus: null });
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      case 'RESET_STATS': {
        await clearVoteAlarms();
        await saveStats({ voteCount: 0, errorCount: 0, errors: [], sessionTotal: 0, sessionTarget: 0,
          loopActive: false, scheduledVotes: [], schedulingLock: false, activeTabId: null, autoVoteEnabled: false, verificationStatus: null });
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      default: sendResponse({});
    }
  })();
  return true;
});

// ============================================================
// ALARM HANDLER
// ============================================================

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === KEEPALIVE_ALARM) return; // just keeps SW alive

  if (alarm.name.startsWith('tab_timeout_')) {
    const tabId = parseInt(alarm.name.split('tab_timeout_')[1], 10);
    console.warn(`[bg] Tab timeout ${tabId}`);
    await closeVoteTab(tabId);
    await recordError('Tab timeout: vote did not complete within 5 minutes');
    return;
  }

  if (!alarm.name.startsWith('vote_')) return;
  const stats = await getStats();
  if (!stats.loopActive) return;

  console.log('[bg] Vote alarm:', alarm.name);
  try { await executeVoteInTab(); } catch (err) {
    console.error('[bg] alarm vote error:', err);
    await recordError(err.message);
  }

  if ((await chrome.alarms.getAll()).filter(a => a.name.startsWith('vote_')).length === 0) {
    const f = await getStats();
    if (f.loopActive && f.sessionTotal < f.sessionTarget) await scheduleNextBatch();
  }
});

// ============================================================
// STARTUP / INSTALL HOOKS
// ============================================================

chrome.runtime.onInstalled.addListener(() => restoreAlarms());
chrome.runtime.onStartup.addListener(() => restoreAlarms());
