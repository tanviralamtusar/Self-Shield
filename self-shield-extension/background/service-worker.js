// In development, use 127.0.0.1. In production, use your actual domain.
const API_BASE_URL = "http://127.0.0.1:3000";

// Fallback polling interval - fast enough to detect deletions quickly
// Grace period (is_enabled === null) protects new pairings from 404
const SYNC_INTERVAL_SECONDS = 5;

// Fallback alarm to keep service worker alive
chrome.alarms.create("syncData", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncData") {
    syncWithAdminPanel();
  }
});

// Force sync when the popup opens
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    syncWithAdminPanel();
  }
});

// Fallback polling loop
function startFastSync() {
  syncWithAdminPanel();
  setTimeout(startFastSync, SYNC_INTERVAL_SECONDS * 1000);
}
startFastSync();

// Initial sync on startup
chrome.runtime.onInstalled.addListener(() => {
  console.log("Self-Shield Extension Installed");
  syncWithAdminPanel();
});

chrome.runtime.onStartup.addListener(() => {
  syncWithAdminPanel();
});

async function syncWithAdminPanel(retryCount = 0) {
  console.log("Syncing with Admin Panel...");

  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");

    if (!deviceId) {
      console.log("No deviceId found.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/extension/sync?deviceId=${deviceId}`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        const { is_enabled } = await chrome.storage.local.get("is_enabled");
        
        // If we are in "Waiting" state (just paired), don't treat 404 as deletion.
        // Give server a few seconds to propagate.
        if (is_enabled === null) {
          console.log("Device not yet found on server (Waiting state). Retrying...");
          return; 
        }

        console.log("Device not found on server. Disabling protection.");
        await chrome.storage.local.set({ is_enabled: false, deviceId: null, blocked_urls: [] });
        clearBlockingRules();
        return;
      }

      // If server is compiling or busy, retry once after 3 seconds
      if (retryCount < 1) {
        console.log("Server busy, retrying in 3s...");
        return new Promise((resolve) => {
          setTimeout(() => syncWithAdminPanel(retryCount + 1).then(resolve), 3000);
        });
      }

      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    const { is_enabled, blocked_urls } = data;

    const enabledState = is_enabled === true;
    const urls = blocked_urls || [];

    await chrome.storage.local.set({ is_enabled: enabledState, blocked_urls: urls });

    if (enabledState && urls.length > 0) {
      updateBlockingRules(urls);
    } else {
      clearBlockingRules();
    }

    console.log(`Sync successful. Active: ${enabledState}, Rules: ${urls.length}`);

  } catch (error) {
    console.error("Sync failed:", error);
  }
}

async function updateBlockingRules(urls) {
  if (!urls || !Array.isArray(urls)) return;

  const rules = urls.map((url, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { extensionPath: "/blocked-page/blocked.html" }
    },
    condition: {
      urlFilter: url,
      resourceTypes: ["main_frame"]
    }
  }));

  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = currentRules.map(r => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: removeRuleIds,
    addRules: rules
  });

  console.log(`Updated blocking rules: ${urls.length} sites blocked.`);
}

async function clearBlockingRules() {
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = currentRules.map(r => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: removeRuleIds
  });

  console.log("Blocking rules cleared.");
}

// Listen for messages from popup AND content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // === PAIRING ===
  if (request.action === "pairDevice") {
    chrome.storage.local.set({ 
      deviceId: request.deviceId,
      is_enabled: null, // "Waiting" state
      blocked_urls: [] 
    }, () => {
      sendResponse({ success: true });
      
      // Retry sync quickly after pairing (every 2s, up to 10 times)
      let attempts = 0;
      const trySync = () => {
        syncWithAdminPanel().then(() => {
          chrome.storage.local.get("is_enabled", (data) => {
            if (data.is_enabled === null && attempts < 10) {
              attempts++;
              setTimeout(trySync, 2000);
            }
          });
        }).catch(() => {
          if (attempts < 10) {
            attempts++;
            setTimeout(trySync, 2000);
          }
        });
      };
      trySync();
    });
    return true;
  }

  // === INSTANT DEVICE DELETION (from content script on admin panel page) ===
  if (request.action === "deviceDeleted") {
    console.log("Device deleted signal received from admin panel! Going INACTIVE immediately.");
    chrome.storage.local.set({ is_enabled: false, deviceId: null, blocked_urls: [] }, () => {
      clearBlockingRules();
      sendResponse({ success: true });
    });
    return true;
  }

  // === MANUAL SYNC ===
  if (request.action === "triggerSync") {
    syncWithAdminPanel()
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  return false;
});
