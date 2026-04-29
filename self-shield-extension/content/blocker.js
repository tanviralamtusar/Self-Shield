// Self-Shield Content Blocker
// Highly resilient blocking with INSTANT BLACKOUT to prevent content flashing

// 1. IMMEDIATELY HIDE EVERYTHING (before any other logic)
// Set background on html immediately so it's not white
document.documentElement.style.background = '#0b1120';

const blackoutStyle = document.createElement('style');
blackoutStyle.id = 'self-shield-blackout';
// Hide everything except our block UI root
blackoutStyle.textContent = `
  html > :not(#self-shield-block-root) { display: none !important; }
  body { display: none !important; }
`;
document.documentElement.appendChild(blackoutStyle);

const EXCLUDED_HOSTS = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'wikipedia.org', 'youtube.com', 'healthline.com'];

function showBlockUI(hostname) {
  // Use a hard redirect to our local blocked page.
  // This is MUCH more secure than an overlay because it completely replaces 
  // the page content and execution context, making it impossible to bypass 
  // via Inspect Element.
  const blockedPageUrl = chrome.runtime.getURL('blocked-page/blocked.html');
  const originalUrl = window.location.href;
  
  // Clear the document immediately to prevent any more script execution
  document.documentElement.innerHTML = '';
  window.stop();
  
  // Perform the redirect
  window.location.replace(blockedPageUrl + '?url=' + encodeURIComponent(originalUrl));
}

function checkAndBlock() {
  chrome.storage.local.get(['safe_search_enabled', 'is_enabled', 'blocked_keywords'], (settings) => {
    const isSafeSearchEnabled = settings.safe_search_enabled && settings.is_enabled !== false;
    
    if (!isSafeSearchEnabled) {
      removeBlackout();
      return;
    }

    const url = window.location.href.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();

    if (EXCLUDED_HOSTS.some(host => hostname.includes(host))) {
      removeBlackout();
      return;
    }

    const keywords = settings.blocked_keywords && settings.blocked_keywords.length > 0 
      ? settings.blocked_keywords 
      : ['porn', 'sex', 'xvideo', 'pornhub', 'xnxx', 'xhamster', 'redtube', 'youporn', 'casino', '1xbet'];

    const isRestricted = keywords.some(kw => url.includes(kw.toLowerCase()));

    if (isRestricted) {
      console.log('[Self-Shield] Content blocked by keyword filter.');
      showBlockUI(hostname);
    } else {
      removeBlackout();
    }
  });
}

function removeBlackout() {
  const style = document.getElementById('self-shield-blackout');
  if (style) style.remove();
}

// Run immediately
checkAndBlock();

// Also run when the URL changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    checkAndBlock();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for pair/unpair messages from the trusted Admin Panel
window.addEventListener('message', (event) => {
  chrome.storage.local.get(['api_base_url'], (data) => {
    const allowedOrigin = data.api_base_url || 'http://localhost:3000';
    
    // Security: Verify that the message is coming from our trusted Admin Panel
    if (event.origin !== allowedOrigin) return;

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
});
