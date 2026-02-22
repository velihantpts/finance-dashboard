'use client';

import { BarChart, Bar, Cell, XAxis, ResponsiveContainer } from 'recharts';
import { weeklyVolume } from '@/data/mockData';
import { useLanguage } from '@/providers/LanguageProvider';

export default function WeeklyVolume() {
  const { trans } = useLanguage();
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{trans.charts.weeklyVolume}</h3>
        <span className="text-[11px] text-[var(--text-muted)]">{trans.charts.thisWeek}</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={weeklyVolume} barCategoryGap="30%">
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          />
          <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
            {weeklyVolume.map((_, index) => (
              <Cell
                key={index}
                fill={index === 3 ? '#6366f1' : 'var(--bg-tertiary)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
