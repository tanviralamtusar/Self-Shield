package com.selfshield.service.messaging

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.selfshield.core.data.identity.DeviceManager
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class SelfShieldFcmService : FirebaseMessagingService() {

    @Inject
    lateinit var deviceManager: DeviceManager

    companion object {
        private const val TAG = "SelfShieldFcm"
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "New FCM Token: $token")
        deviceManager.setFcmToken(token)
        // TODO: Sync token with Supabase if device is already paired
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        Log.d(TAG, "Message received from: ${message.from}")

        // Check if message contains data payload
        if (message.data.isNotEmpty()) {
            val action = message.data["action"]
            val payload = message.data["payload"]
            
            Log.d(TAG, "Command action: $action, payload: $payload")
            
            handleCommand(action, payload)
        }
    }

    private fun handleCommand(action: String?, payload: String?) {
        when (action) {
            "LOCK_DEVICE" -> {
                // TODO: Implement remote lock via DevicePolicyManager
            }
            "SYNC_DATA" -> {
                // TODO: Trigger SyncWorker
            }
            "UPDATE_BLOCKLIST" -> {
                // TODO: Refresh blocklist from Supabase
            }
            else -> {
                Log.w(TAG, "Unknown command action: $action")
            }
        }
    }
}
