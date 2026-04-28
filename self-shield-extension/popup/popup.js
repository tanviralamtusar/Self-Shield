document.addEventListener('DOMContentLoaded', () => {
  // Connect to background script to trigger instant sync
  chrome.runtime.connect({ name: 'popup' });

  const statusText = document.getElementById('status-text');
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

  function updateUI(data) {
    if (data.deviceId) {
      deviceIdSpan.textContent = data.deviceId;
      pairContainer.classList.add('hidden');
      unpairBtn.classList.remove('hidden');
    } else {
      deviceIdSpan.textContent = 'Not Paired';
      pairContainer.classList.remove('hidden');
      unpairBtn.classList.add('hidden');
      
      // If not paired, status must be inactive
      statusText.textContent = 'Inactive';
      statusText.className = 'inactive';
      return;
    }

    if (data.is_enabled === true) {
      statusText.textContent = 'Active';
      statusText.className = 'active';
    } else if (data.pairedAt && (Date.now() - data.pairedAt) < 30000) {
      statusText.textContent = 'Connecting...';
      statusText.className = 'inactive';
    } else {
      statusText.textContent = 'Inactive';
      statusText.className = 'inactive';
    }
  }


  pairBtn.addEventListener('click', () => {
    const id = deviceIdInput.value.trim();
    if (id) {
      statusText.textContent = 'Syncing...';
      pairBtn.disabled = true;
      chrome.runtime.sendMessage({ action: 'pairDevice', deviceId: id }, (response) => {
        const error = chrome.runtime.lastError; // Access to check it
        if (error) {
          statusText.textContent = 'Connection Error';
          pairBtn.disabled = false;
          return;
        }
        if (response && response.success) {
          // No need to poll, storage listener will catch the update
          pairBtn.disabled = false;
        } else {
          statusText.textContent = 'Pairing Failed';
          pairBtn.disabled = false;
        }
      });
    }
  });

  unpairBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to unpair this device?')) {
      chrome.runtime.sendMessage({ action: 'deviceDeleted' }, (response) => {
        if (response && response.success) {
          // Storage listener will update UI
        }
      });
    }
  });
});
