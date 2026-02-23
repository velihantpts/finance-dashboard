'use client';

import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import KpiCard from './KpiCard';
import { useLanguage } from '@/providers/LanguageProvider';
import { useKpi } from '@/hooks/useApi';
import type { ComponentType } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  total_aum:      DollarSign,
  net_revenue:    TrendingUp,
  active_clients: Users,
  transactions:   CreditCard,
};

const accentMap: Record<string, string> = {
  total_aum:      '#6366f1',
  net_revenue:    '#22d3ee',
  active_clients: '#10b981',
  transactions:   '#f59e0b',
};

const labelKeyMap: Record<string, 'totalAUM' | 'netRevenue' | 'activeClients' | 'transactions'> = {
  total_aum:      'totalAUM',
  net_revenue:    'netRevenue',
  active_clients: 'activeClients',
  transactions:   'transactions',
};

export default function KpiGrid() {
  const { trans } = useLanguage();
  const { data, loading } = useKpi();

  if (loading || !data) {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="w-11 h-11 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-3/4 mt-2" />
              <Skeleton className="h-3 w-1/2 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {data.map((item) => {
        const labelKey = labelKeyMap[item.key];
        const title = labelKey ? trans.kpi[labelKey] : item.key;
        return (
          <KpiCard
            key={item.id}
            title={title}
            value={item.value}
            change={item.change}
            icon={iconMap[item.key] ?? DollarSign}
            trend={item.trend === 'up' ? 'up' : 'down'}
            accent={accentMap[item.key] ?? '#6366f1'}
          />
        );
      })}
    </div>
  );
}
