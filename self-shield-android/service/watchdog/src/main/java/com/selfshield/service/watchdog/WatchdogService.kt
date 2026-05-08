package com.selfshield.service.watchdog

import android.app.Service
import android.content.Intent
import android.os.IBinder
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class WatchdogService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // TODO: Start foreground notification
        // TODO: Periodic checks for VPN and Accessibility services
        return START_STICKY
    }
}
