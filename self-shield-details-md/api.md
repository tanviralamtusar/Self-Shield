# Self-Shield — API Reference

## Base URL
```
Production: https://api.yourdomain.com/v1
Development: http://localhost:3000/v1
```

## Authentication
All endpoints require:
```
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

## Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```
Error response:
```json
{
  "success": false,
  "data": null,
  "error": { "code": "UNAUTHORIZED", "message": "Invalid token" }
}
```

---

## Auth

### POST /auth/login
Supabase-handled. Use Supabase JS client directly:
```typescript
supabase.auth.signInWithPassword({ email, password })
```

### GET /auth/me
Returns current user profile.

**Response:**
```json
{
  "id": "uuid",
  "role": "admin",
  "display_name": "Ahmad",
  "email": "admin@email.com"
}
```

---

## Devices

### GET /devices
Returns all devices linked to authenticated admin.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "device_name": "Ahmad's Phone",
      "android_version": 33,
      "app_version": "1.0.0",
      "is_device_owner": true,
      "is_admin_active": true,
      "last_seen_at": "2025-01-15T10:30:00Z",
      "vpn_enabled": true
    }
  ]
}
```

### POST /devices/pair
Link a new child device.

**Request:**
```json
{ "pairing_code": "482910" }
```

**Response:** Device object with FCM token saved.

### PATCH /devices/:id/settings
Update device settings remotely.

**Request:**
```json
{
  "vpn_enabled": true,
  "keyword_blocking": false,
  "theme": "dark"
}
```

### DELETE /devices/:id
Unlink device. Removes pairing and FCM token.

### POST /devices/:id/sync
Called by device to upload a sync payload.

**Request:**
```json
{
  "usage_events": [...],
  "audit_events": [...],
  "device_info": {
    "android_version": 33,
    "app_version": "1.0.0",
    "is_device_owner": true,
    "vpn_running": true,
    "accessibility_running": true
  }
}
```

---

## Block Lists

### GET /blocklists
Returns all block lists visible to the admin (own + system/public).

### POST /blocklists
Create a new custom block list.

**Request:**
```json
{
  "name": "My Custom List",
  "type": "hostname",
  "category": "custom"
}
```

### POST /blocklists/:id/entries
Add entries in bulk.

**Request:**
```json
{
  "entries": [
    { "value": "example.com", "is_regex": false },
    { "value": "*.gambling.io", "is_regex": false }
  ]
}
```

### POST /blocklists/push/:deviceId
Push updated block lists to a specific device via FCM.

**Request:**
```json
{ "list_ids": ["uuid1", "uuid2"] }
```

**Response:**
```json
{ "command_id": "uuid", "status": "sent" }
```

---

## Remote Commands

### POST /commands
Create a remote command for a device.

**Request:**
```json
{
  "device_id": "uuid",
  "command_type": "push_blocklist",
  "payload": { "list_version": 5 }
}
```

Command types:
- `push_blocklist` — trigger block list sync
- `reset_pin` — device shows PIN reset prompt
- `approve_override` — grant temporary override
- `update_app_rules` — push updated app rules
- `sync_request` — request full sync
- `lock_device` — activate kiosk lock

### GET /commands/:deviceId
Poll pending commands (called by device).

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "command_type": "push_blocklist",
      "payload": { "list_version": 5 },
      "created_at": "..."
    }
  ]
}
```

### PATCH /commands/:id/status
Device marks command as executed or failed.

**Request:**
```json
{ "status": "executed" }
```

---

## Emergency Overrides

### POST /overrides
Child device requests override.

**Request:**
```json
{
  "device_id": "uuid",
  "reason": "Need to check school app"
}
```

### GET /overrides/pending
Admin gets all pending override requests.

### PATCH /overrides/:id/approve
Admin approves override.

**Request:**
```json
{ "duration_min": 15 }
```

This automatically creates an `approve_override` FCM command.

### PATCH /overrides/:id/deny
Admin denies override. Device shows "Override denied by admin."

### GET /overrides/:id/status
Device polls for override status.

**Response:**
```json
{
  "status": "approved",
  "duration_min": 15,
  "expires_at": "2025-01-15T11:00:00Z"
}
```

---

## Reports

### GET /reports/:deviceId/daily?date=2025-01-15
Returns daily report for a device.

**Response:**
```json
{
  "date": "2025-01-15",
  "total_screen_sec": 15720,
  "blocks_triggered": 12,
  "keywords_blocked": 3,
  "top_apps": [
    { "package": "com.google.android.youtube", "name": "YouTube", "seconds": 5400, "blocks": 5 }
  ],
  "top_blocked_sites": [
    { "hostname": "pornhub.com", "count": 8 }
  ],
  "focus_sessions_count": 2,
  "focus_total_min": 50
}
```

### GET /reports/:deviceId/weekly?start=2025-01-13
Returns 7-day aggregated report.

### GET /reports/overview
Admin overview: all devices combined stats.

---

## Audit Log

### POST /audit
Device uploads audit events in batch.

**Request:**
```json
{
  "device_id": "uuid",
  "events": [
    {
      "event_type": "uninstall_attempt",
      "details": { "target_package": "com.selfshield.app" },
      "screenshot_url": "https://supabase.co/storage/...",
      "occurred_at": "2025-01-15T09:45:00Z"
    }
  ]
}
```

### GET /audit/:deviceId?type=uninstall_attempt&limit=50&offset=0
Paginated audit log for a device.

---

## PIN Management

### POST /pin/reset/:deviceId
Admin triggers PIN reset on a device.

No request body needed. Authenticated as admin.

Creates FCM command `reset_pin` to device. Device will prompt user to set a new PIN on next unlock.

---

## Health Check

### GET /health
No authentication required.

**Response:** `200 OK`
```json
{ "status": "ok", "uptime": 3600 }
```
