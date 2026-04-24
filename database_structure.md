# Self-Shield — Database Structure (Supabase/PostgreSQL)

## Tables

### users
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  pin_hash      TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin', -- 'admin'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

### devices

CREATE TABLE devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  device_name     TEXT NOT NULL,
  device_token    TEXT UNIQUE NOT NULL, -- for API auth
  fcm_token       TEXT,
  android_version INTEGER,
  app_version     TEXT,
  is_device_owner BOOLEAN DEFAULT FALSE,
  last_seen       TIMESTAMPTZ,
  is_online       BOOLEAN DEFAULT FALSE,
  profile_type    TEXT DEFAULT 'child', -- 'admin' | 'child'
  timezone        TEXT DEFAULT 'UTC',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

### block_rules

CREATE TABLE block_rules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  device_id     UUID REFERENCES devices(id) ON DELETE CASCADE,
  -- NULL device_id = applies to all devices under admin
  rule_type     TEXT NOT NULL,
  -- 'hostname' | 'app_package' | 'keyword' | 'category'
  -- 'whatsapp_control' | 'inapp_block' | 'focus_whitelist'
  value         TEXT NOT NULL,
  is_enabled    BOOLEAN DEFAULT TRUE,
  is_whitelist  BOOLEAN DEFAULT FALSE,
  category      TEXT,
  -- 'adult' | 'gambling' | 'lgbtq' | 'islamophobic'
  -- 'social' | 'streaming' | 'custom'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_block_rules_admin ON block_rules(admin_id);
CREATE INDEX idx_block_rules_device ON block_rules(device_id);
CREATE INDEX idx_block_rules_type ON block_rules(rule_type);

### block_events

CREATE TABLE block_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID REFERENCES devices(id) ON DELETE CASCADE,
  rule_id       UUID REFERENCES block_rules(id) ON DELETE SET NULL,
  blocked_value TEXT NOT NULL, -- what was blocked (url, app, keyword)
  block_type    TEXT NOT NULL, -- 'dns' | 'app' | 'keyword' | 'inapp'
  triggered_at  TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_block_events_device ON block_events(device_id);
CREATE INDEX idx_block_events_time ON block_events(triggered_at);

### app_usage

CREATE TABLE app_usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  package_name    TEXT NOT NULL,
  app_name        TEXT,
  usage_date      DATE NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  open_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, package_name, usage_date)
);

CREATE INDEX idx_app_usage_device_date ON app_usage(device_id, usage_date);

### focus_sessions

CREATE TABLE focus_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  started_at      TIMESTAMPTZ NOT NULL,
  ended_at        TIMESTAMPTZ,
  planned_duration INTEGER, -- seconds, NULL = indefinite
  actual_duration  INTEGER, -- seconds
  whitelist_apps   TEXT[], -- array of package names
  ended_by        TEXT, -- 'timer' | 'admin' | 'user_pin'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_focus_device ON focus_sessions(device_id);

### timer_rules

CREATE TABLE timer_rules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  package_name    TEXT NOT NULL,
  daily_limit_seconds INTEGER, -- NULL = no limit
  schedule_json   JSONB,
  -- {"mon":[{"start":"22:00","end":"23:59"}], "tue":...}
  reset_time      TEXT DEFAULT '00:00', -- midnight reset
  is_enabled      BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

### tamper_events

CREATE TABLE tamper_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  -- 'uninstall_attempt' | 'admin_removal' | 'vpn_killed'
  -- 'accessibility_disabled' | 'adb_enabled' | 'safe_mode'
  -- 'force_stop' | 'factory_reset_attempt'
  description     TEXT,
  screenshot_url  TEXT, -- Supabase Storage URL
  device_state    JSONB, -- snapshot of device state at time
  admin_notified  BOOLEAN DEFAULT FALSE,
  triggered_at    TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tamper_device ON tamper_events(device_id);
CREATE INDEX idx_tamper_time ON tamper_events(triggered_at);

### override_requests

CREATE TABLE override_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  reason          TEXT,
  status          TEXT DEFAULT 'pending',
  -- 'pending' | 'approved' | 'denied'
  duration_seconds INTEGER, -- how long override lasts
  blocked_value   TEXT, -- what they want access to
  requested_at    TIMESTAMPTZ NOT NULL,
  responded_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

### daily_reports

CREATE TABLE daily_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id           UUID REFERENCES devices(id) ON DELETE CASCADE,
  report_date         DATE NOT NULL,
  total_screen_seconds INTEGER DEFAULT 0,
  total_blocks        INTEGER DEFAULT 0,
  focus_sessions      INTEGER DEFAULT 0,
  focus_seconds       INTEGER DEFAULT 0,
  tamper_attempts     INTEGER DEFAULT 0,
  top_apps            JSONB, -- [{package, name, seconds}]
  top_blocked         JSONB, -- [{value, type, count}]
  report_sent         BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, report_date)
);

### sync_queue

CREATE TABLE sync_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  action          TEXT NOT NULL,
  -- 'rules_push' | 'stats_pull' | 'config_update'
  payload         JSONB,
  status          TEXT DEFAULT 'pending',
  -- 'pending' | 'delivered' | 'failed'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  delivered_at    TIMESTAMPTZ
);

### config_versions

CREATE TABLE config_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  device_id       UUID REFERENCES devices(id) ON DELETE CASCADE,
  version         INTEGER NOT NULL DEFAULT 1,
  config_hash     TEXT NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

## Row Level Security (RLS) Policies

### devices — Admin only sees own devices

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_own_devices" ON devices
  FOR ALL USING (admin_id = auth.uid());

### block_rules — Admin owns rules

ALTER TABLE block_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_own_rules" ON block_rules
  FOR ALL USING (admin_id = auth.uid());

### tamper_events — Device can insert, admin can read

ALTER TABLE tamper_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "device_insert_tamper" ON tamper_events
  FOR INSERT WITH CHECK (
    device_id IN (
      SELECT id FROM devices WHERE admin_id = auth.uid()
    )
  );
CREATE POLICY "admin_read_tamper" ON tamper_events
  FOR SELECT USING (
    device_id IN (
      SELECT id FROM devices WHERE admin_id = auth.uid()
    )
  );

## Local Room DB (Android)

**Tables mirrored locally:**

* **block_rules** (synced from server)
* **block_events** (synced to server)
* **app_usage** (synced to server)
* **focus_sessions** (synced to server)
* **timer_rules** (synced from server)
* **tamper_events** (synced to server)
* **override_requests** (synced both ways)
* **sync_metadata** (local only: last sync time, version)
* **admin_config** (local only: PIN hash, settings)

### Room Entities (Kotlin)

@Entity(tableName = "block_rules")
data class BlockRuleEntity(
  @PrimaryKey val id: String,
  val ruleType: String,
  val value: String,
  val isEnabled: Boolean,
  val isWhitelist: Boolean,
  val category: String?,
  val deviceId: String?,
  val updatedAt: Long
)

@Entity(tableName = "block_events")
data class BlockEventEntity(
  @PrimaryKey val id: String,
  val blockedValue: String,
  val blockType: String,
  val triggeredAt: Long,
  val synced: Boolean = false
)

@Entity(tableName = "app_usage")
data class AppUsageEntity(
  @PrimaryKey val id: String,
  val packageName: String,
  val appName: String,
  val usageDate: String, -- "2025-01-01"
  val durationSeconds: Int,
  val openCount: Int,
  val synced: Boolean = false
)

---