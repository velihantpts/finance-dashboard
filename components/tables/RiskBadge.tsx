interface RiskBadgeProps {
  risk: 'Low' | 'Medium' | 'High';
}

const riskTextStyles: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-red-400',
};

const riskDotStyles: Record<string, string> = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-red-400',
};

export default function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${riskDotStyles[risk]}`} />
      <span className={`text-xs font-medium ${riskTextStyles[risk]}`}>{risk}</span>
    </div>
  );
}
