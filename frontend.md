# Self-Shield — Android Frontend Architecture

## Tech Stack
- **Language:** Kotlin 100%
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 34 (Android 14)
- **UI Framework:** Jetpack Compose + XML (hybrid where needed)
- **Architecture:** MVVM + Clean Architecture
- **DI:** Hilt
- **Navigation:** Navigation Compose
- **Async:** Kotlin Coroutines + Flow
- **Local DB:** Room
- **Preferences:** DataStore (Proto)
- **Network:** Retrofit + OkHttp
- **Image:** Coil
- **VPN Layer:** Android VpnService API
- **Accessibility:** AccessibilityService API
- **Device Admin:** DevicePolicyManager API

## Module Structure

self-shield/
├── app/ # Main app module
├── core/
│ ├── core-ui/ # Design system, components
│ ├── core-data/ # Repository implementations
│ ├── core-domain/ # Use cases, models
│ ├── core-network/ # API client
│ ├── core-database/ # Room DB
│ └── core-common/ # Extensions, utils
├── feature/
│ ├── feature-dashboard/ # Home screen
│ ├── feature-blocking/ # Block rules management
│ ├── feature-vpn/ # VPN service + DNS
│ ├── feature-accessibility/ # Accessibility service
│ ├── feature-focus/ # Focus mode
│ ├── feature-timer/ # Timer-based blocking
│ ├── feature-stats/ # Usage analytics
│ ├── feature-profiles/ # Admin/child profiles
│ ├── feature-whitelist/ # Whitelist management
│ ├── feature-keywords/ # Keyword blocking
│ ├── feature-settings/ # App settings
│ ├── feature-tamper/ # Tamper detection
│ └── feature-onboarding/ # First-time setup
└── build-logic/ # Convention plugins

## Screen Inventory

### Onboarding Flow
1. WelcomeScreen
2. RoleSelectScreen (Admin / Child setup)
3. PermissionsScreen (VPN, Accessibility, Device Admin, Notification)
4. DeviceOwnerSetupScreen
5. AdminPinSetScreen
6. ProfileNameScreen
7. DefaultBlockListScreen (select presets)
8. OnboardingCompleteScreen

### Main App (Admin)
1. DashboardScreen
   - Protection status card
   - Quick stats row
   - Active focus session card
   - Recent blocks list
   - Quick action FAB

2. BlockingScreen (tabs)
   - Apps tab
   - Websites tab
   - Keywords tab
   - Categories tab (NSFW, Betting, LGBTQ, etc.)
   - WhatsApp Controls tab
   - In-App Blocking tab

3. FocusScreen
   - Duration selector
   - Whitelist picker
   - Start focus button
   - Active session timer

4. TimerScreen
   - App time limit list
   - Schedule grid (days x hours)
   - Add new timer sheet

5. StatsScreen
   - Daily usage chart
   - App breakdown list
   - Blocks triggered count
   - Weekly summary

6. ProfilesScreen
   - Linked child devices
   - Per-device stats
   - Push rules button

7. SettingsScreen
   - Admin PIN change
   - Tamper protection config
   - Sync settings
   - Theme toggle
   - Export/import config
   - About + open source

8. TamperLogScreen
   - Event list with timestamps
   - Screenshot thumbnails
   - Export log button

### Child Device View
- Minimal UI (no settings access)
- Only shows: protection active status
- All controls hidden behind admin PIN

## Key Services (Android)

### SelfShieldVpnService
- Extends VpnService
- Local TUN interface
- DNS query interception
- Block list lookup (in-memory)
- Returns NXDOMAIN for blocked hosts
- Runs as foreground service
- Auto-restart via BroadcastReceiver on BOOT_COMPLETED

### SelfShieldAccessibilityService
- Extends AccessibilityService
- Monitors: window state changes, text input events
- Keyword detection in all apps
- WhatsApp UI element detection
  - Status tab detection + overlay
  - Channels tab detection + overlay
- Reels/Shorts/TikTok feed detection
- Uninstall screen detection + block
- ADB enable screen detection + alert

### SelfShieldDeviceAdminReceiver
- Extends DeviceAdminReceiver
- Handles Device Owner events
- Blocks Safe Mode (Device Owner API)
- Prevents device admin removal

### TamperDetectionService
- Monitors for:
  - App uninstall attempts
  - Device admin removal attempts
  - VPN disable attempts
  - Accessibility disable attempts
  - ADB connection detection
  - Safe Mode boot detection
- On detection:
  - Log event to Room DB
  - Take screenshot
  - Push alert to admin (FCM)
  - Send email alert via backend

### SyncWorker (WorkManager)
- Periodic sync every 15 min when online
- Pushes usage stats to Supabase
- Pulls updated block lists from admin
- Pulls rule changes from web dashboard
- Runs as expedited work when push received

## State Management
- UiState sealed class per screen
- StateFlow for UI state
- SharedFlow for one-time events
- Repository pattern for data access
- Offline-first: Room as source of truth

## Offline-First Strategy
- All block lists stored in Room
- Rules applied locally always
- Sync queue for pending changes
- Conflict resolution: server wins for admin changes

## Security
- Admin PIN stored as bcrypt hash in EncryptedSharedPreferences
- No plaintext secrets in storage
- Certificate pinning on API calls
- Root detection on startup
- Emulator detection
- Tamper detection on every app resume
