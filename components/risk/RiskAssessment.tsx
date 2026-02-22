'use client';

import { riskScores } from '@/data/mockData';
import SectionHeader from '@/components/ui/SectionHeader';
import { useLanguage } from '@/providers/LanguageProvider';

function getBarColor(score: number): string {
  if (score <= 30) return '#10b981';
  if (score <= 60) return '#f59e0b';
  return '#ef4444';
}

export default function RiskAssessment() {
  const { trans } = useLanguage();
  return (
    <div className="card">
      <SectionHeader
        title={trans.charts.riskAssessment}
        subtitle={trans.charts.currentRiskScores}
        action={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-400/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">{trans.charts.healthy}</span>
          </div>
        }
      />
      {riskScores.map((r) => {
        const diff = r.score - r.prev;
        return (
          <div key={r.category} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-secondary)]">{r.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">{r.score}</span>
                <span className={`text-[10px] font-medium ${diff > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {diff > 0 ? `+${diff}` : diff}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${r.score}%`, background: getBarColor(r.score) }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
