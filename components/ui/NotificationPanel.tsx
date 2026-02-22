'use client';

import { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface Notification {
  id: number;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initial: Notification[] = [
  { id: 1, type: 'alert', title: 'Market Risk Threshold Exceeded', message: 'Market Risk score reached 72, exceeding the limit of 70.', time: '15 min ago', read: false },
  { id: 2, type: 'success', title: 'Transaction Completed', message: 'TXN-7842 Goldman Capital Buy $2.5M completed successfully.', time: '1 hr ago', read: false },
  { id: 3, type: 'warning', title: 'Liquidity Risk Elevated', message: 'Liquidity Risk approaching warning level at 58.', time: '3 hrs ago', read: true },
  { id: 4, type: 'info', title: 'Monthly Report Ready', message: 'Q4 2024 Performance Report is available for download.', time: '1 day ago', read: true },
  { id: 5, type: 'success', title: 'Compliance Check Passed', message: 'All compliance requirements met for this period.', time: '2 days ago', read: true },
];

const iconMap = {
  alert: { Icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  warning: { Icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  success: { Icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  info: { Icon: Info, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
};

export default function NotificationPanel() {
  const { trans } = useLanguage();
  const [notifications, setNotifications] = useState(initial);
  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifications((ns) => ns.filter((n) => n.id !== id));

  return (
    <div className="absolute right-0 top-12 w-[360px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{trans.topbar.notifications}</span>
          {unread > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            {trans.topbar.markAllRead}
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle size={32} className="text-emerald-400 mb-3" />
            <p className="text-sm text-[var(--text-muted)]">{trans.topbar.noNotifications}</p>
          </div>
        ) : (
          notifications.map((n) => {
            const { Icon, color, bg } = iconMap[n.type];
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors ${!n.read ? 'bg-indigo-500/5' : ''}`}
              >
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={13} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-medium leading-snug ${!n.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {n.title}
                    </p>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1" />}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{n.time}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="w-5 h-5 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={11} className="text-[var(--text-muted)]" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
