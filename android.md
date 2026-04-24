# Self-Shield — Android App Specification

## Tech Stack
- Language: Kotlin
- Min SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- Architecture: MVVM + Clean Architecture
- DI: Hilt
- DB: Room + SQLCipher (AES-256 encrypted)
- Networking: Retrofit + OkHttp
- Async: Kotlin Coroutines + Flow
- UI: Jetpack Compose (Material 3) + View-based fallback for API 21–22 where Compose is limited
- Navigation: Jetpack Navigation Component
- Push: Firebase Messaging (FCM)
- Storage: EncryptedSharedPreferences + Room

---

## Module Structure

```
self-shield-android/
├── app/
├── core/
│   ├── core-data/          (repositories, sync)
│   ├── core-database/      (Room, SQLCipher)
│   ├── core-network/       (Retrofit, Supabase client)
│   ├── core-security/      (PIN, biometric, encryption)
│   └── core-ui/            (design system, components)
├── feature/
│   ├── feature-dashboard/
│   ├── feature-blocklist/
│   ├── feature-appblock/
│   ├── feature-focusmode/
│   ├── feature-reports/
│   ├── feature-settings/
│   └── feature-onboarding/
├── service/
│   ├── vpn/                (VpnService implementation)
│   ├── accessibility/      (AccessibilityService implementation)
│   ├── watchdog/           (Watchdog foreground service)
│   └── receiver/           (BroadcastReceivers)
└── admin/
    └── DeviceAdminReceiver.kt
```

---

## Required Permissions (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
<uses-permission android:name="android.permission.BIND_VPN_SERVICE" />
<uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.CAMERA" />  <!-- screenshot on tamper -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

---

## VPN Service

**File:** `service/vpn/SelfShieldVpnService.kt`

Extends `android.net.VpnService`.

How it works:
1. Creates a VPN interface via `Builder`
2. All device traffic is routed through a local TUN interface
3. DNS queries intercepted — blocked hostnames return `0.0.0.0` (NXDOMAIN equivalent)
4. HTTP/HTTPS traffic inspected at hostname level (SNI for HTTPS) — no MITM, no decryption
5. Blocked hostnames: connection reset immediately

Key implementation notes:
- Use `VpnService.Builder.addDnsServer("127.0.0.1")` to intercept DNS
- Implement a local DNS resolver (mini DNS server on loopback) — blocklist checked here
- For HTTPS: inspect ClientHello SNI extension to get hostname without decrypting
- Whitelist: bypass VPN for whitelisted package UIDs (`addDisallowedApplication`)
- Start via `startForeground()` with persistent notification

```kotlin
class SelfShieldVpnService : VpnService() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(NOTIF_ID, buildNotification())
        startVpnTunnel()
        return START_STICKY
    }
    // ...
}
```

Persistence:
- `START_STICKY` ensures OS restarts service if killed
- `BOOT_COMPLETED` receiver calls `startService()`
- Watchdog service checks VPN status every 60s and restarts if not running

---

## Accessibility Service

**File:** `service/accessibility/SelfShieldAccessibilityService.kt`

Extends `AccessibilityService`.

Capabilities used:
- `TYPE_WINDOW_STATE_CHANGED` — detect app open/close
- `TYPE_WINDOW_CONTENT_CHANGED` — detect UI changes within app
- `TYPE_VIEW_TEXT_CHANGED` — detect keyboard input
- `performGlobalAction(GLOBAL_ACTION_BACK)` — navigate away from blocked UI
- `AccessibilityNodeInfo` tree traversal to find blocked elements

Key functions:

### App Blocking
```kotlin
override fun onAccessibilityEvent(event: AccessibilityEvent) {
    if (event.eventType == TYPE_WINDOW_STATE_CHANGED) {
        val pkg = event.packageName?.toString() ?: return
        if (blockedApps.contains(pkg)) showBlockOverlay()
    }
}
```

### Uninstall Blocking
```kotlin
// Detect PackageInstaller or Play Store uninstall confirmation
if (pkg == "com.android.packageinstaller" || pkg == "com.google.android.packageinstaller") {
    val node = rootInActiveWindow ?: return
    if (nodeContains(node, "uninstall") || nodeContains(node, "delete app")) {
        if (isProtectedApp(targetPackage)) showUninstallBlockOverlay()
    }
}
```

### In-App UI Blocking (Instagram Reels example)
```kotlin
if (pkg == "com.instagram.android") {
    val reelsTab = rootInActiveWindow?.findAccessibilityNodeInfosByViewId(
        "com.instagram.android:id/clips_tab"
    )
    if (reelsTab?.isNotEmpty() == true && rules.blockReels) {
        performGlobalAction(GLOBAL_ACTION_BACK)
        showInAppBlockOverlay("Reels are blocked")
    }
}
```

### Keyword Blocking
```kotlin
if (event.eventType == TYPE_VIEW_TEXT_CHANGED) {
    val text = event.text.joinToString(" ")
    if (keywordMatcher.containsBlockedKeyword(text)) {
        // Clear text in node
        event.source?.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, Bundle().apply {
            putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, "")
        })
        showKeywordBlockOverlay()
    }
}
```

---

## Device Admin Receiver

**File:** `admin/SelfShieldDeviceAdminReceiver.kt`

```kotlin
class SelfShieldDeviceAdminReceiver : DeviceAdminReceiver() {
    override fun onDisableRequested(context: Context, intent: Intent): CharSequence {
        return "Self-Shield cannot be disabled. Contact your admin."
    }
    override fun onDisabled(context: Context, intent: Intent) {
        // Log tamper event, alert admin
        logTamperEvent(context, TamperEvent.ADMIN_DISABLED)
    }
}
```

Device Owner provisioning:
- QR code setup at device first boot (Android for Work / DPC provisioning)
- Or one-time: `adb shell dpm set-device-owner com.selfshield/.admin.SelfShieldDeviceAdminReceiver`

Device Owner capabilities used:
- `setSecureSetting(SAFE_BOOT_DISALLOWED, "1")` — block Safe Mode (API 23+)
- `setFactoryResetProtectionPolicy()` — survive factory reset (API 29+)
- `setStatusBarDisabled()` — optional during focus mode

---

## Watchdog Service

**File:** `service/watchdog/WatchdogService.kt`

- Foreground service, runs always
- Every 60 seconds: check VPN service is running, Accessibility Service is enabled
- If VPN not running: restart it
- If Accessibility disabled: show persistent notification prompting re-enable + log tamper event

---

## Broadcast Receivers

| Receiver | Intent | Action |
|---|---|---|
| `BootReceiver` | `BOOT_COMPLETED`, `LOCKED_BOOT_COMPLETED` | Start VPN + Watchdog |
| `PackageReceiver` | `PACKAGE_REMOVED` | Check if protected app being removed |
| `AdbReceiver` | `Settings.Global.ADB_ENABLED` change | Alert admin |

---

## Local Encrypted Database (Room + SQLCipher)

```kotlin
@Database(
    entities = [
        AppRuleEntity::class,
        BlocklistEntryEntity::class,
        UsageEventEntity::class,
        AuditEventEntity::class,
        RemoteCommandEntity::class,
        KeywordEntity::class,
        FocusSessionEntity::class,
        SettingsEntity::class
    ],
    version = 1,
    exportSchema = true
)
abstract class SelfShieldDatabase : RoomDatabase()
```

Encryption:
```kotlin
Room.databaseBuilder(context, SelfShieldDatabase::class.java, "selfshield.db")
    .openHelperFactory(SupportFactory(SQLiteDatabase.getBytes(passphrase)))
    .build()
```

---

## Sync Strategy

1. Device operates fully offline using Room
2. When network available: `SyncWorker` (WorkManager) runs
3. Sync order:
   a. Upload pending `usage_events` → `/audit` + `/reports`
   b. Upload pending `audit_log` events
   c. Poll pending `remote_commands` → execute locally
   d. Download updated block lists if version changed
4. Conflicts: server wins (last-write-wins for settings, append-only for events)

---

## PIN & Biometric Auth

- Admin PIN: 4–8 digits, stored as bcrypt hash in `device_settings`
- Biometric: Android BiometricPrompt API (API 23+) — fallback to PIN
- Wrong PIN 5x → device locked for 10 minutes, alert sent to admin
- PIN reset: only via remote command from admin dashboard (FCM `reset_pin` command)

---

## Overlay Screen

Full-screen overlay shown on blocked access:
- Implements `WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY` (API 26+)
- Fallback: `TYPE_SYSTEM_ALERT` (API < 26)
- Requires `SYSTEM_ALERT_WINDOW` permission
- Shows: "Access Blocked by Self-Shield", reason, "Request Override" button
- Cannot be dismissed by back button (intercept in overlay view)

---

## Backward Compatibility Matrix

| Feature | API 21–22 | API 23–25 | API 26–28 | API 29+ |
|---|---|---|---|---|
| VPN blocking | ✅ | ✅ | ✅ | ✅ |
| Accessibility | ✅ | ✅ | ✅ | ✅ |
| Device Admin | ✅ | ✅ | ✅ | ✅ |
| Device Owner | ✅ | ✅ | ✅ | ✅ |
| Safe Mode block | detect+alert | ✅ | ✅ | ✅ |
| Overlay | TYPE_SYSTEM_ALERT | TYPE_SYSTEM_ALERT | TYPE_APPLICATION_OVERLAY | TYPE_APPLICATION_OVERLAY |
| Biometric | ❌ | Fingerprint only | Fingerprint only | BiometricPrompt |
| Factory reset survive | ❌ | ❌ | ❌ | ✅ (API 29+) |
| Encrypted SharedPrefs | manual | manual | manual | EncryptedSharedPreferences |
