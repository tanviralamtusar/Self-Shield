# Self-Shield — Security Specification

## Threat Model

| Threat | Actor | Severity | Defense |
|---|---|---|---|
| Uninstall the app | User / child | Critical | Device Admin + Accessibility overlay |
| Disable Accessibility Service | User | Critical | Accessibility inaccessible from app settings (blocked), persistent alert |
| Disable VPN | User | Critical | VPN non-dismissible, watchdog restarts |
| Boot into Safe Mode | User | Critical | Device Owner disables Safe Mode (API 23+), detect and alert (API 21-22) |
| Connect ADB / USB debugging | User | High | Detect + alert admin, log event |
| Factory reset device | User | High | Device Owner FRP policy (API 29+), cloud backup of audit log |
| Guess admin PIN | User | High | Bcrypt hash, 5-attempt lockout (10 min), alert admin |
| Disable Device Admin | User | High | Cannot disable without PIN; PIN is only resettable by admin remotely |
| Root device | Advanced user | Medium | Root detection → log + alert (no full defense — documented limitation) |
| Bypass VPN via alternative network | User | Medium | VPN covers all system traffic; user cannot disable without PIN |
| Install VPN bypass app | User | Medium | Monitor new app installs, alert admin |

---

## PIN Security

- Stored as: `bcrypt(pin, 12 rounds)` — never plaintext
- 4–8 digit numeric PIN
- Secret question/answer: `bcrypt(answer.toLowerCase().trim())`
- Biometric: stored in Android Keystore, unlocks app session only (not used for remote auth)
- 5 wrong attempts: 10-minute lockout + alert to admin
- No local PIN reset — admin dashboard only (FCM command)

---

## Data Encryption

| Data | Encryption |
|---|---|
| Room local database | SQLCipher AES-256 |
| SharedPreferences (tokens, PIN hash) | EncryptedSharedPreferences (AES-256-GCM) |
| Network traffic (API) | TLS 1.2+ (enforced via OkHttp CertificatePinner) |
| Keyword list | Encrypted in Room |
| Supabase cloud data | Supabase-managed AES-256 at rest |
| Screenshots (tamper) | Supabase Storage private bucket |

---

## Network Security

- Certificate pinning: OkHttp `CertificatePinner` for backend API domain
- All API calls use HTTPS only — cleartext traffic disabled in `network_security_config.xml`
- Supabase JWT validated on every request (backend middleware)
- Rate limiting: 100 req/min per IP, 10 req/min for auth endpoints
- CORS: restricted to dashboard domain

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
</network-security-config>
```

---

## Anti-Tamper Measures

### Layer 1 — Device Admin
- Registered as Device Admin
- `onDisableRequested()` returns blocking message
- If somehow disabled: log event + FCM alert to admin

### Layer 2 — Accessibility Service Persistence
- Service declared with `android:persistent="true"` (where supported)
- If disabled by user: persistent foreground notification "Re-enable Self-Shield protection"
- Watchdog checks every 60s, cannot re-enable programmatically (OS restriction), but alerts immediately

### Layer 3 — Uninstall Intercept
- Accessibility monitors `PackageInstaller` and Play Store uninstall flows
- Full-screen overlay blocks confirmation step

### Layer 4 — Settings Page Block
- Accessibility monitors navigation to Self-Shield's own settings page in system Settings
- Overlay blocks the page

### Layer 5 — App Kill Intercept
- Recent apps swipe-to-close: foreground services survive
- `START_STICKY` restart policy
- Watchdog restarts VPN/Accessibility check on a 60s cycle

### Layer 6 — Root Detection
```kotlin
fun isRooted(): Boolean {
    return checkBuildTags() || checkSuBinary() || checkSuperuserApk()
}
```
On root detected: log audit event + FCM alert to admin. (Cannot block a rooted device — this is documented as a limitation.)

### Layer 7 — Integrity Check
- App signing verified at startup (compare signing certificate hash)
- If APK was modified/re-signed: refuse to start + alert

---

## VPN Security

- Local VPN only — no traffic leaves device through Self-Shield servers
- VPN interface does NOT decrypt HTTPS traffic — only reads SNI hostname
- No MITM — this is a DNS/hostname filter, not a proxy
- VPN cannot be disabled from Android VPN settings (marked as always-on if Device Owner)

```kotlin
// Mark VPN as always-on (Device Owner required)
dpm.setAlwaysOnVpnPackage(componentName, packageName, lockdownEnabled = true)
```

---

## Supabase Row-Level Security

All tables have RLS enabled. Key rules:
- Admins can only read/write their own devices
- Audit logs readable by admin of the device only
- Block lists readable by device's admin only
- `override_requests` readable by device owner + admin only
- System block lists (is_public = true) readable by all authenticated users

---

## Screenshot on Tamper

On uninstall attempt, ADB detected, or admin settings accessed:
1. Capture screen via `MediaProjection` (requires one-time permission during onboarding)
2. Save to Supabase Storage (`tamper-screenshots` bucket, private)
3. Signed URL generated (1-hour expiry) for admin to view in dashboard

---

## Secrets Management

- No secrets in source code — all in `.env` (gitignored)
- `.env.example` committed with placeholder values
- Production secrets managed on VPS via Docker env vars
- Supabase service role key: backend only, never in Android app
- Android uses Supabase anon key (RLS-protected) — stored in `BuildConfig` (obfuscated via R8/ProGuard)

---

## ProGuard / R8 Obfuscation

```proguard
# Keep FCM and Accessibility service classes
-keep class com.selfshield.service.** { *; }
-keep class com.selfshield.admin.** { *; }

# Obfuscate everything else
-dontskipnonpubliclibraryclasses
-optimizations !code/simplification/arithmetic
```

---

## Known Limitations (Documented)

1. **Rooted devices**: Full bypass possible. Detect + alert, but cannot prevent.
2. **Android 5.0–5.1 Safe Mode**: Cannot block, only detect.
3. **Factory reset on API < 29**: App is removed (Device Owner FRP requires API 29+).
4. **WhatsApp structural changes**: In-app blocking may break on major WhatsApp updates. Mitigated by server-side pattern updates.
5. **Second VPN conflict**: Android allows only one VPN at a time — if user enables another VPN, ours is disconnected. Detect this and alert.
