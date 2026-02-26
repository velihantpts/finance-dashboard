# FinanceHub — Treasury Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-featured **enterprise treasury management dashboard** built with modern web technologies. Real-time financial analytics, risk management, transaction processing, and team collaboration — all in a polished, production-ready interface.

## Features

### Core
- **KPI Dashboard** — Real-time AUM, revenue, clients, and transaction metrics with animated counters
- **Interactive Charts** — Revenue trends, portfolio allocation (pie + treemap), risk assessment, profit analysis, heatmap, funnel
- **Transaction Management** — CRUD operations, search, filter, pagination, CSV/PDF export
- **Risk Management** — Risk scores, category breakdown, trend analysis
- **Reports** — Scheduled reports with DB-backed CRUD, CSV and PDF export

### Technical Highlights
- **Authentication** — NextAuth v5 with JWT strategy, role-based access (admin/analyst/viewer)
- **RBAC** — Permission-based authorization with `RoleGate` component
- **Real-time Notifications** — Server-Sent Events (SSE) with auto-reconnect
- **AI Insights** — Rule-based financial analysis engine (no external API dependency)
- **Audit Log** — Activity tracking with timeline view
- **Command Palette** — Ctrl+K spotlight search with keyboard navigation
- **Keyboard Shortcuts** — Chord-based navigation (G→D, G→A, etc.)
- **Onboarding Tour** — Interactive 7-step tour with spotlight overlay for first-time users
- **Drag & Drop** — Reorderable dashboard sections with `@dnd-kit`
- **Theme System** — Dark/Light with circular reveal animation (View Transition API)
- **i18n** — Full English/Turkish support
- **PWA** — Installable progressive web app with manifest
- **Page Transitions** — Smooth animated route transitions with Framer Motion
- **Mobile Responsive** — Bottom navigation bar, responsive layouts
- **Rate Limiting** — In-memory API rate limiter
- **Error Boundaries** — Custom error and 404 pages with auto-retry

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Auth | NextAuth v5 (Credentials) |
| Drag & Drop | @dnd-kit |
| PDF | jsPDF + jsPDF-AutoTable |
| Testing | Playwright (E2E) |
| CI/CD | GitHub Actions |
| Container | Docker + docker-compose |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or use Docker)

### Quick Start

```bash
# Clone the repo
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Push schema and seed database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

### Docker

```bash
# Start everything (PostgreSQL + App)
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@financehub.com | Admin123! |
| Analyst | analyst@financehub.com | Analyst123! |
| Viewer | viewer@financehub.com | Viewer123! |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (REST)
│   │   ├── analytics/      # Analytics aggregation
│   │   ├── audit-log/      # Audit log entries
│   │   ├── insights/       # AI-powered insights
│   │   ├── notifications/  # CRUD + SSE stream
│   │   ├── profile/        # Profile + avatar upload
│   │   ├── reports/        # Scheduled reports CRUD
│   │   └── transactions/   # Transaction CRUD
│   ├── analytics/          # Analytics page
│   ├── activity/           # Activity log page
│   ├── reports/            # Reports page
│   ├── risk/               # Risk management page
│   ├── settings/           # Settings page
│   └── transactions/       # Transactions page
├── components/
│   ├── cards/              # KPI, Quick Stats, AI Insights
│   ├── charts/             # Revenue, Portfolio, Treemap, Heatmap, Funnel
│   ├── layout/             # DashboardLayout, Sidebar, TopBar, MobileBottomNav
│   ├── risk/               # Risk assessment components
│   ├── tables/             # Transaction table
│   └── ui/                 # shadcn/ui + CommandPalette, OnboardingTour, etc.
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities (prisma, rbac, audit, rate-limit, pdf)
├── providers/              # React context providers
├── prisma/                 # Schema + seed script
├── e2e/                    # Playwright E2E tests
└── public/                 # Static assets + PWA manifest
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Command Palette |
| `G → D` | Go to Dashboard |
| `G → A` | Go to Analytics |
| `G → T` | Go to Transactions |
| `G → R` | Go to Reports |
| `G → M` | Go to Risk Management |
| `G → S` | Go to Settings |
| `G → L` | Go to Activity Log |
| `?` | Keyboard Shortcuts Help |

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
npx prisma studio  # Open Prisma Studio (DB GUI)
npx prisma db seed # Seed database with demo data
npx playwright test # Run E2E tests
```

## License

MIT
