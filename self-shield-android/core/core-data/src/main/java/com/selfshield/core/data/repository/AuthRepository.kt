package com.selfshield.core.data.repository

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.SessionStatus
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.gotrue.SessionStatus
import io.github.jan.supabase.gotrue.user.UserInfo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val supabase: SupabaseClient
) {
    val currentUser: Flow<UserInfo?> = supabase.auth.sessionStatus
        .map { status ->
            when (status) {
                is SessionStatus.Authenticated -> status.session.user
                is SessionStatus.NotAuthenticated -> null
                else -> null
            }
        }
        .flowOn(Dispatchers.IO)

    /** Simple boolean flow that doesn't leak Supabase types to consumer modules. */
    val isAuthenticated: Flow<Boolean> = currentUser.map { it != null }

    suspend fun signIn(email: String, password: String): Result<Boolean> {
        return try {
            supabase.auth.signInWith(Email) {
                this.email = email
                this.password = password
            }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signUp(email: String, password: String): Result<Boolean> {
        return try {
            supabase.auth.signUpWith(Email) {
                this.email = email
                this.password = password
                data = buildJsonObject {
                    put("role", "child")
                }
            }
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signOut(): Result<Boolean> {
        return try {
            supabase.auth.signOut()
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun resetPassword(email: String): Result<Unit> = runCatching {
        supabase.auth.resetPasswordForEmail(
            email = email,
            redirectTo = "https://self-shield-web.vercel.app/reset-password" // Replace with actual web URL if known, or use a placeholder
        )
    }

    fun isUserLoggedIn(): Boolean {
        return supabase.auth.currentUserOrNull() != null
    }
}
