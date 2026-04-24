# Self-Shield — Development Rules & Standards

## Code Standards

### Android (Kotlin)
- Kotlin only — no Java new files (legacy interop allowed)
- Strict null safety — no `!!` operator except in justified + commented cases
- All coroutines scoped properly — no `GlobalScope`
- ViewModels own UI state — no business logic in Activities/Fragments/Composables
- Repository pattern: data layer never touched directly from ViewModel
- Room queries return `Flow<T>` — never blocking calls on main thread
- All `suspend` functions must be called from coroutine scope
- Error handling: `Result<T>` pattern — no bare `try/catch` in ViewModels
- Hilt for all dependency injection — no manual service locators
- No hardcoded strings in code — use `strings.xml`
- No magic numbers — use named constants or resources

### Backend (Node.js + TypeScript)
- `strict: true` in `tsconfig.json`
- No `any` type — use `unknown` and narrow with type guards
- All request bodies validated with Zod before processing
- All database calls go through repository functions — no raw SQL in route handlers
- Never log sensitive data (PIN hashes, JWTs, user emails) to stdout
- All async route handlers wrapped in `asyncHandler()` utility
- Return consistent API response shape: `{ success, data, error }`
- HTTP status codes used correctly (200, 201, 400, 401, 403, 404, 422, 500)

### Web (Next.js + TypeScript)
- Same TypeScript strictness as backend
- No `useEffect` for data fetching — use TanStack Query
- No prop drilling beyond 2 levels — use context or Zustand
- All forms validated with Zod + React Hook Form
- No inline styles — Tailwind only
- Components: single responsibility, max ~150 lines
- Server components where possible, client components only when needed

---

## Git Rules

- **Never commit to `main` directly**
- **Never commit secrets, API keys, or `.env` files**
- Commit messages follow Conventional Commits:
  - `feat: add VPN service restart on boot`
  - `fix: correct keyword detection on WhatsApp`
  - `docs: update database schema`
  - `chore: upgrade dependencies`
  - `test: add unit tests for blocklist matching`
  - `refactor: extract VPN builder to factory`
- PR title = commit message format
- Each PR resolves one issue
- PR must have description explaining what changed and why
- Squash merge into `develop`
- `main` merges from `develop` only — via release PR
- Branch names: `feature/`, `fix/`, `refactor/`, `docs/`, `release/`
- No WIP commits on `develop` — use draft PRs

---

## Testing Rules

### Android
- Unit tests for: blocklist matching logic, keyword detection, PIN hashing, sync conflict resolution
- Instrumented tests for: Room database migrations, VPN service start/stop, Accessibility event handling
- No feature merged without tests for core logic
- Test naming: `methodName_condition_expectedResult`

### Backend
- Unit tests for: service functions, Zod validators, report aggregation logic
- Integration tests for: all API endpoints (Supertest)
- Test database: separate Supabase test project or local Postgres via Docker
- Minimum 70% coverage on services layer

### Web
- Component tests with React Testing Library for critical forms
- E2E tests with Playwright for: login flow, device pairing, override approval

---

## Security Rules

- **Never store PIN or password in plaintext** — bcrypt always
- **Never store Supabase service role key in Android app** — backend only
- **Never disable RLS on any Supabase table** — ever
- **Certificate pinning must not be disabled** even in debug builds (use a separate debug cert)
- All user inputs sanitized before database insertion
- Screenshot storage: private bucket only — signed URLs only
- Any new permission added to AndroidManifest requires team discussion and justification comment

---

## UI / Design Rules

- Follow `design.md` color tokens exactly — no ad-hoc hex values
- All touch targets minimum 48×48dp
- Every new screen needs dark mode tested before merge
- Loading states required for all async operations
- Empty states required for all list/table screens
- Error states required for all network requests
- No user-facing error should show raw error messages or stack traces

---

## Accessibility Rules

- All icons must have `contentDescription`
- All interactive elements reachable by TalkBack
- Focus order must be logical (top-to-bottom, left-to-right)
- No color as the only indicator of state — always use icon or text too
- Minimum contrast ratio 4.5:1 for all text

---

## Performance Rules

### Android
- VPN service DNS lookup: target < 2ms per query (in-memory hash set)
- Accessibility event handling: < 16ms to avoid dropping frames
- App startup time (cold start): target < 1.5s
- Background battery impact: test with Battery Historian before release
- Room queries: no query larger than needed — paginate long lists

### Backend
- API response time P95: < 200ms for all endpoints
- Slow query threshold: log any query > 100ms
- Supabase connection pool: use `supabase-js` pooling correctly

### Web
- Lighthouse score: > 90 for Performance, Accessibility, Best Practices
- Dashboard initial load: < 2s on 4G connection

---

## Release Rules

- Every release must update `CHANGELOG.md`
- Every release must bump `versionCode` and `versionName` in `build.gradle`
- Play Store release: internal test track first → 10% rollout → full
- GitHub release: signed APK attached + release notes = same as CHANGELOG entry
- No hotfix to production without a corresponding fix in `develop`
- Backend deployments: must pass health check before traffic routes to new container

---

## Documentation Rules

- All public API endpoints documented in OpenAPI YAML
- All Supabase migrations in `supabase/migrations/` with descriptive names
- All non-obvious Android service behavior documented with inline comments
- `README.md` in each repo: setup, build, test, deploy instructions
- Architecture decisions recorded in `docs/adr/` (Architecture Decision Records)
