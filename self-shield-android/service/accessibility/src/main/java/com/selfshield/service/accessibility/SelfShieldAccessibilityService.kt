package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Self Shield Accessibility Service
 * Blocks WhatsApp Channels — both the channel listing AND inside individual channels.
 * Uses FocusGuard's proven approach.
 */
class SelfShieldAccessibilityService : AccessibilityService() {

    companion object {
        const val PREF_NAME = "self_shield_prefs"
        const val KEY_CHANNEL_BLOCK_ENABLED = "channel_block_enabled"

        private const val PKG_WHATSAPP = "com.whatsapp"
        private const val PKG_WHATSAPP_B = "com.whatsapp.w4b"

        // WhatsApp activity class names that indicate channel views
        private val CHANNEL_ACTIVITY_KEYWORDS = arrayOf(
            "channel", "Channel", "CHANNEL",
            "newsletter", "Newsletter"
        )
    }

    private val mainHandler = Handler(Looper.getMainLooper())

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val pkg = event.packageName?.toString() ?: return
        if (pkg != PKG_WHATSAPP && pkg != PKG_WHATSAPP_B) return

        // Check if channel blocking is enabled
        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)) return

        // Step 0: Check if the Activity class name contains "channel" or "newsletter"
        // This catches when user taps into any individual channel
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            val className = event.className?.toString() ?: ""
            for (keyword in CHANNEL_ACTIVITY_KEYWORDS) {
                if (className.contains(keyword, ignoreCase = true)) {
                    performBlockAction()
                    return
                }
            }
        }

        // For all other events, check the screen content
        handleWhatsApp()
    }

    private fun handleWhatsApp() {
        val root = rootInActiveWindow ?: return

        try {
            // Step 1: Check if "Updates" tab is SELECTED (the tab, not just visible)
            val updatesTabKeywords = arrayOf(
                "Updates", "আপডেট", "अपडेट", "Novedades", "Actualizaciones",
                "المستجدات", "Atualizações", "Actus", "Aktuelles", "Pembaruan",
                "Обновления"
            )

            for (keyword in updatesTabKeywords) {
                val nodes = root.findAccessibilityNodeInfosByText(keyword)
                if (nodes != null) {
                    for (node in nodes) {
                        if (node.isSelected || node.isFocused) {
                            performBlockAction()
                            return
                        }
                    }
                }
            }

            // Step 2: Channel listing indicators (Updates tab showing channels)
            val channelListIndicators = arrayOf(
                "Find channels", "চ্যানেল খুঁজুন",
                "Channels to follow", "Explore more",
                "See all", "সব দেখুন",
                "Channels", "চ্যানেল"
            )

            for (indicator in channelListIndicators) {
                val nodes = root.findAccessibilityNodeInfosByText(indicator)
                if (nodes != null && nodes.isNotEmpty()) {
                    // Make sure it's not just the bottom tab text "Channels"
                    // by checking that the text node is NOT in the bottom nav
                    for (node in nodes) {
                        // If it's a header or content (not a small tab label), block
                        val text = node.text?.toString() ?: ""
                        if (text.equals("Channels", ignoreCase = true) ||
                            text.equals("চ্যানেল", ignoreCase = true)) {
                            // Only block if this node is selected or if there are multiple
                            if (node.isSelected || nodes.size > 1) {
                                performBlockAction()
                                return
                            }
                        } else {
                            // "Find channels", "See all", etc. — always block
                            performBlockAction()
                            return
                        }
                    }
                }
            }

            // Step 3: INSIDE a single channel view — detect Follow/Mute buttons
            val insideChannelIndicators = arrayOf(
                "Follow", "ফলো করুন", "ফলো", "फ़ॉलो करें", "Seguir",
                "متابعة", "Suivre", "Folgen", "Ikuti", "Подписаться",
                "Following", "ফলো করা হচ্ছে", "Siguiendo",
                "Mute", "Unmute",
                "followers", "ফলোয়ার", "seguidores"
            )

            // Count how many channel-specific indicators we find
            var channelIndicatorCount = 0
            for (indicator in insideChannelIndicators) {
                val nodes = root.findAccessibilityNodeInfosByText(indicator)
                if (nodes != null && nodes.isNotEmpty()) {
                    channelIndicatorCount++
                }
            }

            // If we find 2 or more indicators, we're definitely inside a channel
            // (e.g., "Follow" + "followers", or "Mute" + "Follow")
            if (channelIndicatorCount >= 2) {
                performBlockAction()
                return
            }

        } finally {
            root.recycle()
        }
    }

    /**
     * BACK first, then HOME after 50ms.
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
