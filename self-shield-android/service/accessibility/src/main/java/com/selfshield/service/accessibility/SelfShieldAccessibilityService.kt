package com.selfshield.service.accessibility

import android.view.accessibility.AccessibilityEvent
import android.accessibilityservice.AccessibilityService
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SelfShieldAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                val packageName = event.packageName?.toString()
                // TODO: Check if app is blocked
            }
            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
                // TODO: Check for blocked keywords
            }
        }
    }

    override fun onInterrupt() {
        // Handle interruption
    }
}
