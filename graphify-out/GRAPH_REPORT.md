# Graph Report - self-shield  (2026-05-08)

## Corpus Check
- 132 files · ~119,292 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 794 nodes · 1663 edges · 21 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 37|Community 37]]

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

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (100): _(), ajax(), appendParams(), applyTransformOptsToQuery(), B(), batchSend(), _binaryDecode(), C() (+92 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (97): ar(), _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), channel(), clearHeartbeats(), close() (+89 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (96): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _authenticate(), br(), _callRefreshToken(), _challenge() (+88 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (32): GET(), POST(), GET(), POST(), POST(), GET(), POST(), DashboardLayout() (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (32): AuditPage(), formatDuration(), DeviceSettings(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules(), useDeleteAppSchedule() (+24 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (39): binaryEncode(), _binaryEncodeUserBroadcastPush(), clone(), cloneRequestState(), containedBy(), contains(), delete(), dr() (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (21): catch(), createTable(), createTableIfNotExists(), dropNamespace(), dropTable(), execute(), fetchRequest(), finally() (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (20): _autoRefreshTokenTick(), Bt(), _debug(), _getSessionFromURL(), _getUrlForProvider(), _handleProviderSignIn(), _handleVisibilityChange(), initialize() (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (15): cr(), er(), fetchJwk(), _getAccessToken(), getClaims(), getSession(), Gr(), Jr() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (1): MainActivity

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (1): SelfShieldVpnService

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (1): SelfShieldAccessibilityService

### Community 19 - "Community 19"
Cohesion: 0.5
Nodes (1): WatchdogService

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 28 - "Community 28"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): SelfShieldApplication

## Knowledge Gaps
- **1 isolated node(s):** `SelfShieldApplication`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 13`** (5 nodes): `MainActivity.kt`, `Greeting()`, `GreetingPreview()`, `MainActivity`, `.onCreate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (5 nodes): `SelfShieldVpnService.kt`, `SelfShieldVpnService`, `.onDestroy()`, `.onStartCommand()`, `.startVpnTunnel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (4 nodes): `SelfShieldAccessibilityService`, `.onAccessibilityEvent()`, `.onInterrupt()`, `SelfShieldAccessibilityService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (4 nodes): `WatchdogService.kt`, `WatchdogService`, `.onBind()`, `.onStartCommand()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `SelfShieldApplication.kt`, `SelfShieldApplication`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 4` to `Community 8`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Pt()` connect `Community 2` to `Community 0`, `Community 9`, `Community 7`?**
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