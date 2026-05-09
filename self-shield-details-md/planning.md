# Self-Shield — Project Planning

## Team Structure (2–5 Devs)

| Role | Responsibility |
|---|---|
| Android Lead | VPN service, Accessibility service, Device Admin, Android app |
| Backend Dev | Node.js API, Supabase schema, FCM integration, jobs |
| Frontend Dev | Next.js dashboard, charts, real-time features |
| Full-Stack / QA | Testing, documentation, release pipeline, overlap coverage |
| (Optional 5th) | Second Android dev for feature velocity |

---

## Phase 0 — Foundation (Weeks 1–2)

**Goal:** Repo setup, architecture, no features yet.

- [ ] Create GitHub org + repos: `self-shield-android`, `self-shield-web`, `self-shield-backend`
- [ ] Set up GitHub Actions CI (build checks, linting)
- [ ] Supabase project created (cloud), schema migrated
- [ ] Android: Hilt, Room, Retrofit scaffold
- [ ] Backend: Express + TypeScript + Supabase client scaffold
- [ ] Web: Next.js 14 + shadcn/ui + Supabase auth scaffold
- [ ] `.env.example` files for all three repos
- [ ] Docker Compose for backend local dev
- [ ] Branching strategy: `main` (prod), `develop` (staging), `feature/*`
- [ ] Code review: minimum 1 approval to merge to develop
- [ ] Define API contract (OpenAPI YAML)

---

## Phase 1 — Core Blocking (Weeks 3–6)

**Goal:** Working VPN blocker + basic app block.

- [ ] Android: Local VPN service (hostname blocking, DNS intercept)
- [ ] Android: Default block lists (porn, gambling, islamophobic categories)
- [ ] Android: Custom blocklist add/remove
- [ ] Android: App blocking via Accessibility Service overlay
- [ ] Android: `BOOT_COMPLETED` auto-start
- [ ] Android: Watchdog service
- [ ] Android: Foreground notification (persistent)
- [ ] Android: Room database + sync worker scaffold
- [ ] Backend: `/devices`, `/blocklists`, `/commands` endpoints
- [ ] Backend: Supabase Auth integration
- [ ] Web: Login page + basic device list
- [ ] Integration test: block hostname end-to-end

**Milestone:** Demonstrable blocker works on physical device.

---

## Phase 2 — Protection Layer (Weeks 7–9)

**Goal:** Uninstall protection, PIN, Device Admin.

- [ ] Android: Device Admin receiver (uninstall block)
- [ ] Android: Accessibility intercepts uninstall UI (fallback)
- [ ] Android: PIN entry screen (4–8 digit, bcrypt)
- [ ] Android: Biometric unlock (API 23+)
- [ ] Android: Admin settings gated by PIN
- [ ] Android: Onboarding flow (all permission requests)
- [ ] Android: Safe Mode detection + alert
- [ ] Android: ADB detection + alert
- [ ] Android: Overlay screen (block message, request override button)
- [ ] Backend: FCM integration + send command
- [ ] Backend: `/overrides` request + approval endpoints
- [ ] Backend: PIN reset via FCM command
- [ ] Web: Override request panel with real-time updates

**Milestone:** App cannot be uninstalled or bypassed in standard conditions.

---

## Phase 3 — In-App Blocking & Keyword (Weeks 10–12)

**Goal:** WhatsApp, Reels, Shorts, keyword blocking.

- [ ] Android: WhatsApp Status/Channels blocking (Accessibility node matching)
- [ ] Android: Instagram Reels blocking
- [ ] Android: YouTube Shorts blocking
- [ ] Android: TikTok feed blocking
- [ ] Android: Facebook Reels blocking
- [ ] Android: Twitter/X For You feed blocking
- [ ] Android: Keyword blocking (detect-on-submit, input clear)
- [ ] Android: Default keyword list (encrypted)
- [ ] Backend: In-app rule patterns stored as JSON (version-controlled, pushable)
- [ ] Web: In-app blocking toggles per app in device rules editor

**Milestone:** In-app blocking functional on all major social platforms.

---

## Phase 4 — Timer, Focus Mode, Schedules (Weeks 13–15)

**Goal:** Advanced time management features.

- [ ] Android: Timer-based app block (countdown + AlarmManager)
- [ ] Android: Schedule-based app block (time-of-day, day-of-week)
- [ ] Android: Focus Mode (session, whitelist, PIN-protected end)
- [ ] Android: Pomodoro timer within focus mode
- [ ] Android: Quran/Dua prompt on block screen during focus
- [ ] Web: Schedule editor in device rules (day × time grid)
- [ ] Backend: Schedule sync to device

**Milestone:** All time-based features functional.

---

## Phase 5 — Analytics & Reporting (Weeks 16–17)

**Goal:** Usage stats, reports, audit log.

- [ ] Android: UsageStatsManager integration (screen time per app)
- [ ] Android: Usage event logging to Room, sync to backend
- [ ] Android: Daily report card screen
- [ ] Backend: Daily aggregation cron job
- [ ] Backend: Weekly email report (SendGrid)
- [ ] Web: Reports page with charts (bar, pie, line)
- [ ] Web: Audit log table with screenshots
- [ ] Web: Export to CSV

**Milestone:** Admin has full visibility into device usage.

---

## Phase 6 — Device Owner & Factory Reset Survival (Week 18)

**Goal:** Strongest protection level.

- [ ] Android: Device Owner provisioning flow (QR code instructions)
- [ ] Android: Safe Mode block via Device Owner (API 23+)
- [ ] Android: Factory reset protection policy (API 29+)
- [ ] Android: Audit log backup to Supabase before factory reset
- [ ] Documentation: Device Owner setup guide

**Note:** This phase requires testing on multiple real Android devices.

---

## Phase 7 — Dashboard Remote Control (Weeks 19–20)

**Goal:** Full remote admin capability.

- [ ] Web: Push block list to device (real-time FCM)
- [ ] Web: Remote sync request
- [ ] Web: Lock device (kiosk mode trigger)
- [ ] Web: Real-time tamper alerts in sidebar
- [ ] Web: Device online/offline status (Supabase Realtime)
- [ ] Backend: Command queue + delivery tracking

---

## Phase 8 — Polish, QA, Release (Weeks 21–24)

- [ ] Full regression test on Android 5.0, 8.0, 10, 12, 14
- [ ] Accessibility audit (TalkBack)
- [ ] Security audit (PIN brute force, overlay bypass attempts)
- [ ] Performance: VPN latency test (should be < 5ms overhead)
- [ ] Battery usage audit (foreground service impact)
- [ ] Play Store listing (screenshots, description, content rating)
- [ ] GitHub release with signed APK
- [ ] Public documentation (README + wiki)
- [ ] `CHANGELOG.md` first entry

---

## Version Naming
- `v1.0.0` — Phase 1–3 complete (core blocking)
- `v1.1.0` — Phase 4 (timer/focus)
- `v1.2.0` — Phase 5 (analytics)
- `v1.3.0` — Phase 6 (Device Owner)
- `v1.4.0` — Phase 7 (remote control)
- `v2.0.0` — iOS support (future)

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| WhatsApp UI update breaks Accessibility detection | High | Medium | Store patterns server-side, push updates without app update |
| Play Store rejects app for Device Admin usage | Medium | High | Document legitimate parental control use case, appeal |
| Device Owner provisioning too complex for users | Medium | Medium | Provide step-by-step in-app guide + video |
| Android 14 battery/background restrictions kill VPN | Medium | High | Foreground service + Battery optimization exemption prompt |
| Supabase cloud downtime | Low | Low | Fully offline-capable, queues sync |
| User roots device to bypass | Low | Low | Root detection + tamper alert, document limitation |

---

## GitHub Repository Rules

- `main` branch: protected, no direct push, requires PR + 1 review + CI pass
- `develop`: integration branch, requires CI pass
- `feature/*`: naming `feature/VPN-blocking`, `feature/focus-mode`
- `fix/*`: bug fixes
- `release/*`: release preparation
- Commit convention: `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- Issue templates: Bug report, Feature request
- PR template with checklist
