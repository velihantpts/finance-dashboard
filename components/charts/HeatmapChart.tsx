'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Card, CardContent } from '@/components/ui/card';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const HOURS = Array.from({ length: 12 }, (_, i) => i * 2);

function getColor(value: number, max: number): string {
  const ratio = value / max;
  if (ratio === 0) return 'rgba(99,102,241,0.05)';
  if (ratio < 0.25) return 'rgba(99,102,241,0.15)';
  if (ratio < 0.5) return 'rgba(99,102,241,0.35)';
  if (ratio < 0.75) return 'rgba(99,102,241,0.6)';
  return 'rgba(99,102,241,0.9)';
}

export default function HeatmapChart() {
  const { lang } = useLanguage();
  const days = lang === 'tr' ? DAYS_TR : DAYS;

  const data = useMemo(() => {
    const grid: number[][] = [];
    for (let d = 0; d < 7; d++) {
      const row: number[] = [];
      for (let h = 0; h < 12; h++) {
        // Simulate realistic trading patterns
        const hour = h * 2;
        const isWeekday = d < 5;
        const isBusinessHours = hour >= 8 && hour <= 18;
        const base = isWeekday && isBusinessHours ? 15 : isWeekday ? 3 : 1;
        const peak = (hour === 10 || hour === 14) && isWeekday ? 12 : 0;
        row.push(Math.floor(Math.random() * base + peak));
      }
      grid.push(row);
    }
    return grid;
  }, []);

  const max = Math.max(...data.flat());
  const cellSize = 28;
  const gap = 3;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {lang === 'tr' ? 'İşlem Yoğunluğu' : 'Transaction Heatmap'}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {lang === 'tr' ? 'Haftalık işlem dağılımı' : 'Weekly transaction distribution'}
        </p>
        <div className="overflow-x-auto">
          <svg width={12 * (cellSize + gap) + 40} height={7 * (cellSize + gap) + 24}>
            {/* Hour labels */}
            {HOURS.map((hour, hi) => (
              <text key={hour} x={40 + hi * (cellSize + gap) + cellSize / 2} y={12} textAnchor="middle" fill="var(--muted-foreground)" fontSize={9}>
                {hour}h
              </text>
            ))}
            {/* Day labels + cells */}
            {data.map((row, di) => (
              <g key={di}>
                <text x={0} y={24 + di * (cellSize + gap) + cellSize / 2 + 4} fill="var(--muted-foreground)" fontSize={10}>
                  {days[di]}
                </text>
                {row.map((value, hi) => (
                  <rect
                    key={hi}
                    x={40 + hi * (cellSize + gap)}
                    y={20 + di * (cellSize + gap)}
                    width={cellSize}
                    height={cellSize}
                    rx={6}
                    fill={getColor(value, max)}
                  >
                    <title>{`${days[di]} ${HOURS[hi]}:00 — ${value} ${lang === 'tr' ? 'işlem' : 'transactions'}`}</title>
                  </rect>
                ))}
              </g>
            ))}
          </svg>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-muted-foreground">{lang === 'tr' ? 'Az' : 'Less'}</span>
          {[0.05, 0.15, 0.35, 0.6, 0.9].map((opacity) => (
            <div key={opacity} className="w-3.5 h-3.5 rounded" style={{ background: `rgba(99,102,241,${opacity})` }} />
          ))}
          <span className="text-[10px] text-muted-foreground">{lang === 'tr' ? 'Çok' : 'More'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
