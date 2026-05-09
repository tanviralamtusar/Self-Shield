# Self-Shield — Backend Specification

## Stack
- Runtime: Node.js 20 LTS
- Framework: Express.js + TypeScript
- Database: Supabase Cloud (PostgreSQL + Auth + Storage + Realtime)
- Push Notifications: Firebase Cloud Messaging (FCM)
- Email: SendGrid (or Nodemailer for self-hosted SMTP)
- Hosting: Self-hosted VPS (Linux, Docker Compose)
- Process Manager: PM2 (inside Docker)
- Reverse Proxy: Nginx
- SSL: Let's Encrypt (Certbot)

---

## Repository Structure

```
self-shield-backend/
├── src/
│   ├── api/
│   │   ├── auth/
│   │   ├── devices/
│   │   ├── blocklists/
│   │   ├── commands/
│   │   ├── overrides/
│   │   ├── reports/
│   │   └── audit/
│   ├── services/
│   │   ├── fcm.service.ts
│   │   ├── email.service.ts
│   │   ├── blocklist.service.ts
│   │   ├── report.service.ts
│   │   └── sync.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validate.middleware.ts
│   ├── jobs/
│   │   ├── dailyReport.job.ts
│   │   └── commandCleanup.job.ts
│   ├── config/
│   │   ├── supabase.ts
│   │   └── firebase.ts
│   └── app.ts
├── prisma/ (or supabase/migrations/)
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## API Endpoints

### Auth
All endpoints require Supabase JWT in `Authorization: Bearer <token>` header.
Supabase Auth handles token issuance and verification.

```
POST   /auth/login           → Supabase email/password login
POST   /auth/logout
GET    /auth/me
```

### Devices
```
POST   /devices/pair                 → Link child device (pairing code)
GET    /devices                      → List all devices for admin
GET    /devices/:id                  → Single device info
PATCH  /devices/:id/settings         → Update device settings
DELETE /devices/:id                  → Unlink device
POST   /devices/:id/sync             → Receive sync payload from device
GET    /devices/:id/fcm-token        → Get FCM token for device
```

### Block Lists
```
GET    /blocklists                   → List all (own + subscribed + system)
POST   /blocklists                   → Create custom list
PATCH  /blocklists/:id               → Update list
DELETE /blocklists/:id
POST   /blocklists/:id/entries       → Add entries (bulk)
DELETE /blocklists/:id/entries/:eid
POST   /devices/:id/blocklists       → Subscribe device to list
DELETE /devices/:id/blocklists/:lid  → Unsubscribe
POST   /blocklists/push/:deviceId    → Push updated lists to device via FCM
```

### Remote Commands
```
POST   /commands                     → Create command (admin → device)
GET    /commands/:deviceId           → Pending commands for device (device polls)
PATCH  /commands/:id/status          → Device marks command executed/failed
```

### Emergency Overrides
```
POST   /overrides                    → Child device requests override
GET    /overrides/pending            → Admin: list pending requests
PATCH  /overrides/:id/approve        → Admin approves (sets duration)
PATCH  /overrides/:id/deny
GET    /overrides/:id/status         → Device polls status
```

### Reports & Analytics
```
GET    /reports/:deviceId/daily      → Daily report (query param: date)
GET    /reports/:deviceId/weekly     → Weekly summary
GET    /reports/:deviceId/usage      → Paginated usage_events
GET    /reports/overview             → Admin: all devices summary
```

### Audit Log
```
POST   /audit                        → Device posts audit events (batch)
GET    /audit/:deviceId              → Admin reads audit log
GET    /audit/:deviceId/screenshots  → List tamper screenshots
```

### PIN Management
```
POST   /pin/reset/:deviceId          → Admin resets device PIN (issues FCM command)
```

---

## FCM Integration

All real-time device commands use Firebase Cloud Messaging data messages (not notification messages — silent background delivery).

Message structure:
```json
{
  "to": "<fcm_token>",
  "data": {
    "command_id": "uuid",
    "type": "push_blocklist | reset_pin | approve_override | sync_request",
    "payload": "{...json...}"
  }
}
```

Device receives, processes, marks command as executed via `PATCH /commands/:id/status`.

---

## Scheduled Jobs

### Daily Report Aggregation (Cron: `0 1 * * *`)
- Aggregates `usage_events` per device for previous day
- Writes to `daily_reports` table
- Sends weekly email on Mondays via SendGrid

### Command Cleanup (Cron: `0 3 * * *`)
- Marks commands older than 7 days as `failed` if still `pending`
- Cleans override requests older than 24 hours that are still `pending`

---

## Security

- All endpoints protected with Supabase JWT validation
- Row-Level Security enforced at database layer
- Rate limiting: 100 req/min per IP (express-rate-limit)
- Input validation: Zod schemas on all POST/PATCH bodies
- PIN stored as bcrypt hash (rounds: 12)
- Screenshot uploads use Supabase Storage signed URLs (expire 1 hour)
- CORS: restricted to dashboard domain and mobile app origin

---

## Environment Variables

```env
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
FIREBASE_SERVICE_ACCOUNT_JSON=...
SENDGRID_API_KEY=...
ADMIN_EMAIL=...
JWT_SECRET=...
CORS_ORIGIN=https://dashboard.selfshield.app
```

---

## Docker Compose

```yaml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - api
    restart: always
```

---

## Deployment Flow

1. Push to `main` branch
2. GitHub Actions builds Docker image
3. SSH into VPS, pull new image, `docker compose up -d`
4. Nginx proxies HTTPS → Node.js on port 3000
5. Health check: `GET /health` returns `200 OK`
