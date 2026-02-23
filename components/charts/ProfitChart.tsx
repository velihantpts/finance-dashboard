'use client';

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import CustomTooltip from './CustomTooltip';
import { useLanguage } from '@/providers/LanguageProvider';
import { useRevenue } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfitChart() {
  const { trans } = useLanguage();
  const { data: allData, loading } = useRevenue();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const revenueData = allData ?? [];

  return (
    <Card>
      <CardContent className="pt-6">
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
      </CardContent>
    </Card>
  );
}
