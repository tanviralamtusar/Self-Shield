package com.selfshield.core.database.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "usage_events")
data class UsageEventEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val deviceId: String,
    val eventType: String,
    val target: String?,
    val durationSec: Int?,
    val occurredAt: String,
    val isSynced: Boolean = false
)
