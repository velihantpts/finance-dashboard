'use client';

import { useRouter } from 'next/navigation';
import { X, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useNotifications, type NotificationItem } from '@/hooks/useNotifications';

const iconMap = {
  alert: { Icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  warning: { Icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  success: { Icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  info: { Icon: Info, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
};

export function useNotificationCount() {
  const { unreadCount } = useNotifications();
  return unreadCount;
}

export default function NotificationPanel({ onClose }: { onClose?: () => void }) {
  const { trans } = useLanguage();
  const router = useRouter();
  const { notifications, loading, unreadCount, markAsRead, markAllRead } = useNotifications();

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markAsRead(n.id);
    const hrefMap: Record<string, string> = {
      alert: '/risk',
      warning: '/risk',
      success: '/transactions',
      info: '/reports',
    };
    const href = hrefMap[n.type] || '/';
    router.push(href);
    onClose?.();
  };

  return (
    <div className="absolute right-0 top-12 w-[360px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{trans.topbar.notifications}</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            {trans.topbar.markAllRead}
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle size={32} className="text-emerald-400 mb-3" />
            <p className="text-sm text-muted-foreground">{trans.topbar.noNotifications}</p>
          </div>
        ) : (
          notifications.map((n) => {
            const { Icon, color, bg } = iconMap[n.type] || iconMap.info;
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}
              >
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={13} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-medium leading-snug ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {n.title}
                    </p>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatTime(n.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); if (!n.read) markAsRead(n.id); }}
                  className="w-5 h-5 rounded-md hover:bg-muted flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={11} className="text-muted-foreground" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
