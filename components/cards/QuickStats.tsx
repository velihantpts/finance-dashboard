'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { useStats } from '@/hooks/useApi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const labelKeys = ['avgTransaction', 'settlementRate', 'complianceScore'] as const;

export default function QuickStats() {
  const { trans } = useLanguage();
  const { format: formatCur } = useCurrency();
  const { data, loading } = useStats();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-3.5 w-28 mb-4" />
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-2.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                {i < 3 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayStats = data
    ? [
        { value: formatCur(data.avgTransaction) },
        { value: `${data.settlementRate.toFixed(1)}%` },
        { value: `${data.completed}/${data.total}` },
      ]
    : [];

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">{trans.quickStats.title}</h3>
        <div className="space-y-0">
          {displayStats.map((stat, i) => (
            <div key={labelKeys[i]}>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs text-muted-foreground">{trans.quickStats[labelKeys[i]]}</span>
                <span className="text-xs font-semibold text-foreground">{stat.value}</span>
              </div>
              {i < displayStats.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
