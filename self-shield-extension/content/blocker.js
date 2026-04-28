// Self-Shield Content Blocker
// This script runs on every page to provide additional protection layer

// Listen for messages from the admin panel web page
// When admin deletes a device, the page sends a postMessage
// This content script relays it INSTANTLY to the service worker
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SELF_SHIELD_DEVICE_DELETED') {
    console.log('[Self-Shield] Device deleted from admin panel. Notifying extension...');
    
    try {
      // Check if the extension context is still valid before sending
      if (chrome.runtime && chrome.runtime.id) {
        chrome.runtime.sendMessage({ action: 'deviceDeleted' }, (response) => {
          if (chrome.runtime.lastError) {
            // Silently handle context invalidation or connection errors
            console.warn('[Self-Shield] Could not notify background script:', chrome.runtime.lastError.message);
          }
        });
      }
    } catch (e) {
      // Context invalidated error usually throws an exception
      console.log('[Self-Shield] Extension context invalidated. Please refresh the page.');
    }
  }
});

