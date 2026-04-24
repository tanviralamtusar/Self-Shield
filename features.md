# Self-Shield — Features Specification

## 1. Core Blocking Engine

### 1.1 Local VPN-Based Website & App Blocking
- On-device VPN (no traffic leaves the device)
- Blocks by hostname — no DNS config needed, no search engine breakage
- Works for all browsers and all apps using HTTP/HTTPS
- Auto-restarts on boot via `BOOT_COMPLETED` broadcast receiver
- Foreground service + watchdog to prevent OS kill
- Compatible with Android 5.0+ (API 21+)

### 1.2 Accessibility Service-Based In-App Blocking
- Monitors foreground app and UI window changes in real-time
- Blocks specific UI sections (Reels, Shorts, WhatsApp Status/Channels, TikTok feed)
- Intercepts uninstall flows — shows blocking overlay immediately
- Intercepts keyword input — blocks submission after detection
- Monitors Safe Mode at boot
- Monitors ADB connection and alerts admin

### 1.3 Device Admin + Device Owner Protection
- Device Admin API: prevents uninstall without deactivation
- Device Owner (QR code provisioning or one-time ADB setup): Safe Mode blocking, factory reset survival
- Fallback: Accessibility Service blocks the uninstall confirmation UI if Device Admin is inactive

---

## 2. Website Blocking

### 2.1 Category-Based Blocking (Pre-Built Lists)
- Pornography
- LGBTQ+ content
- Gambling / Betting
- Islamophobic content
- Social media (optional full block)
- Violence & gore
- Drug-related

### 2.2 Custom Blocklist
- Admin adds/removes individual hostnames
- Wildcard support (`*.example.com`)

### 2.3 Whitelist
- Specific apps always allowed regardless of VPN rules
- Specific hostnames/domains always pass-through

### 2.4 Admin-Pushed Block Lists
- Admin pushes updated block lists from web dashboard to all child devices in real-time (via FCM)
- Devices sync when online; queued commands applied when back online
- Subscribe to curated community block lists maintained by app team

---

## 3. App Blocking

### 3.1 Full App Block
- Block any installed app by package name
- Accessibility Service overlay shown on blocked app launch immediately

### 3.2 Timer-Based App Blocking
- Schedule: time ranges per day-of-week (e.g., block YouTube 9pm–6am Mon–Fri)
- Countdown timer: block for a defined duration (e.g., 2 hours)
- Both modes combinable per app

### 3.3 Uninstall Protection (Per App)
- Admin selects protected apps
- Any uninstall attempt → immediate full-screen overlay
- No bypass without admin PIN

---

## 4. In-App Blocking (Accessibility-Based)

| App | Blocked Elements |
|---|---|
| Instagram | Reels feed, Explore reels |
| YouTube | Shorts feed, Shorts tab |
| Facebook | Reels, Watch tab |
| TikTok | Full feed or feed-only |
| WhatsApp | Status tab, Channels tab, specific contacts |
| Snapchat | Discover/Stories feed |
| Twitter/X | For You algorithm feed |

- Detection by UI node `content-desc`, `resource-id`, `class`
- Fallback: full overlay if element not found
- Patterns stored server-side as JSON — pushed as updates (survives app updates)

---

## 5. Keyword Blocking

- Accessibility Service monitors text input across all apps
- After blocked keyword typed and submitted → action intercepted, overlay shown, input cleared
- Default keyword categories: pornographic, gambling, Islamophobic slurs, drug terms
- Admin adds custom keywords
- Keyword list encrypted on-device
- Regex pattern support

---

## 6. Focus Mode

- Admin or user (if permitted) starts session
- Custom session duration
- Whitelist-only apps during session (e.g., Quran app, Notes)
- Quran/Dua prompts shown on block screen during focus
- Session cannot be cancelled without admin PIN
- Pomodoro option: configurable work/break intervals
- Session log saved to usage history

---

## 7. WhatsApp Deep Controls

- Block Status tab (Accessibility: `com.whatsapp:id/status_*`)
- Block Channels tab
- Block specific contacts from appearing in chat list (by display name / number)
- Block entire WhatsApp via app blocker
- No root required — Accessibility Service only

---

## 8. Protection & Anti-Bypass

### Uninstall Blocking
- Device Admin: blocks Settings > Apps > Uninstall
- Accessibility: intercepts Play Store and PackageInstaller uninstall flows

### Safe Mode Blocking
- Device Owner: `setSecureSetting` disables Safe Mode (Android 6+)
- Android 5: detect Safe Mode on boot → log + alert admin

### ADB Detection
- Monitor `Settings.Global.ADB_ENABLED`
- Detected → log event + push + email alert to admin

### Self-Shield App Settings Blocking
- Accessibility monitors navigation to Self-Shield system settings page
- Overlay shown immediately

### PIN Reset
- No local reset
- Admin resets via web dashboard only
- Reset command delivered via FCM to device

### Factory Reset Survival
- Device Owner: `setFactoryResetProtectionPolicy` (Android 9+)
- Audit log backed up to Supabase before reset triggers

---

## 9. Admin & Child Profiles

- One admin per Supabase account
- Child device linked via unique pairing code (6-digit)
- Each child = separate Android device
- Admin can: push block lists, approve emergency overrides, view reports, reset PIN, add protected apps, view audit log
- Child profile UI: hidden — child sees only normal Android launcher

---

## 10. Tamper Detection & Audit Log

Logged events: blocked app launch, blocked site access, keyword block, uninstall attempt, ADB enable, Safe Mode boot, wrong PIN count, VPN restart, admin settings access.

Admin receives:
- FCM push notification on tamper events
- Email alert (SendGrid)
- Screenshot on uninstall attempt stored to Supabase Storage

---

## 11. Screen Time & Usage Analytics

- Per-app daily usage time
- Per-app block trigger count
- Top blocked sites/apps
- Daily in-app report card
- Weekly summary email to admin
- Charts: bar (daily), pie (categories), line (week-over-week)

---

## 12. Persistence & Reliability

- Foreground service with persistent non-dismissible notification
- `BOOT_COMPLETED` + `LOCKED_BOOT_COMPLETED` receiver restarts all services
- Watchdog: secondary service pings main every 60 seconds
- WorkManager: tertiary restart mechanism
- FCM: real-time commands from dashboard to device

---

## 13. Emergency Override

- Child device shows "Request Override" button on block screen
- Request sent to admin via FCM + web dashboard notification
- Admin approves from web dashboard (time-limited: 15 min default)
- No local override possible

---

## 14. Backward Compatibility

- Min SDK: Android 5.0 (API 21)
- Target SDK: Android 14 (API 34)
- Graceful degradation per feature per API level
- VPN API: fully supported API 21+
- Accessibility Service: fully supported API 21+
- Device Owner: API 21+, advanced policies gated to API 23+
- Safe Mode block: API 23+ (detect-and-alert on API 21–22)

---

## 15. Distribution

- Google Play Store (public)
- GitHub Releases (signed APK)
- GitHub Actions automated CI/CD
- Manual: `./gradlew assembleRelease`
