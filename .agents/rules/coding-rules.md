---
trigger: always_on
---

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
