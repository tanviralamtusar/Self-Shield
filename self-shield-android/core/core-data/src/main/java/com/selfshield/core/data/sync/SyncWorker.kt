package com.selfshield.core.data.sync

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.selfshield.core.data.identity.DeviceManager
import com.selfshield.core.data.repository.UsageEventRepository
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.time.Instant

@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val supabase: SupabaseClient,
    private val deviceManager: DeviceManager,
    private val usageEventRepository: UsageEventRepository
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        android.util.Log.d("SelfShieldSync", "SyncWorker started")
        return try {
            val deviceId = deviceManager.getDeviceId() ?: return Result.failure()
            val fcmToken = deviceManager.getFcmToken()

            // Update heartbeat and FCM token
            supabase.postgrest.from("devices").update(
                mapOf(
                    "last_seen_at" to Instant.now().toString(),
                    "fcm_token" to fcmToken,
                    "status" to "online"
                )
            ) {
                filter {
                    eq("id", deviceId)
                }
            }
            android.util.Log.d("SelfShieldSync", "Heartbeat updated")

            // Sync usage events
            val unsyncedEvents = usageEventRepository.getUnsyncedEvents()
            if (unsyncedEvents.isNotEmpty()) {
                val eventsToUpload = unsyncedEvents.map {
                    mapOf(
                        "device_id" to it.deviceId,
                        "event_type" to it.eventType,
                        "target" to it.target,
                        "duration_sec" to it.durationSec,
                        "occurred_at" to it.occurredAt
                    )
                }
                
                supabase.postgrest.from("usage_events").insert(eventsToUpload)
                usageEventRepository.markAsSynced(unsyncedEvents)
            }

            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
