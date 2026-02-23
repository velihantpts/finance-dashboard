# FinanceHub — Full-Stack Upgrade: Database + API + Authentication

## Overview
Upgrade the existing FinanceHub Treasury Dashboard from a static mock-data project into a **full-stack application** with a real PostgreSQL database, API routes, CRUD operations, and authentication. Everything runs on Next.js — no separate backend needed.

## Current State
- Next.js 15+ project with TypeScript, Tailwind CSS, Recharts
- Static mock data in `data/mockData.ts`
- Components already built: KPI cards, charts, tables, sidebar, risk assessment
- Deployed on Vercel

## Target State
- PostgreSQL database (Neon.tech) with Prisma ORM
- Next.js API Routes for all data
- NextAuth.js authentication with login/register
- CRUD operations on transactions
- Protected dashboard (must login to see)
- Seed script to populate initial data

---

## PHASE 1: Database + Prisma Setup

### 1.1 Install Dependencies
```bash
npm install @prisma/client next-auth @auth/prisma-adapter bcryptjs
npm install -D prisma @types/bcryptjs
```

### 1.2 Initialize Prisma
```bash
npx prisma init
```
This creates `prisma/schema.prisma` and `.env` file.

### 1.3 Database Provider (Neon.tech — FREE)
Go to https://neon.tech → Sign up → Create project → Copy the connection string.

Add to `.env`:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="generate-a-random-secret-string-here-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 1.4 Prisma Schema (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth Models ─────────────────────────────
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  role          String    @default("analyst")
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─── Business Models ─────────────────────────
model Transaction {
  id        String   @id @default(cuid())
  txnId     String   @unique  // e.g. "TXN-7842"
  client    String
  type      String   // "Buy" or "Sell"
  asset     String
  amount    Float
  status    String   // "Completed", "Pending", "Failed"
  risk      String   // "Low", "Medium", "High"
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RiskScore {
  id       String @id @default(cuid())
  category String @unique // "Market Risk", "Credit Risk", etc.
  score    Int
  previous Int
}

model PortfolioAllocation {
  id    String @id @default(cuid())
  name  String @unique // "Equities", "Fixed Income", etc.
  value Float  // percentage
  color String // hex color
}

model Revenue {
  id       String @id @default(cuid())
  month    String @unique
  revenue  Float
  expenses Float
  profit   Float
}

model KpiMetric {
  id     String @id @default(cuid())
  key    String @unique // "total_aum", "net_revenue", "active_clients", "transactions"
  title  String
  value  String
  change String
  trend  String // "up" or "down"
}
```

### 1.5 Seed Script (`prisma/seed.ts`)
Create a seed script that populates the database with all the mock data currently in `data/mockData.ts`. This includes:
- 7 transactions (Goldman Capital, Meridian Fund, Atlas Investments, Vertex Holdings, Pinnacle Group, Summit Capital, Horizon Wealth)
- 12 months of revenue data (Jan-Dec)
- 5 portfolio allocations (Equities 42%, Fixed Income 28%, Real Estate 15%, Commodities 10%, Cash 5%)
- 5 risk scores (Market Risk 72, Credit Risk 45, Operational 31, Liquidity 58, Compliance 22)
- 4 KPI metrics (Total AUM $847.2M, Net Revenue $4.15M, Active Clients 2,847, Transactions 12,493)
- 1 default admin user: email "admin@financehub.com", password "Admin123!", name "Velihan T.", role "admin"

Hash the password with bcryptjs before storing.

Add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts"
}
```

Also install ts-node if needed:
```bash
npm install -D ts-node
```

### 1.6 Run Migrations
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 1.7 Prisma Client (`lib/prisma.ts`)
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## PHASE 2: API Routes

Create all API routes under `app/api/`. Every route uses the Prisma client.

### File Structure
```
app/api/
├── auth/
│   ├── [...nextauth]/
│   │   └── route.ts          # NextAuth handler
│   └── register/
│       └── route.ts          # POST - register new user
├── transactions/
│   └── route.ts              # GET (list + search + filter) & POST (create)
├── transactions/[id]/
│   └── route.ts              # GET (single), PUT (update), DELETE
├── kpi/
│   └── route.ts              # GET - all KPI metrics
├── revenue/
│   └── route.ts              # GET - monthly revenue data
├── portfolio/
│   └── route.ts              # GET - portfolio allocations
├── risk-scores/
│   └── route.ts              # GET - risk assessment scores
└── stats/
    └── route.ts              # GET - computed quick stats
```

### API Specifications

#### GET /api/transactions
- Query params: `?search=goldman&status=Completed&risk=Low&page=1&limit=10`
- Returns: `{ data: Transaction[], total: number, page: number, totalPages: number }`
- Search across: client, asset, txnId
- Default: all transactions, sorted by date desc

#### POST /api/transactions
- Body: `{ client, type, asset, amount, status, risk, date }`
- Auto-generates txnId (e.g., "TXN-" + incrementing number)
- Returns: created transaction

#### GET /api/transactions/[id]
- Returns: single transaction

#### PUT /api/transactions/[id]
- Body: partial transaction fields
- Returns: updated transaction

#### DELETE /api/transactions/[id]
- Returns: `{ message: "Deleted" }`

#### GET /api/kpi
- Returns: array of 4 KPI metrics

#### GET /api/revenue
- Returns: array of 12 months revenue data

#### GET /api/portfolio
- Returns: array of portfolio allocations

#### GET /api/risk-scores
- Returns: array of risk scores

#### GET /api/stats
- Computed from transactions table:
  - Average transaction amount
  - Settlement rate (Completed / Total * 100)
  - Total completed, pending, failed counts

### API Response Format
All API routes should follow this pattern:
```typescript
// Success
return NextResponse.json({ data: result }, { status: 200 });

// Error
return NextResponse.json({ error: "Message" }, { status: 400 });
```

### API Error Handling
Every route must have try/catch with proper error responses. Log errors with console.error.

---

## PHASE 3: Authentication (NextAuth.js)

### 3.1 NextAuth Configuration (`lib/auth.ts`)
```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
```

### 3.2 Auth API Route (`app/api/auth/[...nextauth]/route.ts`)
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 3.3 Register API (`app/api/auth/register/route.ts`)
- POST: `{ name, email, password }`
- Hash password with bcrypt (10 rounds)
- Check if email already exists
- Return user (without password)

### 3.4 Session Provider (`components/providers/AuthProvider.tsx`)
Wrap the app with NextAuth SessionProvider in layout.tsx.

### 3.5 Login Page (`app/login/page.tsx`)
Design a beautiful dark-themed login page matching the dashboard aesthetic:
- Centered card on dark background
- FinanceHub logo + title at top
- Email input field
- Password input field
- "Sign In" button (indigo-500, full width)
- "Don't have an account? Register" link
- Error message display (red text)
- Loading state on button

### 3.6 Register Page (`app/register/page.tsx`)
Similar design to login:
- Name, Email, Password, Confirm Password fields
- Validation: password min 6 chars, passwords match
- "Create Account" button
- "Already have an account? Sign In" link
- After successful register → redirect to /login

### 3.7 Middleware (`middleware.ts` at project root)
```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
```
This protects the dashboard — unauthenticated users get redirected to /login.

---

## PHASE 4: Connect Frontend to API

### 4.1 Create API hooks (`hooks/useApi.ts`)
```typescript
// Custom hooks for data fetching
// useTransactions(search, status, risk, page)
// useKpi()
// useRevenue()
// usePortfolio()
// useRiskScores()
// useStats()
```

Use `useState` + `useEffect` + `fetch` for data fetching. Show loading skeletons while data loads.

### 4.2 Update Components
Replace all mock data imports with API calls:

- `KpiGrid.tsx` → fetch from `/api/kpi`
- `RevenueChart.tsx` → fetch from `/api/revenue`
- `PortfolioChart.tsx` → fetch from `/api/portfolio`
- `RiskAssessment.tsx` → fetch from `/api/risk-scores`
- `TransactionTable.tsx` → fetch from `/api/transactions` with search/filter params
- `QuickStats.tsx` → fetch from `/api/stats`

### 4.3 Add Loading States
Create skeleton components that show while data is loading:
- KPI cards: pulsing gray boxes
- Charts: pulsing rectangles
- Table: pulsing rows
Use Tailwind's `animate-pulse` class.

### 4.4 Add Transaction CRUD UI
Add to the transaction table area:
- "Add Transaction" button → opens a modal/form
- Edit button on each row → opens pre-filled form
- Delete button on each row → confirmation dialog then delete
- Form fields: Client, Type (Buy/Sell), Asset, Amount, Status, Risk, Date
- Form validation: all fields required, amount must be positive number

### 4.5 Add Toast Notifications
Show success/error toasts after CRUD operations:
- "Transaction created successfully" (green)
- "Transaction updated" (blue)
- "Transaction deleted" (red)
- "Error: something went wrong" (red)
Build a simple toast component — no external library needed.

### 4.6 Update Sidebar User Section
Show the logged-in user's name and role from the session instead of hardcoded "Velihan T."
Add working logout button using `signOut()` from next-auth.

---

## PHASE 5: Environment & Deployment

### 5.1 Environment Variables
`.env` (local — DO NOT commit):
```
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

`.env.example` (commit this — template for others):
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### 5.2 Vercel Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:
- Add DATABASE_URL
- Add NEXTAUTH_SECRET
- Add NEXTAUTH_URL = your-vercel-url

### 5.3 Update .gitignore
Make sure `.env` is in `.gitignore` (it should be by default).

---

## Execution Order
1. Install all dependencies
2. Set up Neon.tech database and get connection string
3. Create `.env` with DATABASE_URL and NEXTAUTH secrets
4. Create Prisma schema
5. Run `npx prisma migrate dev --name init`
6. Create seed script and run `npx prisma db seed`
7. Create `lib/prisma.ts` and `lib/auth.ts`
8. Build all API routes (test each with browser/curl)
9. Set up NextAuth with auth route and middleware
10. Create login and register pages
11. Create AuthProvider and wrap layout
12. Create API hooks
13. Update all components to use API instead of mock data
14. Add loading skeletons
15. Add transaction CRUD (create, edit, delete)
16. Add toast notifications
17. Update sidebar with session user
18. Test everything locally
19. Set Vercel env variables and deploy

## Quality Checklist
- [ ] No TypeScript errors
- [ ] All API routes return proper JSON responses
- [ ] Authentication works (login, register, logout, protected routes)
- [ ] All dashboard data comes from database via API
- [ ] CRUD operations work on transactions
- [ ] Loading states shown while fetching
- [ ] Error states handled gracefully
- [ ] Responsive on 1280px+ screens
- [ ] No hardcoded data — everything from DB
- [ ] .env not committed to git