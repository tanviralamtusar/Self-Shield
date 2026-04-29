// Import Supabase library first
try {
  importScripts('../supabase.js');
} catch (e) {
  console.error("CRITICAL: Failed to load Supabase library from root. Realtime features will be disabled.", e);
}

// ─── Constants & State ──────────────────────────────────────────────
const API_BASE_URL = "http://localhost:3000";
const SUPABASE_URL = "https://nkadwmptdzjsmwuujcid.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U3jPnKL1B65hjpz8aVJFAA_4jMogGtD";

let supabaseClient = null;
let realtimeChannel = null;
let currentSubscribedDeviceId = null;
let isUnpairing = false;
let eventBatch = [];
const MAX_BATCH_SIZE = 20;
let activeSession = { hostname: null, startTime: null };

// Initialize Supabase Client
function initSupabase() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) {
    if (typeof globalThis.supabase !== 'undefined') {
      const { createClient } = globalThis.supabase;
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false }
      });
    } else {
      console.error("Supabase library loaded but 'supabase' object not found in global scope.");
    }
  }
}

initSupabase();

// ─── Realtime: Instant Unpair Listener ───────────────────────────────
async function setupRealtimeListener(deviceId) {
  if (!deviceId || !supabaseClient) return;
  
  if (currentSubscribedDeviceId === deviceId && realtimeChannel) return;

  if (realtimeChannel) {
    try {
      await realtimeChannel.unsubscribe();
    } catch (e) {
      console.warn("Error unsubscribing from old channel:", e);
    }
  }

  console.log(`[Realtime] Subscribing to device: ${deviceId}`);
  currentSubscribedDeviceId = deviceId;
  
  realtimeChannel = supabaseClient
    .channel(`device-changes-${deviceId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'devices',
        filter: `id=eq.${deviceId}`
      },
      (payload) => {
        if (payload.new && payload.new.is_admin_active === false) {
          console.log('[Realtime] Instant unpair signal received!');
          performUnpair();
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'device_settings',
        filter: `device_id=eq.${deviceId}`
      },
      (payload) => {
        if (payload.new) {
          console.log('[Realtime] Settings updated:', payload.new);
          // Trigger a full sync to get latest blocked URLs/Keywords if safe search changed
          syncWithAdminPanel().catch(() => {});
        }
      }
    )
    .subscribe((status) => {
      console.log(`[Realtime] Subscription status: ${status}`);
    });
}

async function performUnpair() {
  if (isUnpairing) return;
  isUnpairing = true;
  
  console.log("Unpairing device...");

  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (deviceId) {
      await flushEventBatch(deviceId).catch(() => {});
    }

    // 1. Clear storage
    await chrome.storage.local.set({
      is_enabled: false,
      deviceId: null,
      pairedAt: null,
      everBeenActive: false,
      blocked_urls: []
    });

    // 2. Clear blocking rules
    await clearBlockingRules().catch(() => {});

    // 3. Clear Realtime
    if (realtimeChannel) {
      await realtimeChannel.unsubscribe().catch(() => {});
      realtimeChannel = null;
      currentSubscribedDeviceId = null;
    }
    
    console.log("Unpairing complete.");
  } catch (err) {
    console.error("Error during unpair process:", err);
  } finally {
    isUnpairing = false;
  }
}

// ─── Alarms ─────────────────────────────────────────────────────────
chrome.alarms.create("safetyNetSync", { periodInMinutes: 5 });
chrome.alarms.create("flushEvents", { periodInMinutes: 2 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "safetyNetSync") {
    syncWithAdminPanel().catch(() => {});
  }
  if (alarm.name === "flushEvents") {
    chrome.storage.local.get("deviceId", ({ deviceId }) => {
      if (deviceId) flushEventBatch(deviceId).catch(() => {});
    });
  }
});

// ─── Lifecycle Triggers ─────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  console.log("Self-Shield Extension Installed");
  syncWithAdminPanel().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  syncWithAdminPanel().catch(() => {});
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    syncWithAdminPanel().catch(() => {});
  }
});

// ─── Message Listeners ──────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerSync") {
    syncWithAdminPanel()
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === "pairDevice") {
    // Security: Only allow pairing from the extension's own popup
    if (!sender.url || !sender.url.startsWith('chrome-extension://')) {
      console.warn("[Security] Unauthorized pairDevice attempt from:", sender.url);
      sendResponse({ success: false, error: "Unauthorized request" });
      return false;
    }

    const deviceId = request.deviceId?.trim();
    if (!deviceId || deviceId.length < 5) {
      sendResponse({ success: false, error: "Invalid Device ID format" });
      return false;
    }

    const info = getBrowserInfo();
    const params = new URLSearchParams({
      deviceId: deviceId,
      _t: Date.now().toString(),
      browserName: info.browserName,
      browserVersion: info.browserVersion,
      osName: info.osName,
      osVersion: info.osVersion,
      extVersion: info.extensionVersion,
      isPairing: 'true',
    });

    fetch(`${API_BASE_URL}/api/extension/sync?${params.toString()}`)
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          chrome.storage.local.set({
            deviceId: request.deviceId,
            pairedAt: Date.now(),
            everBeenActive: true,
            is_enabled: data.is_enabled === true,
            blocked_urls: data.blocked_urls || [],
            api_base_url: API_BASE_URL // Store for content scripts
          }, () => {
            setupRealtimeListener(deviceId).catch(() => {});
            sendResponse({ success: true });
          });
        } else {
          const errorData = await response.json().catch(() => ({}));
          sendResponse({ 
            success: false, 
            error: errorData.error || "Invalid ID. Please check and try again." 
          });
        }
      })
      .catch((err) => {
        console.error("Pairing verification failed:", err);
        sendResponse({ success: false, error: "Connection error. Is the dashboard online?" });
      });
    return true;
  }

  if (request.action === "deviceDeleted") {
    performUnpair()
      .then(() => sendResponse({ success: true }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  if (request.action === "reportBlock") {
    logEvent("block_triggered", request.target);
    sendResponse({ success: true });
    return true;
  }
  
  // Return false if message is not handled
  return false;
});

// ─── Browser Info Detection ─────────────────────────────────────────
function getBrowserInfo() {
  const ua = navigator.userAgent;
  const manifest = chrome.runtime.getManifest();
  
  let browserName = 'Unknown';
  let browserVersion = '';

  const uaData = navigator.userAgentData;
  if (uaData && uaData.brands) {
    const knownBrands = ['Arc', 'Brave', 'Edge', 'Opera', 'Vivaldi', 'Whale', 'Samsung Internet'];
    for (const target of knownBrands) {
      const match = uaData.brands.find(b => b.brand.toLowerCase().includes(target.toLowerCase()));
      if (match) {
        browserName = target;
        browserVersion = match.version || '';
        break;
      }
    }
    if (browserName === 'Unknown') {
      const edgeBrand = uaData.brands.find(b => b.brand === 'Microsoft Edge');
      if (edgeBrand) {
        browserName = 'Edge';
        browserVersion = edgeBrand.version || '';
      }
    }
    if (browserName === 'Unknown') {
      const chromium = uaData.brands.find(b => b.brand === 'Chromium');
      if (chromium) {
        browserName = 'Chrome';
        browserVersion = chromium.version || '';
      }
    }
  }

  if (browserName === 'Unknown') {
    if (ua.includes('Edg/')) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
      browserName = 'Opera';
      browserVersion = ua.match(/OPR\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Chrome/')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Safari/')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || '';
    }
  }

  let osName = 'Unknown';
  let osVersion = '';
  if (uaData && uaData.platform) osName = uaData.platform;

  if (ua.includes('Windows NT')) {
    if (osName === 'Unknown') osName = 'Windows';
    const ntVersion = ua.match(/Windows NT ([\d.]+)/)?.[1] || '';
    const ntMap = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    osVersion = ntMap[ntVersion] || ntVersion;
  } else if (ua.includes('Mac OS X')) {
    if (osName === 'Unknown') osName = 'macOS';
    osVersion = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  }

  return { browserName, browserVersion, osName, osVersion, extensionVersion: manifest.version };
}

// ─── Core Sync ──────────────────────────────────────────────────────
async function syncWithAdminPanel() {
  if (isUnpairing) return;

  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (!deviceId) return;

    setupRealtimeListener(deviceId).catch(() => {});
    await flushEventBatch(deviceId).catch(() => {});

    const info = getBrowserInfo();
    const params = new URLSearchParams({
      deviceId,
      _t: Date.now().toString(),
      browserName: info.browserName,
      browserVersion: info.browserVersion,
      osName: info.osName,
      osVersion: info.osVersion,
      extVersion: info.extensionVersion,
    });

    const response = await fetch(`${API_BASE_URL}/api/extension/sync?${params.toString()}`, {
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        const { everBeenActive } = await chrome.storage.local.get("everBeenActive");
        if (everBeenActive) {
          console.log("DEVICE DELETED! Going INACTIVE now.");
          await performUnpair();
        }
      }
      return;
    }

    const data = await response.json();
    const enabledState = data.is_enabled === true;
    const safeSearchState = data.safe_search_enabled === true;
    const urls = data.blocked_urls || [];
    const keywords = data.blocked_keywords || [];

    await chrome.storage.local.set({ 
      is_enabled: enabledState, 
      safe_search_enabled: safeSearchState,
      blocked_urls: urls,
      blocked_keywords: keywords,
      everBeenActive: enabledState ? true : undefined
    });

    if (enabledState) {
      updateBlockingRules(urls).catch(() => {});
      updateSafeSearchRules(safeSearchState, urls, keywords).catch(() => {});
    } else {
      clearBlockingRules().catch(() => {});
    }

  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// ─── Blocking Rules ─────────────────────────────────────────────────
async function updateBlockingRules(urls) {
  if (!urls || !Array.isArray(urls)) return;
  const rules = urls.map((url, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: "/blocked-page/blocked.html" } },
    condition: { urlFilter: `||${url}`, resourceTypes: ["main_frame"] }
  }));
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldBlockingRuleIds = currentRules.filter(r => r.id < 10000).map(r => r.id);
  
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldBlockingRuleIds,
    addRules: rules
  });
}

async function clearBlockingRules() {
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({ 
    removeRuleIds: currentRules.map(r => r.id) 
  });
}

// ─── Safe Search Enforcement ──────────────────────────────────────────
async function updateSafeSearchRules(enabled, dynamicUrls = [], dynamicKeywords = []) {
  const START_ID = 10000;
  const END_ID = 15000;
  
  const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
  const rulesToRemove = currentRules
    .filter(r => r.id >= START_ID && r.id <= END_ID)
    .map(r => r.id);
    
  if (!enabled) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rulesToRemove
    });
    console.log("[SafeSearch] Rules disabled and removed.");
    return;
  }

  // 1. Static Search Engine Rules (Force Family Mode / Safe Search)
  const rules = [
    // Google: safe=active (Regex for international domains)
    {
      id: 10001,
      priority: 1000,
      action: {
        type: "redirect",
        redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: "safe", value: "active" }] } } }
      },
      condition: { 
        regexFilter: "^https?://(www\\.)?google\\.[a-z.]+/search.*", 
        resourceTypes: ["main_frame", "sub_frame"] 
      }
    },
    // Bing: adlt=strict
    {
      id: 10002,
      priority: 1000,
      action: {
        type: "redirect",
        redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: "adlt", value: "strict" }] } } }
      },
      condition: { urlFilter: "||bing.com/search*", resourceTypes: ["main_frame", "sub_frame"] }
    },
    // DuckDuckGo: kp=1 (Family Mode)
    {
      id: 10003,
      priority: 1000,
      action: {
        type: "redirect",
        redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: "kp", value: "1" }] } } }
      },
      condition: { urlFilter: "||duckduckgo.com/*", resourceTypes: ["main_frame", "sub_frame"] }
    },
    // Yahoo: vm=p (Strict Search)
    {
      id: 10004,
      priority: 1000,
      action: {
        type: "redirect",
        redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: "vm", value: "p" }] } } }
      },
      condition: { urlFilter: "||search.yahoo.com/search*", resourceTypes: ["main_frame", "sub_frame"] }
    }
  ];

    // 2. Dynamic Domain Rules from Supabase
    dynamicUrls.forEach((url, index) => {
      const ruleId = 11000 + index;
      if (ruleId > 13000) return;

      rules.push({
        id: ruleId,
        priority: 30,
        action: { type: "redirect", redirect: { extensionPath: "/blocked-page/blocked.html" } },
        condition: { 
          urlFilter: url.includes('.') ? `||${url}` : `*${url}*`, 
          resourceTypes: ["main_frame", "sub_frame"]
        }
      });
    });

    // 3. Dynamic Keyword Rules from Supabase
    dynamicKeywords.forEach((kw, index) => {
      const ruleId = 13001 + index;
      if (ruleId > END_ID) return;

      rules.push({
        id: ruleId,
        priority: 30,
        action: { type: "redirect", redirect: { extensionPath: "/blocked-page/blocked.html" } },
        condition: { 
          urlFilter: kw, 
          resourceTypes: ["main_frame", "sub_frame"],
          excludedDomains: ["google.com", "bing.com", "yahoo.com", "duckduckgo.com", "wikipedia.org", "youtube.com"]
        }
      });
    });

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rulesToRemove,
    addRules: rules
  });
  console.log(`[SafeSearch] Dynamic rules enforced from Supabase. Total rules: ${rules.length}`);
}

// ─── Event Logging ──────────────────────────────────────────────────
function logEvent(eventType, target, durationSec = null) {
  const event = { eventType, target, occurredAt: new Date().toISOString() };
  if (durationSec !== null) event.durationSec = durationSec;
  eventBatch.push(event);

  if (eventBatch.length >= MAX_BATCH_SIZE) {
    chrome.storage.local.get("deviceId", ({ deviceId }) => {
      if (deviceId) flushEventBatch(deviceId).catch(() => {});
    });
  }
}

async function flushEventBatch(deviceId) {
  if (eventBatch.length === 0) return;
  const eventsToSend = [...eventBatch];
  eventBatch = [];
  try {
    await fetch(`${API_BASE_URL}/api/extension/sync`, {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, events: eventsToSend })
    });
  } catch (error) {
    eventBatch = [...eventsToSend, ...eventBatch];
    console.error("Event flush failed:", error);
  }
}

// ─── Tab Tracking ───────────────────────────────────────────────────
function endCurrentSession() {
  if (activeSession.hostname && activeSession.startTime) {
    const durationSec = Math.round((Date.now() - activeSession.startTime) / 1000);
    if (durationSec >= 2) logEvent("site_visit", activeSession.hostname, durationSec);
  }
  activeSession = { hostname: null, startTime: null };
}

function startSession(hostname) {
  if (!hostname || activeSession.hostname === hostname) return;
  endCurrentSession();
  activeSession = { hostname, startTime: Date.now() };
}

async function trackActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab?.url) {
      const url = new URL(tab.url);
      if (url.protocol.startsWith('http')) {
        startSession(url.hostname);
        return;
      }
    }
    endCurrentSession();
  } catch (e) {}
}

chrome.tabs.onActivated.addListener(trackActiveTab);
chrome.tabs.onUpdated.addListener((id, change, tab) => { if (change.url && tab.active) trackActiveTab(); });
chrome.windows.onFocusChanged.addListener((id) => { 
  if (id === chrome.windows.WINDOW_ID_NONE) endCurrentSession(); else trackActiveTab(); 
});
