'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const reportsData = [
  {
    titleKey: 'q4Report',
    descKey: 'q4Desc',
    date: 'Feb 1, 2025',
    type: 'Quarterly',
    size: '4.2 MB',
    icon: TrendingUp,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    titleKey: 'riskReport',
    descKey: 'riskDesc',
    date: 'Jan 31, 2025',
    type: 'Monthly',
    size: '2.8 MB',
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    titleKey: 'allocationReport',
    descKey: 'allocationDesc',
    date: 'Jan 15, 2025',
    type: 'Annual',
    size: '6.1 MB',
    icon: PieChart,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    titleKey: 'complianceReport',
    descKey: 'complianceDesc',
    date: 'Jan 10, 2025',
    type: 'Compliance',
    size: '3.4 MB',
    icon: FileText,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    titleKey: 'reconcReport',
    descKey: 'reconcDesc',
    date: 'Jan 5, 2025',
    type: 'Monthly',
    size: '1.9 MB',
    icon: ArrowUpRight,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
];

const reportTitles = {
  en: {
    q4Report: 'Q4 2024 Performance Report',
    riskReport: 'Monthly Risk Assessment — Jan 2025',
    allocationReport: 'Asset Allocation Review 2024',
    complianceReport: 'Compliance & Regulatory Report',
    reconcReport: 'Transaction Reconciliation — Dec 2024',
  },
  tr: {
    q4Report: 'Q4 2024 Performans Raporu',
    riskReport: 'Aylık Risk Değerlendirmesi — Oca 2025',
    allocationReport: 'Varlık Dağılımı İncelemesi 2024',
    complianceReport: 'Uyumluluk & Düzenleyici Rapor',
    reconcReport: 'İşlem Mutabakatı — Ara 2024',
  },
};

const reportDescs = {
  en: {
    q4Desc: 'Comprehensive quarterly analysis including P&L, attribution, and risk metrics.',
    riskDesc: 'Market, credit, and operational risk evaluation with scenario analysis.',
    allocationDesc: 'Annual portfolio composition analysis with rebalancing recommendations.',
    complianceDesc: 'Regulatory compliance status, audit trail, and policy adherence summary.',
    reconcDesc: 'End-of-month trade reconciliation, settlement status, and discrepancy log.',
  },
  tr: {
    q4Desc: 'K&Z, atıf ve risk metrikleri dahil kapsamlı çeyreklik analiz.',
    riskDesc: 'Senaryo analizi içeren piyasa, kredi ve operasyonel risk değerlendirmesi.',
    allocationDesc: 'Yeniden dengeleme önerileri içeren yıllık portföy bileşim analizi.',
    complianceDesc: 'Düzenleyici uyumluluk durumu, denetim izi ve politika özeti.',
    reconcDesc: 'Ay sonu işlem mutabakatı, uzlaşı durumu ve tutarsızlık kaydı.',
  },
};

const typeBadgeStyle: Record<string, string> = {
  Quarterly: 'bg-indigo-500/10 text-indigo-400',
  Monthly: 'bg-cyan-400/10 text-cyan-400',
  Annual: 'bg-amber-400/10 text-amber-400',
  Compliance: 'bg-emerald-400/10 text-emerald-400',
};

const statsLabels = {
  en: [
    { label: 'Reports Generated', sub: 'This year' },
    { label: 'Last Generated', sub: 'Q4 2024 Performance' },
    { label: 'Scheduled', sub: 'Next 30 days' },
  ],
  tr: [
    { label: 'Oluşturulan Rapor', sub: 'Bu yıl' },
    { label: 'Son Oluşturulan', sub: 'Q4 2024 Performans' },
    { label: 'Planlanmış', sub: 'Sonraki 30 gün' },
  ],
};

const statsValues = ['148', 'Feb 1', '3'];

export default function ReportsPage() {
  const { trans, lang } = useLanguage();
  const [downloadedIdx, setDownloadedIdx] = useState<number | null>(null);

  const handleDownload = (i: number) => {
    setDownloadedIdx(i);
    setTimeout(() => setDownloadedIdx(null), 2000);
  };

  const titles = reportTitles[lang];
  const descs = reportDescs[lang];
  const stats = statsLabels[lang];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FileText size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{trans.pages.reports.title}</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{trans.pages.reports.subtitle}</p>
            </div>
          </div>
          <button className="h-9 px-4 rounded-xl bg-indigo-500 text-white text-xs font-medium flex items-center gap-2 hover:bg-indigo-600 transition-colors">
            <Calendar size={14} />
            {trans.pages.reports.schedule}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <div key={i} className="card">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{statsValues[i]}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Report List */}
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">{trans.pages.reports.recent}</h3>
          <div className="space-y-0">
            {reportsData.map((report, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] -mx-6 px-6 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center shrink-0`}>
                  <report.icon size={18} className={report.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {titles[report.titleKey as keyof typeof titles]}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                    {descs[report.descKey as keyof typeof descs]}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${typeBadgeStyle[report.type]}`}>
                    {report.type}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] w-20 text-right">{report.date}</span>
                  <span className="text-xs text-[var(--text-muted)] w-12 text-right">{report.size}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(i); }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      downloadedIdx === i
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-indigo-400'
                    }`}
                    title={downloadedIdx === i ? trans.pages.reports.downloaded : trans.pages.reports.download}
                  >
                    {downloadedIdx === i ? <Check size={14} /> : <Download size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
