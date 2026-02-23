import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Completed' | 'Pending' | 'Failed';
}

const statusStyles: Record<string, string> = {
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  Pending:   'bg-amber-500/10  text-amber-400  border-amber-500/20  hover:bg-amber-500/20',
  Failed:    'bg-red-500/10    text-red-400    border-red-500/20    hover:bg-red-500/20',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', statusStyles[status])}>
      {status}
    </Badge>
  );
}
