document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status-text');
  const deviceIdSpan = document.getElementById('device-id');
  const pairContainer = document.getElementById('pair-container');
  const deviceIdInput = document.getElementById('deviceIdInput');
  const pairBtn = document.getElementById('pairBtn');
  const syncBtn = document.getElementById('syncBtn');

  // Load current status
  function fetchStatus() {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
      if (response) {
        updateUI(response);
      }
    });
  }

  fetchStatus();
  // Poll every 1 second for instant UI update
  const statusPoller = setInterval(fetchStatus, 1000);

  // Cleanup on unload
  window.addEventListener('unload', () => clearInterval(statusPoller));

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
        if (response && response.success) {
          // Poll for status update
          let attempts = 0;
          const poll = setInterval(() => {
            chrome.runtime.sendMessage({ action: 'getStatus' }, (res) => {
              if (res && res.is_enabled !== undefined) {
                updateUI(res);
                clearInterval(poll);
                pairBtn.disabled = false;
              }
            });
            attempts++;
            if (attempts > 10) {
              clearInterval(poll);
              statusText.textContent = 'Sync Error';
              pairBtn.disabled = false;
            }
          }, 1000);
        } else {
          statusText.textContent = 'Pairing Failed';
          pairBtn.disabled = false;
        }
      });
    }
  });

  syncBtn.addEventListener('click', () => {
    statusText.textContent = 'Syncing...';
    chrome.runtime.sendMessage({ action: 'triggerSync' }, () => {
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'getStatus' }, (res) => {
          updateUI(res);
        });
      }, 1000);
    });
  });
});
