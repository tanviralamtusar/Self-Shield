// Logic for the blocked page
document.addEventListener('DOMContentLoaded', () => {
  // Get original URL if passed via query param or use referrer
  const urlParams = new URLSearchParams(window.location.search);
  const originalUrl = urlParams.get('url') || document.referrer;
  
  const hostElement = document.getElementById('blocked-host');
  const backButton = document.getElementById('back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  if (originalUrl) {
    try {
      const urlObj = new URL(originalUrl);
      const host = urlObj.hostname;
      if (hostElement) hostElement.textContent = host;
    } catch (e) {
      if (hostElement) hostElement.textContent = originalUrl;
    }
  } else {
    if (hostElement) hostElement.textContent = 'Restricted Content';
  }

  // Report to background for analytics
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ 
        action: 'reportBlock', 
        target: originalUrl || 'Unknown' 
      });
    }
  } catch (e) {
    console.warn('[Self-Shield] Could not report block event:', e);
  }
});
