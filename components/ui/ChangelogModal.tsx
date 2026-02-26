'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Shield, BarChart3, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';

const CURRENT_VERSION = '2.0.0';
const STORAGE_KEY = 'fh-last-seen-version';

interface ChangelogEntry {
  version: string;
  date: string;
  icon: typeof Sparkles;
  color: string;
  items: { en: string; tr: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: '2026-02-26',
    icon: Sparkles,
    color: 'text-amber-400',
    items: [
      { en: 'Dashboard drag & drop reordering', tr: 'Dashboard sürükle-bırak düzenleme' },
      { en: 'Real-time notifications via SSE', tr: 'SSE ile gerçek zamanlı bildirimler' },
      { en: 'AI-powered financial insights', tr: 'AI destekli finansal öngörüler' },
      { en: 'Interactive onboarding tour', tr: 'İnteraktif tanıtım turu' },
      { en: 'Currency converter widget', tr: 'Döviz çevirici aracı' },
      { en: 'Floating quick actions (FAB)', tr: 'Hızlı işlem butonu (FAB)' },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-02-20',
    icon: Shield,
    color: 'text-emerald-400',
    items: [
      { en: 'Role-based access control (RBAC)', tr: 'Rol tabanlı erişim kontrolü (RBAC)' },
      { en: 'Audit log & activity tracking', tr: 'Denetim kaydı ve aktivite takibi' },
      { en: 'Scheduled reports with DB persistence', tr: 'Veritabanı tabanlı zamanlanmış raporlar' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-02-10',
    icon: BarChart3,
    color: 'text-indigo-400',
    items: [
      { en: 'KPI cards with animated counters', tr: 'Animasyonlu KPI kartları' },
      { en: 'Revenue & portfolio charts', tr: 'Gelir ve portföy grafikleri' },
      { en: 'Transaction CRUD with search & filter', tr: 'İşlem CRUD: arama ve filtreleme' },
      { en: 'Dark/Light theme with circular reveal', tr: 'Dairesel geçiş animasyonlu tema' },
      { en: 'Command palette (Ctrl+K)', tr: 'Komut paleti (Ctrl+K)' },
      { en: 'PWA support', tr: 'PWA desteği' },
    ],
  },
];

export default function ChangelogModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    if (lastSeen !== CURRENT_VERSION) {
      // Show after a short delay so the page loads first
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
  };

  // Allow manual open via custom event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('toggle-changelog', handler);
    return () => window.removeEventListener('toggle-changelog', handler);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {lang === 'tr' ? 'Yenilikler' : "What's New"}
                  </h2>
                  <p className="text-[10px] text-muted-foreground">FinanceHub v{CURRENT_VERSION}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClose}>
                <X size={14} />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-5 space-y-6">
              {changelog.map((entry) => {
                const Icon = entry.icon;
                return (
                  <div key={entry.version}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={14} className={entry.color} />
                      <span className="text-xs font-bold text-foreground">v{entry.version}</span>
                      <span className="text-[10px] text-muted-foreground">{entry.date}</span>
                    </div>
                    <ul className="space-y-1.5 ml-5">
                      {entry.items.map((item, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                          {lang === 'tr' ? item.tr : item.en}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button className="w-full h-9 text-xs" onClick={handleClose}>
                <Globe size={13} className="mr-1.5" />
                {lang === 'tr' ? 'Anladım, devam et' : 'Got it, continue'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
