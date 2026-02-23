import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ─────────────────────────────────────────────
  const hashed = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@financehub.com' },
    update: {},
    create: {
      name: 'Velihan T.',
      email: 'admin@financehub.com',
      password: hashed,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created');

  // ── KPI Metrics ────────────────────────────────────────────
  const kpiData = [
    { key: 'total_aum',     value: '$847.2M', change: '+12.5%', trend: 'up' },
    { key: 'net_revenue',   value: '$4.15M',  change: '+8.3%',  trend: 'up' },
    { key: 'active_clients',value: '2,847',   change: '+3.2%',  trend: 'up' },
    { key: 'transactions',  value: '12,493',  change: '-2.1%',  trend: 'down' },
  ];
  for (const kpi of kpiData) {
    await prisma.kpiMetric.upsert({ where: { key: kpi.key }, update: kpi, create: kpi });
  }
  console.log('✅ KPI metrics seeded');

  // ── Revenue ────────────────────────────────────────────────
  const revenueData = [
    { month: 'Jan', revenue: 186000, expenses: 120000, profit: 66000 },
    { month: 'Feb', revenue: 205000, expenses: 135000, profit: 70000 },
    { month: 'Mar', revenue: 237000, expenses: 142000, profit: 95000 },
    { month: 'Apr', revenue: 198000, expenses: 128000, profit: 70000 },
    { month: 'May', revenue: 276000, expenses: 155000, profit: 121000 },
    { month: 'Jun', revenue: 305000, expenses: 162000, profit: 143000 },
    { month: 'Jul', revenue: 290000, expenses: 158000, profit: 132000 },
    { month: 'Aug', revenue: 325000, expenses: 170000, profit: 155000 },
    { month: 'Sep', revenue: 348000, expenses: 178000, profit: 170000 },
    { month: 'Oct', revenue: 310000, expenses: 165000, profit: 145000 },
    { month: 'Nov', revenue: 370000, expenses: 190000, profit: 180000 },
    { month: 'Dec', revenue: 415000, expenses: 210000, profit: 205000 },
  ];
  for (const r of revenueData) {
    await prisma.revenue.upsert({ where: { month: r.month }, update: r, create: r });
  }
  console.log('✅ Revenue data seeded');

  // ── Portfolio Allocations ──────────────────────────────────
  const portfolioData = [
    { name: 'Equities',     value: 42, color: '#6366f1' },
    { name: 'Fixed Income', value: 28, color: '#22d3ee' },
    { name: 'Real Estate',  value: 15, color: '#f59e0b' },
    { name: 'Commodities',  value: 10, color: '#10b981' },
    { name: 'Cash',         value: 5,  color: '#64748b' },
  ];
  for (const p of portfolioData) {
    await prisma.portfolioAllocation.upsert({ where: { name: p.name }, update: p, create: p });
  }
  console.log('✅ Portfolio data seeded');

  // ── Risk Scores ────────────────────────────────────────────
  const riskData = [
    { category: 'Market Risk',  score: 72, previous: 68 },
    { category: 'Credit Risk',  score: 45, previous: 52 },
    { category: 'Operational',  score: 31, previous: 35 },
    { category: 'Liquidity',    score: 58, previous: 55 },
    { category: 'Compliance',   score: 22, previous: 28 },
  ];
  for (const r of riskData) {
    await prisma.riskScore.upsert({ where: { category: r.category }, update: r, create: r });
  }
  console.log('✅ Risk scores seeded');

  // ── Transactions ───────────────────────────────────────────
  const txns = [
    { txnId: 'TXN-7842', client: 'Goldman Capital',   type: 'Buy',  asset: 'US Treasury 10Y',   amount: 2500000, status: 'Completed', risk: 'Low',    date: new Date('2025-02-20') },
    { txnId: 'TXN-7841', client: 'Meridian Fund',     type: 'Sell', asset: 'EUR/USD FX Swap',    amount: 1800000, status: 'Pending',   risk: 'Medium', date: new Date('2025-02-20') },
    { txnId: 'TXN-7840', client: 'Atlas Investments', type: 'Buy',  asset: 'Corporate Bond AAA', amount: 5200000, status: 'Completed', risk: 'Low',    date: new Date('2025-02-19') },
    { txnId: 'TXN-7839', client: 'Vertex Holdings',   type: 'Sell', asset: 'S&P 500 ETF',        amount: 890000,  status: 'Failed',    risk: 'High',   date: new Date('2025-02-19') },
    { txnId: 'TXN-7838', client: 'Pinnacle Group',    type: 'Buy',  asset: 'Gold Futures',       amount: 3100000, status: 'Completed', risk: 'Medium', date: new Date('2025-02-18') },
    { txnId: 'TXN-7837', client: 'Summit Capital',    type: 'Buy',  asset: 'JPY/USD Forward',    amount: 4200000, status: 'Pending',   risk: 'Low',    date: new Date('2025-02-18') },
    { txnId: 'TXN-7836', client: 'Horizon Wealth',    type: 'Sell', asset: 'BIST 100 Index',     amount: 720000,  status: 'Completed', risk: 'High',   date: new Date('2025-02-17') },
  ];
  for (const t of txns) {
    await prisma.transaction.upsert({ where: { txnId: t.txnId }, update: t, create: t });
  }
  console.log('✅ Transactions seeded');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
