const SUPABASE_URL = "https://nkadwmptdzjsmwuujcid.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWR3bXB0ZHpqc213dXVqY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjI4OTcsImV4cCI6MjA5MjU5ODg5N30.XunlpVcJPHSL953gKIQuZ7-vrbI3SnmCbtp8OX_gdL0";

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

    // 1. Fetch device settings
    const settingsResponse = await fetch(`${SUPABASE_URL}/rest/v1/device_settings?device_id=eq.${deviceId}&select=*`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!settingsResponse.ok) throw new Error("Failed to fetch settings");
    const settings = await settingsResponse.json();
    
    if (!settings || settings.length === 0) {
      console.log("Device settings not found.");
      return;
    }

    const is_enabled = settings[0].vpn_enabled; // Using vpn_enabled as global protection flag
    
    if (!is_enabled) {
      await chrome.storage.local.set({ is_enabled: false });
      clearBlockingRules();
      return;
    }

    // 2. Fetch subscribed blocklists
    const subResponse = await fetch(`${SUPABASE_URL}/rest/v1/device_block_list_subscriptions?device_id=eq.${deviceId}&is_enabled=eq.true&select=block_list_id`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!subResponse.ok) throw new Error("Failed to fetch subscriptions");
    const subs = await subResponse.json();
    const listIds = subs.map(s => s.block_list_id);

    if (listIds.length === 0) {
      await chrome.storage.local.set({ is_enabled: true, blocked_urls: [] });
      clearBlockingRules();
      return;
    }

    // 3. Fetch entries for those blocklists
    // Note: We use in.(id1,id2) syntax for Supabase REST API
    const idsString = listIds.join(',');
    const entriesResponse = await fetch(`${SUPABASE_URL}/rest/v1/block_list_entries?block_list_id=in.(${idsString})&select=value`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!entriesResponse.ok) throw new Error("Failed to fetch blocklist entries");
    const entries = await entriesResponse.json();
    const blocked_urls = [...new Set(entries.map(e => e.value))]; // Unique hostnames

    await chrome.storage.local.set({ is_enabled: true, blocked_urls });
    updateBlockingRules(blocked_urls);

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
