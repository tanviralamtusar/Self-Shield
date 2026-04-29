const API_BASE_URL = "http://localhost:3000";
const SUPABASE_URL = "https://nkadwmptdzjsmwuujcid.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U3jPnKL1B65hjpz8aVJFAA_4jMogGtD";

// Import Supabase library
importScripts('supabase.js');

let supabase = null;
let realtimeChannel = null;

// Initialize Supabase
if (typeof supabase === 'undefined' || !supabase) {
  const { createClient } = this.supabase;
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ─── Realtime: Instant Unpair Listener ───────────────────────────────
async function setupRealtimeListener(deviceId) {
  if (!deviceId || !supabase) return;
  
  // Cleanup existing
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
  }

  console.log(`[Realtime] Subscribing to device: ${deviceId}`);
  
  realtimeChannel = supabase
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
        console.log('[Realtime] Device updated:', payload);
        if (payload.new && payload.new.is_admin_active === false) {
          console.log('[Realtime] Instant unpair signal received!');
          handleDeviceDeleted();
        }
      }
    )
    .subscribe((status) => {
      console.log(`[Realtime] Subscription status: ${status}`);
    });
}

async function handleDeviceDeleted() {
  if (isUnpairing) return;
  isUnpairing = true;
  
  console.log("INSTANT: Device unpairing via Realtime...");

  // 1. Clear storage
  await chrome.storage.local.set({
    is_enabled: false,
    deviceId: null,
    pairedAt: null,
    everBeenActive: false,
    blocked_urls: []
  });

  // 2. Clear blocking rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(rule => rule.id);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds
  });

  // 3. Clear Realtime
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
    realtimeChannel = null;
  }

  isUnpairing = false;
  console.log("INSTANT: Unpairing complete.");
}

// ─── Event Batch Queue ──────────────────────────────────────────────
const MAX_BATCH_SIZE = 20;
let eventBatch = [];

// ─── State ──────────────────────────────────────────────────────────
let isUnpairing = false;

// ─── Alarms ─────────────────────────────────────────────────────────
// Safety-net: catch changes made outside the dashboard (e.g. mobile app)
chrome.alarms.create("safetyNetSync", { periodInMinutes: 5 });
// Event flush: send batched site visits to the backend every 2 minutes
chrome.alarms.create("flushEvents", { periodInMinutes: 2 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "safetyNetSync") {
    syncWithAdminPanel();
  }
  if (alarm.name === "flushEvents") {
    chrome.storage.local.get("deviceId", ({ deviceId }) => {
      if (deviceId) flushEventBatch(deviceId);
    });
  }
});

// ─── Lifecycle Triggers ─────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  console.log("Self-Shield Extension Installed");
  syncWithAdminPanel();
});

chrome.runtime.onStartup.addListener(() => {
  syncWithAdminPanel();
});

// ─── Instant Sync: Content Script Relay or Popup ────────────────────
// When the dashboard page changes settings, the content script sends
// 'triggerSync'. When the popup opens, it connects on this port.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    syncWithAdminPanel();
  }
});

// ─── Message Listeners ──────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerSync") {
    syncWithAdminPanel()
      .then(() => sendResponse({ success: true }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }

  if (request.action === "pairDevice") {
    const info = getBrowserInfo();
    const params = new URLSearchParams({
      deviceId: request.deviceId,
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
            blocked_urls: data.blocked_urls || []
          }, () => {
            setupRealtimeListener(request.deviceId);
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
    console.log("INSTANT: Device unpairing...");
    isUnpairing = true;

    const performUnpair = async () => {
      try {
        const { deviceId } = await chrome.storage.local.get("deviceId");
        if (deviceId) {
          // Flush any remaining events before clearing state
          await flushEventBatch(deviceId);
        }
      } catch (e) {
        // Best-effort flush before unpair
      }

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

  if (request.action === "reportBlock") {
    logEvent("block_triggered", request.target);
    sendResponse({ success: true });
    return true;
  }
});

// ─── Browser Info Detection ─────────────────────────────────────────
function getBrowserInfo() {
  const ua = navigator.userAgent;
  const manifest = chrome.runtime.getManifest();
  
  let browserName = 'Unknown';
  let browserVersion = '';

  // 1. Modern API: navigator.userAgentData.brands (Chromium 90+)
  //    Arc, Brave, Edge, Opera, Vivaldi all register their brand here,
  //    even when their UA string is identical to Chrome's.
  const uaData = navigator.userAgentData;
  if (uaData && uaData.brands) {
    // Known browser brands to look for (order = priority)
    const knownBrands = ['Arc', 'Brave', 'Edge', 'Opera', 'Vivaldi', 'Whale', 'Samsung Internet'];
    
    for (const target of knownBrands) {
      const match = uaData.brands.find(b =>
        b.brand.toLowerCase().includes(target.toLowerCase())
      );
      if (match) {
        browserName = target;
        browserVersion = match.version || '';
        break;
      }
    }

    // If no special brand found, check for Microsoft Edge (brand: "Microsoft Edge")
    if (browserName === 'Unknown') {
      const edgeBrand = uaData.brands.find(b => b.brand === 'Microsoft Edge');
      if (edgeBrand) {
        browserName = 'Edge';
        browserVersion = edgeBrand.version || '';
      }
    }

    // If still unknown, fall back to Chromium version from brands
    if (browserName === 'Unknown') {
      const chromium = uaData.brands.find(b => b.brand === 'Chromium');
      if (chromium) {
        browserName = 'Chrome';
        browserVersion = chromium.version || '';
      }
    }
  }

  // 2. Fallback: UA string parsing (Firefox, Safari, or old browsers)
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

  // Detect OS
  let osName = 'Unknown';
  let osVersion = '';

  // Try modern API first
  if (uaData && uaData.platform) {
    osName = uaData.platform; // "Windows", "macOS", "Linux", "Chrome OS"
  }

  // Enrich with version from UA string
  if (ua.includes('Windows NT')) {
    if (osName === 'Unknown') osName = 'Windows';
    const ntVersion = ua.match(/Windows NT ([\d.]+)/)?.[1] || '';
    const ntMap = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
    osVersion = ntMap[ntVersion] || ntVersion;
  } else if (ua.includes('Mac OS X')) {
    if (osName === 'Unknown') osName = 'macOS';
    osVersion = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
  } else if (ua.includes('CrOS')) {
    if (osName === 'Unknown') osName = 'ChromeOS';
  } else if (ua.includes('Linux')) {
    if (osName === 'Unknown') osName = 'Linux';
  }

  return {
    browserName,
    browserVersion,
    osName,
    osVersion,
    extensionVersion: manifest.version,
  };
}

// ─── Core Sync ──────────────────────────────────────────────────────
async function syncWithAdminPanel() {
  if (isUnpairing) return;

  try {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (!deviceId) return;

    // Start listening for instant unpair signals
    setupRealtimeListener(deviceId);

    // Flush any pending events while we're syncing
    await flushEventBatch(deviceId);

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

    const url = `${API_BASE_URL}/api/extension/sync?${params.toString()}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
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

// ─── Blocking Rules ─────────────────────────────────────────────────
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

// ─── Event Logging (Batched) ────────────────────────────────────────
// Events are queued in memory and flushed either:
// 1. On the next sync cycle
// 2. When the batch reaches MAX_BATCH_SIZE
// 3. On unpair (best-effort flush)
function logEvent(eventType, target, durationSec = null) {
  const event = {
    eventType,
    target,
    occurredAt: new Date().toISOString()
  };
  if (durationSec !== null) event.durationSec = durationSec;
  eventBatch.push(event);

  // Auto-flush if batch is full
  if (eventBatch.length >= MAX_BATCH_SIZE) {
    chrome.storage.local.get("deviceId", ({ deviceId }) => {
      if (deviceId) flushEventBatch(deviceId);
    });
  }
}

async function flushEventBatch(deviceId) {
  if (eventBatch.length === 0) return;

  // Grab current batch and reset immediately to avoid double-flush
  const eventsToSend = [...eventBatch];
  eventBatch = [];

  try {
    await fetch(`${API_BASE_URL}/api/extension/sync`, {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        events: eventsToSend
      })
    });
  } catch (error) {
    // Put events back on failure so they retry next flush
    eventBatch = [...eventsToSend, ...eventBatch];
    console.error("Event flush failed:", error);
  }
}

// ─── Active Tab Time Tracking ───────────────────────────────────────
// Tracks how long the user spends on each hostname.
// When the user switches tabs or the browser loses focus, the elapsed
// time on the previous site is logged as a site_visit with durationSec.
let activeSession = { hostname: null, startTime: null };

function endCurrentSession() {
  if (activeSession.hostname && activeSession.startTime) {
    const durationSec = Math.round((Date.now() - activeSession.startTime) / 1000);
    // Only log if the user spent at least 2 seconds (avoid tab-switch noise)
    if (durationSec >= 2) {
      logEvent("site_visit", activeSession.hostname, durationSec);
    }
  }
  activeSession = { hostname: null, startTime: null };
}

function startSession(hostname) {
  if (!hostname) return;
  // Don't restart if it's the same hostname
  if (activeSession.hostname === hostname) return;
  endCurrentSession();
  activeSession = { hostname, startTime: Date.now() };
}

async function trackActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      if (url.protocol.startsWith('http')) {
        startSession(url.hostname);
        return;
      }
    }
    // Non-http tab or no tab — end any active session
    endCurrentSession();
  } catch (e) {
    // Tab query can fail during shutdown
  }
}

// When user switches tabs
chrome.tabs.onActivated.addListener(() => {
  trackActiveTab();
});

// When current tab navigates to a new URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    trackActiveTab();
  }
});

// When browser window gains/loses focus
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus — user is in another app
    endCurrentSession();
  } else {
    trackActiveTab();
  }
});

