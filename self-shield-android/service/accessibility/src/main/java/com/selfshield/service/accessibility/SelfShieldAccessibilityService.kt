package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SelfShieldAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val packageName = event.packageName?.toString() ?: return

        if (packageName == "com.whatsapp" || packageName == "com.whatsapp.w4b") {
            val rootNode = rootInActiveWindow ?: return
            if (isWhatsAppUpdatesTabVisible(rootNode)) {
                performGlobalAction(GLOBAL_ACTION_HOME)
            }
        }
    }

    private fun isWhatsAppUpdatesTabVisible(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false

        val text = node.text?.toString()?.trim()
        val contentDesc = node.contentDescription?.toString()?.trim()

        // Universal Keywords for "Updates"
        val updatesKeywords = hashSetOf(
            "Updates", "আপডেট", "अपडेट", "Novedades", "Actualizaciones", 
            "المستجدات", "Atualizações", "Actus", "Aktuelles", "Pembaruan", 
            "Обновления", "Status", "স্ট্যাটাস"
        )

        // Universal Keywords for "Channels"
        val channelsKeywords = hashSetOf(
            "Channels", "চ্যানেল", "चैनल", "Canales", "القنوات", 
            "Canais", "Chaînes", "Kanäle", "Saluran", "Каналы", 
            "Find channels", "চ্যানেল খুঁজুন", "Explore more"
        )

        val nodeText = text ?: contentDesc ?: ""
        
        // Check if current node text matches any keyword (Case Insensitive)
        val matchesUpdates = updatesKeywords.any { it.equals(nodeText.toString(), ignoreCase = true) }
        val matchesChannels = channelsKeywords.any { it.equals(nodeText.toString(), ignoreCase = true) }

        // If the node is a selected tab and matches "Updates"
        val isSelectedUpdatesTab = node.isSelected && matchesUpdates
        
        // Or if the screen contains clear "Channels" indicators
        if (isSelectedUpdatesTab || matchesChannels) {
            return true
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (isWhatsAppUpdatesTabVisible(child)) {
                return true
            }
        }
        return false
    }

    override fun onInterrupt() {
        // Handle interruption
    }
}
