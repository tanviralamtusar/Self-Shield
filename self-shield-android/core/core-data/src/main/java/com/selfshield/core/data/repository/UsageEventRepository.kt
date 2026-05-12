package com.selfshield.core.data.repository

import com.selfshield.core.data.identity.DeviceManager
import com.selfshield.core.database.dao.UsageEventDao
import com.selfshield.core.database.entity.UsageEventEntity
import io.github.jan.supabase.SupabaseClient
import java.time.Instant
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UsageEventRepository @Inject constructor(
    private val usageEventDao: UsageEventDao,
    private val deviceManager: DeviceManager,
    private val supabase: SupabaseClient,
    private val syncManager: com.selfshield.core.data.sync.SyncManager
) {
    suspend fun logEvent(eventType: String, target: String? = null, durationSec: Int? = null) {
        val deviceId = deviceManager.getDeviceId() ?: return
        val event = UsageEventEntity(
            deviceId = deviceId,
            eventType = eventType,
            target = target,
            durationSec = durationSec,
            occurredAt = Instant.now().toString()
        )
        usageEventDao.insertEvent(event)

        if (eventType == "site_visit") {
            syncManager.triggerImmediateSync()
        }
    }

    suspend fun getUnsyncedEvents(): List<UsageEventEntity> {
        return usageEventDao.getUnsyncedEvents()
    }

    suspend fun markAsSynced(events: List<UsageEventEntity>) {
        val syncedEvents = events.map { it.copy(isSynced = true) }
        usageEventDao.updateEvents(syncedEvents)
    }
}
