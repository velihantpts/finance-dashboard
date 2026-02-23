'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { useLanguage } from '@/providers/LanguageProvider';
import { useRiskScores } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function getBarColor(score: number): string {
  if (score <= 30) return '#10b981';
  if (score <= 60) return '#f59e0b';
  return '#ef4444';
}

export default function RiskAssessment() {
  const { trans } = useLanguage();
  const { data, loading } = useRiskScores();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const riskScores = data ?? [];

  return (
    <Card>
      <CardContent className="pt-6">
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
          const diff = r.score - r.previous;
          return (
            <div key={r.category} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{r.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{r.score}</span>
                  <span className={`text-[10px] font-medium ${diff > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${r.score}%`, background: getBarColor(r.score) }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
