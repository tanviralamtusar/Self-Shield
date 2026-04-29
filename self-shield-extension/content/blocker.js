// Self-Shield Content Blocker
// Highly resilient blocking with INSTANT BLACKOUT to prevent content flashing

// 1. IMMEDIATELY CREATE BLACKOUT OVERLAY
// We use a DIV instead of a STYLE tag to be more CSP-friendly
const blackoutOverlay = document.createElement('div');
blackoutOverlay.id = 'self-shield-blackout-overlay';
Object.assign(blackoutOverlay.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#0b1120',
  zIndex: '2147483647',
  display: 'block',
  pointerEvents: 'none' // Allow interaction if something goes wrong
});

// Use a trick to ensure it's the first thing in the DOM
if (document.documentElement) {
  document.documentElement.appendChild(blackoutOverlay);
  document.documentElement.style.backgroundColor = '#0b1120';
}

// 2. Safety Timeout: Remove blackout after 1.5 seconds NO MATTER WHAT
setTimeout(removeBlackout, 1500);

function removeBlackout() {
  const overlay = document.getElementById('self-shield-blackout-overlay');
  if (overlay) overlay.remove();
  document.documentElement.style.backgroundColor = '';
}

const SEARCH_ENGINES = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'ecosia.org'];
const SAFE_LIST = ['wikipedia.org', 'healthline.com', 'medicalnewstoday.com', 'selfshield.app'];

function showBlockUI(hostname) {
  const blockedPageUrl = chrome.runtime.getURL('blocked-page/blocked.html');
  const originalUrl = window.location.href;
  document.documentElement.innerHTML = '';
  window.stop();
  window.location.replace(blockedPageUrl + '?url=' + encodeURIComponent(originalUrl));
}

function checkAndBlock() {
  chrome.storage.local.get(['is_enabled', 'blocked_keywords', 'blocked_urls', 'local_blocked_urls'], (settings) => {
    const isEnabled = settings.is_enabled !== false;
    if (!isEnabled) {
      removeBlackout();
      return;
    }

    const url = window.location.href.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();

    // 1. Skip if domain is in SAFE_LIST
    if (SAFE_LIST.some(host => hostname.includes(host))) {
      removeBlackout();
      return;
    }

    const isSearchEngine = SEARCH_ENGINES.some(host => hostname.includes(host));

    // 2. Check for Blocked URLs (Skip for search engines to allow safe search)
    if (!isSearchEngine) {
      const allBlockedUrls = [
        ...(settings.blocked_urls || []), 
        ...(settings.local_blocked_urls || [])
      ];
      
      if (allBlockedUrls.some(blocked => hostname.includes(blocked.toLowerCase()))) {
        showBlockUI(hostname);
        return;
      }
    }

    // 3. Check for Blocked Keywords (Always check, even on search engines)
    const keywords = settings.blocked_keywords && settings.blocked_keywords.length > 0 
      ? settings.blocked_keywords 
      : ['porn', 'sex', 'xvideo', 'pornhub', 'xnxx', 'xhamster', 'redtube', 'youporn', 'casino', '1xbet'];

    const isRestricted = keywords.some(kw => {
      const lowerKw = kw.toLowerCase();
      // Improved regex: Match keyword as a whole word OR as a substring in query parameters
      // This catches "porn" in "pornography" if we remove the word boundaries, 
      // but to avoid false positives (like "button" in "butt"), we use a more balanced approach.
      // We check if the keyword exists at all in the URL.
      if (url.includes(lowerKw)) {
        // Special case: if it's a known search engine, we want to be more specific 
        // to avoid blocking "butt" when user types "button"
        if (isSearchEngine) {
          const searchRegex = new RegExp(`[?&q=]${lowerKw}|[+ ]${lowerKw}|\\b${lowerKw}`, 'i');
          return searchRegex.test(url);
        }
        return true;
      }
      return false;
    });

    if (isRestricted) {
      showBlockUI(hostname);
    } else if (!isSearchEngine) {
      // 4. Final Fallback: Server-Based Checking (Only for non-search engines)
      try {
        chrome.runtime.sendMessage({ action: 'checkUrl', url: window.location.href }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('[Self-Shield] Background script unavailable:', chrome.runtime.lastError.message);
            removeBlackout();
            return;
          }
          
          if (response && response.blocked) {
            console.log('[Self-Shield] Site blocked by server-side verification.');
            showBlockUI(hostname);
          } else {
            removeBlackout();
          }
        });
      } catch (e) {
        console.error('[Self-Shield] Failed to communicate with background:', e);
        removeBlackout();
      }
    } else {
      // It's a search engine and no keywords matched
      removeBlackout();
    }
  });
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

// Listen for pair/unpair messages
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
