'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useLanguage } from '@/providers/LanguageProvider';
import { usePortfolio } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function PortfolioChart() {
  const { trans } = useLanguage();
  const { data, loading } = usePortfolio();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="w-7 h-7 rounded-lg" />
          </div>
          <div className="flex justify-center mb-4">
            <Skeleton className="w-[200px] h-[200px] rounded-full" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-2.5 h-2.5 rounded-sm" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const portfolioData = data ?? [];

  return (
    <Card>
      <CardContent className="pt-6">
        <SectionHeader
          title={trans.charts.portfolioAllocation}
          subtitle={trans.charts.assetDistribution}
          action={
            <Button variant="ghost" size="icon" className="w-7 h-7">
              <MoreHorizontal size={14} className="text-muted-foreground" />
            </Button>
          }
        />
        <div className="flex justify-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                cornerRadius={4}
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) => [`${value ?? 0}%`, '']}
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2.5 mt-2">
          {portfolioData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
