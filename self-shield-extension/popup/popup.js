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
  const unpairBtn = document.getElementById('unpairBtn');

  // Load initial status
  chrome.storage.local.get(["is_enabled", "deviceId", "blocked_urls", "pairedAt"], (data) => {
    updateUI(data);
  });

  // Listen for storage changes (Real-time updates from background)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      chrome.storage.local.get(["is_enabled", "deviceId", "blocked_urls", "pairedAt"], (data) => {
        updateUI(data);
      });
    }
  });

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
      if(unpairBtn) unpairBtn.classList.remove('hidden');
    } else {
      if(deviceIdSpan) deviceIdSpan.textContent = 'Not Paired';
      if(pairContainer) pairContainer.classList.remove('hidden');
      if(unpairBtn) unpairBtn.classList.add('hidden');
      
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
            if(statusText) statusText.textContent = 'Pairing Failed';
            pairBtn.disabled = false;
          }
        });
      }
    });
  }

  if(unpairBtn) {
    unpairBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to unpair this device?')) {
        chrome.runtime.sendMessage({ action: 'deviceDeleted' }, (response) => {
          if (response && response.success) {
            // Storage listener will update UI
          }
        });
      }
    });
  }
});
