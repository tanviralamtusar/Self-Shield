# Self-Shield — Deployment Guide

## Infrastructure Overview

```
┌─────────────────────────────────────┐
│  VPS (Ubuntu 22.04)                 │
│  - Nginx (reverse proxy + SSL)      │
│  - Docker Compose                   │
│    ├── Node.js API (port 3000)      │
│    └── (future: Redis for sessions) │
├─────────────────────────────────────┤
│  Supabase Cloud (managed)           │
│  - PostgreSQL                       │
│  - Auth                             │
│  - Storage                          │
│  - Realtime                         │
├─────────────────────────────────────┤
│  Vercel (or self-hosted)            │
│  - Next.js Dashboard                │
├─────────────────────────────────────┤
│  Firebase                           │
│  - Cloud Messaging (FCM)            │
└─────────────────────────────────────┘
```

---

## VPS Setup (One-Time)

```bash
# Ubuntu 22.04 — minimum: 1 vCPU, 1GB RAM, 20GB SSD

# Update
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Install Nginx
sudo apt install nginx -y

# Firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## Nginx Configuration

`/etc/nginx/sites-available/selfshield-api`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/selfshield-api /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.yourdomain.com
sudo nginx -t && sudo systemctl reload nginx
```

---

## Backend Deployment

```bash
# First deploy
git clone https://github.com/your-org/self-shield-backend.git
cd self-shield-backend
cp .env.example .env
nano .env  # fill all values

docker compose up -d
docker compose logs -f  # verify startup

# Subsequent deploys
git pull origin main
docker compose up -d --build
```

`docker-compose.yml`:
```yaml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## Web Dashboard Deployment (Vercel)

```bash
cd self-shield-web
npx vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# NEXT_PUBLIC_API_URL
```

Or self-hosted on same VPS:
```bash
npm run build
PORT=3001 npm start
# Nginx proxy: dashboard.yourdomain.com → localhost:3001
```

---

## Android App — Play Store Release

1. Generate release keystore (one-time):
```bash
keytool -genkey -v -keystore selfshield.keystore \
  -alias selfshield -keyalg RSA -keysize 2048 -validity 10000
```

2. Store in `~/.gradle/gradle.properties`:
```
SELFSHIELD_KEYSTORE_PATH=/path/to/selfshield.keystore
SELFSHIELD_KEYSTORE_PASSWORD=...
SELFSHIELD_KEY_ALIAS=selfshield
SELFSHIELD_KEY_PASSWORD=...
```

3. Build release:
```bash
./gradlew bundleRelease  # .aab for Play Store
./gradlew assembleRelease  # .apk for GitHub
```

4. Play Store setup:
   - App category: Tools or Parental Control
   - Content rating: complete IARC questionnaire
   - Target audience: Parental Controls / Self-Improvement
   - Feature graphic + screenshots required (min 2 phone screenshots)
   - Privacy policy URL required (host a simple one)

---

## GitHub Actions Secrets Required

Set in each repo's Settings → Secrets:

**Android repo:**
```
KEYSTORE_BASE64          # base64 encoded keystore file
KEYSTORE_PASSWORD
KEY_ALIAS
KEY_PASSWORD
SUPABASE_ANON_KEY
API_BASE_URL
```

**Backend repo:**
```
VPS_HOST
VPS_USER
VPS_SSH_KEY             # private key for SSH deploy
SUPABASE_SERVICE_ROLE_KEY
FIREBASE_SERVICE_ACCOUNT_JSON
SENDGRID_API_KEY
```

**Web repo:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL
```

---

## Monitoring & Logs

```bash
# View API logs
docker compose logs -f api

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Container health
docker compose ps

# Restart if needed
docker compose restart api
```

Recommended additions (future):
- Uptime monitoring: UptimeRobot (free tier, ping `/health` every 5 min)
- Error tracking: Sentry (Node.js + Next.js SDK)
- Log aggregation: Grafana Loki (self-hosted) or Logtail

---

## Backup Strategy

| Data | Backup Method | Frequency |
|---|---|---|
| Supabase PostgreSQL | Supabase auto-backups (cloud) | Daily (7-day retention) |
| Supabase Storage | Supabase auto-backups | Daily |
| VPS config files (.env, nginx.conf) | Manual backup to secure storage | On every change |
| Android keystore | Encrypted copy in secure storage | One-time + after rotation |
