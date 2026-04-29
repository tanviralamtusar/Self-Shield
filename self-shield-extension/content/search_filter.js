
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

    // 1. Precise Redirection for Search (only if missing param)
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

    // 2. Hide "Safe Search" controls and sensitive containers
    const hideSelectors = [
      '#ss-status-container', '.not-safe-search', // Google
      '#h_safesearch', '#ftrB .ftrS', // Bing
      '.safe-search-label', '#ybar-sf-container', // Yahoo
      '#family-filter-container' // Yandex
    ];
    
    if (!document.getElementById('self-shield-search-css')) {
      const style = document.createElement('style');
      style.id = 'self-shield-search-css';
      style.textContent = `
        ${hideSelectors.join(', ')} { display: none !important; visibility: hidden !important; pointer-events: none !important; }
        /* Instant blackout for potential NSFW containers in image search if not safe */
        .img-res-item, .mimg, .vr_link, .image-item { opacity: 0.1 !important; filter: blur(20px) !important; }
      `;
      document.documentElement.appendChild(style);
    }
  });
}

// Run immediately and on mutations
scrubSearch();
const observer = new MutationObserver(scrubSearch);
observer.observe(document.documentElement, { childList: true, subtree: true });
