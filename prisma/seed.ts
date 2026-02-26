import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── Users ─────────────────────────────────────────────────
  const hashed = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@financehub.com' },
    update: {},
    create: {
      name: 'Velihan T.',
      email: 'admin@financehub.com',
      password: hashed,
      role: 'admin',
    },
  });

  const analystPw = await bcrypt.hash('Analyst123!', 10);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@financehub.com' },
    update: {},
    create: {
      name: 'Sarah Johnson',
      email: 'analyst@financehub.com',
      password: analystPw,
      role: 'analyst',
    },
  });

  const viewerPw = await bcrypt.hash('Viewer123!', 10);
  await prisma.user.upsert({
    where: { email: 'viewer@financehub.com' },
    update: {},
    create: {
      name: 'Mike Chen',
      email: 'viewer@financehub.com',
      password: viewerPw,
      role: 'viewer',
    },
  });
  console.log('✅ Users created (admin, analyst, viewer)');

  // ── KPI Metrics ──────────────────────────────────────────
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

  // ── Revenue ──────────────────────────────────────────────
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

  // ── Portfolio Allocations ────────────────────────────────
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

  // ── Risk Scores ──────────────────────────────────────────
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

  // ── Transactions (50 realistic entries) ──────────────────
  const clients = ['Goldman Capital', 'Meridian Fund', 'Atlas Investments', 'Vertex Holdings', 'Pinnacle Group', 'Summit Capital', 'Horizon Wealth', 'Blackrock Partners', 'Vanguard Trust', 'Citadel Securities'];
  const assets = ['US Treasury 10Y', 'EUR/USD FX Swap', 'Corporate Bond AAA', 'S&P 500 ETF', 'Gold Futures', 'JPY/USD Forward', 'BIST 100 Index', 'BTC/USD', 'Crude Oil WTI', 'Silver Futures', 'German Bund 5Y', 'MSCI Emerging'];
  const types = ['Buy', 'Sell'];
  const statuses = ['Completed', 'Pending', 'Failed'];
  const risksArr = ['Low', 'Medium', 'High'];

  const txns = [];
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    txns.push({
      txnId: `TXN-${7842 - i}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      type: types[Math.floor(Math.random() * types.length)],
      asset: assets[Math.floor(Math.random() * assets.length)],
      amount: Math.floor(Math.random() * 9000000 + 100000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      risk: risksArr[Math.floor(Math.random() * risksArr.length)],
      date: new Date(Date.now() - daysAgo * 86400000),
    });
  }
  for (const t of txns) {
    await prisma.transaction.upsert({ where: { txnId: t.txnId }, update: t, create: t });
  }
  console.log('✅ 50 transactions seeded');

  // ── Notifications ────────────────────────────────────────
  const notifData = [
    { userId: admin.id, type: 'alert', title: 'Market Risk Threshold Exceeded', message: 'Market Risk score reached 72, exceeding the limit of 70.' },
    { userId: admin.id, type: 'success', title: 'Transaction Completed', message: 'TXN-7842 Goldman Capital Buy $2.5M completed successfully.' },
    { userId: admin.id, type: 'warning', title: 'Liquidity Risk Elevated', message: 'Liquidity Risk approaching warning level at 58.', read: true },
    { userId: admin.id, type: 'info', title: 'Monthly Report Ready', message: 'Q4 2024 Performance Report is available for download.', read: true },
    { userId: admin.id, type: 'success', title: 'Compliance Check Passed', message: 'All compliance requirements met for this period.', read: true },
    { userId: analyst.id, type: 'info', title: 'New Assignment', message: 'You have been assigned to review Q1 risk assessment.' },
    { userId: analyst.id, type: 'alert', title: 'Failed Transaction Alert', message: 'TXN-7839 Vertex Holdings failed — requires investigation.' },
  ];
  await prisma.notification.deleteMany({});
  for (const n of notifData) {
    await prisma.notification.create({ data: n });
  }
  console.log('✅ Notifications seeded');

  // ── Audit Logs ───────────────────────────────────────────
  const auditData = [
    { userId: admin.id, action: 'LOGIN', entity: 'session', details: 'Logged in from 192.168.1.100' },
    { userId: admin.id, action: 'CREATE', entity: 'transaction', entityId: 'TXN-7842', details: 'Created Buy order $2.5M' },
    { userId: admin.id, action: 'UPDATE', entity: 'profile', details: 'Updated profile information' },
    { userId: analyst.id, action: 'LOGIN', entity: 'session', details: 'Logged in from 10.0.0.55' },
    { userId: analyst.id, action: 'VIEW', entity: 'report', details: 'Viewed Q4 Performance Report' },
    { userId: admin.id, action: 'EXPORT', entity: 'transactions', details: 'Exported 50 transactions as CSV' },
    { userId: admin.id, action: 'UPDATE', entity: 'risk-score', entityId: 'Market Risk', details: 'Risk score updated from 68 to 72' },
  ];
  await prisma.auditLog.deleteMany({});
  for (const a of auditData) {
    await prisma.auditLog.create({ data: a });
  }
  console.log('✅ Audit logs seeded');

  // ── Scheduled Reports ────────────────────────────────────
  const schedData = [
    { userId: admin.id, name: 'Weekly Risk Summary', frequency: 'weekly', email: 'admin@financehub.com', reportType: 'risk', active: true, nextRun: new Date(Date.now() + 7 * 86400000) },
    { userId: admin.id, name: 'Monthly Performance Report', frequency: 'monthly', email: 'admin@financehub.com', reportType: 'performance', active: true, nextRun: new Date(Date.now() + 30 * 86400000) },
    { userId: analyst.id, name: 'Daily Transaction Digest', frequency: 'daily', email: 'analyst@financehub.com', reportType: 'general', active: false, nextRun: new Date(Date.now() + 86400000) },
  ];
  await prisma.scheduledReport.deleteMany({});
  for (const s of schedData) {
    await prisma.scheduledReport.create({ data: s });
  }
  console.log('✅ Scheduled reports seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:   admin@financehub.com   / Admin123!');
  console.log('   Analyst: analyst@financehub.com / Analyst123!');
  console.log('   Viewer:  viewer@financehub.com  / Viewer123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
