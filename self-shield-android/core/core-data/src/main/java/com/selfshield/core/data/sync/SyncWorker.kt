package com.selfshield.core.data.sync

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.selfshield.core.data.identity.DeviceManager
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.filter.FilterOperation
import io.github.jan.supabase.postgrest.query.filter.FilterOperator
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.time.Instant

@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val supabase: SupabaseClient,
    private val deviceManager: DeviceManager
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            val deviceId = deviceManager.getDeviceId()
            val fcmToken = deviceManager.getFcmToken()

            // Update heartbeat and FCM token
            supabase.postgrest.from("devices").update(
                mapOf(
                    "last_seen_at" to Instant.now().toString(),
                    "fcm_token" to fcmToken,
                    "status" to "online"
                )
            ) {
                filter(FilterOperation("id", FilterOperator.EQ, deviceId))
            }

            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry() else Result.failure()
        }
    }
}
