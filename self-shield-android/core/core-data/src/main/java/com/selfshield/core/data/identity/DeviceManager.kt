package com.selfshield.core.data.identity

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DeviceManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
    
    private val prefs = EncryptedSharedPreferences.create(
        "device_prefs",
        masterKeyAlias,
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    companion object {
        private const val KEY_DEVICE_ID = "device_id"
        private const val KEY_IS_PAIRED = "is_paired"
        private const val KEY_ADMIN_ID = "admin_id"
        private const val KEY_FCM_TOKEN = "fcm_token"
    }

    fun getFcmToken(): String? = prefs.getString(KEY_FCM_TOKEN, null)

    fun setFcmToken(token: String) {
        prefs.edit().putString(KEY_FCM_TOKEN, token).apply()
    }

    /**
     * Get or create a unique device ID.
     */
    fun getDeviceId(): String {
        var id = prefs.getString(KEY_DEVICE_ID, null)
        if (id == null) {
            id = UUID.randomUUID().toString()
            prefs.edit().putString(KEY_DEVICE_ID, id).apply()
        }
        return id
    }

    /**
     * Mark the device as paired with an admin.
     */
    fun setPaired(adminId: String) {
        prefs.edit()
            .putBoolean(KEY_IS_PAIRED, true)
            .putString(KEY_ADMIN_ID, adminId)
            .apply()
    }

    fun isPaired(): Boolean = prefs.getBoolean(KEY_IS_PAIRED, false)
    
    fun getAdminId(): String? = prefs.getString(KEY_ADMIN_ID, null)

    /**
     * Clear the local pairing state.
     */
    fun clearPairing() {
        prefs.edit()
            .remove(KEY_IS_PAIRED)
            .remove(KEY_ADMIN_ID)
            .apply()
    }
}
