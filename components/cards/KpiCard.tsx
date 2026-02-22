'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { ComponentType } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  trend: 'up' | 'down';
  accent: string;
}

export default function KpiCard({ title, value, change, icon: Icon, trend, accent }: KpiCardProps) {
  const { trans } = useLanguage();
  return (
    <div className="card group hover:translate-y-[-2px] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium mb-3">
            {title}
          </p>
          <p className="text-[28px] font-bold text-[var(--text-primary)] leading-none tracking-tight">
            {value}
          </p>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}15`, color: accent }}
        >
          <Icon size={22} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        {trend === 'up' ? (
          <ArrowUpRight size={14} className="text-emerald-400" />
        ) : (
          <ArrowDownRight size={14} className="text-red-400" />
        )}
        <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
          {change}
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">{trans.kpi.vsLastMonth}</span>
      </div>
    </div>
  );
}
