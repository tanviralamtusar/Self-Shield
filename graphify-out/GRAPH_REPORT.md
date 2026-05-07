# Graph Report - .  (2026-04-30)

## Corpus Check
- 155 files · ~111,171 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 770 nodes · 1647 edges · 15 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Supabase Utils|Supabase Utils]]
- [[_COMMUNITY_Supabase Auth|Supabase Auth]]
- [[_COMMUNITY_Realtime Client|Realtime Client]]
- [[_COMMUNITY_API Routes|API Routes]]
- [[_COMMUNITY_Hooks & Components|Hooks & Components]]
- [[_COMMUNITY_Serialization & Filtering|Serialization & Filtering]]
- [[_COMMUNITY_Protocol Decoding|Protocol Decoding]]
- [[_COMMUNITY_Table Management|Table Management]]
- [[_COMMUNITY_Extension Core|Extension Core]]
- [[_COMMUNITY_Content Blocker|Content Blocker]]
- [[_COMMUNITY_UI Sidebar|UI Sidebar]]
- [[_COMMUNITY_Popup UI|Popup UI]]
- [[_COMMUNITY_Middleware|Middleware]]
- [[_COMMUNITY_Pairing UI|Pairing UI]]
- [[_COMMUNITY_Auth Flow|Auth Flow]]

## God Nodes (most connected - your core abstractions)
1. `Pt()` - 73 edges
2. `_returnResult()` - 44 edges
3. `Sr()` - 42 edges
4. `constructor()` - 33 edges
5. `join()` - 29 edges
6. `handleOperation()` - 28 edges
7. `createClient()` - 27 edges
8. `push()` - 24 edges
9. `_useSession()` - 24 edges
10. `requireAuth()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `initSupabase()` --calls--> `createClient()`  [INFERRED]
  self-shield-extension\background\service-worker.js → self-shield-web\src\lib\supabase\client.ts
- `LoginPage()` --calls--> `createClient()`  [INFERRED]
  self-shield-web\src\app\(auth)\login\page.tsx → self-shield-web\src\lib\supabase\client.ts
- `DashboardLayout()` --calls--> `createServerSupabase()`  [INFERRED]
  self-shield-web\src\app\(dashboard)\layout.tsx → self-shield-web\src\lib\supabase\server.ts
- `POST()` --calls--> `createServerSupabase()`  [INFERRED]
  self-shield-web\src\app\api\extension\devices\cleanup\route.ts → self-shield-web\src\lib\supabase\server.ts
- `POST()` --calls--> `createServerSupabase()`  [INFERRED]
  self-shield-web\src\app\api\extension\register\route.ts → self-shield-web\src\lib\supabase\server.ts

## Communities

### Community 0 - "Supabase Utils"
Cohesion: 0.02
Nodes (107): _(), appendParams(), applyTransformOptsToQuery(), ar(), B(), C(), catch(), Ce() (+99 more)

### Community 1 - "Supabase Auth"
Cohesion: 0.05
Nodes (110): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _autoRefreshTokenTick(), br(), Bt(), _callRefreshToken() (+102 more)

### Community 2 - "Realtime Client"
Cohesion: 0.05
Nodes (81): _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), clearHeartbeats(), close(), closeAndRetry(), connect() (+73 more)

### Community 3 - "API Routes"
Cohesion: 0.08
Nodes (32): GET(), POST(), GET(), POST(), POST(), GET(), POST(), DashboardLayout() (+24 more)

### Community 4 - "Hooks & Components"
Cohesion: 0.05
Nodes (32): AuditPage(), formatDuration(), DeviceSettings(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules(), useDeleteAppSchedule() (+24 more)

### Community 5 - "Serialization & Filtering"
Cohesion: 0.08
Nodes (40): binaryEncode(), _binaryEncodeUserBroadcastPush(), clone(), cloneRequestState(), containedBy(), contains(), dr(), encode() (+32 more)

### Community 6 - "Protocol Decoding"
Cohesion: 0.09
Nodes (31): _authenticate(), _binaryDecode(), _challenge(), _challengeAndVerify(), cr(), decode(), decodeBroadcast(), decodePush() (+23 more)

### Community 7 - "Table Management"
Cohesion: 0.16
Nodes (19): ajax(), batchSend(), createNamespace(), createNamespaceIfNotExists(), createTable(), createTableIfNotExists(), dropNamespace(), dropTable() (+11 more)

### Community 8 - "Extension Core"
Cohesion: 0.23
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 12 - "Content Blocker"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 13 - "UI Sidebar"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 15 - "Popup UI"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 16 - "Middleware"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 21 - "Pairing UI"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 24 - "Auth Flow"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

## Knowledge Gaps
- **Thin community `Content Blocker`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Sidebar`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Popup UI`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Middleware`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pairing UI`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Flow`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Hooks & Components` to `Extension Core`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Pt()` connect `Supabase Auth` to `Supabase Utils`, `Protocol Decoding`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `initSupabase()` connect `Extension Core` to `Hooks & Components`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Should `Supabase Utils` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Supabase Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Realtime Client` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._