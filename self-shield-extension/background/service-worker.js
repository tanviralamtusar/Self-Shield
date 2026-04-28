// In development, use 127.0.0.1. In production, use your actual domain.
const API_BASE_URL = "http://127.0.0.1:3000";

// Sync interval in minutes
const SYNC_INTERVAL = 5;

// Initialize alarm for syncing
chrome.alarms.create("syncData", { periodInMinutes: SYNC_INTERVAL });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncData") {
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

async function syncWithAdminPanel() {
  console.log("Syncing with Admin Panel...");
  
  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    
    if (!deviceId) {
      console.log("No deviceId found. Please pair the extension via the admin panel.");
      return;
    }

    // Call our new secure API route
    const response = await fetch(`${API_BASE_URL}/api/extension/sync?deviceId=${deviceId}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Sync failed:", errorData.error);
      return;
    }

    const data = await response.json();
    const { is_enabled, blocked_urls } = data;

    await chrome.storage.local.set({ is_enabled, blocked_urls });
    
    if (is_enabled && blocked_urls && blocked_urls.length > 0) {
      updateBlockingRules(blocked_urls);
    } else {
      clearBlockingRules();
    }

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
});
