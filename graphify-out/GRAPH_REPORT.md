# Graph Report - self-shield  (2026-05-12)

## Corpus Check
- 159 files · ~94,707 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 938 nodes · 1861 edges · 40 communities detected
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]

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
- `Error` --calls--> `from()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `_encodeUserBroadcastPush()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `join()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `request()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (132): _(), ajax(), appendParams(), applyTransformOptsToQuery(), ar(), B(), batchSend(), C() (+124 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (110): _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _authenticate(), _autoRefreshTokenTick(), br(), Bt() (+102 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (33): GET(), POST(), GET(), POST(), POST(), POST(), GET(), POST() (+25 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (34): AuditPage(), formatDuration(), DeviceSettings(), ForgotPasswordPage(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules() (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (55): Error, cancelTimeout(), canPush(), close(), closeAndRetry(), copyBindings(), cr(), er() (+47 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (43): _binaryDecode(), binaryEncode(), _binaryEncodeUserBroadcastPush(), clone(), cloneRequestState(), containedBy(), contains(), decode() (+35 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (36): _cancelPendingDisconnect(), cancelRefEvent(), clearHeartbeats(), destroy(), disconnect(), flushSendBuffer(), hasLogger(), heartbeatCallback() (+28 more)

### Community 7 - "Community 7"
Cohesion: 0.2
Nodes (16): createNamespace(), createNamespaceIfNotExists(), createTable(), createTableIfNotExists(), dropNamespace(), dropTable(), listNamespaces(), listTables() (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.24
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (1): SelfShieldAccessibilityService

### Community 10 - "Community 10"
Cohesion: 0.2
Nodes (1): MainActivity

### Community 11 - "Community 11"
Cohesion: 0.2
Nodes (6): ConnectUiState, ConnectViewModel, Error, Idle, Loading, Success

### Community 12 - "Community 12"
Cohesion: 0.2
Nodes (6): Idle, Loading, LoginUiState, LoginViewModel, PasswordResetSent, Success

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (5): Authenticated, AuthState, MainViewModel, NeedsConnection, Unauthenticated

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (1): DeviceManager

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (4): DeviceRepository, DeviceStatus, DeviceUpsert, PlaceholderDevice

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (5): Idle, Loading, SignupUiState, SignupViewModel, Success

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (1): AuthRepository

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (1): UsageEventDao

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (1): SelfShieldDeviceAdminReceiver

### Community 23 - "Community 23"
Cohesion: 0.4
Nodes (1): UsageEventRepository

### Community 24 - "Community 24"
Cohesion: 0.4
Nodes (1): NetworkModule

### Community 25 - "Community 25"
Cohesion: 0.4
Nodes (4): ClaimRequest, ClaimResponse, RegisterRequest, RegisterResponse

### Community 26 - "Community 26"
Cohesion: 0.4
Nodes (1): SelfShieldFcmService

### Community 27 - "Community 27"
Cohesion: 0.4
Nodes (1): SelfShieldVpnService

### Community 28 - "Community 28"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 29 - "Community 29"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 31 - "Community 31"
Cohesion: 0.5
Nodes (1): SyncManager

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (1): DatabaseModule

### Community 33 - "Community 33"
Cohesion: 0.5
Nodes (1): SupabaseApi

### Community 34 - "Community 34"
Cohesion: 0.5
Nodes (1): WatchdogService

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 44 - "Community 44"
Cohesion: 0.67
Nodes (1): SelfShieldApplication

### Community 45 - "Community 45"
Cohesion: 0.67
Nodes (1): SyncWorker

### Community 46 - "Community 46"
Cohesion: 0.67
Nodes (1): AppDatabase

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): UsageEvent

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): UsageEventEntity

## Knowledge Gaps
- **27 isolated node(s):** `AuthState`, `Authenticated`, `Unauthenticated`, `NeedsConnection`, `UsageEvent` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 9`** (12 nodes): `SelfShieldAccessibilityService`, `.findBrowserUrl()`, `.findUrlRecursively()`, `.handleWhatsApp()`, `.isBrowser()`, `.logEvent()`, `.onAccessibilityEvent()`, `.onDestroy()`, `.onInterrupt()`, `.performBlockAction()`, `.tryClick()`, `SelfShieldAccessibilityService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (10 nodes): `MainActivity.kt`, `checkAccessibility()`, `checkDeviceAdmin()`, `MainActivity`, `.handleIntent()`, `.onCreate()`, `.onNewIntent()`, `MainScreen()`, `PermissionItem()`, `requestDeviceAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (9 nodes): `DeviceManager`, `.clearPairing()`, `.getAdminId()`, `.getDeviceId()`, `.getFcmToken()`, `.isPaired()`, `.setFcmToken()`, `.setPaired()`, `DeviceManager.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (7 nodes): `AuthRepository`, `.isUserLoggedIn()`, `.resetPassword()`, `.signIn()`, `.signOut()`, `.signUp()`, `AuthRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (7 nodes): `UsageEventDao`, `.deleteOldSyncedEvents()`, `.getRecentEvents()`, `.getUnsyncedEvents()`, `.insertEvent()`, `.updateEvents()`, `UsageEventDao.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (5 nodes): `SelfShieldDeviceAdminReceiver`, `.onDisabled()`, `.onDisableRequested()`, `.onEnabled()`, `SelfShieldDeviceAdminReceiver.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (5 nodes): `UsageEventRepository`, `.getUnsyncedEvents()`, `.logEvent()`, `.markAsSynced()`, `UsageEventRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (5 nodes): `NetworkModule`, `.provideRetrofit()`, `.provideSupabaseApi()`, `.provideSupabaseClient()`, `NetworkModule.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (5 nodes): `SelfShieldFcmService`, `.handleCommand()`, `.onMessageReceived()`, `.onNewToken()`, `SelfShieldFcmService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (5 nodes): `SelfShieldVpnService.kt`, `SelfShieldVpnService`, `.onDestroy()`, `.onStartCommand()`, `.startVpnTunnel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (4 nodes): `SyncManager.kt`, `SyncManager`, `.schedulePeriodicSync()`, `.triggerImmediateSync()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (4 nodes): `DatabaseModule`, `.provideDatabase()`, `.provideUsageEventDao()`, `DatabaseModule.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (4 nodes): `SupabaseApi`, `.claimDevice()`, `.registerDevice()`, `SupabaseApi.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (4 nodes): `WatchdogService.kt`, `WatchdogService`, `.onBind()`, `.onStartCommand()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (3 nodes): `SelfShieldApplication.kt`, `SelfShieldApplication`, `.onCreate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (3 nodes): `SyncWorker.kt`, `SyncWorker`, `.doWork()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (3 nodes): `AppDatabase`, `.usageEventDao()`, `AppDatabase.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (2 nodes): `UsageEvent`, `UsageEvent.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (2 nodes): `UsageEventEntity`, `UsageEventEntity.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Error` connect `Community 4` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 12`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `Error` connect `Community 4` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 16`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 3` to `Community 8`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `Error` (e.g. with `stripNulls()` and `from()`) actually correct?**
  _`Error` has 35 INFERRED edges - model-reasoned connections that need verification._
- **Are the 35 inferred relationships involving `Error` (e.g. with `stripNulls()` and `from()`) actually correct?**
  _`Error` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AuthState`, `Authenticated`, `Unauthenticated` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._