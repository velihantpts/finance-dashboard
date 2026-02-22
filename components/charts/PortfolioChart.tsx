'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import { portfolioData } from '@/data/mockData';
import SectionHeader from '@/components/ui/SectionHeader';
import { useLanguage } from '@/providers/LanguageProvider';

export default function PortfolioChart() {
  const { trans } = useLanguage();
  return (
    <div className="card">
      <SectionHeader
        title={trans.charts.portfolioAllocation}
        subtitle={trans.charts.assetDistribution}
        action={
          <button className="w-7 h-7 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center transition-colors">
            <MoreHorizontal size={14} className="text-[var(--text-muted)]" />
          </button>
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
              <div
                className="w-2.5 h-2.5 rounded-[3px]"
                style={{ background: item.color }}
              />
              <span className="text-xs text-[var(--text-secondary)]">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
