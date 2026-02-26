'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import RevenueChart from '@/components/charts/RevenueChart';
import ProfitChart from '@/components/charts/ProfitChart';
import PortfolioChart from '@/components/charts/PortfolioChart';
import WeeklyVolume from '@/components/charts/WeeklyVolume';
import TreemapChart from '@/components/charts/TreemapChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import FunnelChart from '@/components/charts/FunnelChart';
import AiInsights from '@/components/cards/AiInsights';
import { BarChart3, Activity } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const metricsBase = [
  { labelKey: 'ytdReturn', value: '+24.3%', sub: 'vs benchmark +18.1%', color: 'text-emerald-400' },
  { labelKey: 'sharpeRatio', value: '1.84', sub: 'Risk-adjusted return', color: 'text-indigo-400' },
  { labelKey: 'alpha', value: '+6.2%', sub: 'Excess vs market', color: 'text-cyan-400' },
  { labelKey: 'beta', value: '0.87', sub: 'Market sensitivity', color: 'text-amber-400' },
] as const;

const metricLabels = {
  en: { ytdReturn: 'YTD Return', sharpeRatio: 'Sharpe Ratio', alpha: 'Alpha', beta: 'Beta' },
  tr: { ytdReturn: 'YTD Getirisi', sharpeRatio: 'Sharpe Oranı', alpha: 'Alfa', beta: 'Beta' },
};

const metricSubs = {
  en: { ytdReturn: 'vs benchmark +18.1%', sharpeRatio: 'Risk-adjusted return', alpha: 'Excess vs market', beta: 'Market sensitivity' },
  tr: { ytdReturn: 'kıyaslama: +18.1%', sharpeRatio: 'Riske göre düzeltilmiş getiri', alpha: 'Piyasaya kıyasla fazla', beta: 'Piyasa hassasiyeti' },
};

const correlationItems = [
  { label: 'S&P 500', value: '0.82', bar: 82 },
  { label: 'MSCI World', value: '0.76', bar: 76 },
  { label: 'US Treasury', value: '-0.31', bar: 31 },
  { label: 'Gold', value: '0.14', bar: 14 },
];

export default function AnalyticsPage() {
  const { trans, lang } = useLanguage();
  const labels = metricLabels[lang];
  const subs = metricSubs[lang];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <BarChart3 size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">{trans.pages.analytics.title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{trans.pages.analytics.subtitle}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {metricsBase.map((m) => (
            <div key={m.labelKey} className="card hover:translate-y-[-2px] transition-all duration-300">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">{labels[m.labelKey]}</p>
              <p className={`text-[28px] font-bold leading-none tracking-tight ${m.color}`}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-3">{subs[m.labelKey]}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <PortfolioChart />
        </div>

        {/* Charts Row 2 — New visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TreemapChart />
          <FunnelChart />
          <AiInsights />
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfitChart />
          <HeatmapChart />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyVolume />
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={16} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-foreground">
                {lang === 'tr' ? 'Piyasa Korelasyonu' : 'Market Correlation'}
              </h3>
            </div>
            {correlationItems.map((item) => (
              <div key={item.label} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-semibold text-foreground">{item.value}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
