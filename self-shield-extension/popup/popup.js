document.addEventListener('DOMContentLoaded', () => {
  // Connect to background script to trigger instant sync
  chrome.runtime.connect({ name: 'popup' });

  const statusText = document.getElementById('status-text');
  const deviceIdSpan = document.getElementById('device-id');
  const pairContainer = document.getElementById('pair-container');
  const deviceIdInput = document.getElementById('deviceIdInput');
  const pairBtn = document.getElementById('pairBtn');

  // Load initial status
  chrome.storage.local.get(["is_enabled", "deviceId", "blocked_urls"], (data) => {
    updateUI(data);
  });

  // Listen for storage changes (Real-time updates from background)
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      chrome.storage.local.get(["is_enabled", "deviceId", "blocked_urls"], (data) => {
        updateUI(data);
      });
    }
  });

  function updateUI(data) {
    if (data.deviceId) {
      deviceIdSpan.textContent = data.deviceId;
      pairContainer.classList.add('hidden');
    } else {
      deviceIdSpan.textContent = 'Not Paired';
      pairContainer.classList.remove('hidden');
    }

    if (data.is_enabled === true) {
      statusText.textContent = 'Active';
      statusText.className = 'active';
    } else if (data.is_enabled === false) {
      statusText.textContent = 'Inactive';
      statusText.className = 'inactive';
    } else {
      statusText.textContent = 'Waiting for Sync...';
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
});
