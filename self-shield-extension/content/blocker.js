// Self-Shield Content Blocker
// This script runs on every page to provide additional protection layer

// Listen for messages from the admin panel web page
// When admin changes settings or deletes a device, the page sends a postMessage
// This content script relays it INSTANTLY to the service worker
window.addEventListener('message', (event) => {
  // Device deleted — instant unpair
  if (event.data && event.data.type === 'SELF_SHIELD_DEVICE_DELETED') {
    console.log('[Self-Shield] Device deleted from admin panel. Notifying extension...');

    try {
      if (chrome.runtime && chrome.runtime.id) {
        chrome.runtime.sendMessage({ action: 'deviceDeleted' }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('[Self-Shield] Could not notify background script:', chrome.runtime.lastError.message);
          }
        });
      }
    } catch (e) {
      console.log('[Self-Shield] Extension context invalidated. Please refresh the page.');
    }
  }

  // Settings changed — instant sync
  if (event.data && event.data.type === 'SELF_SHIELD_SETTINGS_CHANGED') {
    console.log('[Self-Shield] Settings changed from admin panel. Triggering sync...');

    try {
      if (chrome.runtime && chrome.runtime.id) {
        chrome.runtime.sendMessage({ action: 'triggerSync' }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('[Self-Shield] Could not trigger sync:', chrome.runtime.lastError.message);
          }
        });
      }
    } catch (e) {
      console.log('[Self-Shield] Extension context invalidated. Please refresh the page.');
    }
  }
});
