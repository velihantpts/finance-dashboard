import type { RevenueData, PortfolioItem, RiskScore, Transaction, WeeklyVolumeData, QuickStat } from '@/types';

export const revenueData: RevenueData[] = [
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

export const portfolioData: PortfolioItem[] = [
  { name: 'Equities', value: 42, color: '#6366f1' },
  { name: 'Fixed Income', value: 28, color: '#22d3ee' },
  { name: 'Real Estate', value: 15, color: '#f59e0b' },
  { name: 'Commodities', value: 10, color: '#10b981' },
  { name: 'Cash', value: 5, color: '#64748b' },
];

export const riskScores: RiskScore[] = [
  { category: 'Market Risk', score: 72, prev: 68 },
  { category: 'Credit Risk', score: 45, prev: 52 },
  { category: 'Operational', score: 31, prev: 35 },
  { category: 'Liquidity', score: 58, prev: 55 },
  { category: 'Compliance', score: 22, prev: 28 },
];

export const transactions: Transaction[] = [
  { id: 'TXN-7842', client: 'Goldman Capital', type: 'Buy', asset: 'US Treasury 10Y', amount: 2500000, status: 'Completed', date: '2025-02-20', risk: 'Low' },
  { id: 'TXN-7841', client: 'Meridian Fund', type: 'Sell', asset: 'EUR/USD FX Swap', amount: 1800000, status: 'Pending', date: '2025-02-20', risk: 'Medium' },
  { id: 'TXN-7840', client: 'Atlas Investments', type: 'Buy', asset: 'Corporate Bond AAA', amount: 5200000, status: 'Completed', date: '2025-02-19', risk: 'Low' },
  { id: 'TXN-7839', client: 'Vertex Holdings', type: 'Sell', asset: 'S&P 500 ETF', amount: 890000, status: 'Failed', date: '2025-02-19', risk: 'High' },
  { id: 'TXN-7838', client: 'Pinnacle Group', type: 'Buy', asset: 'Gold Futures', amount: 3100000, status: 'Completed', date: '2025-02-18', risk: 'Medium' },
  { id: 'TXN-7837', client: 'Summit Capital', type: 'Buy', asset: 'JPY/USD Forward', amount: 4200000, status: 'Pending', date: '2025-02-18', risk: 'Low' },
  { id: 'TXN-7836', client: 'Horizon Wealth', type: 'Sell', asset: 'BIST 100 Index', amount: 720000, status: 'Completed', date: '2025-02-17', risk: 'High' },
];

export const weeklyVolume: WeeklyVolumeData[] = [
  { day: 'Mon', volume: 24 },
  { day: 'Tue', volume: 31 },
  { day: 'Wed', volume: 28 },
  { day: 'Thu', volume: 45 },
  { day: 'Fri', volume: 38 },
];

export const quickStats: QuickStat[] = [
  { label: 'Avg. Transaction', value: '$2.4M', change: '+5.2%' },
  { label: 'Settlement Rate', value: '98.7%', change: '+0.3%' },
  { label: 'Compliance Score', value: 'A+', change: 'Stable' },
];
