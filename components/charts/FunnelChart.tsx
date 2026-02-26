'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';

interface FunnelData {
  label: string;
  value: number;
  color: string;
}

export default function FunnelChart({ data }: { data?: FunnelData[] }) {
  const { lang } = useLanguage();

  const defaultData: FunnelData[] = data || [
    { label: lang === 'tr' ? 'Toplam İşlem' : 'Total Transactions', value: 100, color: '#6366f1' },
    { label: lang === 'tr' ? 'Tamamlanan' : 'Completed', value: 72, color: '#22d3ee' },
    { label: lang === 'tr' ? 'Uzlaşılan' : 'Settled', value: 65, color: '#10b981' },
  ];

  const max = defaultData[0]?.value || 1;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {lang === 'tr' ? 'İşlem Hunisi' : 'Transaction Funnel'}
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          {lang === 'tr' ? 'İşlem tamamlanma akışı' : 'Transaction completion flow'}
        </p>
        <div className="space-y-3">
          {defaultData.map((item, i) => {
            const widthPct = (item.value / max) * 100;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-semibold text-foreground">{item.value}%</span>
                </div>
                <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2"
                    style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                  >
                    {widthPct > 20 && (
                      <span className="text-[10px] font-medium text-white">{item.value}%</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
