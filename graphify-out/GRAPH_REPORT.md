# Graph Report - self-shield  (2026-05-09)

## Corpus Check
- 133 files · ~88,554 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 805 nodes · 1676 edges · 22 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 133 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `Pt()` - 73 edges
2. `_returnResult()` - 44 edges
3. `Sr()` - 42 edges
4. `constructor()` - 33 edges
5. `join()` - 29 edges
6. `handleOperation()` - 28 edges
7. `createClient()` - 28 edges
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

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (90): _(), ajax(), appendParams(), applyTransformOptsToQuery(), B(), batchSend(), C(), Ce() (+82 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (98): ar(), _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), channel(), clearHeartbeats(), close() (+90 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (95): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _authenticate(), _challenge(), _challengeAndVerify(), cr() (+87 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (32): GET(), POST(), GET(), POST(), POST(), GET(), POST(), DashboardLayout() (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (33): AuditPage(), formatDuration(), DeviceSettings(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules(), useDeleteAppSchedule() (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (48): _binaryDecode(), binaryEncode(), _binaryEncodeUserBroadcastPush(), clone(), cloneRequestState(), containedBy(), contains(), decode() (+40 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (30): _autoRefreshTokenTick(), br(), Bt(), _callRefreshToken(), _debug(), delete(), _getSessionFromURL(), _getUrlForProvider() (+22 more)

### Community 7 - "Community 7"
Cohesion: 0.2
Nodes (16): createNamespace(), createNamespaceIfNotExists(), createTable(), createTableIfNotExists(), dropNamespace(), dropTable(), listNamespaces(), listTables() (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.24
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (11): catch(), execute(), fetchRequest(), finally(), getPromise(), _handleTokenChanged(), _isManualToken(), _performAuth() (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (1): MainActivity

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (1): SelfShieldAccessibilityService

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (1): SelfShieldDeviceAdminReceiver

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (1): SelfShieldVpnService

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (1): WatchdogService

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 22 - "Community 22"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): SelfShieldApplication

## Knowledge Gaps
- **1 isolated node(s):** `SelfShieldApplication`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 10`** (8 nodes): `MainActivity.kt`, `checkAccessibility()`, `checkDeviceAdmin()`, `MainActivity`, `.onCreate()`, `MainScreen()`, `PermissionItem()`, `requestDeviceAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (7 nodes): `SelfShieldAccessibilityService`, `.handleWhatsApp()`, `.onAccessibilityEvent()`, `.onInterrupt()`, `.performBlockAction()`, `.tryClick()`, `SelfShieldAccessibilityService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (5 nodes): `SelfShieldDeviceAdminReceiver`, `.onDisabled()`, `.onDisableRequested()`, `.onEnabled()`, `SelfShieldDeviceAdminReceiver.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (5 nodes): `SelfShieldVpnService.kt`, `SelfShieldVpnService`, `.onDestroy()`, `.onStartCommand()`, `.startVpnTunnel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `WatchdogService.kt`, `WatchdogService`, `.onBind()`, `.onStartCommand()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `SelfShieldApplication.kt`, `SelfShieldApplication`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 4` to `Community 8`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Pt()` connect `Community 2` to `Community 0`, `Community 6`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `initSupabase()` connect `Community 8` to `Community 4`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `SelfShieldApplication` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._