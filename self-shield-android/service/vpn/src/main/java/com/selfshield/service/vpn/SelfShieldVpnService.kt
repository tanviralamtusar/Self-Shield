package com.selfshield.service.vpn

import android.content.Intent
import android.net.VpnService
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SelfShieldVpnService : VpnService() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // TODO: Start foreground notification
        // TODO: Start VPN tunnel logic
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        // TODO: Stop VPN tunnel
    }

    private fun startVpnTunnel() {
        val builder = Builder()
        // Configure VPN (DNS, routes, etc.)
        // builder.addAddress("10.0.0.2", 32)
        // builder.addRoute("0.0.0.0", 0)
        // builder.establish()
    }
}
