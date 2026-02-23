'use client';

import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import KpiCard from './KpiCard';
import { useLanguage } from '@/providers/LanguageProvider';

const kpiItemsBase = [
  { labelKey: 'totalAUM' as const, value: '$847.2M', change: '+12.5%', icon: DollarSign, trend: 'up' as const, accent: '#6366f1' },
  { labelKey: 'netRevenue' as const, value: '$4.15M', change: '+8.3%', icon: TrendingUp, trend: 'up' as const, accent: '#22d3ee' },
  { labelKey: 'activeClients' as const, value: '2,847', change: '+3.2%', icon: Users, trend: 'up' as const, accent: '#10b981' },
  { labelKey: 'transactions' as const, value: '12,493', change: '-2.1%', icon: CreditCard, trend: 'down' as const, accent: '#f59e0b' },
];

export default function KpiGrid() {
  const { trans } = useLanguage();
  return (
    <div className="grid grid-cols-4 gap-6">
      {kpiItemsBase.map((item) => (
        <KpiCard key={item.labelKey} {...item} title={trans.kpi[item.labelKey]} />
      ))}
    </div>
  );
}
