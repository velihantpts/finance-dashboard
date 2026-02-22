export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface PortfolioItem {
  name: string;
  value: number;
  color: string;
}

export interface RiskScore {
  category: string;
  score: number;
  prev: number;
}

export interface Transaction {
  id: string;
  client: string;
  type: 'Buy' | 'Sell';
  asset: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  risk: 'Low' | 'Medium' | 'High';
}

export interface WeeklyVolumeData {
  day: string;
  volume: number;
}

export interface QuickStat {
  label: string;
  value: string;
  change: string;
}

export interface KpiCardData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  accent: string;
}

export type Period = '1M' | '3M' | '6M' | '1Y';
