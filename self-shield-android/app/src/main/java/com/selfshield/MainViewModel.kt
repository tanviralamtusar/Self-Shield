package com.selfshield

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.selfshield.core.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import com.selfshield.core.data.repository.DeviceRepository

@HiltViewModel
class MainViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val deviceRepository: DeviceRepository,
    private val deviceManager: com.selfshield.core.data.identity.DeviceManager
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Unauthenticated)
    val authState = _authState.asStateFlow()

    init {
        viewModelScope.launch {
            authRepository.isAuthenticated.collect { loggedIn ->
                updateAuthState(loggedIn)
                if (loggedIn) {
                    checkConnection()
                }
            }
        }
    }

    fun syncStatus(isAdminEnabled: Boolean, isAccessibilityActive: Boolean, isVpnActive: Boolean) {
        viewModelScope.launch {
            deviceRepository.updateStatus(isAdminEnabled, isAccessibilityActive, isVpnActive)
        }
    }

    fun checkConnection() {
        viewModelScope.launch {
            deviceRepository.checkPairingStatus()
            updateAuthState(authRepository.isUserLoggedIn())
        }
    }

    private fun updateAuthState(loggedIn: Boolean) {
        _authState.value = when {
            !loggedIn -> AuthState.Unauthenticated
            deviceManager.isPaired() -> AuthState.Authenticated
            else -> AuthState.NeedsConnection
        }
    }
}

sealed class AuthState {
    object Authenticated : AuthState()
    object Unauthenticated : AuthState()
    object NeedsConnection : AuthState()
}
