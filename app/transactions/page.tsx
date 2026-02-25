'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionTable from '@/components/tables/TransactionTable';
import { Wallet, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function TransactionsPage() {
  const { trans, lang } = useLanguage();

  const summaryCards = [
    {
      label: lang === 'tr' ? 'Toplam Hacim' : 'Total Volume',
      value: '$18.4M',
      change: '+12.3%',
      icon: ArrowUpRight,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      label: lang === 'tr' ? 'Tamamlandı' : 'Completed',
      value: '4',
      change: lang === 'tr' ? 'Toplam %57' : '57% of total',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: lang === 'tr' ? 'Beklemede' : 'Pending',
      value: '2',
      change: lang === 'tr' ? 'Toplam %28' : '28% of total',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: lang === 'tr' ? 'Başarısız' : 'Failed',
      value: '1',
      change: lang === 'tr' ? 'Toplam %14' : '14% of total',
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Wallet size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{trans.pages.transactions.title}</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{trans.pages.transactions.subtitle}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryCards.map((card) => (
            <div key={card.label} className="card hover:translate-y-[-2px] transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-[28px] font-semibold text-[var(--text-primary)] leading-none tracking-tight">{card.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">{card.change}</p>
            </div>
          ))}
        </div>

        {/* Full Table */}
        <Suspense fallback={null}>
          <TransactionTable />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
