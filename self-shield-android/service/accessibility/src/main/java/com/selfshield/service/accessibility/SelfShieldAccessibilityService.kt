package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class SelfShieldAccessibilityService : AccessibilityService() {

    companion object {
        const val PREF_NAME = "self_shield_prefs"
        const val KEY_CHANNEL_BLOCK_ENABLED = "channel_block_enabled"

        // Keywords that ONLY appear when viewing channel content
        // NOT the bottom tab "Updates" label
        val CHANNEL_CONTENT_KEYWORDS = hashSetOf(
            // "Channels" header inside Updates tab
            "Channels", "চ্যানেল", "चैनल", "Canales", "القنوات",
            "Canais", "Chaînes", "Kanäle", "Saluran", "Каналы",
            // "Find channels" button
            "Find channels", "চ্যানেল খুঁজুন", "Explore more",
            "Buscar canales", "Найти каналы", "Kanal temukan",
            "Kanäle finden", "Trouver des chaînes", "Encontrar canais",
            // "See all" for channels
            "See all", "সব দেখুন", "सभी देखें", "Ver todos", "عرض الكل",
            "Voir tout", "Alle ansehen", "Lihat semua", "Посмотреть все",
            // "Follow" button inside a single channel
            "Follow", "ফলো", "फ़ॉलो करें", "Seguir", "متابعة",
            "Suivre", "Folgen", "Ikuti", "Подписаться",
            // "Followers" count label inside a channel
            "followers", "ফলোয়ার", "seguidores", "abonnés", "Follower", "pengikut"
        )

        // Chats tab label in various languages — to click and navigate
        val CHATS_TAB_KEYWORDS = hashSetOf(
            "Chats", "চ্যাট", "चैट्स", "Conversaciones", "المحادثات",
            "Conversas", "Discussions", "Kanäle", "Obrolan", "Чаты"
        )
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val packageName = event.packageName?.toString() ?: return
        if (packageName != "com.whatsapp" && packageName != "com.whatsapp.w4b") return

        // Check if channel blocking is enabled
        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)) return

        val rootNode = rootInActiveWindow ?: return

        if (isViewingChannelContent(rootNode)) {
            // Try to click "Chats" tab to stay in WhatsApp
            if (!clickChatsTab(rootNode)) {
                // Fallback: press BACK only if Chats tab not found
                performGlobalAction(GLOBAL_ACTION_BACK)
            }
        }
    }

    /**
     * Detects if the user is currently viewing channel-related content.
     * This does NOT trigger on the normal Chats, Calls, or Communities tabs.
     */
    private fun isViewingChannelContent(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false

        val text = node.text?.toString()?.trim() ?: ""
        val contentDesc = node.contentDescription?.toString()?.trim() ?: ""
        val nodeText = text.ifEmpty { contentDesc }

        if (nodeText.isNotEmpty()) {
            val matchesChannel = CHANNEL_CONTENT_KEYWORDS.any {
                it.equals(nodeText, ignoreCase = true)
            }
            if (matchesChannel) return true
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            if (isViewingChannelContent(child)) return true
        }
        return false
    }

    /**
     * Finds the "Chats" tab in the bottom navigation and clicks it.
     * Returns true if successfully clicked.
     */
    private fun clickChatsTab(node: AccessibilityNodeInfo?): Boolean {
        if (node == null) return false

        val text = node.text?.toString()?.trim() ?: ""
        val contentDesc = node.contentDescription?.toString()?.trim() ?: ""
        val nodeText = text.ifEmpty { contentDesc }

        if (nodeText.isNotEmpty()) {
            val isChatsTab = CHATS_TAB_KEYWORDS.any {
                it.equals(nodeText, ignoreCase = true)
            }
            if (isChatsTab && node.isClickable) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return true
            }
            // Try clicking the parent if the text node itself isn't clickable
            if (isChatsTab) {
                var parent = node.parent
                while (parent != null) {
                    if (parent.isClickable) {
                        parent.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                        return true
                    }
                    parent = parent.parent
                }
            }
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            if (clickChatsTab(child)) return true
        }
        return false
    }

    override fun onInterrupt() {
        // Handle interruption
    }
}
