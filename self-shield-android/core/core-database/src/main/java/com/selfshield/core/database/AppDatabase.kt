package com.selfshield.core.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.selfshield.core.database.dao.UsageEventDao
import com.selfshield.core.database.entity.UsageEventEntity

@Database(
    entities = [UsageEventEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun usageEventDao(): UsageEventDao
}
