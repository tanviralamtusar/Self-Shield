# Self-Shield — Database Structure (Supabase / PostgreSQL)

## Overview
- Database: Supabase Cloud (PostgreSQL)
- Local device: SQLite (Room) for offline-first operation
- Sync: device → Supabase when online
- All sensitive data (PINs, keywords) encrypted before storage

---

## Tables

### `users`
Supabase Auth handles authentication. This table extends auth.users.

```sql
CREATE TABLE users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id),
  role         TEXT NOT NULL CHECK (role IN ('admin', 'child')),
  display_name TEXT,
  email        TEXT,
  admin_id     UUID REFERENCES users(id),  -- null if admin
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

---

### `devices`
One row per Android device.

```sql
CREATE TABLE devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES users(id),
  admin_id        UUID NOT NULL REFERENCES users(id),
  device_name     TEXT,
  pairing_code    TEXT UNIQUE,         -- 6-digit, expires after use
  fcm_token       TEXT,                -- Firebase Cloud Messaging token
  android_version INTEGER,
  app_version     TEXT,
  is_device_owner BOOLEAN DEFAULT false,
  is_admin_active BOOLEAN DEFAULT false,
  last_seen_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

### `block_lists`
Named block lists (can be default, custom, or community).

```sql
CREATE TABLE block_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID REFERENCES users(id),  -- null = system/community list
  name        TEXT NOT NULL,
  type        TEXT CHECK (type IN ('hostname', 'app_package', 'keyword')),
  category    TEXT,  -- 'porn', 'gambling', 'lgbtq', 'islamophobic', 'custom'
  is_default  BOOLEAN DEFAULT false,
  is_public   BOOLEAN DEFAULT false,
  version     INTEGER DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### `block_list_entries`
Individual entries in a block list.

```sql
CREATE TABLE block_list_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_list_id UUID NOT NULL REFERENCES block_lists(id) ON DELETE CASCADE,
  value         TEXT NOT NULL,    -- hostname, package name, or keyword
  is_regex      BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON block_list_entries(block_list_id);
CREATE INDEX ON block_list_entries(value);
```

---

### `device_block_list_subscriptions`
Which block lists are active on which device.

```sql
CREATE TABLE device_block_list_subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  block_list_id UUID NOT NULL REFERENCES block_lists(id) ON DELETE CASCADE,
  is_enabled    BOOLEAN DEFAULT true,
  synced_at     TIMESTAMPTZ,
  UNIQUE (device_id, block_list_id)
);
```

---

### `app_rules`
Per-app blocking rules on a device.

```sql
CREATE TABLE app_rules (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id         UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  package_name      TEXT NOT NULL,
  app_name          TEXT,
  is_blocked        BOOLEAN DEFAULT false,
  is_uninstall_protected BOOLEAN DEFAULT false,
  inapp_block_reels BOOLEAN DEFAULT false,
  inapp_block_shorts BOOLEAN DEFAULT false,
  inapp_block_status BOOLEAN DEFAULT false,
  inapp_block_channels BOOLEAN DEFAULT false,
  inapp_block_feed  BOOLEAN DEFAULT false,
  schedule_enabled  BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (device_id, package_name)
);
```

---

### `app_schedules`
Time-range based blocking schedules per app rule.

```sql
CREATE TABLE app_schedules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_rule_id UUID NOT NULL REFERENCES app_rules(id) ON DELETE CASCADE,
  day_of_week INTEGER[] NOT NULL,  -- 0=Sun, 1=Mon ... 6=Sat
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### `focus_sessions`
Focus mode session records.

```sql
CREATE TABLE focus_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  ended_early_at  TIMESTAMPTZ,
  duration_min    INTEGER NOT NULL,
  whitelist_apps  TEXT[],          -- package names allowed during session
  quran_prompt    TEXT,
  pomodoro_work   INTEGER,         -- minutes
  pomodoro_break  INTEGER,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

### `usage_events`
Raw usage tracking events (append-only).

```sql
CREATE TABLE usage_events (
  id          BIGSERIAL PRIMARY KEY,
  device_id   UUID NOT NULL REFERENCES devices(id),
  event_type  TEXT NOT NULL CHECK (event_type IN (
                'app_open', 'app_close', 'site_visit',
                'block_triggered', 'keyword_blocked',
                'focus_start', 'focus_end'
              )),
  target      TEXT,               -- package name or hostname
  duration_sec INTEGER,
  occurred_at TIMESTAMPTZ NOT NULL,
  synced_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON usage_events(device_id, occurred_at);
CREATE INDEX ON usage_events(event_type);
```

---

### `audit_log`
Tamper and security events (append-only, immutable).

```sql
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  device_id       UUID NOT NULL REFERENCES devices(id),
  event_type      TEXT NOT NULL CHECK (event_type IN (
                    'uninstall_attempt', 'adb_detected', 'safe_mode_boot',
                    'wrong_pin', 'vpn_killed', 'admin_settings_access',
                    'factory_reset_attempt', 'app_kill_attempt'
                  )),
  details         JSONB,
  screenshot_url  TEXT,           -- Supabase Storage URL
  occurred_at     TIMESTAMPTZ NOT NULL,
  synced_at       TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON audit_log(device_id, occurred_at);
```

---

### `remote_commands`
Commands pushed from admin dashboard to device via FCM.

```sql
CREATE TABLE remote_commands (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id    UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  command_type TEXT NOT NULL CHECK (command_type IN (
                 'push_blocklist', 'reset_pin', 'approve_override',
                 'update_app_rules', 'sync_request', 'lock_device'
               )),
  payload      JSONB,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'executed', 'failed')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  executed_at  TIMESTAMPTZ
);
CREATE INDEX ON remote_commands(device_id, status);
```

---

### `override_requests`
Emergency override requests from child device to admin.

```sql
CREATE TABLE override_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  reason        TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  approved_by   UUID REFERENCES users(id),
  duration_min  INTEGER DEFAULT 15,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  resolved_at   TIMESTAMPTZ
);
```

---

### `daily_reports`
Pre-aggregated daily reports per device.

```sql
CREATE TABLE daily_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id           UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  report_date         DATE NOT NULL,
  total_screen_sec    INTEGER DEFAULT 0,
  blocks_triggered    INTEGER DEFAULT 0,
  keywords_blocked    INTEGER DEFAULT 0,
  top_apps            JSONB,   -- [{package, seconds, blocks}]
  top_blocked_sites   JSONB,   -- [{hostname, count}]
  focus_sessions_count INTEGER DEFAULT 0,
  focus_total_min     INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE (device_id, report_date)
);
```

---

### `device_settings`
Per-device configuration flags.

```sql
CREATE TABLE device_settings (
  device_id               UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
  vpn_enabled             BOOLEAN DEFAULT true,
  accessibility_enabled   BOOLEAN DEFAULT true,
  keyword_blocking        BOOLEAN DEFAULT true,
  inapp_blocking          BOOLEAN DEFAULT true,
  focus_mode_active       BOOLEAN DEFAULT false,
  theme                   TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  admin_pin_hash          TEXT,       -- bcrypt hash
  pin_secret_question     TEXT,
  pin_secret_answer_hash  TEXT,
  biometric_enabled       BOOLEAN DEFAULT false,
  updated_at              TIMESTAMPTZ DEFAULT now()
);
```

---

## Local SQLite Schema (Room — Android)

Mirrors the Supabase schema with these additions:
- `sync_status` column on every table: `'synced' | 'pending' | 'conflict'`
- `local_id` integer primary key (auto-increment) for offline use
- `remote_id` UUID nullable — populated after successful sync
- Encrypted using SQLCipher (AES-256)

---

## Row-Level Security (RLS) Policies

```sql
-- Users can only read their own data
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_owns_devices" ON devices
  USING (admin_id = auth.uid() OR owner_id = auth.uid());

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_reads_audit" ON audit_log
  USING (device_id IN (SELECT id FROM devices WHERE admin_id = auth.uid()));

-- Similar policies on all tables
```

---

## Supabase Storage Buckets

| Bucket | Purpose | Access |
|---|---|---|
| `tamper-screenshots` | Screenshots on breach events | Admin only (private) |
| `block-list-exports` | Exported JSON block lists | Admin (private) |
| `audit-backups` | Pre-factory-reset audit dumps | Admin only (private) |
