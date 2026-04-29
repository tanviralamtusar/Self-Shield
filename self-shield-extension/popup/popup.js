document.addEventListener('DOMContentLoaded', () => {
  // Connect to background script to trigger instant sync
  chrome.runtime.connect({ name: 'popup' });

  const statusCard = document.getElementById('status-card');
  const statusText = document.getElementById('status-text');
  const statusDot = document.getElementById('status-dot');
  const statusIcon = document.getElementById('status-icon');
  const deviceIdSpan = document.getElementById('device-id');
  const pairContainer = document.getElementById('pair-container');
  const deviceIdInput = document.getElementById('deviceIdInput');
  const pairBtn = document.getElementById('pairBtn');
  const activeSiteContainer = document.getElementById('active-site-container');
  const currentHostnameSpan = document.getElementById('current-hostname');
  const quickBlockBtn = document.getElementById('quickBlockBtn');

  let currentTabHostname = null;

  // Load initial status
  chrome.storage.local.get(["is_enabled", "deviceId", "blocked_urls", "pairedAt"], (data) => {
    updateUI(data);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      chrome.storage.local.get(["is_enabled", "deviceId", "blocked_urls", "pairedAt", "local_blocked_urls"], (data) => {
        updateUI(data);
      });
    }
  });

  // Get current tab info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        if (url.protocol.startsWith('http')) {
          currentTabHostname = url.hostname;
          if (currentHostnameSpan) currentHostnameSpan.textContent = currentTabHostname;
        } else {
          currentTabHostname = null;
        }
      } catch (e) {
        currentTabHostname = null;
      }
    }
    updateUIForCurrentTab();
  });

  function updateUIForCurrentTab() {
    if (currentTabHostname && activeSiteContainer) {
      // Don't show block button for our own admin panel or safe sites
      const safeSites = ['google.com', 'bing.com', 'wikipedia.org', 'selfshield.app', 'localhost'];
      const isSafe = safeSites.some(s => currentTabHostname.includes(s));
      
      chrome.storage.local.get(["deviceId", "blocked_urls", "local_blocked_urls"], (data) => {
        const allBlocked = [...(data.blocked_urls || []), ...(data.local_blocked_urls || [])];
        const isAlreadyBlocked = allBlocked.includes(currentTabHostname);
        
        if (data.deviceId && !isSafe && !isAlreadyBlocked) {
          activeSiteContainer.classList.remove('hidden');
        } else {
          activeSiteContainer.classList.add('hidden');
        }
      });
    } else if (activeSiteContainer) {
      activeSiteContainer.classList.add('hidden');
    }
  }

  function updateStatusUI(state) {
    if(statusCard) statusCard.className = 'status-card group state-' + state;
    if (state === 'active') {
      if(statusText) statusText.textContent = 'Active';
      if (statusIcon) statusIcon.textContent = 'shield_locked';
      if (statusDot) statusDot.className = 'status-dot animate-pulse';
      if (statusIcon) statusIcon.className = 'material-symbols-outlined status-icon';
    } else if (state === 'connecting') {
      if(statusText) statusText.textContent = 'Connecting...';
      if (statusIcon) statusIcon.textContent = 'sync';
      if (statusDot) statusDot.className = 'status-dot animate-pulse';
      if (statusIcon) statusIcon.className = 'material-symbols-outlined status-icon animate-spin';
    } else { // inactive
      if(statusText) statusText.textContent = 'Inactive';
      if (statusIcon) statusIcon.textContent = 'phonelink_erase';
      if (statusDot) statusDot.className = 'status-dot animate-pulse';
      if (statusIcon) statusIcon.className = 'material-symbols-outlined status-icon';
    }
  }

  function updateUI(data) {
    if (data.deviceId) {
      if(deviceIdSpan) deviceIdSpan.textContent = data.deviceId;
      if(pairContainer) pairContainer.classList.add('hidden');
    } else {
      if(deviceIdSpan) deviceIdSpan.textContent = 'Not Paired';
      if(pairContainer) pairContainer.classList.remove('hidden');
      
      // If not paired, status must be inactive
      updateStatusUI('inactive');
      return;
    }

    if (data.is_enabled === true) {
      updateStatusUI('active');
    } else if (data.pairedAt && (Date.now() - data.pairedAt) < 30000) {
      updateStatusUI('connecting');
    } else {
      updateStatusUI('inactive');
    }
  }

  if(pairBtn) {
    pairBtn.addEventListener('click', () => {
      const id = deviceIdInput ? deviceIdInput.value.trim() : '';
      if (id) {
        if(statusText) statusText.textContent = 'Syncing...';
        pairBtn.disabled = true;
        chrome.runtime.sendMessage({ action: 'pairDevice', deviceId: id }, (response) => {
          const error = chrome.runtime.lastError; // Access to check it
          if (error) {
            if(statusText) statusText.textContent = 'Connection Error';
            pairBtn.disabled = false;
            return;
          }
          if (response && response.success) {
            // No need to poll, storage listener will catch the update
            pairBtn.disabled = false;
          } else {
            const errorMsg = (response && response.error) ? response.error : 'Pairing Failed';
            if(statusText) {
              statusText.textContent = errorMsg;
              statusText.style.color = '#ff4d4d';
              
              // Visual feedback for input error
              if(deviceIdInput) {
                deviceIdInput.value = '';
                deviceIdInput.focus();
                deviceIdInput.classList.add('error-shake');
                setTimeout(() => deviceIdInput.classList.remove('error-shake'), 500);
              }

              setTimeout(() => {
                statusText.style.color = '';
                // Check if still not paired before resetting text
                chrome.storage.local.get("deviceId", (data) => {
                  if (!data.deviceId) {
                    statusText.textContent = 'Inactive';
                  }
                });
              }, 4000);
            }
            pairBtn.disabled = false;
          }
        });
      }
    });
  }

  if (quickBlockBtn) {
    quickBlockBtn.addEventListener('click', () => {
      if (currentTabHostname) {
        quickBlockBtn.disabled = true;
        quickBlockBtn.textContent = 'Blocking...';
        chrome.runtime.sendMessage({ action: 'addBlockedUrl', url: currentTabHostname }, (response) => {
          if (response && response.success) {
            quickBlockBtn.textContent = 'Blocked';
            setTimeout(() => {
              updateUIForCurrentTab();
            }, 1000);
          } else {
            quickBlockBtn.disabled = false;
            quickBlockBtn.textContent = 'Block This Site';
          }
        });
      }
    });
  }

});
