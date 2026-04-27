document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status-text');
  const deviceIdSpan = document.getElementById('device-id');
  const pairContainer = document.getElementById('pair-container');
  const deviceIdInput = document.getElementById('deviceIdInput');
  const pairBtn = document.getElementById('pairBtn');

  // Load current status
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
      updateUI(response);
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

    if (data.is_enabled) {
      statusText.textContent = 'Active';
      statusText.className = 'active';
    } else {
      statusText.textContent = 'Inactive';
      statusText.className = 'inactive';
    }
  }

  pairBtn.addEventListener('click', () => {
    const id = deviceIdInput.value.trim();
    if (id) {
      chrome.runtime.sendMessage({ action: 'pairDevice', deviceId: id }, (response) => {
        if (response && response.success) {
          // Refresh UI
          chrome.runtime.sendMessage({ action: 'getStatus' }, (res) => {
            updateUI(res);
          });
        }
      });
    }
  });
});
