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

        // Tab is typically selected
        val isUpdatesTabSelected = node.isSelected && (
                text.equals("Updates", ignoreCase = true) || 
                text.equals("আপডেট", ignoreCase = true) ||
                contentDesc.equals("Updates", ignoreCase = true) || 
                contentDesc.equals("আপডেট", ignoreCase = true)
        )

        // Presence of channels section
        val hasChannelsHeader = text.equals("Channels", ignoreCase = true) || text.equals("চ্যানেল", ignoreCase = true)
        val hasFindChannels = text.equals("Find channels", ignoreCase = true) || text.equals("চ্যানেল খুঁজুন", ignoreCase = true)

        if (isUpdatesTabSelected || hasChannelsHeader || hasFindChannels) {
            return true
        }

        for (i in 0 until node.childCount) {
            if (isWhatsAppUpdatesTabVisible(node.getChild(i))) {
                return true
            }
        }
        return false
    }

    override fun onInterrupt() {
        // Handle interruption
    }
}
