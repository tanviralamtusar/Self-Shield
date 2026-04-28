// Self-Shield Content Blocker
// This script runs on every page to provide additional protection layer

// Listen for messages from the admin panel web page
// When admin deletes a device, the page sends a postMessage
// This content script relays it INSTANTLY to the service worker
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SELF_SHIELD_DEVICE_DELETED') {
    console.log('[Self-Shield] Device deleted from admin panel. Notifying extension...');
    chrome.runtime.sendMessage({ action: 'deviceDeleted' }, (response) => {
      if (chrome.runtime.lastError) {
        // Ignore errors
      }
    });
  }
});
