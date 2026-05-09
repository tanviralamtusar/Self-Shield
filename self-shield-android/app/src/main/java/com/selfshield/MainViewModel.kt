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
    private val authRepository: AuthRepository
) : ViewModel() {

    val authState: StateFlow<AuthState> = authRepository.currentUser.map { user ->
        if (user != null) AuthState.Authenticated else AuthState.Unauthenticated
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = if (authRepository.isUserLoggedIn()) AuthState.Authenticated else AuthState.Unauthenticated
    )
}

sealed class AuthState {
    object Authenticated : AuthState()
    object Unauthenticated : AuthState()
}
