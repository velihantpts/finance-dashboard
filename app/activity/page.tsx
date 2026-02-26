'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Activity, ChevronLeft, ChevronRight, User, FileText, Shield, Settings, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
}

const ACTION_ICONS: Record<string, typeof Activity> = {
  TRANSACTION_CREATE: ArrowRightLeft,
  TRANSACTION_UPDATE: ArrowRightLeft,
  TRANSACTION_DELETE: ArrowRightLeft,
  PROFILE_UPDATE: User,
  REPORT_EXPORT: FileText,
  REPORT_SCHEDULE: FileText,
  SETTINGS_CHANGE: Settings,
  LOGIN: Shield,
};

const ACTION_COLORS: Record<string, string> = {
  TRANSACTION_CREATE: 'bg-emerald-500/10 text-emerald-400',
  TRANSACTION_UPDATE: 'bg-indigo-500/10 text-indigo-400',
  TRANSACTION_DELETE: 'bg-red-500/10 text-red-400',
  PROFILE_UPDATE: 'bg-cyan-500/10 text-cyan-400',
  REPORT_EXPORT: 'bg-amber-500/10 text-amber-400',
  LOGIN: 'bg-purple-500/10 text-purple-400',
};

export default function ActivityPage() {
  const { lang } = useLanguage();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit-log?page=${page}&limit=15`);
      const json = await res.json();
      setEntries(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {lang === 'tr' ? 'Aktivite Günlüğü' : 'Activity Log'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === 'tr' ? 'Tüm sistem aktivitelerini izleyin' : 'Monitor all system activities'}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-48 mb-2" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <Activity size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">
                {lang === 'tr' ? 'Henüz aktivite kaydı yok' : 'No activity logs yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {entries.map((entry) => {
                const IconComp = ACTION_ICONS[entry.action] || Activity;
                const colorClass = ACTION_COLORS[entry.action] || 'bg-secondary text-muted-foreground';
                return (
                  <div key={entry.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                      <IconComp size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-foreground">
                          {entry.user.name || entry.user.email}
                        </span>
                        <Badge variant="outline" className="text-[9px] h-4">
                          {formatAction(entry.action)}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {entry.entity}{entry.entityId ? ` #${entry.entityId.slice(0, 8)}` : ''}
                        {entry.details && ` — ${JSON.parse(entry.details).summary || ''}`}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 mt-1">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
              </Button>
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" className="h-8 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
