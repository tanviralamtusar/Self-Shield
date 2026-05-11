# Graph Report - self-shield  (2026-05-12)

## Corpus Check
- 152 files · ~93,146 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 899 nodes · 1829 edges · 33 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 48|Community 48]]

## God Nodes (most connected - your core abstractions)
1. `Pt()` - 73 edges
2. `_returnResult()` - 44 edges
3. `Sr()` - 42 edges
4. `Error` - 36 edges
5. `Error` - 36 edges
6. `constructor()` - 35 edges
7. `join()` - 31 edges
8. `createClient()` - 29 edges
9. `handleOperation()` - 28 edges
10. `push()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `initSupabase()` --calls--> `createClient()`  [INFERRED]
  self-shield-extension\background\service-worker.js → self-shield-web\src\lib\supabase\client.ts
- `Error` --calls--> `push()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `request()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `heartbeatTimeout()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `constructor()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (95): _(), ajax(), appendParams(), applyTransformOptsToQuery(), B(), batchSend(), C(), Ce() (+87 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (109): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _authenticate(), _autoRefreshTokenTick(), Bt(), _callRefreshToken() (+101 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (95): ar(), _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), channel(), clearHeartbeats(), close() (+87 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (63): Error, binaryEncode(), _binaryEncodeUserBroadcastPush(), br(), clone(), cloneRequestState(), containedBy(), contains() (+55 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (33): GET(), POST(), GET(), POST(), POST(), POST(), GET(), POST() (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (34): AuditPage(), formatDuration(), DeviceSettings(), ForgotPasswordPage(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules() (+26 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (23): catch(), createNamespace(), createNamespaceIfNotExists(), createTable(), createTableIfNotExists(), dropNamespace(), dropTable(), execute() (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (1): MainActivity

### Community 9 - "Community 9"
Cohesion: 0.2
Nodes (6): ConnectUiState, ConnectViewModel, Error, Idle, Loading, Success

### Community 10 - "Community 10"
Cohesion: 0.2
Nodes (6): Idle, Loading, LoginUiState, LoginViewModel, PasswordResetSent, Success

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (1): DeviceManager

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (5): Idle, Loading, SignupUiState, SignupViewModel, Success

### Community 14 - "Community 14"
Cohesion: 0.29
Nodes (1): AuthRepository

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (1): SelfShieldAccessibilityService

### Community 16 - "Community 16"
Cohesion: 0.48
Nodes (7): _binaryDecode(), decode(), decodeBroadcast(), decodePush(), decodeReply(), _decodeUserBroadcast(), onConnMessage()

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): Authenticated, AuthState, MainViewModel, NeedsConnection, Unauthenticated

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (2): DeviceRepository, DeviceStatus

### Community 21 - "Community 21"
Cohesion: 0.4
Nodes (1): SelfShieldDeviceAdminReceiver

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (1): NetworkModule

### Community 23 - "Community 23"
Cohesion: 0.4
Nodes (4): ClaimRequest, ClaimResponse, RegisterRequest, RegisterResponse

### Community 24 - "Community 24"
Cohesion: 0.4
Nodes (1): SelfShieldFcmService

### Community 25 - "Community 25"
Cohesion: 0.4
Nodes (1): SelfShieldVpnService

### Community 26 - "Community 26"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 27 - "Community 27"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 29 - "Community 29"
Cohesion: 0.5
Nodes (1): SupabaseApi

### Community 30 - "Community 30"
Cohesion: 0.5
Nodes (1): WatchdogService

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (1): SyncWorker

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (1): SelfShieldApplication

## Knowledge Gaps
- **25 isolated node(s):** `MainViewModel`, `AuthState`, `Authenticated`, `Unauthenticated`, `NeedsConnection` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (10 nodes): `MainActivity.kt`, `checkAccessibility()`, `checkDeviceAdmin()`, `MainActivity`, `.handleIntent()`, `.onCreate()`, `.onNewIntent()`, `MainScreen()`, `PermissionItem()`, `requestDeviceAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (8 nodes): `DeviceManager`, `.getAdminId()`, `.getDeviceId()`, `.getFcmToken()`, `.isPaired()`, `.setFcmToken()`, `.setPaired()`, `DeviceManager.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (7 nodes): `AuthRepository`, `.isUserLoggedIn()`, `.resetPassword()`, `.signIn()`, `.signOut()`, `.signUp()`, `AuthRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (7 nodes): `SelfShieldAccessibilityService`, `.handleWhatsApp()`, `.onAccessibilityEvent()`, `.onInterrupt()`, `.performBlockAction()`, `.tryClick()`, `SelfShieldAccessibilityService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (6 nodes): `DeviceRepository`, `.checkPairingStatus()`, `.claimDevice()`, `.registerDevice()`, `DeviceStatus`, `DeviceRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (5 nodes): `SelfShieldDeviceAdminReceiver`, `.onDisabled()`, `.onDisableRequested()`, `.onEnabled()`, `SelfShieldDeviceAdminReceiver.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (5 nodes): `NetworkModule`, `.provideRetrofit()`, `.provideSupabaseApi()`, `.provideSupabaseClient()`, `NetworkModule.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (5 nodes): `SelfShieldFcmService`, `.handleCommand()`, `.onMessageReceived()`, `.onNewToken()`, `SelfShieldFcmService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (5 nodes): `SelfShieldVpnService.kt`, `SelfShieldVpnService`, `.onDestroy()`, `.onStartCommand()`, `.startVpnTunnel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (4 nodes): `SupabaseApi`, `.claimDevice()`, `.registerDevice()`, `SupabaseApi.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (4 nodes): `WatchdogService.kt`, `WatchdogService`, `.onBind()`, `.onStartCommand()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (3 nodes): `SyncWorker.kt`, `SyncWorker`, `.doWork()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (2 nodes): `SelfShieldApplication.kt`, `SelfShieldApplication`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Error` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 6`, `Community 10`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Error` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 6`, `Community 12`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 5` to `Community 7`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `Error` (e.g. with `stripNulls()` and `from()`) actually correct?**
  _`Error` has 35 INFERRED edges - model-reasoned connections that need verification._
- **Are the 35 inferred relationships involving `Error` (e.g. with `stripNulls()` and `from()`) actually correct?**
  _`Error` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `MainViewModel`, `AuthState`, `Authenticated` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._