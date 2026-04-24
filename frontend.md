# Self-Shield — Frontend Specification (Web Dashboard)

## Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- UI Library: shadcn/ui + Radix UI primitives
- Styling: Tailwind CSS
- State: Zustand (client state) + TanStack Query (server state)
- Auth: Supabase Auth JS client
- Charts: Recharts
- Icons: Lucide React
- Forms: React Hook Form + Zod
- Notifications: Sonner (toast)
- Date: date-fns
- Real-time: Supabase Realtime (for live override requests, tamper alerts)

---

## Repository Structure

```
self-shield-web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Sidebar + topbar shell
│   │   ├── page.tsx            ← Overview
│   │   ├── devices/
│   │   │   ├── page.tsx        ← Device list
│   │   │   └── [id]/
│   │   │       ├── page.tsx    ← Device detail
│   │   │       ├── rules/page.tsx
│   │   │       ├── reports/page.tsx
│   │   │       └── audit/page.tsx
│   │   ├── blocklists/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── overrides/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── audit/page.tsx
│   │   └── settings/page.tsx
├── components/
│   ├── ui/                     ← shadcn components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── MobileSidebar.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── DeviceStatusTable.tsx
│   │   └── RecentAuditFeed.tsx
│   ├── devices/
│   │   ├── DeviceCard.tsx
│   │   ├── PairDeviceModal.tsx
│   │   └── DeviceRulesEditor.tsx
│   ├── blocklists/
│   │   ├── BlocklistTable.tsx
│   │   ├── AddEntryModal.tsx
│   │   └── CategoryToggles.tsx
│   ├── overrides/
│   │   └── OverrideRequestCard.tsx
│   └── charts/
│       ├── UsageBarChart.tsx
│       ├── AppPieChart.tsx
│       └── WeeklyLineChart.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── api.ts
│   └── utils.ts
├── hooks/
│   ├── useDevices.ts
│   ├── useReports.ts
│   └── useRealtime.ts
├── store/
│   └── ui.store.ts
└── middleware.ts               ← Auth protection
```

---

## Pages

### Login Page `/login`
- Email + password form
- Supabase `signInWithPassword()`
- Redirect to `/` on success
- Error handling: wrong credentials, unconfirmed email

### Overview Page `/`
Stats at a glance:
- Cards: Total Devices, Blocks Today (all devices), Pending Overrides, Tamper Events (24h)
- Device status table: device name, last seen, VPN status, blocks today, quick actions
- Override requests panel (live via Supabase Realtime)
- Recent tamper alerts feed

### Devices Page `/devices`
- Card grid of all linked devices
- Pair new device modal (generate 6-digit code, QR code)
- Status badges: Online / Last seen X hours ago / Offline

### Device Detail `/devices/[id]`
Tabs:
1. **Summary** — device info, protection status, quick toggles
2. **Block Rules** — app rules, website categories, custom hostnames
3. **App Rules** — per-app block, timer, uninstall protect, in-app controls
4. **Reports** — usage charts, top apps, block counts (date range picker)
5. **Audit Log** — tamper events table with screenshots
6. **Commands** — push blocklist, remote sync, reset PIN

### Block Lists `/blocklists`
- List all lists (system defaults + custom)
- Toggle category lists on/off
- Create/edit custom list with bulk entry import (paste list or upload .txt)
- Push list to specific devices or all devices

### Overrides `/overrides`
- Table of pending/resolved override requests
- Approve button (set duration: 15min, 30min, 60min)
- Deny button
- Real-time: new request triggers toast + notification sound

### Reports `/reports`
- Select device (or all)
- Date range picker
- Charts: daily screen time bar, app category pie, weekly trend line
- Export to CSV button

### Audit Log `/audit`
- Filter by device, event type, date range
- Screenshot thumbnails for uninstall/tamper events
- Export to CSV

### Settings `/settings`
- Admin account email
- Change password
- Email notification preferences
- Webhook URL (optional)

---

## Auth & Route Protection

`middleware.ts` checks Supabase session cookie. Unauthenticated requests to `/dashboard/*` are redirected to `/login`.

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect('/login')
  return NextResponse.next()
}
```

---

## Real-Time Features (Supabase Realtime)

```typescript
// Override requests — live updates
const channel = supabase
  .channel('overrides')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'override_requests'
  }, payload => {
    toast.warning(`Override request from ${payload.new.device_name}`)
    invalidateQuery(['overrides'])
  })
  .subscribe()
```

Also subscribe to:
- `audit_log` INSERT → live tamper alert in sidebar badge
- `devices` UPDATE → live last_seen update in device table

---

## Push PIN Reset Flow (Dashboard → Device)

1. Admin clicks "Reset PIN" on device detail page
2. Modal confirms action (requires admin password re-entry)
3. POST `/pin/reset/:deviceId` → backend creates `remote_commands` row
4. Backend sends FCM data message to device
5. Device receives FCM, generates new PIN prompt on screen, stores new hash
6. Dashboard shows "PIN reset delivered" toast

---

## Design Implementation Notes

- Colors: follow `design.md` token system, configured in `tailwind.config.ts`
- Dark mode: `class` strategy, toggle in topbar, persisted in localStorage
- Responsive: sidebar collapses to drawer on mobile
- Tables: use TanStack Table for sorting, filtering, pagination
- All forms: Zod schema validation, React Hook Form
- Data fetching: TanStack Query with 30s stale time for most data, 0s for overrides
