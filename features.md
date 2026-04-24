# Self-Shield — Feature Specification

## F-01: VPN-Based DNS Blocking
- Local VPN using Android VpnService
- Intercepts all DNS queries on device
- In-memory blocklist lookup (hashmap, O(1))
- Returns NXDOMAIN for blocked hostnames
- Does NOT decrypt HTTPS — DNS level only
- Blocklist loaded from Room DB on VPN start
- Auto-reload on list update
- Wildcard support: *.example.com
- Runs as persistent foreground service
- Priority: CRITICAL

## F-02: Accessibility Service Blocking
- Monitors all window state changes
- Detects app in foreground by package name
- Shows block overlay for blocked apps
- Detects UI elements in WhatsApp:
  - Status tab (content-desc / resource-id match)
  - Channels tab
  - Block with opaque overlay on top
- Detects Reels/Shorts/TikTok feed sections
  - Instagram: com.instagram.android — Reels tab
  - YouTube: com.google.android.youtube — Shorts tab
  - TikTok: com.zhiliaoapp.musically — main feed
  - Facebook: com.facebook.katana — Reels section
  - Snapchat: com.snapchat.android — Spotlight
- Keyword detection in text fields
  - Intercepts TYPE_VIEW_TEXT_CHANGED events
  - Matches against keyword list
  - Shows warning overlay
  - Clears input field content
- Priority: CRITICAL

## F-03: App Blocking
- Block any installed app by package name
- When blocked app is brought to foreground:
  - Accessibility detects it
  - Full-screen block overlay shown
  - Back button always works
- Admin can toggle per app
- Bulk block by category (games, social, etc.)
- Priority: HIGH

## F-04: Website/DNS Blocking
- Category-based blocking (presets):
  - Adult/Pornography (hosts list)
  - Gambling / Betting
  - LGBTQ content
  - Islamophobic sites
  - General harmful content
  - Social media (optional)
  - Streaming (optional)
- Custom hostname entry
- Wildcard subdomain blocking
- Blocklist stored in Room DB
- VPN reads from Room DB
- Priority: CRITICAL

## F-05: Keyword Blocking
- Built-in default keyword list (harmful/inappropriate terms)
- Custom keyword addition by admin
- Works across all apps via Accessibility Service
- Detection: after user types, before submission
- Action: clear field + show block overlay with message
- Case-insensitive matching
- Priority: HIGH

## F-06: WhatsApp In-App Controls
- Block Status tab (Accessibility overlay)
- Block Channels tab (Accessibility overlay)
- Block Calls (block WhatsApp call screens)
- Block View Once media
- Each control is individual toggle
- Overlay is placed precisely over WhatsApp UI elements
- Priority: HIGH
- Note: May break on WhatsApp updates — include auto-detect fallback

## F-07: In-App Blocking (Social Media)
- Instagram: Block Reels tab navigation
- YouTube: Block Shorts tab navigation
- TikTok: Block entire app OR just feed (configurable)
- Facebook: Block Reels section
- Snapchat: Block Spotlight section
- Twitter/X: Block Trending / For You
- Each platform individually configurable
- Detected via Accessibility window events
- Priority: HIGH

## F-08: Focus Mode
- Admin or user starts focus session
- Duration options: 15m / 25m / 45m / 1h / custom / indefinite
- During focus:
  - All non-whitelisted apps blocked
  - Notifications blocked (DND mode activated)
  - VPN continues running
  - Block overlay shows "Focus Mode Active"
- Whitelist: user picks allowed apps before starting
- Cannot be cancelled without admin PIN
- Session saved to history
- Priority: HIGH

## F-09: Timer-Based App Blocking
- Set daily time limit per app
- Set schedule (block on specific days/hours)
- Progress bar shows used vs limit
- When limit hit: app blocked for rest of day
- Reset: midnight (configurable)
- Separate timer per device profile
- Notification when 80% of limit reached
- Priority: HIGH

## F-10: Uninstall Protection
- Method 1: Accessibility Service
  - Detects uninstall confirmation screen
  - Immediately shows block overlay over it
  - User cannot confirm uninstall
- Method 2: Device Owner
  - If Device Owner: can restrict package uninstall
  - Cannot be removed from settings without admin PIN
- Method 3: Device Admin Receiver
  - App registered as device admin
  - Cannot remove device admin without PIN
- All three methods combined
- Priority: CRITICAL

## F-11: Tamper Detection & Protection
- Monitors and alerts on:
  - Uninstall attempt
  - Device admin removal attempt
  - VPN service killed
  - Accessibility service disabled
  - ADB/USB debugging enabled
  - Safe Mode boot detected
  - App force-stopped
  - Factory reset initiated (Device Owner can block)
- On detection:
  - Log event (timestamp, type, device info) to Room DB
  - Take screenshot of what was happening
  - Upload screenshot to Supabase Storage
  - Send FCM push to admin
  - Send email to admin
  - Show lock screen / re-enable protections
- Priority: CRITICAL

## F-12: Admin PIN Protection
- 6-digit PIN (configurable)
- PIN required to:
  - Open app settings
  - Change any rule
  - Disable any protection
  - Cancel focus mode
  - View tamper logs
- PIN stored as bcrypt hash
- Wrong PIN: delay (exponential backoff)
- 10 wrong attempts: alert admin
- Remote reset: admin resets via web dashboard
- Priority: CRITICAL

## F-13: Device Owner Mode
- Setup via QR code provisioning or ADB (one-time setup)
- Capabilities used:
  - Block Safe Mode boot
  - Prevent factory reset
  - Restrict USB data transfer
  - Lock down device settings
- Graceful fallback if not Device Owner:
  - Use Device Admin + Accessibility only
  - Notify admin that some features limited
- Priority: HIGH

## F-14: Usage Statistics
- Track per-app screen time (minute precision)
- Track blocks triggered (per rule, per app)
- Track focus sessions
- Daily report card generated at midnight
- Charts: bar chart by hour, pie by app
- Weekly summary
- Export as CSV
- Priority: MEDIUM

## F-15: Remote Admin Dashboard
- Web dashboard (Next.js)
- Admin sees all linked child devices
- Per-device:
  - Real-time status (online/offline)
  - Usage stats
  - Block list management
  - Push rules to device
  - Override requests
  - Tamper log
- Priority: HIGH

## F-16: Emergency Override
- Child device shows "Request Override" button on block screen
- Request sent to admin via FCM + web dashboard
- Admin approves or denies from web dashboard
- If approved: temporary access for configurable duration (5/15/30 min)
- Override logged in audit trail
- Priority: MEDIUM

## F-17: Cloud Sync
- Sync block lists, rules, settings to Supabase
- Offline-first: local Room DB is source of truth
- Sync on: app start, periodic (15 min), on network reconnect
- Real-time rule updates via Supabase Realtime
- Conflict resolution: server (admin) wins
- Priority: HIGH

## F-18: Profile System
- Admin profile: full control, PIN-protected
- Child profile: minimal UI, no settings
- Each device linked to admin account
- Admin manages all linked devices from web
- Child device identified by unique device token
- Priority: HIGH

## F-19: Whitelist System
- Whitelist specific apps always allowed (even during focus)
- Whitelist specific websites always accessible
- Phone, Messages, Emergency contacts always whitelisted
- Admin manages whitelist
- Priority: HIGH

## F-20: Default Block Lists
- Built-in curated block lists:
  - General adult content (Steven Black hosts)
  - Gambling sites
  - LGBTQ content
  - Islamophobic sites
  - Social media (optional preset)
- Lists stored in assets, loaded on first run
- Admin can push list updates to all child devices
- Priority: HIGH

## F-21: Safe Mode Blocking
- Device Owner required
- Detect Safe Mode boot
- If Safe Mode detected: re-enable all protections immediately
- Alert admin of Safe Mode attempt
- Priority: HIGH (Device Owner only)

## F-22: ADB Detection
- Detect when USB Debugging is enabled
- Alert admin immediately (FCM + email)
- Log in tamper events
- Cannot block ADB without Device Owner
- Priority: MEDIUM

## F-23: Auto-Restart / Persistence
- VPN Service: restart on BOOT_COMPLETED broadcast
- Accessibility: cannot be auto-started, guide user
- WorkManager for periodic sync (battery-efficient)
- Foreground service notification (cannot be dismissed)
- App listed in battery optimization exclusion prompt
- Priority: CRITICAL

## F-24: Daily Report Card
- Generated daily (cron job backend)
- Contains:
  - Total screen time
  - Top 5 apps by time
  - Total blocks triggered
  - Focus sessions completed
  - Tamper attempts
- Sent as: push notification + email to admin
- Stored in DB for history
- Priority: MEDIUM