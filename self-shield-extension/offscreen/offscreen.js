const SUPABASE_URL = "https://nkadwmptdzjsmwuujcid.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYWR3bXB0ZHpqc213dXVqY2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjI4OTcsImV4cCI6MjA5MjU5ODg5N30.XunlpVcJPHSL953gKIQuZ7-vrbI3SnmCbtp8OX_gdL0";

// Rename local variable to avoid conflict with global 'supabase' from the UMD library
let sbClient = null;
let supabaseChannel = null;

async function init() {
  console.log("[Offscreen] Initializing Supabase...");
  
  // Wait up to 3 seconds for the library to be available on window
  let retries = 30;
  while (!window.supabase && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
    retries--;
  }

  if (!window.supabase) {
    console.error("[Offscreen] Supabase library (window.supabase) not found after waiting!");
    // Log available keys on window for debugging
    const keys = Object.keys(window).filter(k => k.toLowerCase().includes('sb') || k.toLowerCase().includes('supa'));
    console.log("[Offscreen] Potential matches on window:", keys);
    return;
  }
  
  try {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("[Offscreen] Supabase client created.");
  } catch (err) {
    console.error("[Offscreen] Failed to create Supabase client:", err);
    return;
  }
  
  if (chrome.storage && chrome.storage.local) {
    const { deviceId } = await chrome.storage.local.get("deviceId");
    if (deviceId) {
      setupRealtime(deviceId);
    }
  } else {
    console.error("[Offscreen] chrome.storage.local is not available");
  }
}

// Check for chrome.storage before adding listener
if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.deviceId && changes.deviceId.newValue) {
      setupRealtime(changes.deviceId.newValue);
    }
  });
}

function setupRealtime(deviceId) {
  if (!sbClient) {
    console.error("[Offscreen] sbClient not initialized, cannot setup realtime");
    return;
  }
  if (supabaseChannel) {
    supabaseChannel.unsubscribe();
  }

  console.log(`[Offscreen] Setting up Realtime for ${deviceId}`);
  supabaseChannel = sbClient.channel(`device-${deviceId}`);

  supabaseChannel
    .on('presence', { event: 'sync' }, () => {
      const state = supabaseChannel.presenceState();
      console.log("[Offscreen] Presence sync:", state);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await supabaseChannel.track({
          device: deviceId,
          online_at: new Date().toISOString(),
          app: 'extension'
        });
        console.log("[Offscreen] Subscribed and tracking presence");
      }
    });

  // Settings subscription
  sbClient.channel('settings-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'device_settings',
        filter: `device_id=eq.${deviceId}`
      },
      (payload) => {
        console.log("[Offscreen] Settings updated, notifying worker...");
        chrome.runtime.sendMessage({ action: 'supabase_update', source: 'settings' });
      }
    )
    .subscribe();

  // Subscription updates
  sbClient.channel('subscription-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'device_block_list_subscriptions',
        filter: `device_id=eq.${deviceId}`
      },
      (payload) => {
        console.log("[Offscreen] Blocklist updated, notifying worker...");
        chrome.runtime.sendMessage({ action: 'supabase_update', source: 'blocklist' });
      }
    )
    .subscribe();
}

init();
