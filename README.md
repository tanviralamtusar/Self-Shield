# Self-Shield

A comprehensive device protection and content filtering system combining VPN-based website blocking, accessibility service-based in-app filtering, and admin-controlled parental controls for Android devices and web dashboard management.

## 🎯 Features

### Core Blocking Engine
- **Local VPN-Based Website Blocking**: On-device VPN with hostname-based blocking (no DNS breakage)
- **In-App Content Filtering**: Real-time monitoring of foreground apps with UI section blocking
- **Device Admin & Owner Protection**: Multi-layered device protection against uninstall and Safe Mode bypasses
- **Anti-Tamper Detection**: Detects uninstall attempts, ADB connections, and factory reset triggers

### Website Blocking
- **Pre-Built Category Lists**: Pornography, LGBTQ+, Gambling, Islamophobic, Violence, Drugs, and more
- **Custom Blocklists**: Admin-managed allowlists and denylists with wildcard support
- **Community Block Lists**: Subscribe to curated blocklists maintained by the team
- **Real-Time Push Updates**: FCM-based distribution of blocklist updates to all devices

### App Management
- **Full App Blocking**: Block any installed app by package name
- **Timer-Based Controls**: Schedule app availability with time-based restrictions
- **Launch Interception**: Accessibility Service overlays on blocked app launches
- **Foreground Monitoring**: Real-time detection and control of app switching

### Admin Dashboard
- **Multi-Device Management**: Manage all child devices from a single web dashboard
- **Audit Logging**: Complete activity logs with screenshots and timestamp tracking
- **User Overrides**: Request-based temporary access with admin approval workflow
- **Usage Analytics**: Charts and reports on app usage and device activity

---

## 📁 Project Structure

```
self-shield/
├── self-shield-web/          # Next.js web dashboard (Supabase + TypeScript)
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities and Supabase clients
│   │   └── middleware.ts     # Auth middleware
│   ├── next.config.ts
│   └── package.json
│
├── self-shield-blocklists/   # Pre-built category blocklists
│   └── lists/
│       ├── pornography.json
│       ├── gambling.json
│       ├── keywords.json
│       └── ... (other category lists)
│
├── documentation/            # Architecture & setup docs
│   ├── instruction.md        # Development setup
│   ├── architecture.md       # System design
│   ├── api.md               # API documentation
│   ├── database_structure.md
│   └── ... (other docs)
│
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- Supabase account
- Docker & Docker Compose (for backend)
- Android Studio (for mobile development)

### Web Dashboard Setup

```bash
cd self-shield-web
npm install
cp .env.example .env.local
# Configure environment variables
npm run dev
```

See [instruction.md](./instruction.md) for detailed setup instructions.

---

## 📚 Documentation

- **[Setup & Development](./instruction.md)** - Complete development environment setup
- **[Architecture](./architecture.md)** - System design and components
- **[API Reference](./api.md)** - Endpoint documentation
- **[Database Structure](./database_structure.md)** - Schema and relationships
- **[Security](./security.md)** - Security considerations and best practices
- **[Features](./features.md)** - Detailed feature specifications
- **[Design System](./design.md)** - UI/UX design tokens and philosophy

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database Client**: Supabase (@supabase/ssr)
- **Theme**: Light/Dark mode support

### Backend
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth (JWT)
- **Cloud**: Firebase (FCM for push notifications)
- **Storage**: Supabase Storage (screenshots, exports)
- **Email**: SendGrid (alerts and notifications)

### Mobile
- **Platform**: Android 5.0+ (API 21+)
- **Languages**: Kotlin, Java
- **Key APIs**: VPN Service, Accessibility Service, Device Admin API

---

## 🔐 Security Features

- On-device VPN (no cloud traffic interception)
- Multi-layered device protection
- RLS-enabled database with role-based access control
- JWT-based authentication
- Encrypted sensitive data storage
- Anti-tampering detection and alerts
- Comprehensive audit logging

---

## 📦 Key Dependencies

**Web Dashboard:**
- `next` - React framework
- `@supabase/ssr` - Database & auth client
- `typescript` - Type safety
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `sonner` - Toast notifications

---

## 🤝 Contributors

- **Tanvir Alam Tusar** - Project Creator & Lead Developer

---

## 📄 License

[Add your license here]

---

## 🙋 Support & Feedback

For issues, questions, or feature requests, please refer to the documentation or contact the development team.

---

## 🗺️ Roadmap

- [ ] Advanced filtering with AI/ML
- [ ] Cross-device sync improvements
- [ ] Enhanced analytics dashboard
- [ ] API rate limiting and webhooks
- [ ] Offline mode support
- [ ] Additional language support

