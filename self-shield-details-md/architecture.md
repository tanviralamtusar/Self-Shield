# Self-Shield — System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ANDROID DEVICE                              │
│                                                                     │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────────┐    │
│  │  VPN Service │  │ Accessibility  │  │   Device Admin /     │    │
│  │  (hostname   │  │ Service        │  │   Device Owner       │    │
│  │   blocking)  │  │ (in-app block, │  │   (uninstall block,  │    │
│  │              │  │  keyword,      │  │    Safe Mode block,  │    │
│  │  TUN iface   │  │  uninstall     │  │    factory reset)    │    │
│  │  DNS filter  │  │  intercept)    │  │                      │    │
│  └──────┬───────┘  └───────┬────────┘  └───────────┬──────────┘    │
│         │                  │                        │               │
│         └──────────────────┴────────────────────────┘               │
│                            │                                        │
│                     ┌──────▼───────┐                                │
│                     │  Core Engine │ ← Room DB (SQLCipher)          │
│                     │  (Kotlin,    │ ← EncryptedSharedPrefs         │
│                     │   Hilt, MVVM)│ ← Blocklist (in-memory set)    │
│                     └──────┬───────┘                                │
│                            │                                        │
│              ┌─────────────▼──────────────┐                         │
│              │     Sync Worker (offline   │                         │
│              │     queue → Supabase)      │                         │
│              └─────────────┬──────────────┘                         │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │ HTTPS + FCM
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                        BACKEND (Self-Hosted VPS)                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Nginx (reverse proxy, SSL termination)                      │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │  Node.js + Express + TypeScript                              │   │
│  │  REST API: /devices, /blocklists, /commands,                 │   │
│  │           /overrides, /reports, /audit, /pin                 │   │
│  │  Cron jobs: daily reports, command cleanup                   │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
          ┌───────────────────┼──────────────────────┐
          │                   │                      │
┌─────────▼──────┐  ┌─────────▼──────┐   ┌──────────▼────────┐
│  Supabase Cloud │  │  Firebase FCM  │   │   SendGrid        │
│  - PostgreSQL   │  │  (push cmds    │   │   (email alerts,  │
│  - Auth         │  │   to device)   │   │   weekly reports) │
│  - Storage      │  └────────────────┘   └───────────────────┘
│  - Realtime     │
└─────────┬───────┘
          │
          │ Supabase Realtime WebSocket
          │
┌─────────▼───────────────────────────────────────────────────────────┐
│                  WEB DASHBOARD (Next.js)                            │
│                  Admin: overview, devices, blocklists,              │
│                  reports, audit, overrides, remote control          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Website Block

```
1. App opens browser, navigates to blocked.com
2. Android routes all DNS queries through TUN interface (VPN)
3. SelfShieldVpnService receives DNS query for blocked.com
4. Checks in-memory hash set (loaded from Room DB at startup)
5. Match found → return NXDOMAIN (0.0.0.0)
6. Browser gets no IP → navigation fails
7. Accessibility Service detects Chrome loading blocked URL → overlay shown
8. UsageEvent logged: {type: "block_triggered", target: "blocked.com"}
9. Sync worker uploads event to Supabase
```

---

## Data Flow: Remote Block List Push

```
1. Admin edits block list on web dashboard
2. Admin clicks "Push to Device"
3. POST /blocklists/push/:deviceId → backend
4. Backend: updates block_list_entries in Supabase
5. Backend: creates remote_command {type: "push_blocklist", payload: {list_version: N}}
6. Backend: sends FCM data message to device's FCM token
7. Android device receives FCM message (even if screen off)
8. Device: downloads updated list from Supabase
9. Device: updates Room DB + in-memory blocklist hash set
10. Device: PATCH /commands/:id/status → "executed"
```

---

## Data Flow: Emergency Override Request

```
1. Child taps "Request Override" on block screen
2. POST /overrides → creates override_request row in Supabase
3. Supabase Realtime fires → dashboard receives INSERT event
4. Admin sees toast notification on dashboard
5. Admin approves: PATCH /overrides/:id/approve {duration: 15}
6. Backend creates FCM command: {type: "approve_override", duration_min: 15}
7. Android receives FCM → sets override_active = true for 15 minutes
8. VPN and Accessibility Service check override flag → allow blocked content
9. After 15 min: AlarmManager fires → override_active = false → blocking resumes
```

---

## Data Flow: Tamper Detection (Uninstall Attempt)

```
1. User navigates to Settings > Apps > Self-Shield > Uninstall
2. Accessibility Service detects PackageInstaller window
3. Checks if target is Self-Shield → yes
4. Immediately shows full-screen blocking overlay
5. Logs AuditEvent: {type: "uninstall_attempt"}
6. Captures screenshot via MediaProjection
7. Uploads screenshot to Supabase Storage (private bucket)
8. Syncs audit event to Supabase
9. Sends FCM push to admin device + email via SendGrid
10. Admin sees alert in web dashboard
```

---

## Offline Sync Architecture

```
Device (Room DB)
│
├── usage_events: append-only, batch upload when online
├── audit_log: append-only, upload immediately when possible
├── remote_commands: download and execute when online
├── block_list_entries: version-checked, download delta when version changes
└── device_settings: sync bidirectional (server wins on conflict)

Sync triggers:
- WorkManager periodic (15 min interval)
- App foreground (immediate sync attempt)
- FCM message received (trigger sync)
- Network connectivity change (ConnectivityManager callback)
```

---

## Android Service Lifecycle

```
Boot:
  BOOT_COMPLETED → BootReceiver
    → startForegroundService(VpnService)
    → startForegroundService(WatchdogService)
    → VpnService.establish() → VPN tunnel up
    → AccessibilityService already running (OS-managed)

Running:
  WatchdogService (every 60s):
    → isVpnRunning? No → restart VpnService
    → isAccessibilityEnabled? No → notify user + log

Killed by OS:
  VpnService: START_STICKY → OS restarts automatically
  WatchdogService: START_STICKY → OS restarts automatically
  WorkManager: reschedules automatically
```

---

## Blocklist Storage (Performance)

- At startup: load all active block list entries into `HashSet<String>` in memory
- DNS lookup: `O(1)` — constant time regardless of list size
- Supports 100,000+ entries without performance degradation
- On list update (FCM push): rebuild hash set atomically (no downtime)
- Wildcard entries (*.example.com): stored in separate `prefix list` — O(n) scan on subdomain check but size is small

---

## Repositories (GitHub)

```
github.com/your-org/
├── self-shield-android     (Kotlin Android app)
├── self-shield-backend     (Node.js API + cron jobs)
├── self-shield-web         (Next.js dashboard)
└── self-shield-blocklists  (curated default block lists as JSON)
```
