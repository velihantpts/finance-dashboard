# FinanceHub — Enterprise Treasury Dashboard

A production-grade treasury management dashboard built with Next.js 16, TypeScript, and Tailwind CSS v4. Features real-time KPI monitoring, interactive charts, transaction management, risk assessment, and full EN/TR bilingual support with dark/light theme switching.

---

## Features

- **6 fully routed pages** — Dashboard, Analytics, Transactions, Reports, Risk Management, Settings
- **Collapsible sidebar** — smooth 240px ↔ 64px transition, state persisted to `localStorage`
- **Dark / Light mode** — one-click toggle, persisted to `localStorage`
- **EN / TR language support** — full bilingual UI, persisted to `localStorage`
- **Interactive charts** — Area, Bar, and Pie charts via Recharts with period selectors (1M / 3M / 6M / 1Y)
- **Transaction table** — real-time search, multi-filter panel (Status / Risk / Type), export feedback
- **Notification panel** — per-item dismiss, mark-all-read, unread count badge
- **Profile modal** — edit name, email, role, phone with save confirmation
- **Interactive settings** — live toggle switches, preference sections
- **Zero TypeScript errors** — strict mode, no `any` types

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v4 — CSS custom properties for theming |
| Charts | Recharts 3 |
| Icons | Lucide React |
| State | React Context API (Sidebar · Theme · Language) |
| Runtime | React 19 |

---

## Getting Started

### Prerequisites

- Node.js 18+

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
finance-dashboard/
├── app/
│   ├── global.css            # CSS variables, .card base, theme overrides
│   ├── layout.tsx            # Root layout — wraps with <Providers>
│   ├── page.tsx              # Dashboard (home)
│   ├── analytics/page.tsx
│   ├── transactions/page.tsx
│   ├── reports/page.tsx
│   ├── risk/page.tsx
│   └── settings/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx   # Wrapper — sidebar + topbar + children
│   │   ├── Sidebar.tsx           # Collapsible nav with tooltips
│   │   └── TopBar.tsx            # Theme · Language · Notification controls
│   ├── cards/
│   │   ├── KpiCard.tsx           # Single KPI metric card
│   │   ├── KpiGrid.tsx           # 4-column KPI grid
│   │   └── QuickStats.tsx        # Compact stat list
│   ├── charts/
│   │   ├── RevenueChart.tsx      # Area — revenue vs expenses
│   │   ├── PortfolioChart.tsx    # Donut — asset allocation
│   │   ├── ProfitChart.tsx       # Bar — monthly profit
│   │   ├── WeeklyVolume.tsx      # Mini bar — weekly volume
│   │   └── CustomTooltip.tsx     # Shared chart tooltip
│   ├── tables/
│   │   ├── TransactionTable.tsx  # Searchable, filterable table
│   │   ├── StatusBadge.tsx
│   │   └── RiskBadge.tsx
│   ├── risk/
│   │   └── RiskAssessment.tsx    # Risk score progress bars
│   └── ui/
│       ├── SectionHeader.tsx     # Card header (title + subtitle + action slot)
│       ├── PeriodSelector.tsx    # Period toggle buttons
│       ├── NotificationPanel.tsx # Notification dropdown
│       ├── ProfileModal.tsx      # Edit profile modal
│       └── LogoutModal.tsx       # Sign-out confirmation
│
├── providers/
│   ├── Providers.tsx             # Combined provider tree
│   ├── SidebarProvider.tsx       # collapsed ↔ expanded state
│   ├── ThemeProvider.tsx         # dark / light — toggles html.light
│   └── LanguageProvider.tsx      # en / tr — translation lookup
│
├── lib/
│   ├── translations.ts           # Full EN/TR strings (as const)
│   └── utils.ts                  # formatCurrency, formatDate
│
├── data/
│   └── mockData.ts               # Typed mock data for all components
│
└── types/
    └── index.ts                  # Shared TypeScript interfaces
```

---

## Theming

Colors are defined as CSS custom properties in `app/global.css`. Dark mode is the default. Light mode applies when `html.light` is set on the document element.

```css
/* Dark (default) */
--bg-primary:    #0d0e14;
--bg-secondary:  #13151f;
--text-primary:  #e8eaf6;
--text-secondary:#9aa5ce;
--text-muted:    #4a5280;
--accent:        #6366f1;

/* Light override (html.light) */
--bg-primary:    #f4f5fb;
--bg-secondary:  #ffffff;
--text-primary:  #0d0e14;
--text-secondary:#3a3e55;
--text-muted:    #7880a2;
```

---

## Internationalization

Language state lives in `LanguageProvider`. All strings are defined in `lib/translations.ts`.

```ts
import { useLanguage } from '@/providers/LanguageProvider';

export default function MyComponent() {
  const { trans, lang } = useLanguage();
  return <p>{trans.nav.dashboard}</p>;
}
```

To add a new page:

1. Create `app/your-page/page.tsx` and wrap with `<DashboardLayout>`
2. Add a nav entry in `components/layout/Sidebar.tsx`
3. Add translation keys in `lib/translations.ts` under `nav` and `pages`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## License

MIT
