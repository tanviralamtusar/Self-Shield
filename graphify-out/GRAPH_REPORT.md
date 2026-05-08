# Graph Report - self-shield  (2026-05-08)

## Corpus Check
- 124 files · ~118,692 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 770 nodes · 1647 edges · 15 communities detected
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 24|Community 24]]

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
Nodes (107): _(), appendParams(), applyTransformOptsToQuery(), ar(), B(), C(), catch(), Ce() (+99 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (110): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _autoRefreshTokenTick(), br(), Bt(), _callRefreshToken() (+102 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (81): _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), clearHeartbeats(), close(), closeAndRetry(), connect() (+73 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (32): GET(), POST(), GET(), POST(), POST(), GET(), POST(), DashboardLayout() (+24 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (32): AuditPage(), formatDuration(), DeviceSettings(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules(), useDeleteAppSchedule() (+24 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (40): binaryEncode(), _binaryEncodeUserBroadcastPush(), clone(), cloneRequestState(), containedBy(), contains(), dr(), encode() (+32 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (31): _authenticate(), _binaryDecode(), _challenge(), _challengeAndVerify(), cr(), decode(), decodeBroadcast(), decodePush() (+23 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (19): ajax(), batchSend(), createNamespace(), createNamespaceIfNotExists(), createTable(), createTableIfNotExists(), dropNamespace(), dropTable() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.23
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

## Knowledge Gaps
- **Thin community `Community 12`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 4` to `Community 8`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Pt()` connect `Community 1` to `Community 0`, `Community 6`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `initSupabase()` connect `Community 8` to `Community 4`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._