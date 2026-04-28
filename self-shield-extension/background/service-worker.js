// In development, use localhost. In production, use your actual domain.
const API_BASE_URL = "http://localhost:3000";

// Supabase Config (for REST logging)
const SUPABASE_URL = "https://nkadwmptdzjsmwuujcid.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWR3bXB0ZHpqc213dXVqY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjI4OTcsImV4cCI6MjA5MjU5ODg5N30.XunlpVcJPHSL953gKIQuZ7-vrbI3SnmCbtp8OX_gdL0";

// Offscreen Management
let isCreatingOffscreen = false;

async function setupOffscreen() {
  if (isCreatingOffscreen) return;

  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });

  if (existingContexts.length > 0) return;

  // Re-check after the async getContexts call
  if (isCreatingOffscreen) return;
  isCreatingOffscreen = true;

  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen/offscreen.html',
      reasons: ['MATCH_MEDIA'],
      justification: 'Maintaining a Realtime WebSocket connection with Supabase for instant settings sync.'
    });
    console.log("[Service Worker] Offscreen document created.");
  } catch (error) {
    if (!error.message.includes('Only a single offscreen document')) {
      console.error("[Service Worker] Failed to create offscreen document:", error);
    }
  } finally {
    isCreatingOffscreen = false;
  }
}

// Ensure offscreen is running
setupOffscreen();

// Backup alarm to ensure service worker and offscreen stay alive
chrome.alarms.create("keepAlive", { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keepAlive") {
    setupOffscreen();
  }
});

let isUnpairing = false;

// Initial sync on startup
chrome.runtime.onInstalled.addListener(() => {
  console.log("Self-Shield Extension Installed");
  syncWithAdminPanel();
  setupOffscreen();
});

chrome.runtime.onStartup.addListener(() => {
  syncWithAdminPanel();
  setupOffscreen();
});

// Sync when offscreen notifies us of a change
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'supabase_update') {
    console.log(`[Service Worker] Sync triggered by ${request.source}`);
    syncWithAdminPanel();
  }
});

// Also sync immediately when popup opens
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    syncWithAdminPanel();
  }
});

async function syncWithAdminPanel(retryCount = 0) {
  if (isUnpairing) return;

  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (!deviceId) return;

    const url = `${API_BASE_URL}/api/extension/sync?deviceId=${deviceId}&_t=${Date.now()}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) {
      if (response.status === 404) {
        const { everBeenActive } = await chrome.storage.local.get("everBeenActive");
        if (!everBeenActive) return;

        console.log("DEVICE DELETED! Going INACTIVE now.");
        await chrome.storage.local.set({ 
          is_enabled: false, deviceId: null, pairedAt: null, 
          everBeenActive: false, blocked_urls: [] 
        });
        clearBlockingRules();
        return;
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
}

async function clearBlockingRules() {
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = currentRules.map(r => r.id);
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });
}

// Listen for messages from popup AND content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pairDevice") {
    chrome.storage.local.set({ 
      deviceId: request.deviceId,
      pairedAt: Date.now(),
      everBeenActive: false,
      is_enabled: false,
      blocked_urls: [] 
    }, () => {
      sendResponse({ success: true });
      syncWithAdminPanel();
    });
    return true;
  }

  if (request.action === "deviceDeleted") {
    console.log("INSTANT: Device unpairing...");
    isUnpairing = true;
    
    const performUnpair = async () => {
      try {
        const { deviceId } = await chrome.storage.local.get("deviceId");
        if (deviceId) {
          // Send offline signal to Supabase directly
          await reportEventToServer("status_offline", "manual_unpair");
        }
      } catch (e) {}

      await chrome.storage.local.set({ 
        is_enabled: false, deviceId: null, pairedAt: null, 
        everBeenActive: false, blocked_urls: [] 
      });
      
      await clearBlockingRules().catch(() => {});
      isUnpairing = false;
      sendResponse({ success: true });
    };

    performUnpair();
    return true;
  }

  if (request.action === "triggerSync") {
    syncWithAdminPanel()
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (request.action === "reportBlock") {
    reportEventToServer("block_triggered", request.target);
    sendResponse({ success: true });
    return true;
  }
});

// Activity Logging via direct Supabase REST API
async function reportEventToServer(eventType, target) {
  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (!deviceId) return;

    await fetch(`${SUPABASE_URL}/rest/v1/usage_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        device_id: deviceId,
        event_type: eventType,
        target: target,
        occurred_at: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error("Direct logging failed:", error);
  }
}

// Site Visit Tracking
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    try {
      const url = new URL(details.url);
      if (url.protocol.startsWith('http')) {
        reportEventToServer("site_visit", url.hostname);
      }
    } catch (e) {}
  }
});
