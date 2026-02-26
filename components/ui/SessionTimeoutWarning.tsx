'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/LanguageProvider';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

export default function SessionTimeoutWarning() {
  const { showWarning, remaining, extendSession } = useSessionTimeout();
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[380px] max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-card border border-amber-500/30 rounded-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={18} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {lang === 'tr' ? 'Oturum Süresi Dolmak Üzere' : 'Session Expiring Soon'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === 'tr'
                    ? `Oturumunuz ${remaining} saniye içinde sona erecek.`
                    : `Your session will expire in ${remaining} seconds.`}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" className="h-7 text-xs" onClick={extendSession}>
                    {lang === 'tr' ? 'Oturumu Uzat' : 'Stay Logged In'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground"
                    onClick={() => { window.location.href = '/login'; }}
                  >
                    {lang === 'tr' ? 'Çıkış Yap' : 'Log Out'}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={extendSession}
              >
                <X size={12} />
              </Button>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: remaining, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
