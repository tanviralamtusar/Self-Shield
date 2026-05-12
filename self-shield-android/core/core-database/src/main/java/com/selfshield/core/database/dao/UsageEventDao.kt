package com.selfshield.core.database.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.selfshield.core.database.entity.UsageEventEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface UsageEventDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: UsageEventEntity)

    @Query("SELECT * FROM usage_events WHERE isSynced = 0 ORDER BY occurredAt ASC")
    suspend fun getUnsyncedEvents(): List<UsageEventEntity>

    @Update
    suspend fun updateEvents(events: List<UsageEventEntity>)

    @Query("DELETE FROM usage_events WHERE isSynced = 1 AND occurredAt < :timestamp")
    suspend fun deleteOldSyncedEvents(timestamp: String)

    @Query("SELECT * FROM usage_events ORDER BY occurredAt DESC LIMIT 100")
    fun getRecentEvents(): Flow<List<UsageEventEntity>>
}
