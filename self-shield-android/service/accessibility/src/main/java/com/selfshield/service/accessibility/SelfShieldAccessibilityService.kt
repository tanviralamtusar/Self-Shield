package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Self Shield Accessibility Service
 * Optimized for surgical WhatsApp channel blocking.
 */
class SelfShieldAccessibilityService : AccessibilityService() {

    companion object {
        const val PREF_NAME = "self_shield_prefs"
        const val KEY_CHANNEL_BLOCK_ENABLED = "channel_block_enabled"

        private const val PKG_WHATSAPP = "com.whatsapp"
        private const val PKG_WHATSAPP_B = "com.whatsapp.w4b"

        private val CHANNEL_ACTIVITY_KEYWORDS = arrayOf("channel", "newsletter", "StatusPartView", "ChannelView")
        
        // Keywords for buttons that lead to channel lists
        private val CHANNEL_EXPLORE_KEYWORDS = arrayOf(
            "Find channels", "চ্যানেল খুঁজুন", "Explore more", "See all", 
            "সব দেখুন", "চ্যানেল দেখুন", "Explore channels"
        )
        
        // Indicators that we are INSIDE an individual channel
        private val INSIDE_INDICATORS = arrayOf("Follow", "Following", "followers", "Mute", "অনুসরণ করুন", "ফলো")
        
        private val CHATS_TAB_KEYWORDS = arrayOf(
            "Chats", "চ্যাট", "চ্যাটস", "চ্যাট", "Conversaciones", 
            "المحادثات", "Conversas", "Discussions", "Obrolan", "Чаты",
            "Conversations"
        )
    }

    private var lastActivityName: String? = null

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val pkg = event.packageName?.toString() ?: return
        if (pkg != PKG_WHATSAPP && pkg != PKG_WHATSAPP_B) return

        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)) return

        // Track activity changes
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            lastActivityName = event.className?.toString()
            
            // FAST PATH 1: Instant detection on Activity change (Individual channel or explorer)
            val className = lastActivityName ?: ""
            for (keyword in CHANNEL_ACTIVITY_KEYWORDS) {
                if (className.contains(keyword, ignoreCase = true)) {
                    performBlockAction()
                    return
                }
            }
        }

        // FAST PATH 2: Instant detection on Clicking channel-related items
        if (event.eventType == AccessibilityEvent.TYPE_VIEW_CLICKED) {
            val text = event.text?.toString() ?: ""
            for (keyword in CHANNEL_EXPLORE_KEYWORDS) {
                if (text.contains(keyword, ignoreCase = true)) {
                    performBlockAction()
                    return
                }
            }
        }

        // NORMAL PATH: Content checking (optimized)
        handleWhatsApp()
    }

    private fun handleWhatsApp() {
        val root = rootInActiveWindow ?: return

        try {
            // Check if inside an individual channel (requires 2 indicators for accuracy)
            // This prevents false positives on the Status screen
            var count = 0
            for (indicator in INSIDE_INDICATORS) {
                val nodes = root.findAccessibilityNodeInfosByText(indicator)
                if (!nodes.isNullOrEmpty()) {
                    count++
                    if (count >= 2) {
                        performBlockAction()
                        return
                    }
                }
            }
        } finally {
            root.recycle()
        }
    }

    private fun performBlockAction() {
        val root = rootInActiveWindow ?: return

        // 1. Try to find and click "Chats" tab (Priority)
        for (keyword in CHATS_TAB_KEYWORDS) {
            val nodes = root.findAccessibilityNodeInfosByText(keyword)
            if (!nodes.isNullOrEmpty()) {
                for (node in nodes) {
                    if (tryClick(node)) return
                }
            }
        }

        // 2. Fallback: If we are in a sub-activity (channel screen), BACK is safe and brings us to Status list.
        // If we are already on HomeActivity (main screen), don't call BACK as it will exit WhatsApp.
        val activity = lastActivityName ?: ""
        if (!activity.contains("HomeActivity", ignoreCase = true)) {
            performGlobalAction(GLOBAL_ACTION_BACK)
        }
    }

    private fun tryClick(node: AccessibilityNodeInfo?): Boolean {
        var current = node
        var depth = 0
        while (current != null && depth < 5) {
            if (current.isClickable) {
                if (current.performAction(AccessibilityNodeInfo.ACTION_CLICK)) return true
            }
            current = current.parent
            depth++
        }
        return false
    }

    override fun onInterrupt() {}
}
