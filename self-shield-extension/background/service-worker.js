// In development, use 127.0.0.1. In production, use your actual domain.
const API_BASE_URL = "http://127.0.0.1:3000";

// Sync interval in seconds for near-instant response
const SYNC_INTERVAL_SECONDS = 10;

// Fallback alarm to keep service worker alive (minimum 1 minute)
chrome.alarms.create("syncData", { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncData") {
    syncWithAdminPanel();
  }
});

function startFastSync() {
  syncWithAdminPanel();
  // Recursive timeout will run as long as the service worker is active
  setTimeout(startFastSync, SYNC_INTERVAL_SECONDS * 1000);
}

// Start fast sync immediately
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
      // Add a timeout signal
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log("Device not found on server. Disabling protection.");
        await chrome.storage.local.set({ is_enabled: false, deviceId: null, blocked_urls: [] });
        clearBlockingRules();
        return;
      }
      
      // If server is compiling or busy, retry once after 3 seconds
      if (retryCount < 1) {
        console.log("Server busy, retrying in 3s...");
        setTimeout(() => syncWithAdminPanel(retryCount + 1), 3000);
        return;
      }
      
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    const { is_enabled, blocked_urls } = data;

    // Explicitly set to true if enabled, false otherwise
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
    // If we have a deviceId but sync failed, don't wipe it, just wait for next alarm
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

  // Get current rules to remove them first
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

// Listen for messages from popup (e.g. pairing)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pairDevice") {
    chrome.storage.local.set({ deviceId: request.deviceId }, () => {
      syncWithAdminPanel();
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === "getStatus") {
    chrome.storage.local.get(["is_enabled", "deviceId"], (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (request.action === "triggerSync") {
    syncWithAdminPanel().then(() => sendResponse({ success: true }));
    return true;
  }
});
