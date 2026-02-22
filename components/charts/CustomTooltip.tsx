import { formatCurrency } from '@/lib/utils';

interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 shadow-2xl">
      <p className="text-[11px] text-[var(--text-muted)] mb-2 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-[var(--text-secondary)] capitalize">{entry.dataKey}:</span>
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
