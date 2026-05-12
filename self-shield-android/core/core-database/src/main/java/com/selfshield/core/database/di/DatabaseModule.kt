package com.selfshield.core.database.di

import android.content.Context
import androidx.room.Room
import com.selfshield.core.database.AppDatabase
import com.selfshield.core.database.dao.UsageEventDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "self_shield_db"
        ).build()
    }

    @Provides
    fun provideUsageEventDao(database: AppDatabase): UsageEventDao {
        return database.usageEventDao()
    }
}
