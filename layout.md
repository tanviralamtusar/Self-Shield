# Self-Shield — Screen Layouts

## Navigation Structure

Bottom Navigation Bar (Admin):
├── Dashboard (shield icon)
├── Blocking (block icon)
├── Focus (timer icon)
├── Stats (chart icon)
└── Settings (gear icon)

Child View:
└── Single screen (shield active indicator only)

## Dashboard Screen Layout

┌─────────────────────────────────┐
│ [≡] Self-Shield [🔔] [👤] │ TopAppBar
├─────────────────────────────────┤
│ │
│ ┌─────────────────────────┐ │
│ │ 🛡️ PROTECTION ACTIVE │ │ Status Card (accent border)
│ │ VPN + Accessibility ON │ │
│ │ Since: 2h 34m │ │
│ └─────────────────────────┘ │
│ │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 42 │ │ 8 │ │ 3.2h │ │ Stats Row Cards
│ │Sites │ │Apps │ │Screen│ │
│ │Block │ │Block │ │Time │ │
│ └──────┘ └──────┘ └──────┘ │
│ │
│ ┌─────────────────────────┐ │
│ │ ⏱️ Focus Mode │ │ Focus Card
│ │ Not Active │ │
│ │ [Start Focus Session] │ │
│ └─────────────────────────┘ │
│ │
│ Recent Blocks [All→] │ Section Header
│ ┌─────────────────────────┐ │
│ │ 🚫 youtube.com 2m ago │ │ Block Item
│ │ 🚫 Instagram 5m ago │ │
│ │ 🚫 "keyword" 12m ago │ │
│ └─────────────────────────┘ │
│ │
│ [+] │ FAB
└─────────────────────────────────┘

## Blocking Screen Layout

┌─────────────────────────────────┐
│ ← Blocking Rules │ TopAppBar
├─────────────────────────────────┤
│ [Apps][Sites][Keywords][More▼] │ Tab Row (scrollable)
├─────────────────────────────────┤
│ 🔍 Search... │ Search Bar
│ │
│ CATEGORIES │ Section
│ ┌─────────────────────────┐ │
│ │ 🔞 Adult Content [ON] │ │ Category Toggle Card
│ │ 🎰 Gambling [ON] │ │
│ │ 🏳️‍🌈 LGBTQ [ON] │ │
│ │ ☪️ Islamophobic [ON] │ │
│ │ 📰 Fake News [OFF] │ │
│ └─────────────────────────┘ │
│ │
│ CUSTOM RULES [+] │ Section
│ ┌─────────────────────────┐ │
│ │ reddit.com [ON] │ │ Custom Rule Card
│ │ tiktok.com [ON] │ │
│ └─────────────────────────┘ │
└─────────────────────────────────┘

## WhatsApp Controls Tab

┌─────────────────────────────────┐
│ WhatsApp Controls │
├─────────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 📊 Block Status Tab [ON]│ │
│ │ 📢 Block Channels [ON]│ │
│ │ 📞 Block Calls [OFF│ │
│ │ 🔵 Block View Once [ON]│ │
│ └─────────────────────────┘ │
│ │
│ ⚠️ Uses Accessibility Service │ Info banner
└─────────────────────────────────┘

## In-App Blocking Tab

┌─────────────────────────────────┐
│ In-App Blocking │
├─────────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 📱 Instagram Reels [ON]│ │
│ │ ▶️ YouTube Shorts [ON]│ │
│ │ 🎵 TikTok Feed [ON]│ │
│ │ 📘 FB Reels [ON]│ │
│ │ 🐦 Twitter Trends [OFF│ │
│ │ 📸 Snap Spotlight [ON]│ │
│ └─────────────────────────┘ │
└─────────────────────────────────┘

## Focus Mode Screen

┌─────────────────────────────────┐
│ Focus Mode │
├─────────────────────────────────┤
│ │
│ 🎯 │
│ Deep Focus Session │
│ │
│ ┌──────────────────────────┐ │
│ │ Duration │ │
│ │ [-] 25 minutes [+] │ │
│ │ [15m][25m][45m][1h][∞] │ │
│ └──────────────────────────┘ │
│ │
│ ┌──────────────────────────┐ │
│ │ Allowed Apps (Whitelist)│ │
│ │ + Add apps... │ │
│ │ ✓ Phone │ │
│ │ ✓ Messages │ │
│ └──────────────────────────┘ │
│ │
│ ┌──────────────────────────┐ │
│ │ Block Everything Else │ │
│ │ Including notifications │[✓]│
│ └──────────────────────────┘ │
│ │
│ ┌──────────────────────────┐ │
│ │ [START FOCUS SESSION] │ │ Primary Button
│ └──────────────────────────┘ │
└─────────────────────────────────┘

## Block Overlay (Full Screen)
┌─────────────────────────────────┐
│ │
│ │
│ 🛡️ │
│ │
│ Access Blocked │
│ │
│ This content is restricted │
│ by Self-Shield │
│ │
│ Blocked: youtube.com │
│ Category: Video Streaming │
│ Time: 14:32 │
│ │
│ ┌──────────────────────────┐ │
│ │ Request Override │ │ Secondary Button
│ └──────────────────────────┘ │
│ │
│ ┌──────────────────────────┐ │
│ │ Go Back │ │ Primary Button
│ └──────────────────────────┘ │
│ │
└─────────────────────────────────┘

## Timer Screen Layout

┌─────────────────────────────────┐
│ App Timers [+] │
├─────────────────────────────────┤
│ [Timers] [Schedule] │ Tab row
├─────────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 📷 Instagram │ │
│ │ Used: 45m / Limit: 1h │ │ Timer Card
│ │ ████████░░ 75% │ │ Progress bar
│ │ Resets: midnight │ │
│ └─────────────────────────┘ │
│ │
│ ┌─────────────────────────┐ │
│ │ 🎮 Games │ │
│ │ Used: 2h / Limit: 2h │ │
│ │ ██████████ LIMIT HIT │ │ Red progress
│ └─────────────────────────┘ │
└─────────────────────────────────┘

## Stats Screen Layout

┌─────────────────────────────────┐
│ Statistics │
│ [Today][Week][Month] │
├─────────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Screen Time: 3h 20m │ │
│ │ ▁▂▄▆▇█▅▃▂▁ (bar chart)│ │
│ └─────────────────────────┘ │
│ │
│ ┌─────────────────────────┐ │
│ │ Blocks Triggered: 28 │ │
│ │ Most blocked: YouTube │ │
│ └─────────────────────────┘ │
│ │
│ APP BREAKDOWN │
│ ┌─────────────────────────┐ │
│ │ Instagram 1h 20m ████│ │
│ │ Chrome 45m ███ │ │
│ │ YouTube 30m ██ │ │
│ └─────────────────────────┘ │
└─────────────────────────────────┘

## Settings Screen Layout

┌─────────────────────────────────┐
│ Settings │
├─────────────────────────────────┤
│ PROTECTION │
│ ┌─────────────────────────┐ │
│ │ Change Admin PIN │→ │
│ │ Tamper Protection │→ │
│ │ Device Owner Status │→ │
│ │ ADB Detection [ON]│ │
│ └─────────────────────────┘ │
│ │
│ SYNC │
│ ┌─────────────────────────┐ │
│ │ Cloud Sync [ON]│ │
│ │ Last synced: 2m ago │ │
│ │ Sync Now │→ │
│ └─────────────────────────┘ │
│ │
│ APPEARANCE │
│ ┌─────────────────────────┐ │
│ │ Dark Mode [ON] │ │
│ └─────────────────────────┘ │
│ │
│ ABOUT │
│ ┌─────────────────────────┐ │
│ │ Version 1.0.0 │ │
│ │ Open Source (GitHub) │→ │
│ │ Licenses │→ │
│ └─────────────────────────┘ │
└─────────────────────────────────┘