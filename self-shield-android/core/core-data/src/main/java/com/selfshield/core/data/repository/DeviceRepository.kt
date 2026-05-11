package com.selfshield.core.data.repository

import com.selfshield.core.data.identity.DeviceManager
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.auth
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.serialization.Serializable

@Singleton
class DeviceRepository @Inject constructor(
    private val supabase: SupabaseClient,
    private val deviceManager: DeviceManager
) {

    /**
     * Claim a device by pairing code — uses Supabase Postgrest directly.
     *
     * Flow:
     * 1. Find the pending placeholder row matching the pairing code.
     * 2. Upsert the real device row with admin_id from that placeholder.
     * 3. Clean up the placeholder if it differs from the real device.
     * 4. Save pairing state locally.
     */
    suspend fun claimDevice(
        pairingCode: String,
        deviceName: String,
        model: String,
        osVersion: String
    ): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val deviceId = deviceManager.getDeviceId()
            val fcmToken = deviceManager.getFcmToken()
            val currentUser = supabase.auth.currentUserOrNull()
                ?: return@withContext Result.failure(Exception("Not authenticated"))

            // 1. Find the pending placeholder with this pairing code
            val placeholder = supabase.postgrest.from("devices")
                .select(columns = Columns.raw("id, admin_id")) {
                    filter {
                        eq("pairing_code", pairingCode)
                        eq("status", "pending")
                    }
                }.decodeSingle<PlaceholderDevice>()

            val nowIso = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").apply {
                timeZone = java.util.TimeZone.getTimeZone("UTC")
            }.format(java.util.Date())

            // 2. Upsert the real device row, linking it to the admin
            supabase.postgrest.from("devices")
                .upsert(DeviceUpsert(
                    id = deviceId,
                    admin_id = placeholder.admin_id,
                    owner_id = currentUser.id,
                    fcm_token = fcmToken,
                    device_name = deviceName,
                    os_version = osVersion,
                    device_type = "android",
                    status = "online",
                    pairing_code = null,
                    last_seen_at = nowIso,
                    is_admin_active = true
                ))

            // 3. Clean up the placeholder if it's a different row
            if (placeholder.id != deviceId) {
                supabase.postgrest.from("devices")
                    .delete {
                        filter { eq("id", placeholder.id) }
                    }
            }

            // 4. Save locally
            deviceManager.setPaired(placeholder.admin_id)
            Result.success(true)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun checkPairingStatus(): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val deviceId = deviceManager.getDeviceId()
            val response = supabase.postgrest.from("devices")
                .select(columns = Columns.raw("admin_id, status, is_admin_active, is_accessibility_active, is_vpn_active")) {
                    filter {
                        eq("id", deviceId)
                    }
                }.decodeSingleOrNull<DeviceStatus>()

            if (response?.admin_id != null && response.is_admin_active) {
                deviceManager.setPaired(response.admin_id)
                Result.success(true)
            } else {
                // If not found, admin_id is null, or admin deactivated us
                deviceManager.clearPairing()
                Result.success(false)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    suspend fun updateStatus(
        isAdminEnabled: Boolean,
        isAccessibilityActive: Boolean,
        isVpnActive: Boolean
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val deviceId = deviceManager.getDeviceId()
            val nowIso = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").apply {
                timeZone = java.util.TimeZone.getTimeZone("UTC")
            }.format(java.util.Date())

            supabase.postgrest.from("devices")
                .update({
                    set("is_admin_enabled", isAdminEnabled)
                    set("is_accessibility_active", isAccessibilityActive)
                    set("is_vpn_active", isVpnActive)
                    set("last_seen_at", nowIso)
                    set("status", "online")
                }) {
                    filter { eq("id", deviceId) }
                }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

@Serializable
data class PlaceholderDevice(
    val id: String,
    val admin_id: String
)

@Serializable
data class DeviceUpsert(
    val id: String,
    val admin_id: String,
    val owner_id: String,
    val fcm_token: String?,
    val device_name: String,
    val os_version: String,
    val device_type: String,
    val status: String,
    val pairing_code: String?,
    val last_seen_at: String?,
    val is_admin_active: Boolean,
    val is_admin_enabled: Boolean = false,
    val is_accessibility_active: Boolean = false,
    val is_vpn_active: Boolean = false
)

@Serializable
data class DeviceStatus(
    val admin_id: String?,
    val status: String,
    val is_admin_active: Boolean,
    val is_admin_enabled: Boolean = false,
    val is_accessibility_active: Boolean,
    val is_vpn_active: Boolean
)
