package com.selfshield.feature.onboarding.connect

import android.os.Build
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.selfshield.core.data.repository.DeviceRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ConnectViewModel @Inject constructor(
    private val deviceRepository: DeviceRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<ConnectUiState>(ConnectUiState.Idle)
    val uiState: StateFlow<ConnectUiState> = _uiState.asStateFlow()

    fun connectDevice(pairingCode: String) {
        viewModelScope.launch {
            _uiState.value = ConnectUiState.Loading
            
            // Get device info
            val deviceName = "${Build.MANUFACTURER} ${Build.MODEL}"
            val model = Build.MODEL
            val osVersion = "Android ${Build.VERSION.RELEASE}"

            val result = deviceRepository.claimDevice(
                pairingCode = pairingCode,
                deviceName = deviceName,
                model = model,
                osVersion = osVersion
            )

            _uiState.value = if (result.isSuccess) {
                ConnectUiState.Success
            } else {
                ConnectUiState.Error(result.exceptionOrNull()?.message ?: "Failed to connect device")
            }
        }
    }

    fun clearError() {
        _uiState.value = ConnectUiState.Idle
    }
}

sealed class ConnectUiState {
    object Idle : ConnectUiState()
    object Loading : ConnectUiState()
    object Success : ConnectUiState()
    data class Error(val message: String) : ConnectUiState()
}
