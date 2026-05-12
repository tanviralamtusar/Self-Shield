package com.selfshield.service.accessibility

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.selfshield.core.data.repository.UsageEventRepository
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Self Shield Accessibility Service
 * Optimized for ultra-fast (0.01s) surgical WhatsApp channel blocking.
 */
@AndroidEntryPoint
class SelfShieldAccessibilityService : AccessibilityService() {

    @Inject
    lateinit var usageEventRepository: UsageEventRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

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
        // Optimized for instant detection
        private val INSIDE_INDICATORS = arrayOf(
            "Follow", "Following", "followers", "Mute", "Unmute", 
            "অনুসরণ করুন", "ফলো", "ম্যুট", "আনম্যুট", "Channel info", "Newsletter"
        )
        
        private val CHATS_TAB_KEYWORDS = arrayOf(
            "Chats", "চ্যাট", "চ্যাটস", "Conversaciones", 
            "المحادثات", "Conversas", "Discussions", "Obrolan", "Чаты",
            "Conversations"
        )

        // Internal back button indicators
        private val WHATSAPP_BACK_KEYWORDS = arrayOf(
            "Back", "Navigate up", "পিছনে যান", "ফিরে যান", 
            "Back button", "Navigate back"
        )
    }

    private var lastActivityName: String? = null

    private var lastAppPackage: String? = null
    private var lastUrl: String? = null
    private val appStartTimes = mutableMapOf<String, Long>()

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val pkg = event.packageName?.toString() ?: return

        // 1. Track App Open/Close
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            if (pkg != lastAppPackage && pkg != "android") {
                val now = System.currentTimeMillis()
                
                // Close previous app
                lastAppPackage?.let { lastPkg ->
                    val startTime = appStartTimes[lastPkg]
                    val duration = if (startTime != null) ((now - startTime) / 1000).toInt() else null
                    logEvent("app_close", lastPkg, duration)
                    appStartTimes.remove(lastPkg)
                }

                // Open new app
                lastAppPackage = pkg
                appStartTimes[pkg] = now
                logEvent("app_open", pkg)
            }
        }

        // 2. Track Browser URL
        if (isBrowser(pkg)) {
            val url = findBrowserUrl(rootInActiveWindow)
            if (url != null && url != lastUrl) {
                lastUrl = url
                logEvent("site_visit", url)
            }
        }

        // WhatsApp Blocking Logic
        if (pkg != PKG_WHATSAPP && pkg != PKG_WHATSAPP_B) return

        val prefs = applicationContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        if (!prefs.getBoolean(KEY_CHANNEL_BLOCK_ENABLED, false)) return

        // ULTRA FAST PATH: Check event text directly (Zero latency)
        val eventText = event.text?.toString() ?: ""
        val eventContentDesc = event.contentDescription?.toString() ?: ""
        for (indicator in INSIDE_INDICATORS) {
            if (eventText.contains(indicator, ignoreCase = true) || 
                eventContentDesc.contains(indicator, ignoreCase = true)) {
                performBlockAction()
                return
            }
        }

        // Track activity changes
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            lastActivityName = event.className?.toString()
            
            // FAST PATH 1: Instant detection on Activity change
            val className = lastActivityName ?: ""
            for (keyword in CHANNEL_ACTIVITY_KEYWORDS) {
                if (className.contains(keyword, ignoreCase = true)) {
                    performBlockAction()
                    return
                }
            }
        }

        // FAST PATH 2: Click detection
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

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
    }

    private fun logEvent(type: String, target: String, durationSec: Int? = null) {
        android.util.Log.d("SelfShieldLog", "Logging event: $type on $target")
        serviceScope.launch {
            try {
                usageEventRepository.logEvent(type, target, durationSec)
                android.util.Log.d("SelfShieldLog", "Event saved to local DB: $type")
            } catch (e: Exception) {
                android.util.Log.e("SelfShieldLog", "Error logging event: ${e.message}")
            }
        }
    }

    private fun isBrowser(pkg: String): Boolean {
        return pkg == "com.android.chrome" || 
               pkg == "com.microsoft.emmx" || 
               pkg == "com.sec.android.app.sbrowser" || 
               pkg == "org.mozilla.firefox" || 
               pkg == "com.duckduckgo.mobile.android" ||
               pkg == "com.opera.browser"
    }

    private fun findBrowserUrl(root: AccessibilityNodeInfo?): String? {
        if (root == null) return null
        
        // This is a common heuristic for browser address bars
        // We look for nodes that are likely to contain the URL
        val nodes = root.findAccessibilityNodeInfosByViewId("com.android.chrome:id/url_bar") ?:
                    root.findAccessibilityNodeInfosByViewId("com.microsoft.emmx:id/url_bar") ?:
                    root.findAccessibilityNodeInfosByViewId("com.sec.android.app.sbrowser:id/location_bar_edit_text")
        
        if (!nodes.isNullOrEmpty()) {
            return nodes[0].text?.toString()
        }

        // Fallback: search recursively for something that looks like a URL
        return findUrlRecursively(root)
    }

    private fun findUrlRecursively(node: AccessibilityNodeInfo): String? {
        if (node.className?.toString()?.contains("EditText", ignoreCase = true) == true) {
            val text = node.text?.toString()
            if (text != null && (text.startsWith("http") || text.contains("."))) {
                return text
            }
        }
        
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            val result = findUrlRecursively(child)
            if (result != null) return result
        }
        return null
    }

    private fun handleWhatsApp() {
        val root = rootInActiveWindow ?: return

        try {
            // Instant exit if any indicator is found
            for (indicator in INSIDE_INDICATORS) {
                val nodes = root.findAccessibilityNodeInfosByText(indicator)
                if (!nodes.isNullOrEmpty()) {
                    performBlockAction()
                    return
                }
            }
        } finally {
            root.recycle()
        }
    }

    private fun performBlockAction() {
        val root = rootInActiveWindow ?: return
        try {
            // 1. Try to click the "Chats" tab directly (Immediate redirection to WhatsApp Home)
            for (keyword in CHATS_TAB_KEYWORDS) {
                val nodes = root.findAccessibilityNodeInfosByText(keyword)
                if (!nodes.isNullOrEmpty()) {
                    for (node in nodes) {
                        if (tryClick(node)) return
                    }
                }
            }

            // 2. Fallback: Try to click WhatsApp's internal back button
            for (keyword in WHATSAPP_BACK_KEYWORDS) {
                val nodes = root.findAccessibilityNodeInfosByText(keyword)
                if (!nodes.isNullOrEmpty()) {
                    for (node in nodes) {
                        if (tryClick(node)) return
                    }
                }
            }

            // 3. Final resort: Use surgical BACK action only if we're not on the main screen
            val activity = lastActivityName ?: ""
            if (!activity.contains("HomeActivity", ignoreCase = true)) {
                performGlobalAction(GLOBAL_ACTION_BACK)
            }
        } finally {
            root.recycle()
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
