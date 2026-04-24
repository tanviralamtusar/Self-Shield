# Self-Shield — Setup & Development Instructions

## Prerequisites

### Development Machine
- OS: macOS, Linux, or Windows (WSL2 recommended for Windows)
- Android Studio: Hedgehog (2023.1.1) or newer
- JDK: 17 (via Android Studio or standalone)
- Node.js: 20 LTS
- Docker + Docker Compose
- Git

### Accounts Required
- Supabase account (supabase.com) — create a new project
- Firebase project (console.firebase.google.com) — for FCM
- SendGrid account (sendgrid.com) — for email alerts
- Google Play Developer account (if publishing)
- GitHub account

---

## 1. Supabase Setup

1. Create project at supabase.com
2. Go to **SQL Editor** → run migrations from `self-shield-backend/supabase/migrations/` in order
3. Go to **Authentication** → enable Email/Password provider
4. Go to **Storage** → create buckets: `tamper-screenshots`, `block-list-exports`, `audit-backups`
5. Set all buckets to **private**
6. Copy: **Project URL**, **anon key**, **service_role key**

---

## 2. Firebase Setup

1. Create project at console.firebase.google.com
2. Add Android app with package name `com.selfshield.app`
3. Download `google-services.json` → place in `self-shield-android/app/`
4. Enable **Cloud Messaging** in Firebase project settings
5. Download **Service Account JSON** for backend FCM server calls

---

## 3. Backend Setup

```bash
git clone https://github.com/your-org/self-shield-backend.git
cd self-shield-backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
SENDGRID_API_KEY=SG.xxxxxxx
ADMIN_EMAIL=admin@yourapp.com
CORS_ORIGIN=https://your-dashboard-domain.com
```

### Local Development
```bash
npm install
npm run dev          # ts-node-dev hot reload on port 3000
```

### Production Deploy (VPS)
```bash
# On VPS (Ubuntu 22.04):
git clone ... && cd self-shield-backend
cp .env.example .env && nano .env  # fill values
docker compose up -d
# Nginx config in nginx.conf proxies :443 → :3000
# Certbot: certbot --nginx -d api.yourdomain.com
```

---

## 4. Web Dashboard Setup

```bash
git clone https://github.com/your-org/self-shield-web.git
cd self-shield-web
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

```bash
npm install
npm run dev          # runs on http://localhost:3001
```

### Production Build
```bash
npm run build
npm start
# or deploy to Vercel: vercel --prod
```

---

## 5. Android App Setup

1. Open `self-shield-android/` in Android Studio
2. Place `google-services.json` in `app/` directory
3. Create `app/src/main/res/values/secrets.xml`:
```xml
<resources>
    <string name="supabase_url">https://xxxx.supabase.co</string>
    <string name="supabase_anon_key">your_anon_key</string>
    <string name="api_base_url">https://api.yourdomain.com</string>
</resources>
```
4. Sync Gradle
5. Run on a physical device (emulator has VPN limitations)

### Build Release APK
```bash
cd self-shield-android
./gradlew assembleRelease
# Signed APK at: app/build/outputs/apk/release/app-release.apk
```

Set up signing in `app/build.gradle`:
```groovy
signingConfigs {
    release {
        storeFile file(KEYSTORE_PATH)
        storePassword KEYSTORE_PASSWORD
        keyAlias KEY_ALIAS
        keyPassword KEY_PASSWORD
    }
}
```
Store keystore credentials in `~/.gradle/gradle.properties` (never in repo).

---

## 6. Device Owner Provisioning (Strongest Protection)

**Option A: QR Code at First Boot (Recommended)**

1. Factory reset the target Android device
2. On the "Welcome" screen, tap the screen 6 times
3. The device will open a QR code scanner
4. Provide the DPC QR code (generated from our provisioning tool)
5. Device Owner is set automatically

**Option B: ADB (One-Time, Development)**

```bash
adb shell dpm set-device-owner com.selfshield.app/.admin.SelfShieldDeviceAdminReceiver
```

This only works on a device with no Google accounts added.

---

## 7. GitHub Actions CI/CD

### Android Build (`.github/workflows/android.yml`)
```yaml
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17' }
      - run: ./gradlew assembleDebug testDebugUnitTest lintDebug
```

### Release APK (`.github/workflows/release.yml`)
```yaml
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - ... build + sign APK ...
      - uses: actions/upload-release-asset@v1
```

### Backend Deploy (`.github/workflows/backend-deploy.yml`)
```yaml
on:
  push:
    branches: [main]
    paths: ['self-shield-backend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - SSH into VPS
      - git pull
      - docker compose up -d --build
```

---

## 8. Running Tests

### Android
```bash
./gradlew testDebugUnitTest          # unit tests
./gradlew connectedDebugAndroidTest  # instrumented (requires device)
```

### Backend
```bash
npm test           # Jest
npm run test:cov   # with coverage report
```

### Web
```bash
npm test           # Jest + RTL
npx playwright test  # E2E
```

---

## 9. Database Migrations

All migrations in `supabase/migrations/` named `YYYYMMDD_description.sql`.

Apply locally:
```bash
npx supabase db push --project-ref your-project-ref
```

---

## 10. First Admin Account Setup

1. Go to web dashboard `/login`
2. Use Supabase dashboard to create first user manually:
   - Supabase → Authentication → Users → Invite user
3. Set role to `admin` in `users` table:
   ```sql
   INSERT INTO users (id, role, display_name, email)
   VALUES ('<auth.users id>', 'admin', 'Admin', 'admin@email.com');
   ```
4. Log in to dashboard with that email/password
5. Pair first Android device using device pairing code

---

## 11. Pairing an Android Device

1. In web dashboard: Devices → "+ Add Device" → generates 6-digit pairing code (expires 10 min)
2. On Android device: open Self-Shield → Onboarding → "Pair with admin dashboard"
3. Enter 6-digit code → device linked
4. Admin can now push rules to that device
