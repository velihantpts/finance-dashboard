'use client';

import type { Period } from '@/types';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-0.5">
      {(['1M', '3M', '6M', '1Y'] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
            value === p
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
