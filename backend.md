# Self-Shield — Backend Architecture

## Overview
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Hosting:** Self-hosted server (Docker)
- **Auth:** Supabase Auth (email/password)
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **Email:** Nodemailer + SMTP (self-hosted) or Resend
- **Realtime:** Supabase Realtime channels
- **File Storage:** Supabase Storage (tamper screenshots)
- **Job Queue:** Bull (Redis-backed) for async jobs
- **Cache:** Redis
- **Validation:** Zod
- **Logging:** Winston + daily rotate

## Architecture Pattern

Client (Android App)
│
▼
[Express API Server]
│
┌────┴────┐
│ │
Supabase Redis
(DB+Auth) (Cache+Queue)
│
FCM / Email (alerts)

## Directory Structure

self-shield-backend/
├── src/
│ ├── api/
│ │ ├── routes/
│ │ │ ├── auth.routes.ts
│ │ │ ├── devices.routes.ts
│ │ │ ├── profiles.routes.ts
│ │ │ ├── blocklist.routes.ts
│ │ │ ├── rules.routes.ts
│ │ │ ├── stats.routes.ts
│ │ │ ├── tamper.routes.ts
│ │ │ ├── focus.routes.ts
│ │ │ ├── override.routes.ts
│ │ │ └── sync.routes.ts
│ │ ├── middleware/
│ │ │ ├── auth.middleware.ts
│ │ │ ├── rateLimit.middleware.ts
│ │ │ ├── validate.middleware.ts
│ │ │ ├── deviceAuth.middleware.ts
│ │ │ └── error.middleware.ts
│ │ └── controllers/
│ │ ├── auth.controller.ts
│ │ ├── devices.controller.ts
│ │ ├── blocklist.controller.ts
│ │ ├── rules.controller.ts
│ │ ├── stats.controller.ts
│ │ ├── tamper.controller.ts
│ │ ├── focus.controller.ts
│ │ └── override.controller.ts
│ ├── services/
│ │ ├── supabase.service.ts
│ │ ├── fcm.service.ts
│ │ ├── email.service.ts
│ │ ├── sync.service.ts
│ │ ├── blocklist.service.ts
│ │ └── tamper.service.ts
│ ├── jobs/
│ │ ├── dailyReport.job.ts
│ │ ├── pushRules.job.ts
│ │ └── cleanupLogs.job.ts
│ ├── config/
│ │ ├── env.ts
│ │ ├── supabase.ts
│ │ ├── redis.ts
│ │ └── fcm.ts
│ ├── types/
│ │ └── index.ts
│ └── app.ts
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── package.json

## API Endpoints

### Auth

POST /api/v1/auth/register # Admin register
POST /api/v1/auth/login # Admin login
POST /api/v1/auth/logout # Logout
POST /api/v1/auth/refresh # Refresh token
POST /api/v1/auth/pin/verify # Verify admin PIN
PUT /api/v1/auth/pin/change # Change admin PIN
POST /api/v1/auth/pin/reset # Remote PIN reset

### Devices

POST /api/v1/devices/register # Register new device
GET /api/v1/devices # List all devices (admin)
GET /api/v1/devices/:id # Get device detail
PUT /api/v1/devices/:id # Update device
DELETE /api/v1/devices/:id # Remove device
POST /api/v1/devices/:id/push-rules # Push rules to device now
GET /api/v1/devices/:id/status # Get device last seen + status

### Block Lists

GET /api/v1/blocklist # Get full block list
POST /api/v1/blocklist # Add rule
PUT /api/v1/blocklist/:id # Update rule
DELETE /api/v1/blocklist/:id # Remove rule
POST /api/v1/blocklist/bulk # Bulk add rules
GET /api/v1/blocklist/categories # Get category presets
POST /api/v1/blocklist/push # Push list to all devices

### Rules (App/Timer/Focus rules)

GET /api/v1/rules/:deviceId # Get all rules for device
POST /api/v1/rules # Create rule
PUT /api/v1/rules/:id # Update rule
DELETE /api/v1/rules/:id # Delete rule

### Stats

POST /api/v1/stats/sync # Device pushes usage stats
GET /api/v1/stats/:deviceId # Get stats for device
GET /api/v1/stats/:deviceId/daily # Daily report
GET /api/v1/stats/summary # All devices summary (admin)

### Tamper Events
POST /api/v1/tamper/report # Device reports tamper event
GET /api/v1/tamper/:deviceId # Get tamper log
POST /api/v1/tamper/screenshot # Upload tamper screenshot

### Focus
POST /api/v1/focus/start # Start focus session
POST /api/v1/focus/end # End focus session
GET /api/v1/focus/history # Focus history

### Override
POST /api/v1/override/request # Child requests override
GET /api/v1/override/pending # Admin sees pending requests
POST /api/v1/override/:id/approve # Admin approves
POST /api/v1/override/:id/deny # Admin denies

### Sync
POST /api/v1/sync/pull # Device pulls latest config
POST /api/v1/sync/push # Device pushes usage data
GET /api/v1/sync/version # Check if update needed

## Realtime (Supabase Channels)

Channel: device:{deviceId}

rules_updated → device pulls new rules immediately
focus_command → start/stop focus session remotely
override_response → admin approved/denied override
alert_ack → admin acknowledged tamper alert
Channel: admin:{adminId}

tamper_alert → real-time tamper notification
override_request → child requested emergency override
device_offline → device hasn't synced in threshold

## Security
- JWT auth on all routes
- Device-specific API tokens (separate from admin JWT)
- Rate limiting: 100 req/min per IP
- Helmet.js security headers
- CORS whitelist
- Input validation (Zod) on all inputs
- SQL injection prevention (Supabase parameterized)
- Screenshot upload: validate mime type + size limit 2MB
- API versioning (/api/v1/)

## FCM Push Notification Types

tamper_detected - admin alert, high priority
override_approved - child device alert
override_denied - child device alert
rules_updated - silent push, trigger sync
focus_start - silent push
daily_report - daily summary push

## Daily Report Job (Cron)
- Runs at 11:59 PM per device timezone
- Aggregates: screen time, blocks triggered, top apps
- Stores in daily_reports table
- Sends push + email to admin

## Docker Setup
```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
    depends_on: [redis]
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on: [api]
    restart: unless-stopped
    
---