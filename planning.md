# Self-Shield — Project Planning

## Team
- 2–5 developers
- Open source on GitHub
- CI/CD: GitHub Actions + manual release option

## Development Phases

---

### Phase 0: Foundation (Weeks 1–2)
**Goal:** Project setup, architecture, dev environment

Tasks:
- [ ] Create GitHub organization + repo
- [ ] Android project setup (Kotlin, multi-module)
- [ ] Backend project setup (Node.js + Express)
- [ ] Web dashboard project setup (Next.js)
- [ ] Supabase project creation + schema init
- [ ] Docker Compose setup for backend
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] Design system tokens implementation (Android)
- [ ] Linting, formatting, code style setup
- [ ] Branch protection rules

Deliverables:
- Runnable skeleton apps (all 3)
- CI/CD green
- Supabase tables created

---

### Phase 1: Core Blocking Engine (Weeks 3–5)
**Goal:** VPN + Accessibility working, basic blocking functional

Tasks:
- [ ] VPN Service implementation (local TUN)
- [ ] DNS query interceptor
- [ ] Block list loader from Room DB
- [ ] NXDOMAIN response for blocked hosts
- [ ] Accessibility Service setup
- [ ] App foreground detection
- [ ] Block overlay UI component
- [ ] App blocking (package name)
- [ ] Onboarding flow (permissions)
- [ ] Device Admin Receiver setup
- [ ] PIN setup + storage (encrypted)
- [ ] Basic Room DB schema

Deliverables:
- Can block apps by package name
- Can block websites by hostname
- VPN running persistently

---

### Phase 2: Advanced Blocking (Weeks 6–8)
**Goal:** WhatsApp controls, in-app blocking, keyword blocking

Tasks:
- [ ] WhatsApp Accessibility detection (Status, Channels)
- [ ] Instagram Reels blocking
- [ ] YouTube Shorts blocking
- [ ] TikTok feed blocking
- [ ] Facebook Reels blocking
- [ ] Snapchat Spotlight blocking
- [ ] Keyword detection system
- [ ] Default keyword list
- [ ] Custom keyword management UI
- [ ] Category-based website block lists
- [ ] Default block lists import (adult, gambling, etc.)

Deliverables:
- All in-app blocking functional
- WhatsApp controls working
- Keyword blocking working

---

### Phase 3: Protection & Tamper Detection (Weeks 9–10)
**Goal:** Uninstall protection, tamper detection, persistence

Tasks:
- [ ] Uninstall protection (Accessibility method)
- [ ] Device Admin uninstall prevention
- [ ] Tamper detection service
- [ ] Screenshot on tamper
- [ ] Auto-restart on boot
- [ ] Foreground service persistence
- [ ] ADB detection
- [ ] Safe Mode detection
- [ ] Device Owner provisioning guide + QR setup
- [ ] Exponential backoff on wrong PIN

Deliverables:
- App cannot be uninstalled without admin PIN
- Tamper events logged locally

---

### Phase 4: Focus Mode + Timer Blocking (Weeks 11–12)
**Goal:** Focus mode, timer-based blocking fully working

Tasks:
- [ ] Focus mode UI
- [ ] Focus mode engine (whitelist enforcement)
- [ ] DND activation during focus
- [ ] Focus session history
- [ ] Timer-based blocking UI
- [ ] Per-app daily limits
- [ ] Schedule-based blocking (days x hours grid)
- [ ] Limit-hit notification
- [ ] Midnight reset job

Deliverables:
- Focus mode fully functional
- Timer blocking fully functional

---

### Phase 5: Backend + Sync (Weeks 13–15)
**Goal:** Backend API, Supabase integration, cloud sync

Tasks:
- [ ] All API endpoints implemented
- [ ] Supabase auth integration
- [ ] Device registration + token system
- [ ] Block list sync (push/pull)
- [ ] Usage stats upload
- [ ] Tamper event upload + screenshot storage
- [ ] FCM push notification integration
- [ ] Email alerts (Nodemailer)
- [ ] Supabase Realtime channels
- [ ] Offline-first sync logic in Android

Deliverables:
- Android app syncs with backend
- Admin receives alerts
- Rules pushed to devices in real-time

---

### Phase 6: Web Dashboard (Weeks 16–18)
**Goal:** Full web admin dashboard

Tasks:
- [ ] Auth (email/password login)
- [ ] Dashboard home (device list, stats)
- [ ] Per-device detail view
- [ ] Block list management UI
- [ ] Push rules to device
- [ ] Tamper log viewer
- [ ] Screenshot gallery
- [ ] Override request management
- [ ] Daily report viewer
- [ ] Profile management
- [ ] Settings (PIN reset, email prefs)

Deliverables:
- Full web dashboard functional
- Admin can control all devices remotely

---

### Phase 7: Polish + Testing (Weeks 19–21)
**Goal:** Bug fixes, performance, UX polish

Tasks:
- [ ] Dark mode implementation
- [ ] Animations + transitions
- [ ] Edge case handling (API errors, offline, etc.)
- [ ] Performance profiling (VPN memory, battery)
- [ ] Accessibility audit (a11y)
- [ ] Backward compatibility testing (Android 5–14)
- [ ] Security audit
- [ ] Penetration testing (bypass attempts)
- [ ] Beta testing with real users

---

### Phase 8: Release (Weeks 22–24)
**Goal:** Public release

Tasks:
- [ ] Play Store listing prep
- [ ] Privacy policy + terms
- [ ] GitHub README + docs
- [ ] APK direct download setup
- [ ] Final CI/CD release pipeline
- [ ] v1.0.0 tag + release
- [ ] Monitoring setup (Sentry / crash reporting)

---

## Milestones
| Milestone | Target Week | Description |
|-----------|-------------|-------------|
| M1 | Week 2  | Project skeleton + CI |
| M2 | Week 5  | Core blocking engine |
| M3 | Week 8  | Advanced blocking |
| M4 | Week 10 | Tamper protection |
| M5 | Week 12 | Focus + Timer |
| M6 | Week 15 | Backend + Sync |
| M7 | Week 18 | Web Dashboard |
| M8 | Week 21 | Polish + Testing |
| M9 | Week 24 | Public Release v1.0 |

## Risk Register
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| WhatsApp UI changes break detection | HIGH | MEDIUM | Version-specific selectors, fallback |
| Play Store rejection (VPN + Accessibility) | MEDIUM | HIGH | Prepare APK sideload option |
| Device Owner setup too complex for users | MEDIUM | MEDIUM | Detailed guide + QR provisioning |
| Android version fragmentation | HIGH | MEDIUM | Test matrix on Android 5–14 |
| Supabase cloud limits (free tier) | LOW | LOW | Self-hosted Supabase fallback |
| Bypass via rooted device | LOW | HIGH | Root detection, warn admin |

## Git Branching Strategy
main → production
develop → integration
feature/* → individual features
fix/* → bug fixes
release/* → release candidates

## Code Review Rules
- All PRs require 1 review minimum
- No direct push to main
- CI must pass before merge
- Feature flags for incomplete features