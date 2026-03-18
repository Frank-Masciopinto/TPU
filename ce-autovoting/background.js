// ============================================================
// CONSTANTS
// ============================================================

const TARGET_URL    = 'https://thehuntsvilleitem.secondstreetapp.com/2026-Huntsville-Items-Readers-Choice/gallery/531033351';
const VOTE_WINDOW   = { start: 8, end: 22 }; // Central time, 24h
const TIMEZONE      = 'America/Chicago';
const MAX_PER_DAY   = 100;
const MIN_GAP_MS    = 5 * 60 * 1000; // 5 minutes minimum between votes

// ============================================================
// STORAGE HELPERS
// Always read fresh from storage — never rely on in-memory state
// ============================================================

async function getStats() {
  const defaults = {
    voteCount:      0,
    errorCount:     0,
    errors:         [],
    sessionTotal:   0,
    sessionTarget:  0,
    loopActive:     false,
    scheduledVotes: [],
    schedulingLock: false,
    activeTabId:    null
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

// Clears only vote/timeout alarms — never wipes unrelated alarms
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
// Returns baseMinutes ±20% converted to milliseconds
// ============================================================

function naturalDelay(baseMinutes) {
  return baseMinutes * (0.8 + Math.random() * 0.4) * 60 * 1000;
}

// ============================================================
// ALARM RESTORE — called on startup and install
// Re-creates alarms for any scheduled votes still in the future
// ============================================================

async function restoreAlarms() {
  const stats = await getStats();
  if (!stats.loopActive || !stats.scheduledVotes.length) return;

  const now = Date.now();
  const existingAlarms = await chrome.alarms.getAll();
  const existingNames  = new Set(existingAlarms.map(a => a.name));

  // Filter to future-only entries and persist the pruned list back
  const futureVotes = stats.scheduledVotes.filter(iso => new Date(iso).getTime() > now);
  await saveStats({ scheduledVotes: futureVotes });

  for (const isoTime of futureVotes) {
    const when      = new Date(isoTime).getTime();
    const alarmName = `vote_${when}`;
    if (!existingNames.has(alarmName)) {
      chrome.alarms.create(alarmName, { when });
    }
  }
  console.log('[bg] restoreAlarms: restored', futureVotes.length, 'future votes (pruned', stats.scheduledVotes.length - futureVotes.length, 'expired)');
}

// ============================================================
// SCHEDULING
// ============================================================

async function scheduleNextBatch() {
  const stats = await getStats();

  // Guard: only one scheduling run at a time
  if (stats.schedulingLock) {
    console.log('[bg] scheduleNextBatch: lock held, skipping');
    return;
  }
  // Guard: nothing to do
  if (!stats.loopActive || stats.sessionTotal >= stats.sessionTarget) {
    console.log('[bg] scheduleNextBatch: loop complete or inactive');
    await saveStats({ loopActive: false });
    broadcastStatsUpdate();
    return;
  }
  // Guard: alarms already exist for this day
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

    // Determine current time in Central timezone
    const nowMs      = Date.now();
    const centralNow = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date(nowMs));

    const centralHour   = parseInt(centralNow.find(p => p.type === 'hour').value,   10);
    const centralMinute = parseInt(centralNow.find(p => p.type === 'minute').value, 10);

    // Minutes remaining in today's window
    const windowEndMinutes   = VOTE_WINDOW.end * 60;
    const currentTotalMinutes = centralHour * 60 + centralMinute;
    const windowStartMinutes  = VOTE_WINDOW.start * 60;

    // If we're past the window, schedule from tomorrow's window start
    let startMinutesFromNow;
    if (currentTotalMinutes >= windowEndMinutes) {
      // Minutes until tomorrow 08:00 Central
      const minutesUntilMidnight = (24 * 60) - currentTotalMinutes;
      startMinutesFromNow        = minutesUntilMidnight + windowStartMinutes;
    } else {
      // Start from next minute, but at least 1 minute from now (alarms API minimum)
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
      // Enforce minimum gap and Chrome alarm minimum (60s)
      cursor += Math.max(delay, MIN_GAP_MS, 60 * 1000);

      // Clamp: if cursor has drifted past window end, roll to next day's window start
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
        console.log(`[bg] Vote ${i + 1} rolled to next day window: ${new Date(cursor).toISOString()}`);
      }

      scheduledTimes.push(new Date(cursor).toISOString());
    }

    // Persist and create alarms
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
// Shared by alarm handler and SINGLE_VOTE message handler
// ============================================================

async function executeVoteInTab() {
  // Single-in-flight guard — bail if a vote tab is already open
  const current = await getStats();
  if (current.activeTabId !== null) {
    console.warn('[bg] executeVoteInTab: vote already in progress (tabId:', current.activeTabId, '), skipping');
    return;
  }

  // Set the guard flag so content_script.js actually runs
  await saveStats({ autoVoteEnabled: true });

  const tab = await chrome.tabs.create({ url: TARGET_URL, active: false });
  const tabId = tab.id;
  await saveStats({ activeTabId: tabId });

  // Wait for tab to finish loading — with 60s timeout guard
  await new Promise((resolve, reject) => {
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
  });

  // Inject content script
  await chrome.scripting.executeScript({
    target: { tabId },
    files:  ['content_script.js']
  });

  // Fallback: close tab after 2 minutes if no VOTE_SUCCESS/VOTE_ERROR arrives
  chrome.alarms.create(`tab_timeout_${tabId}`, { delayInMinutes: 2 });
  console.log(`[bg] Tab ${tabId} opened and script injected. Awaiting vote result...`);
}

async function closeVoteTab(tabId) {
  if (!tabId) return;
  chrome.alarms.clear(`tab_timeout_${tabId}`).catch(() => {});
  try {
    await chrome.tabs.remove(tabId);
  } catch (_) {
    // Tab may already be closed
  }
  await saveStats({ activeTabId: null, autoVoteEnabled: false });
}

// ============================================================
// MESSAGE HANDLER
// ============================================================

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    const stats = await getStats();

    // --------------------------------------------------------
    switch (msg.type) {

      case 'VOTE_SUCCESS': {
        await saveStats({
          voteCount:    stats.voteCount    + 1,
          sessionTotal: stats.sessionTotal + 1
        });
        await closeVoteTab(stats.activeTabId);
        broadcastStatsUpdate();

        // Check if all done
        const updated = await getStats();
        if (updated.loopActive && updated.sessionTotal >= updated.sessionTarget) {
          await saveStats({ loopActive: false });
        }
        sendResponse({ ok: true });
        break;
      }

      case 'VOTE_ERROR': {
        const errors = [...stats.errors, {
          message:   msg.error || 'Unknown error',
          timestamp: new Date().toISOString()
        }].slice(-100);
        await saveStats({
          errorCount:   stats.errorCount   + 1,
          sessionTotal: stats.sessionTotal + 1,
          errors
        });
        await closeVoteTab(stats.activeTabId);
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      case 'CLEAR_DATA': {
        // Always use the hardcoded constant — never trust msg.origin from caller
        try {
          await chrome.browsingData.remove(
            { origins: [`https://${TARGET_ORIGIN}`] },
            {
              cookies:        true,
              cache:          true,
              localStorage:   true,
              indexedDB:      true,
              serviceWorkers: true,
              cacheStorage:   true
            }
          );
        } catch (err) {
          console.warn('[bg] browsingData.remove failed (non-fatal):', err.message);
        }
        sendResponse({ success: true });
        break;
      }

      case 'GET_STATS': {
        sendResponse(stats);
        break;
      }

      case 'START_LOOP': {
        const totalVotes = parseInt(msg.totalVotes, 10);
        if (!totalVotes || totalVotes < 1) {
          sendResponse({ ok: false, error: 'totalVotes must be >= 1' });
          break;
        }
        await saveStats({
          sessionTarget:  totalVotes,
          sessionTotal:   0,
          loopActive:     true,
          schedulingLock: false,
          scheduledVotes: []
        });
        await scheduleNextBatch();
        sendResponse({ ok: true });
        break;
      }

      case 'STOP_LOOP': {
        await closeVoteTab(stats.activeTabId);
        await clearVoteAlarms();
        await saveStats({ loopActive: false, scheduledVotes: [], schedulingLock: false });
        broadcastStatsUpdate();
        sendResponse({ ok: true });
        break;
      }

      case 'RESET_STATS': {
        await clearVoteAlarms();
        await saveStats({
          voteCount:      0,
          errorCount:     0,
          errors:         [],
          sessionTotal:   0,
          sessionTarget:  0,
          loopActive:     false,
          scheduledVotes: [],
          schedulingLock: false,
          activeTabId:    null,
          autoVoteEnabled: false
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
    // --------------------------------------------------------
  })();
  return true; // keep message channel open for async response
});

// ============================================================
// ALARM HANDLER
// ============================================================

chrome.alarms.onAlarm.addListener(async alarm => {
  // Tab timeout fallback — force-close a stuck tab
  if (alarm.name.startsWith('tab_timeout_')) {
    const tabId = parseInt(alarm.name.split('tab_timeout_')[1], 10);
    console.warn(`[bg] Tab timeout for tabId ${tabId} — force closing`);
    await closeVoteTab(tabId);
    const stats = await getStats();
    // Count this as an error
    const errors = [...stats.errors, {
      message:   'Tab timeout: vote script did not respond within 2 minutes',
      timestamp: new Date().toISOString()
    }].slice(-100);
    await saveStats({ errorCount: stats.errorCount + 1, errors });
    broadcastStatsUpdate();
    return;
  }

  // Vote alarms
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

  // After firing: check if this was the last alarm; schedule tomorrow if needed
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
