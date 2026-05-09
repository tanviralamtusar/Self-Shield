# Graph Report - self-shield  (2026-05-09)

## Corpus Check
- 148 files · ~91,464 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 875 nodes · 1772 edges · 30 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 173 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `Pt()` - 73 edges
2. `_returnResult()` - 44 edges
3. `Sr()` - 42 edges
4. `Error` - 36 edges
5. `constructor()` - 34 edges
6. `join()` - 30 edges
7. `createClient()` - 29 edges
8. `handleOperation()` - 28 edges
9. `push()` - 25 edges
10. `apiSuccess()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Error` --calls--> `stripNulls()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `copyBindings()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `initSupabase()` --calls--> `createClient()`  [INFERRED]
  self-shield-extension\background\service-worker.js → self-shield-web\src\lib\supabase\client.ts
- `Error` --calls--> `from()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js
- `Error` --calls--> `getWebSocketConstructor()`  [INFERRED]
  self-shield-android\feature\feature-onboarding\src\main\java\com\selfshield\feature\onboarding\login\LoginViewModel.kt → self-shield-extension\supabase.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (108): _(), appendParams(), applyTransformOptsToQuery(), B(), _binaryDecode(), _binaryEncodeUserBroadcastPush(), C(), Ce() (+100 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (113): Error, _acquireLock(), _adminDeletePasskey(), _adminListPasskeys(), _approveAuthorization(), _authenticate(), br(), _callRefreshToken() (+105 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (104): ar(), _cancelPendingDisconnect(), cancelRefEvent(), cancelTimeout(), canPush(), catch(), channel(), clearHeartbeats() (+96 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (33): GET(), POST(), GET(), POST(), POST(), POST(), GET(), POST() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (34): AuditPage(), formatDuration(), DeviceSettings(), ForgotPasswordPage(), useActivityLog(), useAppRules(), useUpdateAppRule(), useAppSchedules() (+26 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (46): ajax(), batchSend(), binaryEncode(), clone(), cloneRequestState(), containedBy(), contains(), createNamespace() (+38 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (20): _autoRefreshTokenTick(), Bt(), _debug(), _getSessionFromURL(), _getUrlForProvider(), _handleProviderSignIn(), _handleVisibilityChange(), initialize() (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (14): clearAllRules(), endCurrentSession(), flushEventBatch(), getBrowserInfo(), initSupabase(), logEvent(), performUnpair(), setupRealtimeListener() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.2
Nodes (1): MainActivity

### Community 9 - "Community 9"
Cohesion: 0.2
Nodes (6): Idle, Loading, LoginUiState, LoginViewModel, PasswordResetSent, Success

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (1): DeviceManager

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (1): AuthRepository

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (1): SelfShieldAccessibilityService

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (2): DeviceRepository, DeviceStatus

### Community 17 - "Community 17"
Cohesion: 0.4
Nodes (4): Authenticated, AuthState, MainViewModel, Unauthenticated

### Community 18 - "Community 18"
Cohesion: 0.4
Nodes (1): SelfShieldDeviceAdminReceiver

### Community 19 - "Community 19"
Cohesion: 0.4
Nodes (1): NetworkModule

### Community 20 - "Community 20"
Cohesion: 0.4
Nodes (4): ClaimRequest, ClaimResponse, RegisterRequest, RegisterResponse

### Community 21 - "Community 21"
Cohesion: 0.4
Nodes (1): SelfShieldFcmService

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (1): SelfShieldVpnService

### Community 23 - "Community 23"
Cohesion: 0.5
Nodes (2): performServerCheck(), removeBlackout()

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (2): cn(), SidebarMenuSubButton()

### Community 26 - "Community 26"
Cohesion: 0.5
Nodes (1): SupabaseApi

### Community 27 - "Community 27"
Cohesion: 0.5
Nodes (1): WatchdogService

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (2): updateStatusUI(), updateUI()

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (2): generateCode(), handleOpenChange()

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (2): proxy(), updateSession()

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (1): SyncWorker

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (2): handleSignup(), validateForm()

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (1): SelfShieldApplication

## Knowledge Gaps
- **15 isolated node(s):** `MainViewModel`, `AuthState`, `Authenticated`, `Unauthenticated`, `SelfShieldApplication` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (10 nodes): `MainActivity.kt`, `checkAccessibility()`, `checkDeviceAdmin()`, `MainActivity`, `.handleIntent()`, `.onCreate()`, `.onNewIntent()`, `MainScreen()`, `PermissionItem()`, `requestDeviceAdmin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (8 nodes): `DeviceManager`, `.getAdminId()`, `.getDeviceId()`, `.getFcmToken()`, `.isPaired()`, `.setFcmToken()`, `.setPaired()`, `DeviceManager.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (7 nodes): `AuthRepository`, `.isUserLoggedIn()`, `.resetPassword()`, `.signIn()`, `.signOut()`, `.signUp()`, `AuthRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (7 nodes): `SelfShieldAccessibilityService`, `.handleWhatsApp()`, `.onAccessibilityEvent()`, `.onInterrupt()`, `.performBlockAction()`, `.tryClick()`, `SelfShieldAccessibilityService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (6 nodes): `DeviceRepository`, `.checkPairingStatus()`, `.claimDevice()`, `.registerDevice()`, `DeviceStatus`, `DeviceRepository.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (5 nodes): `SelfShieldDeviceAdminReceiver`, `.onDisabled()`, `.onDisableRequested()`, `.onEnabled()`, `SelfShieldDeviceAdminReceiver.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (5 nodes): `NetworkModule`, `.provideRetrofit()`, `.provideSupabaseApi()`, `.provideSupabaseClient()`, `NetworkModule.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (5 nodes): `SelfShieldFcmService`, `.handleCommand()`, `.onMessageReceived()`, `.onNewToken()`, `SelfShieldFcmService.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (5 nodes): `SelfShieldVpnService.kt`, `SelfShieldVpnService`, `.onDestroy()`, `.onStartCommand()`, `.startVpnTunnel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (5 nodes): `checkAndBlock()`, `performServerCheck()`, `removeBlackout()`, `showBlockUI()`, `blocker.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (5 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenuSubButton()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (4 nodes): `SupabaseApi`, `.claimDevice()`, `.registerDevice()`, `SupabaseApi.kt`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (4 nodes): `WatchdogService.kt`, `WatchdogService`, `.onBind()`, `.onStartCommand()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (4 nodes): `updateStatusUI()`, `updateUI()`, `updateUIForCurrentTab()`, `popup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (4 nodes): `copyToClipboard()`, `generateCode()`, `handleOpenChange()`, `PairDeviceModal.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (4 nodes): `middleware.ts`, `proxy.ts`, `proxy()`, `updateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (3 nodes): `SyncWorker.kt`, `SyncWorker`, `.doWork()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (3 nodes): `page.tsx`, `handleSignup()`, `validateForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `SelfShieldApplication.kt`, `SelfShieldApplication`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Error` connect `Community 1` to `Community 0`, `Community 9`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 4` to `Community 7`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 35 inferred relationships involving `Error` (e.g. with `stripNulls()` and `from()`) actually correct?**
  _`Error` has 35 INFERRED edges - model-reasoned connections that need verification._
- **What connects `MainViewModel`, `AuthState`, `Authenticated` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._