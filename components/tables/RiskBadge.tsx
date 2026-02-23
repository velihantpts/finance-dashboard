import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  risk: 'Low' | 'Medium' | 'High';
}

const riskStyles: Record<string, string> = {
  Low:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10  text-amber-400  border-amber-500/20',
  High:   'bg-red-500/10    text-red-400    border-red-500/20',
};

export default function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', riskStyles[risk])}>
      {risk}
    </Badge>
  );
}
