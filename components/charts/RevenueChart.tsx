'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { revenueData } from '@/data/mockData';
import type { Period } from '@/types';
import PeriodSelector from '@/components/ui/PeriodSelector';
import SectionHeader from '@/components/ui/SectionHeader';
import CustomTooltip from './CustomTooltip';
import { useLanguage } from '@/providers/LanguageProvider';

const periodSlices: Record<Period, number> = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12,
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<Period>('1Y');
  const { trans } = useLanguage();

  const data = useMemo(
    () => revenueData.slice(-periodSlices[period]),
    [period]
  );

  return (
    <div className="card h-full">
      <SectionHeader
        title={trans.charts.revenueExpenses}
        subtitle={trans.charts.monthlyPerformance}
        action={<PeriodSelector value={period} onChange={setPeriod} />}
      />
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            tickFormatter={(v: number) => `${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#expenseGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-[3px] rounded-full bg-indigo-500" />
          <span className="text-[11px] text-[var(--text-muted)]">{trans.charts.revenue}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-[3px] rounded-full bg-cyan-400" />
          <span className="text-[11px] text-[var(--text-muted)]">{trans.charts.expenses}</span>
        </div>
      </div>
    </div>
  );
}
