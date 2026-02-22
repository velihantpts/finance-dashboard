# FinanceHub — Enterprise Treasury Dashboard

## Project Overview
Build a **production-grade enterprise finance dashboard** using Next.js 15+, React, TypeScript, and Tailwind CSS. This is a portfolio showcase project for Upwork — it must look like a real banking application, not a tutorial demo.

## Tech Stack
- **Framework:** Next.js 15+ (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + CSS Variables for theming
- **Charts:** Recharts
- **Icons:** Lucide React
- **State:** React hooks (useState, useMemo, useCallback)

## Folder Structure
Create this exact folder structure:

```
src/
├── app/
│   ├── layout.tsx              # Root layout with font + metadata
│   ├── globals.css             # CSS variables, base styles, scrollbar
│   └── page.tsx                # Main page (imports DashboardLayout)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Fixed left sidebar with nav
│   │   ├── TopBar.tsx          # Sticky header with search + notifications
│   │   └── DashboardLayout.tsx # Combines Sidebar + TopBar + content area
│   ├── cards/
│   │   ├── KpiCard.tsx         # KPI metric card (value, change, icon)
│   │   ├── QuickStats.tsx      # Small stats list component
│   │   └── KpiGrid.tsx        # 4-column KPI grid wrapper
│   ├── charts/
│   │   ├── RevenueChart.tsx    # Area chart — revenue vs expenses
│   │   ├── PortfolioChart.tsx  # Donut chart — asset allocation
│   │   ├── ProfitChart.tsx     # Bar chart — monthly profit
│   │   ├── WeeklyVolume.tsx    # Small bar chart — weekly volume
│   │   └── CustomTooltip.tsx   # Shared tooltip component
│   ├── tables/
│   │   ├── TransactionTable.tsx    # Full transaction table with search
│   │   ├── StatusBadge.tsx         # Completed/Pending/Failed badge
│   │   └── RiskBadge.tsx           # Low/Medium/High risk indicator
│   ├── risk/
│   │   └── RiskAssessment.tsx  # Risk score bars panel
│   └── ui/
│       ├── PeriodSelector.tsx  # 1M/3M/6M/1Y toggle buttons
│       └── SectionHeader.tsx   # Reusable card header
├── data/
│   └── mockData.ts             # ALL mock data in one place
├── lib/
│   └── utils.ts                # formatCurrency, formatDate helpers
└── types/
    └── index.ts                # TypeScript interfaces/types
```

**IMPORTANT:** The current project may have files in `app/` at root level (not inside `src/`). Check first — if `app/` exists at root, use that structure instead of `src/app/`. Keep the component structure the same regardless.

## Design System (Dark Theme)

### CSS Variables (globals.css)
```css
:root {
  --bg-primary: #0a0b0f;
  --bg-secondary: #12131a;
  --bg-tertiary: #1a1b25;
  --border: #1e2030;
  --text-primary: #e8e9ed;
  --text-secondary: #a0a3b1;
  --text-muted: #5c5f73;
  --accent: #6366f1;
  --accent-cyan: #22d3ee;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-red: #ef4444;
}
```

### Card Style
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  border-color: #2a2d42;
}
```

### Typography Rules
- KPI values: text-[28px] font-semibold tracking-tight
- Section titles: text-sm font-semibold
- Subtitles: text-[11px] text-muted
- Labels: text-[11px] uppercase tracking-[0.1em] font-medium
- Table headers: text-[10px] uppercase tracking-[0.08em]
- Body text: text-xs

### Color Usage
- Positive trends: emerald-400
- Negative trends: red-400
- Primary accent: indigo-500 (#6366f1)
- Secondary accent: cyan-400 (#22d3ee)
- Warnings: amber-400
- Risk Low: emerald, Medium: amber, High: red

## Component Specifications

### Sidebar (240px fixed left)
- Logo: "FinanceHub" with gradient icon (indigo→cyan)
- Subtitle: "Treasury Platform"
- Nav items: Dashboard (active), Analytics, Transactions, Reports, Risk Management, Settings
- Active state: bg-indigo-500/10 text-indigo-400
- User card at bottom: avatar with initials "VT", name "Velihan T.", role "Admin"
- Logout icon

### TopBar (sticky, 64px height)
- Title: "Treasury Dashboard"
- Subtitle: "Real-time financial overview • Last updated 2 min ago"
- Search input (w-52, rounded-xl)
- Notification bell with red dot indicator
- backdrop-blur-xl effect

### KPI Cards (4 columns)
1. Total AUM: $847.2M, +12.5%, DollarSign icon, indigo accent
2. Net Revenue: $4.15M, +8.3%, TrendingUp icon, cyan accent
3. Active Clients: 2,847, +3.2%, Users icon, emerald accent
4. Transactions: 12,493, -2.1%, CreditCard icon, amber accent

Each card: icon in colored bg circle, value, percentage change with arrow, "vs last month" text

### Revenue & Expenses Chart (2/3 width)
- AreaChart with gradient fills
- Revenue line: indigo-500, strokeWidth 2.5
- Expenses line: cyan-400, strokeWidth 2
- Period selector: 1M / 3M / 6M / 1Y toggle
- Custom tooltip with colored dots
- Legend at bottom

### Portfolio Allocation (1/3 width)
- Donut/PieChart (innerRadius 60, outerRadius 85)
- 5 segments: Equities 42% (indigo), Fixed Income 28% (cyan), Real Estate 15% (amber), Commodities 10% (emerald), Cash 5% (slate)
- Legend list below chart

### Risk Assessment Panel
- 5 risk categories with progress bars
- Color coded: ≤30 green, ≤60 amber, >60 red
- Show score + change from previous period
- "Healthy" badge in header

### Weekly Volume (small bar chart)
- 5 bars (Mon-Fri), highlight Thursday (highest)
- Compact, 120px height

### Quick Stats
- Avg Transaction: $2.4M (+5.2%)
- Settlement Rate: 98.7% (+0.3%)
- Compliance Score: A+ (Stable)
- Separated by border-b

### Profit Trend (bar chart)
- Monthly profit bars
- Last month highlighted in full indigo, others in indigo/30 opacity
- +18.4% trend indicator in header

### Transaction Table
- Searchable (client, asset, ID)
- Columns: Transaction ID (mono, indigo), Client, Type (Buy=green, Sell=red), Asset, Amount, Risk (badge), Status (badge), Date
- Filter button + Export button
- Hover row highlight

### Status Badges
- Completed: emerald bg/text with ring
- Pending: amber bg/text with ring
- Failed: red bg/text with ring
- All: rounded-full, text-[11px], px-2.5 py-1

## Mock Data

### Revenue (12 months)
Jan: 186K/120K, Feb: 205K/135K, Mar: 237K/142K, Apr: 198K/128K, May: 276K/155K, Jun: 305K/162K, Jul: 290K/158K, Aug: 325K/170K, Sep: 348K/178K, Oct: 310K/165K, Nov: 370K/190K, Dec: 415K/210K

### Transactions (7 rows)
Include: Goldman Capital, Meridian Fund, Atlas Investments, Vertex Holdings, Pinnacle Group, Summit Capital, Horizon Wealth — with mix of Buy/Sell, different assets (Treasury, FX Swap, Corporate Bond, ETF, Futures, Forward, Index), amounts from $720K to $5.2M, statuses mix, risk levels mix.

## Quality Requirements
- NO TypeScript errors — use proper types for all props
- NO `any` types
- All components properly typed with interfaces
- Recharts tooltips: use custom components, avoid inline formatter typing issues
- Icon components: pass only `size` and `className` props (no `style` prop)
- All data in `data/mockData.ts`, imported where needed
- Helper functions in `lib/utils.ts`
- Responsive: works well on 1280px+ screens
- Clean imports, no unused variables
- Smooth hover transitions on all interactive elements
- Custom scrollbar styling

## Instructions
1. First check if the project uses `app/` or `src/app/` — adapt accordingly
2. Install dependencies if missing: `npm install recharts lucide-react`
3. Create all folders and files as specified
4. Move ALL mock data to `data/mockData.ts`
5. Move ALL types to `types/index.ts`
6. Move utility functions to `lib/utils.ts`
7. Build each component as a separate file
8. Ensure `page.tsx` only imports and composes — no logic
9. Test with `npm run dev` and verify no errors
10. Make sure the dashboard renders correctly at localhost:3000