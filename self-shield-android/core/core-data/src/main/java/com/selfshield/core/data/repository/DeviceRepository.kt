package com.selfshield.core.data.repository

import com.selfshield.core.data.identity.DeviceManager
import io.github.jan.supabase.SupabaseClient
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
    private val supabaseApi: com.selfshield.core.network.api.SupabaseApi,
    private val deviceManager: DeviceManager
) {
    suspend fun registerDevice(deviceName: String, model: String, osVersion: String): Result<String> = withContext(Dispatchers.IO) {
        try {
            val deviceId = deviceManager.getDeviceId()
            val request = com.selfshield.core.network.model.RegisterRequest(
                device_id = deviceId,
                device_name = deviceName,
                os_version = osVersion,
                model = model
            )
            
            val response = supabaseApi.registerDevice(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!.pairing_code)
            } else {
                Result.failure(Exception("Failed to register: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun claimDevice(pairingCode: String, deviceName: String, model: String, osVersion: String): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val fcmToken = deviceManager.getFcmToken()
            val request = com.selfshield.core.network.model.ClaimRequest(
                pairing_code = pairingCode,
                fcm_token = fcmToken,
                device_name = deviceName,
                os_version = osVersion,
                model = model
            )
            
            val response = supabaseApi.claimDevice(request)
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                // Note: In our claim flow, the backend might return a NEW id if it wants
                // But usually we just use the one already in the placeholder
                deviceManager.setPaired(body.admin_id)
                Result.success(true)
            } else {
                Result.failure(Exception("Failed to claim: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun checkPairingStatus(): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val deviceId = deviceManager.getDeviceId()
            val response = supabase.postgrest.from("devices")
                .select(columns = Columns.raw("admin_id, status")) {
                    filter {
                        eq("id", deviceId)
                    }
                }.decodeSingle<DeviceStatus>()

            if (response.admin_id != null) {
                deviceManager.setPaired(response.admin_id)
                Result.success(true)
            } else {
                Result.success(false)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

@Serializable
data class DeviceStatus(
    val admin_id: String?,
    val status: String
)
