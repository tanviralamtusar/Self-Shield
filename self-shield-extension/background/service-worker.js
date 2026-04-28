// In development, use localhost. In production, use your actual domain.
const API_BASE_URL = "http://localhost:3000";
// Keep service worker alive with alarm (backup)
chrome.alarms.create("syncData", { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncData") {
    syncWithAdminPanel();
  }
});

// Always-running fast polling (every 2 seconds) with self-healing
let isUnpairing = false;

function startFastSync() {
  try {
    syncWithAdminPanel().finally(() => {
      // Always schedule the next sync, even if this one failed
      setTimeout(startFastSync, 2000);
    });
  } catch (e) {
    console.error("Critical error in fast sync loop:", e);
    setTimeout(startFastSync, 5000); // Wait a bit longer on crash
  }
}
startFastSync();

// Also sync immediately when popup opens
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    syncWithAdminPanel();
  }
});

// Initial sync on startup
chrome.runtime.onInstalled.addListener(() => {
  console.log("Self-Shield Extension Installed");
  syncWithAdminPanel();
});

chrome.runtime.onStartup.addListener(() => {
  syncWithAdminPanel();
});

async function syncWithAdminPanel(retryCount = 0) {
  if (isUnpairing) return;

  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");

    if (!deviceId) {
      return;
    }

    // Cache-busting: add timestamp to URL to prevent ANY caching
    const url = `${API_BASE_URL}/api/extension/sync?deviceId=${deviceId}&_t=${Date.now()}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) {
      if (response.status === 404) {
        const { everBeenActive } = await chrome.storage.local.get("everBeenActive");
        
        // Grace period: only retry if device has NEVER been active
        if (!everBeenActive) {
          console.log("Grace period: device not yet on server...");
          return; 
        }

        // Device was active before → it was DELETED
        console.log("DEVICE DELETED! Going INACTIVE now.");
        await chrome.storage.local.set({ 
          is_enabled: false, deviceId: null, pairedAt: null, 
          everBeenActive: false, blocked_urls: [] 
        });
        clearBlockingRules();
        return;
      }

      if (retryCount < 1) {
        return new Promise((resolve) => {
          setTimeout(() => syncWithAdminPanel(retryCount + 1).then(resolve), 2000);
        });
      }
      return;
    }

    const data = await response.json();
    const enabledState = data.is_enabled === true;
    const urls = data.blocked_urls || [];

    const update = { is_enabled: enabledState, blocked_urls: urls };
    if (enabledState) update.everBeenActive = true;
    await chrome.storage.local.set(update);

    if (enabledState && urls.length > 0) {
      updateBlockingRules(urls);
    } else {
      clearBlockingRules();
    }

  } catch (error) {
    // Silently fail — next sync will retry
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
}

async function clearBlockingRules() {
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = currentRules.map(r => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: removeRuleIds
  });
}

// Listen for messages from popup AND content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Safely wrap all message processing
  try {
    // === PAIRING ===
    if (request.action === "pairDevice") {
      chrome.storage.local.set({ 
        deviceId: request.deviceId,
        pairedAt: Date.now(),
        everBeenActive: false,
        is_enabled: false,
        blocked_urls: [] 
      }, () => {
        sendResponse({ success: true });
        
        // Aggressive retry after pairing
        let attempts = 0;
        const trySync = () => {
          syncWithAdminPanel().then(() => {
            chrome.storage.local.get("is_enabled", (data) => {
              if (!data.is_enabled && attempts < 15) {
                attempts++;
                setTimeout(trySync, 1000);
              }
            });
          }).catch(() => {
            if (attempts < 15) {
              attempts++;
              setTimeout(trySync, 1000);
            }
          });
        };
        trySync();
      });
      return true;
    }

    // === INSTANT DEVICE DELETION (from content script or popup) ===
    if (request.action === "deviceDeleted") {
      console.log("INSTANT: Device unpairing...");
      isUnpairing = true;
      
      const performUnpair = async () => {
        try {
          const { deviceId } = await chrome.storage.local.get("deviceId");
          if (deviceId) {
            // Await the signal and use keepalive to ensure it finishes
            await fetch(`${API_BASE_URL}/api/extension/sync?deviceId=${deviceId}&status=offline`, {
              keepalive: true
            }).catch(() => {});
          }
        } catch (e) {}

        await chrome.storage.local.set({ 
          is_enabled: false, deviceId: null, pairedAt: null, 
          everBeenActive: false, blocked_urls: [] 
        });
        
        await clearBlockingRules().catch(() => {});
        isUnpairing = false; // Reset for potential future pairing
        sendResponse({ success: true });
      };

      performUnpair();
      return true;
    }

    // === MANUAL SYNC ===
    if (request.action === "triggerSync") {
      syncWithAdminPanel()
        .then(() => sendResponse({ success: true }))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    // === REPORT BLOCK EVENT ===
    if (request.action === "reportBlock") {
      reportEventToServer("block_triggered", request.target);
      sendResponse({ success: true });
      return true;
    }
  } catch (error) {
    console.error("Error in message listener:", error);
    sendResponse({ success: false, error: error.message });
  }

  return false;
});

async function reportEventToServer(eventType, target) {
  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (!deviceId) return;

    await fetch(`${API_BASE_URL}/api/extension/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        eventType,
        target
      })
    });
  } catch (error) {
    console.error("Failed to report event:", error);
  }
}

