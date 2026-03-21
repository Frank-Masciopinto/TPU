// ============================================================
// CONSTANTS
// ============================================================

const TARGET_URL    = 'https://embed-1142836.secondstreetapp.com/embed/16a05f9b-0bff-4657-8d74-414c5a771dc1/gallery/531033351';
const TARGET_ORIGINS = [
  'embed-1142836.secondstreetapp.com',
  'thehuntsvilleitem.secondstreetapp.com',
];
const VOTE_WINDOW   = { start: 8, end: 22 }; // Central time, 24h
const TIMEZONE      = 'America/Chicago';
const MAX_PER_DAY   = 100;
const MIN_GAP_MS    = 5 * 60 * 1000; // 5 minutes minimum between votes

// ============================================================
// TEMP EMAIL CONFIG (mail.tm — uses real-looking domains)
// ============================================================

const MAIL_TM_API = 'https://api.mail.tm';
const TEMP_FIRST = ['james','mike','sarah','emma','john','anna','david','lisa','chris','kate',
                    'tom','mark','amy','nicole','ryan','brian','laura','rachel','kevin','megan'];
const TEMP_LAST  = ['smith','jones','brown','white','green','hill','clark','hall','lee','king',
                    'walker','young','allen','scott','adams','baker','turner','nelson','carter','morris'];

// ============================================================
// STORAGE HELPERS
// ============================================================

async function getStats() {
  const defaults = {
    voteCount:          0,
    errorCount:         0,
    errors:             [],
    sessionTotal:       0,
    sessionTarget:      0,
    loopActive:         false,
    scheduledVotes:     [],
    schedulingLock:     false,
    activeTabId:        null,
    verificationStatus: null,
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
    all
      .filter(a => a.name.startsWith('vote_') || a.name.startsWith('tab_timeout_'))
      .map(a => chrome.alarms.clear(a.name))
  );
}

// ============================================================
// NATURAL DELAY HELPER
// ============================================================

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
  if (!res.ok) throw new Error(`mail.tm /domains failed: HTTP ${res.status}`);
  const data = await res.json();
  const domains = data['hydra:member'] || [];
  const active = domains.filter(d => d.isActive);
  if (active.length === 0) throw new Error('mail.tm has no active domains');
  return active[Math.floor(Math.random() * active.length)].domain;
}

async function generateTempEmail() {
  const domain   = await getMailTmDomain();
  const login    = randomTempLogin();
  const address  = `${login}@${domain}`;
  const password = 'VoteBot_' + Math.random().toString(36).slice(2, 14);

  // Create account
  const createRes = await fetch(`${MAIL_TM_API}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(`mail.tm account creation failed (${createRes.status}): ${errBody}`);
  }
  const account = await createRes.json();

  // Get auth token
  const tokenRes = await fetch(`${MAIL_TM_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  if (!tokenRes.ok) throw new Error(`mail.tm token failed: HTTP ${tokenRes.status}`);
  const { token } = await tokenRes.json();

  const tempEmail = { login, domain, address, password, token, accountId: account.id };
  await chrome.storage.local.set({ currentTempEmail: tempEmail });
  console.log('[bg] Generated mail.tm email:', address);
  return tempEmail;
}

async function pollTempEmailInbox(token, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${MAIL_TM_API}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn(`[bg] mail.tm messages HTTP ${res.status}`);
      } else {
        const data = await res.json();
        const messages = data['hydra:member'] || [];
        if (messages.length > 0) {
          const msgId = messages[0].id;
          const msgRes = await fetch(`${MAIL_TM_API}/messages/${msgId}`, {
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
      console.warn('[bg] pollTempEmailInbox error:', err.message);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  return null;
}

function extractVerificationLink(html) {
  if (!html) return null;

  const decoded = html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Strategy 1: Links whose visible text contains action words
  const textPatterns = /href=["'](https?:\/\/[^"']+)["'][^>]*>[^<]*(?:verify|confirm|vote|click\s+here|continue|participate)[^<]*/gi;
  let match = textPatterns.exec(decoded);
  if (match) return match[1];

  // Strategy 2: URLs containing verification keywords
  const urlPatterns = /href=["'](https?:\/\/[^"']*(?:verify|confirm|vote|token|auth|activate|click|entry)[^"']*?)["']/gi;
  match = urlPatterns.exec(decoded);
  if (match) return match[1];

  // Strategy 3: First non-utility link (most prominent CTA)
  const allLinksRegex = /href=["'](https?:\/\/[^"']+)["']/gi;
  const allLinks = [];
  while ((match = allLinksRegex.exec(decoded)) !== null) {
    const url = match[1];
    if (url.includes('unsubscribe') || url.includes('privacy') ||
        url.includes('support') || url.includes('mailto:') ||
        url.includes('facebook.com') || url.includes('twitter.com') ||
        url.includes('instagram.com') || url.includes('linkedin.com') ||
        url.includes('youtube.com') || url.includes('#') ||
        url.includes('terms') || url.includes('opt-out')) {
      continue;
    }
    allLinks.push(url);
  }
  return allLinks[0] || null;
}

// ============================================================
// ALARM RESTORE
// ============================================================

async function restoreAlarms() {
  const stats = await getStats();
  if (!stats.loopActive || !stats.scheduledVotes.length) return;

  const now = Date.now();
  const existingAlarms = await chrome.alarms.getAll();
  const existingNames  = new Set(existingAlarms.map(a => a.name));

  const futureVotes = stats.scheduledVotes.filter(iso => new Date(iso).getTime() > now);
  await saveStats({ scheduledVotes: futureVotes });

  for (const isoTime of futureVotes) {
    const when      = new Date(isoTime).getTime();
    const alarmName = `vote_${when}`;
    if (!existingNames.has(alarmName)) {
      chrome.alarms.create(alarmName, { when });
    }
  }
  console.log('[bg] restoreAlarms: restored', futureVotes.length, 'future votes');
}

// ============================================================
// SCHEDULING
// ============================================================

async function scheduleNextBatch() {
  const stats = await getStats();

  if (stats.schedulingLock) {
    console.log('[bg] scheduleNextBatch: lock held, skipping');
    return;
  }
  if (!stats.loopActive || stats.sessionTotal >= stats.sessionTarget) {
    console.log('[bg] scheduleNextBatch: loop complete or inactive');
    await saveStats({ loopActive: false });
    broadcastStatsUpdate();
    return;
  }
  const existingAlarms = await chrome.alarms.getAll();
  const voteAlarms     = existingAlarms.filter(a => a.name.startsWith('vote_'));
  if (voteAlarms.length > 0) {
    console.log('[bg] scheduleNextBatch: alarms already scheduled, skipping');
    return;
  }

  await saveStats({ schedulingLock: true });

  try {
    const remaining  = stats.sessionTarget - stats.sessionTotal;
    const todayBatch = Math.min(MAX_PER_DAY, remaining);

    const nowMs      = Date.now();
    const centralNow = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date(nowMs));

    const centralHour   = parseInt(centralNow.find(p => p.type === 'hour').value,   10);
    const centralMinute = parseInt(centralNow.find(p => p.type === 'minute').value, 10);

    const windowEndMinutes    = VOTE_WINDOW.end * 60;
    const currentTotalMinutes = centralHour * 60 + centralMinute;
    const windowStartMinutes  = VOTE_WINDOW.start * 60;

    let startMinutesFromNow;
    if (currentTotalMinutes >= windowEndMinutes) {
      const minutesUntilMidnight = (24 * 60) - currentTotalMinutes;
      startMinutesFromNow        = minutesUntilMidnight + windowStartMinutes;
    } else {
      startMinutesFromNow = Math.max(1, 1);
    }

    const availableWindowMinutes = Math.max(
      1,
      windowEndMinutes - Math.max(currentTotalMinutes, windowStartMinutes)
    );

    const baseIntervalMinutes = Math.max(5, availableWindowMinutes / todayBatch);
    const scheduledTimes      = [];
    let   cursor               = nowMs + startMinutesFromNow * 60 * 1000;

    for (let i = 0; i < todayBatch; i++) {
      const delay = naturalDelay(baseIntervalMinutes);
      cursor += Math.max(delay, MIN_GAP_MS, 60 * 1000);

      const centralParts = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE, hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date(cursor));
      const cHour = parseInt(centralParts.find(p => p.type === 'hour').value,   10);
      const cMin  = parseInt(centralParts.find(p => p.type === 'minute').value, 10);
      const cTotalMins = cHour * 60 + cMin;
      if (cTotalMins >= VOTE_WINDOW.end * 60) {
        const minsToMidnight    = (24 * 60) - cTotalMins;
        const minsToWindowStart = minsToMidnight + VOTE_WINDOW.start * 60;
        cursor += minsToWindowStart * 60 * 1000;
      }

      scheduledTimes.push(new Date(cursor).toISOString());
    }

    await saveStats({ scheduledVotes: scheduledTimes, schedulingLock: false });

    for (const isoTime of scheduledTimes) {
      const when      = new Date(isoTime).getTime();
      const alarmName = `vote_${when}`;
      chrome.alarms.create(alarmName, { when });
    }

    console.log('[bg] Scheduled', todayBatch, 'votes:', scheduledTimes);
    broadcastStatsUpdate();

  } catch (err) {
    console.error('[bg] scheduleNextBatch error:', err);
    await saveStats({ schedulingLock: false });
  }
}

// ============================================================
// TAB VOTE EXECUTION
// ============================================================

async function executeVoteInTab() {
  const current = await getStats();
  if (current.activeTabId !== null) {
    try {
      await chrome.tabs.get(current.activeTabId);
      console.warn('[bg] executeVoteInTab: vote already in progress (tabId:', current.activeTabId, '), skipping');
      return;
    } catch (_) {
      console.log('[bg] Stale activeTabId', current.activeTabId, 'detected — clearing lock');
      await saveStats({ activeTabId: null, autoVoteEnabled: false, verificationStatus: null });
    }
  }

  // Open the tab INSTANTLY — don't block on email generation
  await saveStats({ autoVoteEnabled: true, verificationStatus: null });
  const tab = await chrome.tabs.create({ url: TARGET_URL, active: true });
  const tabId = tab.id;
  await saveStats({ activeTabId: tabId });
  console.log(`[bg] Tab ${tabId} opened instantly`);

  // Run email generation + data clearing IN PARALLEL with page load
  const [, ,] = await Promise.all([
    generateTempEmail().then(() => console.log('[bg] Temp email ready')),
    clearAllOriginData().then(() => console.log('[bg] Origin data cleared')),
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        reject(new Error(`[bg] Tab ${tabId} never reached complete status after 60s`));
      }, 60000);
      function onUpdated(id, changeInfo) {
        if (id === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        }
      }
      chrome.tabs.onUpdated.addListener(onUpdated);
    }),
  ]);

  // Inject content script (email is ready in storage by now)
  await chrome.scripting.executeScript({
    target: { tabId },
    files:  ['content_script.js']
  });

  // Fallback: close tab after 5 minutes
  chrome.alarms.create(`tab_timeout_${tabId}`, { delayInMinutes: 5 });
  console.log(`[bg] Tab ${tabId} script injected. Awaiting vote result...`);
}

async function closeVoteTab(tabId) {
  if (!tabId) return;
  chrome.alarms.clear(`tab_timeout_${tabId}`).catch(() => {});
  try {
    await chrome.tabs.remove(tabId);
  } catch (_) {}
  await saveStats({ activeTabId: null, autoVoteEnabled: false, verificationStatus: null });
}

// ============================================================
// EMAIL VERIFICATION FLOW
// ============================================================

async function handleEmailVerification(stats) {
  const { currentTempEmail } = await chrome.storage.local.get('currentTempEmail');
  if (!currentTempEmail) {
    throw new Error('Temp email data missing during verification');
  }

  const voteTabId = stats.activeTabId;

  // Clear the tab timeout alarm
  if (voteTabId) {
    chrome.alarms.clear(`tab_timeout_${voteTabId}`).catch(() => {});
    try { await chrome.tabs.remove(voteTabId); } catch (_) {}
  }

  // Update status
  await saveStats({ verificationStatus: 'waiting_for_email', activeTabId: null });
  broadcastStatsUpdate();

  console.log(`[bg] Polling temp inbox for ${currentTempEmail.address}...`);

  // Poll for verification email (up to 90 seconds)
  const emailMsg = await pollTempEmailInbox(currentTempEmail.token, 90000);

  if (!emailMsg) {
    throw new Error(`Verification email not received within 90s (${currentTempEmail.address})`);
  }

  console.log('[bg] Verification email received, extracting link...');
  await saveStats({ verificationStatus: 'clicking_link' });
  broadcastStatsUpdate();

  // Extract verification link from email body
  // mail.tm returns: html[] array with HTML parts, text for plain text
  const htmlParts = emailMsg.html || [];
  const htmlBody  = Array.isArray(htmlParts) ? htmlParts.join('') : (htmlParts || '');
  const textBody  = emailMsg.text || '';
  const link = extractVerificationLink(htmlBody || textBody);

  if (!link) {
    throw new Error('No verification link found in email body');
  }

  console.log('[bg] Opening verification link:', link);

  // Open verification link in a new tab
  const verifyTab = await chrome.tabs.create({ url: link, active: false });

  // Wait for tab to finish loading (max 30s)
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      resolve();
    }, 30000);
    function onUpdated(id, changeInfo) {
      if (id === verifyTab.id && changeInfo.status === 'complete') {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(onUpdated);
  });

  // Allow time for any redirects / processing
  await new Promise(r => setTimeout(r, 3000));

  // Close verification tab
  try { await chrome.tabs.remove(verifyTab.id); } catch (_) {}

  // Clear origin data after verification
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
        await saveStats({
          voteCount:          stats.voteCount    + 1,
          sessionTotal:       stats.sessionTotal + 1,
          verificationStatus: null,
        });
        await closeVoteTab(stats.activeTabId);
        broadcastStatsUpdate();

        const updated = await getStats();
        if (updated.loopActive && updated.sessionTotal >= updated.sessionTarget) {
          await saveStats({ loopActive: false });
        }
        sendResponse({ ok: true });
        break;
      }

      case 'VOTE_NEEDS_VERIFICATION': {
        try {
          await handleEmailVerification(stats);

          // Mark as success
          const freshStats = await getStats();
          await saveStats({
            voteCount:          freshStats.voteCount    + 1,
            sessionTotal:       freshStats.sessionTotal + 1,
            verificationStatus: null,
            activeTabId:        null,
            autoVoteEnabled:    false,
          });
          broadcastStatsUpdate();
          console.log('[bg] ✓ Vote verified and counted!');

          const updated = await getStats();
          if (updated.loopActive && updated.sessionTotal >= updated.sessionTarget) {
            await saveStats({ loopActive: false });
          }
          sendResponse({ ok: true });

        } catch (err) {
          console.error('[bg] Email verification failed:', err.message);
          const freshStats = await getStats();
          const errors = [...freshStats.errors, {
            message:   err.message,
            timestamp: new Date().toISOString()
          }].slice(-100);
          await saveStats({
            errorCount:         freshStats.errorCount + 1,
            sessionTotal:       freshStats.sessionTotal + 1,
            errors,
            activeTabId:        null,
            autoVoteEnabled:    false,
            verificationStatus: null,
          });
          broadcastStatsUpdate();
          sendResponse({ ok: false, error: err.message });
        }
        break;
      }

      case 'VOTE_ERROR': {
        const errors = [...stats.errors, {
          message:   msg.error || 'Unknown error',
          timestamp: new Date().toISOString()
        }].slice(-100);
        await saveStats({
          errorCount:         stats.errorCount   + 1,
          sessionTotal:       stats.sessionTotal + 1,
          errors,
          verificationStatus: null,
        });
        await closeVoteTab(stats.activeTabId);
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      case 'CLEAR_DATA': {
        await clearAllOriginData();
        sendResponse({ success: true });
        break;
      }

      case 'GET_STATS': {
        sendResponse(stats);
        break;
      }

      case 'GET_DEBUG_LOG': {
        const { debugLog = [] } = await chrome.storage.local.get('debugLog');
        sendResponse(debugLog);
        break;
      }

      case 'START_LOOP': {
        const totalVotes = parseInt(msg.totalVotes, 10);
        if (!totalVotes || totalVotes < 1) {
          sendResponse({ ok: false, error: 'totalVotes must be >= 1' });
          break;
        }
        await saveStats({
          sessionTarget:      totalVotes,
          sessionTotal:       0,
          loopActive:         true,
          schedulingLock:     false,
          scheduledVotes:     [],
          verificationStatus: null,
        });
        await scheduleNextBatch();
        sendResponse({ ok: true });
        break;
      }

      case 'STOP_LOOP': {
        await closeVoteTab(stats.activeTabId);
        await clearVoteAlarms();
        await saveStats({
          loopActive:         false,
          scheduledVotes:     [],
          schedulingLock:     false,
          verificationStatus: null,
        });
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      case 'RESET_STATS': {
        await clearVoteAlarms();
        await saveStats({
          voteCount:          0,
          errorCount:         0,
          errors:             [],
          sessionTotal:       0,
          sessionTarget:      0,
          loopActive:         false,
          scheduledVotes:     [],
          schedulingLock:     false,
          activeTabId:        null,
          autoVoteEnabled:    false,
          verificationStatus: null,
        });
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      case 'SINGLE_VOTE': {
        try {
          await executeVoteInTab();
          sendResponse({ ok: true });
        } catch (err) {
          sendResponse({ ok: false, error: err.message });
        }
        break;
      }

      default:
        sendResponse({});
    }
  })();
  return true;
});

// ============================================================
// ALARM HANDLER
// ============================================================

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name.startsWith('tab_timeout_')) {
    const tabId = parseInt(alarm.name.split('tab_timeout_')[1], 10);
    console.warn(`[bg] Tab timeout for tabId ${tabId} — force closing`);
    await closeVoteTab(tabId);
    const stats = await getStats();
    const errors = [...stats.errors, {
      message:   'Tab timeout: vote script did not respond within 5 minutes',
      timestamp: new Date().toISOString()
    }].slice(-100);
    await saveStats({ errorCount: stats.errorCount + 1, errors, verificationStatus: null });
    broadcastStatsUpdate();
    return;
  }

  if (!alarm.name.startsWith('vote_')) return;

  const stats = await getStats();
  if (!stats.loopActive) {
    console.log('[bg] Alarm fired but loop is inactive, ignoring:', alarm.name);
    return;
  }

  console.log('[bg] Vote alarm fired:', alarm.name);
  try {
    await executeVoteInTab();
  } catch (err) {
    console.error('[bg] executeVoteInTab error:', err);
    const errors = [...stats.errors, {
      message:   err.message,
      timestamp: new Date().toISOString()
    }].slice(-100);
    await saveStats({ errorCount: stats.errorCount + 1, errors });
    broadcastStatsUpdate();
  }

  const remainingAlarms = (await chrome.alarms.getAll()).filter(a => a.name.startsWith('vote_'));
  if (remainingAlarms.length === 0) {
    const freshStats = await getStats();
    if (freshStats.loopActive && freshStats.sessionTotal < freshStats.sessionTarget) {
      console.log('[bg] Last alarm of batch fired — scheduling next batch');
      await scheduleNextBatch();
    }
  }
});

// ============================================================
// STARTUP / INSTALL HOOKS
// ============================================================

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[bg] Extension installed/updated — restoring alarms');
  await restoreAlarms();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('[bg] Browser started — restoring alarms');
  await restoreAlarms();
});
