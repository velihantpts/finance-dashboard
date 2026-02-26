'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, ArrowUpRight, Check, Loader2, FileDown, Trash2, Power } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { toast } from 'sonner';
import { generateReportPdf } from '@/lib/pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

type ApiEndpoint = '/api/revenue' | '/api/risk-scores' | '/api/portfolio' | '/api/transactions';

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  email: string;
  reportType: string;
  active: boolean;
  nextRun: string | null;
  createdAt: string;
}

const reportsData: {
  titleKey: string; descKey: string; date: string; type: string; size: string;
  icon: typeof TrendingUp; color: string; bg: string; api: ApiEndpoint;
}[] = [
  { titleKey: 'q4Report', descKey: 'q4Desc', date: 'Feb 1, 2025', type: 'Quarterly', size: '4.2 MB', icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10', api: '/api/revenue' },
  { titleKey: 'riskReport', descKey: 'riskDesc', date: 'Jan 31, 2025', type: 'Monthly', size: '2.8 MB', icon: BarChart3, color: 'text-cyan-400', bg: 'bg-cyan-400/10', api: '/api/risk-scores' },
  { titleKey: 'allocationReport', descKey: 'allocationDesc', date: 'Jan 15, 2025', type: 'Annual', size: '6.1 MB', icon: PieChart, color: 'text-amber-400', bg: 'bg-amber-400/10', api: '/api/portfolio' },
  { titleKey: 'complianceReport', descKey: 'complianceDesc', date: 'Jan 10, 2025', type: 'Compliance', size: '3.4 MB', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10', api: '/api/transactions' },
  { titleKey: 'reconcReport', descKey: 'reconcDesc', date: 'Jan 5, 2025', type: 'Monthly', size: '1.9 MB', icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-400/10', api: '/api/transactions' },
];

const reportTitles = {
  en: { q4Report: 'Q4 2024 Performance Report', riskReport: 'Monthly Risk Assessment — Jan 2025', allocationReport: 'Asset Allocation Review 2024', complianceReport: 'Compliance & Regulatory Report', reconcReport: 'Transaction Reconciliation — Dec 2024' },
  tr: { q4Report: 'Q4 2024 Performans Raporu', riskReport: 'Aylık Risk Değerlendirmesi — Oca 2025', allocationReport: 'Varlık Dağılımı İncelemesi 2024', complianceReport: 'Uyumluluk & Düzenleyici Rapor', reconcReport: 'İşlem Mutabakatı — Ara 2024' },
};

const reportDescs = {
  en: { q4Desc: 'Comprehensive quarterly analysis including P&L, attribution, and risk metrics.', riskDesc: 'Market, credit, and operational risk evaluation with scenario analysis.', allocationDesc: 'Annual portfolio composition analysis with rebalancing recommendations.', complianceDesc: 'Regulatory compliance status, audit trail, and policy adherence summary.', reconcDesc: 'End-of-month trade reconciliation, settlement status, and discrepancy log.' },
  tr: { q4Desc: 'K&Z, atıf ve risk metrikleri dahil kapsamlı çeyreklik analiz.', riskDesc: 'Senaryo analizi içeren piyasa, kredi ve operasyonel risk değerlendirmesi.', allocationDesc: 'Yeniden dengeleme önerileri içeren yıllık portföy bileşim analizi.', complianceDesc: 'Düzenleyici uyumluluk durumu, denetim izi ve politika özeti.', reconcDesc: 'Ay sonu işlem mutabakatı, uzlaşı durumu ve tutarsızlık kaydı.' },
};

const typeBadgeStyle: Record<string, string> = {
  Quarterly: 'bg-indigo-500/10 text-indigo-400',
  Monthly: 'bg-cyan-400/10 text-cyan-400',
  Annual: 'bg-amber-400/10 text-amber-400',
  Compliance: 'bg-emerald-400/10 text-emerald-400',
};

const statsLabels = {
  en: [{ label: 'Reports Generated', sub: 'This year' }, { label: 'Last Generated', sub: 'Q4 2024 Performance' }, { label: 'Scheduled', sub: 'Active schedules' }],
  tr: [{ label: 'Oluşturulan Rapor', sub: 'Bu yıl' }, { label: 'Son Oluşturulan', sub: 'Q4 2024 Performans' }, { label: 'Planlanmış', sub: 'Aktif zamanlamalar' }],
};

function jsonToCsv(data: Record<string, unknown>[]): string {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => `"${row[h] ?? ''}"`).join(','));
  return '\uFEFF' + [headers.join(','), ...rows].join('\n');
}

function downloadBlob(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { trans, lang } = useLanguage();
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const [downloadedIdx, setDownloadedIdx] = useState<number | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedName, setSchedName] = useState('');
  const [schedFreq, setSchedFreq] = useState('weekly');
  const [schedEmail, setSchedEmail] = useState('');
  const [schedReportType, setSchedReportType] = useState('general');
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [schedLoading, setSchedLoading] = useState(true);
  const [schedSaving, setSchedSaving] = useState(false);

  const titles = reportTitles[lang];
  const descs = reportDescs[lang];
  const stats = statsLabels[lang];

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await fetch('/api/reports/schedule');
      const json = await res.json();
      setScheduledReports(json.data || []);
    } catch {
      // silent
    } finally {
      setSchedLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  const activeCount = scheduledReports.filter((s) => s.active).length;
  const statsValues = ['148', 'Feb 1', String(activeCount)];

  const handleDownload = async (i: number, format: 'csv' | 'pdf' = 'csv') => {
    const report = reportsData[i];
    setDownloadingIdx(i);
    const toastId = toast.loading(trans.pages.reports.preparing);
    try {
      const res = await fetch(report.api);
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      const rows = Array.isArray(json) ? json : (json.data ?? [json]);
      const title = titles[report.titleKey as keyof typeof titles] || 'report';
      const safeName = title.replace(/[^a-zA-Z0-9]/g, '_');

      if (format === 'pdf') {
        const headers = rows.length ? Object.keys(rows[0]) : [];
        const bodyRows = rows.map((row: Record<string, unknown>) => headers.map((h) => String(row[h] ?? '')));
        generateReportPdf({
          title,
          subtitle: descs[report.descKey as keyof typeof descs],
          headers,
          rows: bodyRows,
          filename: `${safeName}.pdf`,
        });
      } else {
        const csv = jsonToCsv(rows);
        downloadBlob(csv, `${safeName}.csv`);
      }

      toast.success(trans.pages.reports.downloaded, { id: toastId });
      setDownloadedIdx(i);
      setTimeout(() => setDownloadedIdx(null), 2000);
    } catch {
      toast.error('Download failed', { id: toastId });
    } finally {
      setDownloadingIdx(null);
    }
  };

  const handleSchedule = async () => {
    if (!schedName.trim() || !schedEmail.trim()) return;
    setSchedSaving(true);
    try {
      const res = await fetch('/api/reports/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: schedName, frequency: schedFreq, email: schedEmail, reportType: schedReportType }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(trans.pages.reports.scheduleSuccess);
      setScheduleOpen(false);
      setSchedName('');
      setSchedFreq('weekly');
      setSchedEmail('');
      setSchedReportType('general');
      fetchSchedules();
    } catch {
      toast.error(lang === 'tr' ? 'Planlama başarısız' : 'Scheduling failed');
    } finally {
      setSchedSaving(false);
    }
  };

  const toggleScheduleActive = async (id: string, active: boolean) => {
    try {
      await fetch('/api/reports/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !active }),
      });
      fetchSchedules();
    } catch {
      // silent
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await fetch(`/api/reports/schedule?id=${id}`, { method: 'DELETE' });
      fetchSchedules();
      toast.success(lang === 'tr' ? 'Zamanlama silindi' : 'Schedule deleted');
    } catch {
      // silent
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const freqLabel = (freq: string) => {
    const map: Record<string, Record<string, string>> = {
      en: { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' },
      tr: { daily: 'Günlük', weekly: 'Haftalık', monthly: 'Aylık' },
    };
    return map[lang][freq] || freq;
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FileText size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">{trans.pages.reports.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{trans.pages.reports.subtitle}</p>
            </div>
          </div>
          <Button onClick={() => setScheduleOpen(true)} className="h-9 gap-2 text-xs">
            <Calendar size={14} />
            {trans.pages.reports.schedule}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="card">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{statsValues[i]}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Report List */}
        <div className="card">
          <h3 className="text-sm font-semibold text-foreground mb-6">{trans.pages.reports.recent}</h3>
          <div className="space-y-0">
            {reportsData.map((report, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b border-border last:border-0 hover:bg-muted -mx-6 px-6 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center shrink-0`}>
                  <report.icon size={18} className={report.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {titles[report.titleKey as keyof typeof titles]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {descs[report.descKey as keyof typeof descs]}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${typeBadgeStyle[report.type]}`}>
                    {report.type}
                  </span>
                  <span className="text-xs text-muted-foreground w-20 text-right">{report.date}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">{report.size}</span>
                  {downloadingIdx === i ? (
                    <div className="h-8 w-8 flex items-center justify-center">
                      <Loader2 size={14} className="animate-spin text-muted-foreground" />
                    </div>
                  ) : downloadedIdx === i ? (
                    <div className="h-8 w-8 flex items-center justify-center">
                      <Check size={14} className="text-emerald-400" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] px-2 text-muted-foreground hover:text-indigo-400"
                        onClick={(e) => { e.stopPropagation(); handleDownload(i, 'csv'); }}
                        title="CSV"
                      >
                        <Download size={12} className="mr-1" />
                        {trans.pages.reports.exportCsv}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] px-2 text-muted-foreground hover:text-red-400"
                        onClick={(e) => { e.stopPropagation(); handleDownload(i, 'pdf'); }}
                        title="PDF"
                      >
                        <FileDown size={12} className="mr-1" />
                        {trans.pages.reports.exportPdf}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-foreground">
              {lang === 'tr' ? 'Planlanmış Raporlar' : 'Scheduled Reports'}
            </h3>
            <Badge variant="secondary" className="text-[10px]">
              {activeCount} {lang === 'tr' ? 'aktif' : 'active'}
            </Badge>
          </div>

          {schedLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : scheduledReports.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={28} className="text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-xs text-muted-foreground">
                {lang === 'tr' ? 'Henüz planlanmış rapor yok' : 'No scheduled reports yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {scheduledReports.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center gap-4 py-3 border-b border-border last:border-0 -mx-6 px-6"
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${schedule.active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                      {schedule.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {schedule.email}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5">
                    {freqLabel(schedule.frequency)}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-28 text-right">
                    {lang === 'tr' ? 'Sonraki:' : 'Next:'} {formatDate(schedule.nextRun)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => toggleScheduleActive(schedule.id, schedule.active)}
                      title={schedule.active ? (lang === 'tr' ? 'Devre dışı bırak' : 'Disable') : (lang === 'tr' ? 'Etkinleştir' : 'Enable')}
                    >
                      <Power size={12} className={schedule.active ? 'text-emerald-400' : 'text-muted-foreground'} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteSchedule(schedule.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{trans.pages.reports.scheduleTitle}</DialogTitle>
            <DialogDescription>{trans.pages.reports.scheduleDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{trans.pages.reports.reportName}</Label>
              <Input value={schedName} onChange={(e) => setSchedName(e.target.value)} placeholder="Q1 2025 Performance Report" />
            </div>
            <div className="space-y-2">
              <Label>{lang === 'tr' ? 'Rapor Türü' : 'Report Type'}</Label>
              <Select value={schedReportType} onValueChange={setSchedReportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{lang === 'tr' ? 'Genel' : 'General'}</SelectItem>
                  <SelectItem value="performance">{lang === 'tr' ? 'Performans' : 'Performance'}</SelectItem>
                  <SelectItem value="risk">{lang === 'tr' ? 'Risk' : 'Risk'}</SelectItem>
                  <SelectItem value="compliance">{lang === 'tr' ? 'Uyumluluk' : 'Compliance'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{trans.pages.reports.frequency}</Label>
              <Select value={schedFreq} onValueChange={setSchedFreq}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{trans.pages.reports.daily}</SelectItem>
                  <SelectItem value="weekly">{trans.pages.reports.weekly}</SelectItem>
                  <SelectItem value="monthly">{trans.pages.reports.monthly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{trans.pages.reports.email}</Label>
              <Input type="email" value={schedEmail} onChange={(e) => setSchedEmail(e.target.value)} placeholder="admin@financehub.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>{trans.profile.cancel}</Button>
            <Button onClick={handleSchedule} disabled={!schedName.trim() || !schedEmail.trim() || schedSaving}>
              {schedSaving ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
              {trans.pages.reports.scheduleBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
