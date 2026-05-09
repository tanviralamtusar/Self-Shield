package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Self Shield Accessibility Service
 * Optimized for ultra-fast (0.01s) detection and blocking.
 */
class SelfShieldAccessibilityService : AccessibilityService() {

    companion object {
        const val PREF_NAME = "self_shield_prefs"
        const val KEY_CHANNEL_BLOCK_ENABLED = "channel_block_enabled"

        private const val PKG_WHATSAPP = "com.whatsapp"
        private const val PKG_WHATSAPP_B = "com.whatsapp.w4b"

        private val CHANNEL_ACTIVITY_KEYWORDS = arrayOf("channel", "newsletter")
        
        // Grouped keywords for faster searching
        private val TAB_KEYWORDS = arrayOf("Updates", "আপডেট", "अपडेट", "Novedades")
        private val LIST_INDICATORS = arrayOf("Find channels", "চ্যানেল খুঁজুন", "Explore more", "See all")
        private val INSIDE_INDICATORS = arrayOf("Follow", "Following", "followers", "Mute")
        
        private val CHATS_TAB_KEYWORDS = arrayOf("Chats", "চ্যাট", "চ্যাটস", "चैट्स", "Conversaciones")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val pkg = event.packageName?.toString() ?: return
        if (pkg != PKG_WHATSAPP && pkg != PKG_WHATSAPP_B) return

        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)) return

        // FAST PATH 1: Instant detection on Window State Change (Activity change)
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val className = event.className?.toString() ?: ""
            for (keyword in CHANNEL_ACTIVITY_KEYWORDS) {
                if (className.contains(keyword, ignoreCase = true)) {
                    performBlockAction()
                    return
                }
            }
        }

        // FAST PATH 2: Instant detection on Tab Click
        if (event.eventType == AccessibilityEvent.TYPE_VIEW_CLICKED) {
            val text = event.text?.toString() ?: ""
            for (keyword in TAB_KEYWORDS) {
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
            // Check most unique indicators first for early exit
            for (indicator in LIST_INDICATORS) {
                val nodes = root.findAccessibilityNodeInfosByText(indicator)
                if (!nodes.isNullOrEmpty()) {
                    performBlockAction()
                    return
                }
            }

            // Check if Updates tab is active
            for (keyword in TAB_KEYWORDS) {
                val nodes = root.findAccessibilityNodeInfosByText(keyword)
                if (!nodes.isNullOrEmpty()) {
                    for (node in nodes) {
                        if (node.isSelected || node.isFocused) {
                            performBlockAction()
                            return
                        }
                    }
                }
            }

            // Check if inside channel (requires 2 indicators for accuracy)
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
        val root = rootInActiveWindow ?: run {
            performGlobalAction(GLOBAL_ACTION_BACK)
            return
        }

        // Lightning fast Chats tab click
        for (keyword in CHATS_TAB_KEYWORDS) {
            val nodes = root.findAccessibilityNodeInfosByText(keyword)
            if (!nodes.isNullOrEmpty()) {
                val node = nodes[0]
                if (node.isClickable && node.performAction(AccessibilityNodeInfo.ACTION_CLICK)) return
                
                var parent = node.parent
                var depth = 0
                while (parent != null && depth < 5) {
                    if (parent.isClickable && parent.performAction(AccessibilityNodeInfo.ACTION_CLICK)) return
                    parent = parent.parent
                    depth++
                }
            }
        }

        // Instant fallback
        performGlobalAction(GLOBAL_ACTION_BACK)
    }

    override fun onInterrupt() {}
}
