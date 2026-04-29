
const SEARCH_ENGINES = {
  google: {
    host: 'google.com',
    selectors: ['#islrc', '.islrc', '#search', '#vpw_'], // Image/Video containers
    safeParam: 'safe=active'
  },
  bing: {
    host: 'bing.com',
    selectors: ['.dg_u', '#mmComponent_images_1', '#v_results'],
    safeParam: 'adlt=strict'
  }
};

function scrubSearch() {
  chrome.storage.local.get(['safe_search_enabled', 'is_enabled'], (settings) => {
    if (!settings.safe_search_enabled || settings.is_enabled === false) return;

    const url = new URL(window.location.href);
    const hostname = window.location.hostname;

    // 1. Force Safe Search parameters for all major engines
    if (hostname.includes('google.') && url.pathname === '/search') {
      if (url.searchParams.get('safe') !== 'active') {
        url.searchParams.set('safe', 'active');
        window.location.replace(url.toString());
        return;
      }
    }
    
    if (hostname.includes('bing.com') && url.pathname === '/search') {
      if (url.searchParams.get('adlt') !== 'strict') {
        url.searchParams.set('adlt', 'strict');
        window.location.replace(url.toString());
        return;
      }
    }

    if (hostname.includes('duckduckgo.com')) {
      if (url.searchParams.get('kp') !== '1') {
        url.searchParams.set('kp', '1');
        window.location.replace(url.toString());
        return;
      }
    }

    // 2. Hide "Safe Search" controls so users can't even see the toggle
    const hideSelectors = [
      '#ss-status-container', '.not-safe-search', // Google
      '#h_safesearch', '#ftrB .ftrS', // Bing
      '.safe-search-label', '#ybar-sf-container', // Yahoo
      '#family-filter-container', // Yandex
      '.onoffswitch' // General toggles
    ];
    
    if (!document.getElementById('self-shield-search-css')) {
      const style = document.createElement('style');
      style.id = 'self-shield-search-css';
      style.textContent = `
        ${hideSelectors.join(', ')} { display: none !important; visibility: hidden !important; pointer-events: none !important; }
      `;
      document.documentElement.appendChild(style);
    }
  });
}

// Run immediately and on mutations
scrubSearch();
const observer = new MutationObserver(scrubSearch);
observer.observe(document.documentElement, { childList: true, subtree: true });
