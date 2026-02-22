'use client';

import { quickStats } from '@/data/mockData';
import { useLanguage } from '@/providers/LanguageProvider';

const labelKeys = ['avgTransaction', 'settlementRate', 'complianceScore'] as const;

export default function QuickStats() {
  const { trans } = useLanguage();
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{trans.quickStats.title}</h3>
      <div className="space-y-3">
        {quickStats.map((stat, i) => (
          <div
            key={labelKeys[i]}
            className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
          >
            <span className="text-xs text-[var(--text-muted)]">{trans.quickStats[labelKeys[i]]}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-primary)]">{stat.value}</span>
              <span className="text-[10px] text-emerald-400">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
