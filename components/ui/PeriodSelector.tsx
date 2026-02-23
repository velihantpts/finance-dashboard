'use client';

import type { Period } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
      {(['1M', '3M', '6M', '1Y'] as Period[]).map((p) => (
        <Button
          key={p}
          size="sm"
          variant={value === p ? 'default' : 'ghost'}
          onClick={() => onChange(p)}
          className={cn(
            'h-7 px-3 text-[11px] font-medium rounded-md',
            value === p
              ? 'shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-transparent',
          )}
        >
          {p}
        </Button>
      ))}
    </div>
  );
}
