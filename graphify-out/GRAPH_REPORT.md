# Graph Report - self-shield  (2026-05-09)

## Corpus Check
- 146 files · ~90,657 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 866 nodes · 1764 edges · 29 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 172 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 44|Community 44]]

## God Nodes (most connected - your core abstractions)
1. `Pt()` - 73 edges
2. `_returnResult()` - 44 edges
3. `Sr()` - 42 edges
4. `Error` - 36 edges
5. `constructor()` - 34 edges
6. `join()` - 30 edges
7. `handleOperation()` - 28 edges
8. `createClient()` - 28 edges
9. `push()` - 25 edges
10. `apiSuccess()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `initSupabase()` --calls--> `createClient()`  [INFERRED]
  self-shield-extension\background\service-worker.js → self-shield-web\src\lib\supabase\client.ts
- `Error` --calls--> `stripNulls()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `from()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `_encodeUserBroadcastPush()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `join()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (126): _(), appendParams(), applyTransformOptsToQuery(), B(), _binaryDecode(), binaryEncode(), _binaryEncodeUserBroadcastPush(), C() (+118 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (111): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _authenticate(), _autoRefreshTokenTick(), br(), Bt() (+103 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (95): ar(), _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), channel(), clearHeartbeats(), close() (+87 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (33): GET(), POST(), GET(), POST(), POST(), POST(), GET(), POST() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (33): AuditPage(), formatDuration(), DeviceSettings(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules(), useDeleteAppSchedule() (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (32): Error, Idle, Loading, LoginUiState, LoginViewModel, Success, copyBindings(), cr() (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (32): ajax(), batchSend(), catch(), createNamespace(), createNamespaceIfNotExists(), createTable(), createTableIfNotExists(), dropNamespace() (+24 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (1): MainActivity

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (1): DeviceManager

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (1): SelfShieldAccessibilityService

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (1): AuthRepository

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (2): DeviceRepository, DeviceStatus

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (4): Authenticated, AuthState, MainViewModel, Unauthenticated

### Community 17 - "Community 17"
Cohesion: 0.4
Nodes (1): SelfShieldDeviceAdminReceiver

### Community 18 - "Community 18"
Cohesion: 0.4
Nodes (1): NetworkModule

### Community 19 - "Community 19"
Cohesion: 0.4
Nodes (4): ClaimRequest, ClaimResponse, RegisterRequest, RegisterResponse

### Community 20 - "Community 20"
Cohesion: 0.4
Nodes (1): SelfShieldFcmService

### Community 21 - "Community 21"
Cohesion: 0.4
Nodes (1): SelfShieldVpnService

### Community 22 - "Community 22"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 23 - "Community 23"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 25 - "Community 25"
Cohesion: 0.5
Nodes (1): SupabaseApi

### Community 26 - "Community 26"
Cohesion: 0.5
Nodes (1): WatchdogService

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 35 - "Community 35"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (1): SyncWorker

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): SelfShieldApplication

## Knowledge Gaps
- **14 isolated node(s):** `MainViewModel`, `AuthState`, `Authenticated`, `Unauthenticated`, `SelfShieldApplication` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (8 nodes): `MainActivity.kt`, `checkAccessibility()`, `checkDeviceAdmin()`, `MainActivity`, `.onCreate()`, `MainScreen()`, `PermissionItem()`, `requestDeviceAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (8 nodes): `DeviceManager`, `.getAdminId()`, `.getDeviceId()`, `.getFcmToken()`, `.isPaired()`, `.setFcmToken()`, `.setPaired()`, `DeviceManager.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (7 nodes): `SelfShieldAccessibilityService`, `.handleWhatsApp()`, `.onAccessibilityEvent()`, `.onInterrupt()`, `.performBlockAction()`, `.tryClick()`, `SelfShieldAccessibilityService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (6 nodes): `AuthRepository`, `.isUserLoggedIn()`, `.signIn()`, `.signOut()`, `.signUp()`, `AuthRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (6 nodes): `DeviceRepository`, `.checkPairingStatus()`, `.claimDevice()`, `.registerDevice()`, `DeviceStatus`, `DeviceRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `SelfShieldDeviceAdminReceiver`, `.onDisabled()`, `.onDisableRequested()`, `.onEnabled()`, `SelfShieldDeviceAdminReceiver.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (5 nodes): `NetworkModule`, `.provideRetrofit()`, `.provideSupabaseApi()`, `.provideSupabaseClient()`, `NetworkModule.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (5 nodes): `SelfShieldFcmService`, `.handleCommand()`, `.onMessageReceived()`, `.onNewToken()`, `SelfShieldFcmService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (5 nodes): `SelfShieldVpnService.kt`, `SelfShieldVpnService`, `.onDestroy()`, `.onStartCommand()`, `.startVpnTunnel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (4 nodes): `SupabaseApi`, `.claimDevice()`, `.registerDevice()`, `SupabaseApi.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (4 nodes): `WatchdogService.kt`, `WatchdogService`, `.onBind()`, `.onStartCommand()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (3 nodes): `SyncWorker.kt`, `SyncWorker`, `.doWork()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `SelfShieldApplication.kt`, `SelfShieldApplication`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Error` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 4` to `Community 7`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Pt()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `Error` (e.g. with `stripNulls()` and `from()`) actually correct?**
  _`Error` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `MainViewModel`, `AuthState`, `Authenticated` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._