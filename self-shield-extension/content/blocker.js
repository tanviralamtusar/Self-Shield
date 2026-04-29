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

const SEARCH_ENGINES = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com'];
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
      const regex = new RegExp(`[?&/=]${lowerKw}|\\b${lowerKw}\\b`, 'i');
      return regex.test(url);
    });

    if (isRestricted) {
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
