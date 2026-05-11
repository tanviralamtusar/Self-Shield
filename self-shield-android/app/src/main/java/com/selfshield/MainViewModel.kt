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

@HiltViewModel
class MainViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val deviceManager: com.selfshield.core.data.identity.DeviceManager
) : ViewModel() {

    val authState: StateFlow<AuthState> = authRepository.isAuthenticated.map { loggedIn ->
        when {
            !loggedIn -> AuthState.Unauthenticated
            deviceManager.isPaired() -> AuthState.Authenticated
            else -> AuthState.NeedsConnection
        }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = if (authRepository.isUserLoggedIn()) {
            if (deviceManager.isPaired()) AuthState.Authenticated else AuthState.NeedsConnection
        } else {
            AuthState.Unauthenticated
        }
    )
}

sealed class AuthState {
    object Authenticated : AuthState()
    object Unauthenticated : AuthState()
    object NeedsConnection : AuthState()
}
