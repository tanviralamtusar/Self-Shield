# Self-Shield — Layout & Navigation

## Navigation Structure

### Android App

```
Bottom Navigation (4 tabs):
├── Dashboard      (Home icon)
├── Blocking       (Shield icon)
├── Focus Mode     (Timer icon)
└── Reports        (Chart icon)

Floating Action Button (Dashboard):
└── Quick Block (+ icon) → Add app or site to blocklist

Top-Level Screens (no tab, accessed via Settings gear):
└── Settings / Admin Panel
    ├── Device Settings
    ├── PIN & Security
    ├── Child Devices (admin only)
    ├── Block List Manager
    ├── Notification Settings
    └── About / Version
```

---

## Screen Layouts

### 1. Dashboard Screen

```
┌─────────────────────────────────┐
│  Self-Shield         ⚙️  Admin   │  ← Top AppBar
├─────────────────────────────────┤
│  ╔═══════════════════════════╗  │
│  ║  🛡️  Protection Active    ║  │  ← Status Hero Card
│  ║  VPN ✅  Accessibility ✅ ║  │
│  ╚═══════════════════════════╝  │
├─────────────────────────────────┤
│  Today at a Glance              │  ← Section Header
│  ┌──────────┐  ┌──────────┐    │
│  │ 4h 20m   │  │  12      │    │  ← Stat Cards
│  │ Screen   │  │ Blocks   │    │
│  └──────────┘  └──────────┘    │
├─────────────────────────────────┤
│  Quick Actions                  │
│  ┌────────┐ ┌────────┐         │
│  │ Focus  │ │ Block  │         │  ← Action Cards
│  │  Mode  │ │  App   │         │
│  └────────┘ └────────┘         │
├─────────────────────────────────┤
│  Recent Activity                │  ← Activity Feed
│  🚫 YouTube blocked  2m ago     │
│  ⌨️  Keyword blocked  5m ago    │
│  🔒 Uninstall blocked 1h ago    │
└─────────────────────────────────┘
```

---

### 2. Blocking Screen

```
┌─────────────────────────────────┐
│  Blocking               Filter▼ │
├─────────────────────────────────┤
│  [Websites] [Apps] [Keywords]   │  ← Tab Row
├─────────────────────────────────┤
│  WEBSITES tab:                  │
│  ┌─────────────────────────┐   │
│  │ 🔞 Pornography      [✅]│   │  ← Category Toggle Cards
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🎰 Gambling          [✅]│   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🏳️‍🌈 LGBTQ Content   [❌]│   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ ✏️  Custom Blocklist     │   │
│  │    34 hostnames     [>] │   │
│  └─────────────────────────┘   │
│                                 │
│  + Add hostname manually        │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│  APPS tab:                      │
│  Search apps...          🔍     │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ [Icon] YouTube          │   │
│  │ Block [❌]  Timer [⏱️]  │   │
│  │ Uninstall Protect [✅]  │   │
│  │ In-App: Shorts [✅]     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ [Icon] Instagram        │   │
│  │ Block [❌]  Timer [❌]  │   │
│  │ Protect [✅]            │   │
│  │ In-App: Reels [✅]      │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

### 3. Focus Mode Screen

```
┌─────────────────────────────────┐
│  Focus Mode                     │
├─────────────────────────────────┤
│         🧘 No Session           │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Duration               │   │
│  │  [25min] [50min] [Custom]│   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  Pomodoro               │   │
│  │  Work: 25m  Break: 5m   │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  Allowed Apps           │   │
│  │  + Quran, Notes, Maps   │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  Quran Prompt            │   │
│  │  Show dua on block screen│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │   START FOCUS SESSION   │   │  ← Primary CTA
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Active Focus Session:**
```
┌─────────────────────────────────┐
│  Focus Active       🟢 LIVE     │
├─────────────────────────────────┤
│         ⏳ 24:13                 │  ← Big countdown
│        remaining                │
│                                 │
│  Break in: 0:47                 │
│  ████████████░░░░░░░░           │  ← Progress bar
├─────────────────────────────────┤
│  ⚠️  End Session (PIN required) │
└─────────────────────────────────┘
```

---

### 4. Reports Screen

```
┌─────────────────────────────────┐
│  Reports          [Day|Week|Mo] │
├─────────────────────────────────┤
│  Screen Time Today              │
│  ████████████░░░░░░  4h 22m     │  ← Bar chart
│                                 │
│  Top Apps                       │
│  YouTube      ██████  1h 30m    │
│  Chrome       ████    55m       │
│  WhatsApp     ███     40m       │
├─────────────────────────────────┤
│  Blocks Today           12      │
│  Keywords Blocked        3      │
│  Tamper Attempts         0      │
├─────────────────────────────────┤
│  Focus Sessions                 │
│  2 sessions · 50 min total      │
└─────────────────────────────────┘
```

---

### 5. Block Overlay (Full Screen)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│            🛡️                   │
│                                 │
│      Access Blocked             │
│   Self-Shield is protecting you │
│                                 │
│   "YouTube - Shorts"            │
│                                 │
│  ─────────────────────────────  │
│                                 │
│   بِسْمِ اللَّهِ الرَّحْمَٰنِ  │   ← If focus mode Quran prompt
│                                 │
│  ─────────────────────────────  │
│                                 │
│      [Request Override]         │  ← Ghost button
│                                 │
└─────────────────────────────────┘
```

---

### 6. Admin Settings (PIN-gated)

```
┌─────────────────────────────────┐
│  ← Admin Settings               │
├─────────────────────────────────┤
│  Security                       │
│  ┌─────────────────────────┐   │
│  │ Change PIN          [>] │   │
│  │ Biometric Login     [✅]│   │
│  │ Secret Question     [>] │   │
│  └─────────────────────────┘   │
│  Devices                        │
│  ┌─────────────────────────┐   │
│  │ Child Device 1      [>] │   │
│  │ Child Device 2      [>] │   │
│  │ + Add Device            │   │
│  └─────────────────────────┘   │
│  Tamper Log                     │
│  ┌─────────────────────────┐   │
│  │ View Audit Log      [>] │   │
│  └─────────────────────────┘   │
│  App                           │
│  ┌─────────────────────────┐   │
│  │ Theme: System       [>] │   │
│  │ Notifications       [>] │   │
│  │ Sync Now                │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

## Web Dashboard Layout (Next.js)

### Sidebar (Desktop)
```
┌──────────────────────────────────────────────────────┐
│  🛡️ Self-Shield Admin              admin@email.com  │
├──────┬───────────────────────────────────────────────┤
│      │ Overview                                       │
│      │ Devices                                        │
│  Nav │ Block Lists                                    │
│      │ Reports & Analytics                            │
│      │ Audit Log                                      │
│      │ Overrides                                      │
│      │ Settings                                       │
└──────┴───────────────────────────────────────────────┘
```

### Overview Page (Dashboard)
```
4 stat cards: Total Devices | Active Blocks | Overrides Pending | Tamper Events
Device status table: [Name | Last Seen | VPN | Blocks Today | Actions]
Recent audit events feed
```

### Device Detail Page
```
Tabs: Summary | Block Rules | App Rules | Schedule | Reports | Audit Log
```

---

## Onboarding Flow (First Launch)

```
Screen 1: Welcome → "Protect yourself with Self-Shield"
Screen 2: Set Admin PIN (+ confirm + optional secret question)
Screen 3: Enable Accessibility Service → deep link to settings
Screen 4: Enable VPN → system dialog
Screen 5: Request Device Admin → system dialog
Screen 6: Optional — pair to admin dashboard
Screen 7: Setup Complete → Go to Dashboard
```

Each screen: one action, clear instruction, skip not allowed for critical permissions.
