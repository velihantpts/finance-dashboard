'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { riskScores } from '@/data/mockData';
import { useLanguage } from '@/providers/LanguageProvider';

function getBarColor(score: number): string {
  if (score <= 30) return '#10b981';
  if (score <= 60) return '#f59e0b';
  return '#ef4444';
}

function getRiskLabel(score: number, lang: 'en' | 'tr'): string {
  if (lang === 'tr') {
    if (score <= 30) return 'Düşük';
    if (score <= 60) return 'Orta';
    return 'Yüksek';
  }
  if (score <= 30) return 'Low';
  if (score <= 60) return 'Medium';
  return 'High';
}

const overallScore = Math.round(riskScores.reduce((acc, r) => acc + r.score, 0) / riskScores.length);

export default function RiskPage() {
  const { trans, lang } = useLanguage();

  const riskAlerts = [
    {
      level: 'High',
      message: lang === 'tr'
        ? 'Piyasa Riski eşiği aştı (72 / limit 70)'
        : 'Market Risk exceeds threshold (72 / limit 70)',
      time: lang === 'tr' ? '15 dk önce' : '15 min ago',
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      level: 'Medium',
      message: lang === 'tr'
        ? 'Likidite Riski uyarı seviyesine yaklaşıyor (58)'
        : 'Liquidity Risk approaching warning level (58)',
      time: lang === 'tr' ? '1 saat önce' : '1 hr ago',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      level: 'Low',
      message: lang === 'tr'
        ? 'Kredi Riski bu dönemde 7 puan iyileşti'
        : 'Credit Risk improved by 7 points this period',
      time: lang === 'tr' ? '3 saat önce' : '3 hrs ago',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      level: 'Low',
      message: lang === 'tr'
        ? 'Uyumluluk Skoru optimal seviyede (22)'
        : 'Compliance Score at optimal level (22)',
      time: lang === 'tr' ? '1 gün önce' : '1 day ago',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Shield size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{trans.pages.risk.title}</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{trans.pages.risk.subtitle}</p>
          </div>
        </div>

        {/* Overall Score + Category Cards */}
        <div className="grid grid-cols-3 gap-6">
          {/* Overall */}
          <div className="card flex flex-col items-center justify-center py-6">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium mb-3">
              {lang === 'tr' ? 'Genel Risk Skoru' : 'Overall Risk Score'}
            </p>
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={getBarColor(overallScore)}
                  strokeWidth="10"
                  strokeDasharray={`${overallScore * 2.513} 251.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--text-primary)]">{overallScore}</span>
                <span className="text-[10px] text-amber-400 font-medium">{getRiskLabel(overallScore, lang)}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              {lang === 'tr' ? 'Bileşik risk endeksi' : 'Composite risk index'}
            </p>
          </div>

          {/* Category Breakdown */}
          <div className="col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {lang === 'tr' ? 'Risk Kategori Dağılımı' : 'Risk Category Breakdown'}
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-medium text-amber-400">
                  {lang === 'tr' ? 'Yükseltilmiş' : 'Elevated'}
                </span>
              </div>
            </div>
            {riskScores.map((r) => {
              const diff = r.score - r.prev;
              return (
                <div key={r.category} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[var(--text-secondary)]">{r.category}</span>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{ color: getBarColor(r.score), background: `${getBarColor(r.score)}15` }}
                      >
                        {getRiskLabel(r.score, lang)}
                      </span>
                      <span className="text-xs font-semibold text-[var(--text-primary)] w-6 text-right">{r.score}</span>
                      <span className={`text-[10px] font-medium w-8 ${diff > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${r.score}%`, background: getBarColor(r.score) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {lang === 'tr' ? 'Risk Uyarıları' : 'Risk Alerts'}
            </h3>
            <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-red-400/10 text-red-400">
              {lang === 'tr' ? '1 Aktif' : '1 Active'}
            </span>
          </div>
          <div className="space-y-0">
            {riskAlerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3.5 border-b border-[var(--border)] last:border-0"
              >
                <div className={`w-7 h-7 rounded-lg ${alert.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <alert.icon size={14} className={alert.color} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--text-primary)]">{alert.message}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{alert.time}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${
                  alert.level === 'High' ? 'bg-red-400/10 text-red-400' :
                  alert.level === 'Medium' ? 'bg-amber-400/10 text-amber-400' :
                  'bg-emerald-400/10 text-emerald-400'
                }`}>
                  {getRiskLabel(alert.level === 'High' ? 100 : alert.level === 'Medium' ? 50 : 10, lang)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Limits */}
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">
            {lang === 'tr' ? 'Risk Limitleri & Eşikleri' : 'Risk Limits & Thresholds'}
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {riskScores.map((r) => (
              <div key={r.category} className="text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center border-2"
                  style={{ borderColor: getBarColor(r.score), background: `${getBarColor(r.score)}15` }}
                >
                  <span className="text-xs font-bold" style={{ color: getBarColor(r.score) }}>{r.score}</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] leading-tight">{r.category}</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: getBarColor(r.score) }}>
                  {getRiskLabel(r.score, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
