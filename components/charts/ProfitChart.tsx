'use client';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { revenueData } from '@/data/mockData';
import SectionHeader from '@/components/ui/SectionHeader';
import CustomTooltip from './CustomTooltip';
import { useLanguage } from '@/providers/LanguageProvider';

export default function ProfitChart() {
  const { trans } = useLanguage();
  return (
    <div className="card">
      <SectionHeader
        title={trans.charts.profitTrend}
        subtitle={trans.charts.monthlyNetProfit}
        action={
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">+18.4%</span>
          </div>
        }
      />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickFormatter={(v: number) => `${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
            {revenueData.map((_, index) => (
              <Cell
                key={index}
                fill={index === revenueData.length - 1 ? '#6366f1' : '#6366f130'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
