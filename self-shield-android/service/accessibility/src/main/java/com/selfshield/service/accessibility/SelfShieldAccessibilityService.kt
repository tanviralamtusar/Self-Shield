package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Self Shield Accessibility Service
 * Blocks WhatsApp Channels using the same proven approach as FocusGuard.
 * Uses findAccessibilityNodeInfosByText() + selected/focused check.
 */
class SelfShieldAccessibilityService : AccessibilityService() {

    companion object {
        const val PREF_NAME = "self_shield_prefs"
        const val KEY_CHANNEL_BLOCK_ENABLED = "channel_block_enabled"

        private const val PKG_WHATSAPP = "com.whatsapp"
        private const val PKG_WHATSAPP_B = "com.whatsapp.w4b"
    }

    private val mainHandler = Handler(Looper.getMainLooper())

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val pkg = event.packageName?.toString() ?: return
        if (pkg != PKG_WHATSAPP && pkg != PKG_WHATSAPP_B) return

        // Check if channel blocking is enabled
        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)) return

        handleWhatsApp()
    }

    private fun handleWhatsApp() {
        val root = rootInActiveWindow ?: return

        try {
            // Step 1: Check if "Updates"/"Channels" tab is SELECTED or FOCUSED
            val restrictedKeywords = arrayOf(
                "Updates", "আপডেট", "अपडेट", "Novedades", "Actualizaciones",
                "المستجدات", "Atualizações", "Actus", "Aktuelles", "Pembaruan",
                "Обновления",
                "Channels", "চ্যানেল", "चैनल", "Canales", "القنوات",
                "Canais", "Chaînes", "Kanäle", "Saluran", "Каналы"
            )

            for (keyword in restrictedKeywords) {
                val nodes = root.findAccessibilityNodeInfosByText(keyword)
                if (nodes != null && nodes.isNotEmpty()) {
                    for (node in nodes) {
                        val isActive = node.isSelected ||
                            node.isFocused ||
                            (node.contentDescription?.toString()?.lowercase()?.contains("selected") == true)
                        if (isActive) {
                            performBlockAction()
                            return
                        }
                    }
                }
            }

            // Step 2: Check for channel-specific UI elements
            // These only appear when actually inside channel views
            val channelIndicators = arrayOf(
                "Find channels", "চ্যানেল খুঁজুন",
                "Channels to follow", "Explore more",
                "See all", "সব দেখুন"
            )

            for (indicator in channelIndicators) {
                val nodes = root.findAccessibilityNodeInfosByText(indicator)
                if (nodes != null && nodes.isNotEmpty()) {
                    performBlockAction()
                    return
                }
            }
        } finally {
            root.recycle()
        }
    }

    /**
     * BACK first (to exit the current view), then HOME after 50ms
     * This ensures the user is quickly moved away from channels.
     */
    private fun performBlockAction() {
        performGlobalAction(GLOBAL_ACTION_BACK)
        mainHandler.postDelayed({
            performGlobalAction(GLOBAL_ACTION_HOME)
        }, 50)
    }

    override fun onInterrupt() {
        // Handle interruption
    }
}

