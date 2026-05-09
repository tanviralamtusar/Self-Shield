package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class SelfShieldAccessibilityService : AccessibilityService() {

    companion object {
        const val PREF_NAME = "self_shield_prefs"
        const val KEY_CHANNEL_BLOCK_ENABLED = "channel_block_enabled"
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val packageName = event.packageName?.toString() ?: return

        // Only act on WhatsApp
        if (packageName != "com.whatsapp" && packageName != "com.whatsapp.w4b") return

        // Check if channel blocking is enabled by user
        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val isBlockingEnabled = prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)
        if (!isBlockingEnabled) return

        val rootNode = rootInActiveWindow ?: return
        if (isOnChannelsSection(rootNode)) {
            // Press BACK to go to WhatsApp Chats tab — NOT home screen
            performGlobalAction(GLOBAL_ACTION_BACK)
        }
    }

    private fun isOnChannelsSection(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false

        val text = node.text?.toString()?.trim() ?: ""
        val contentDesc = node.contentDescription?.toString()?.trim() ?: ""
        val nodeText = text.ifEmpty { contentDesc }

        // Universal Keywords for "Updates" tab (selected state only)
        val updatesKeywords = hashSetOf(
            "Updates", "আপডেট", "अपडेट", "Novedades", "Actualizaciones",
            "المستجدات", "Atualizações", "Actus", "Aktuelles", "Pembaruan",
            "Обновления"
        )

        // Universal Keywords for "Channels" content indicators
        val channelsKeywords = hashSetOf(
            "Channels", "চ্যানেল", "चैनल", "Canales", "القنوات",
            "Canais", "Chaînes", "Kanäle", "Saluran", "Каналы",
            "Find channels", "চ্যানেল খুঁজুন", "Explore more",
            "Buscar canales", "Найти каналы", "Kanal temukan",
            "Kanäle finden", "Trouver des chaînes", "Encontrar canais"
        )

        // Only trigger if the "Updates" tab is actively selected
        val isUpdatesTabSelected = node.isSelected &&
            updatesKeywords.any { it.equals(nodeText, ignoreCase = true) }

        // Or if we see Channels-specific content on screen
        val isChannelsContent = channelsKeywords.any { it.equals(nodeText, ignoreCase = true) }

        if (isUpdatesTabSelected || isChannelsContent) {
            return true
        }

        // Recurse into children
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            if (isOnChannelsSection(child)) {
                return true
            }
        }
        return false
    }

    override fun onInterrupt() {
        // Handle interruption
    }
}
