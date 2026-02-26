'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import TopProgressBar from '@/components/ui/TopProgressBar';
import OnboardingTour from '@/components/ui/OnboardingTour';
import CommandPalette from '@/components/ui/CommandPalette';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useSidebar } from '@/providers/SidebarProvider';
import { useKeyboardShortcuts, SHORTCUT_LIST } from '@/hooks/useKeyboardShortcuts';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { helpOpen, setHelpOpen } = useKeyboardShortcuts();
  const onboarding = useOnboarding();

  return (
    <div className="min-h-screen bg-background">
      <TopProgressBar />
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar />

      <main
        className="main-transition ml-0 lg:ml-16 min-h-screen"
        style={{ marginLeft: undefined }}
      >
        {/* Desktop margin via CSS */}
        <style>{`
          @media (min-width: 1024px) {
            main.main-transition { margin-left: ${collapsed ? 64 : 240}px !important; }
          }
        `}</style>
        <TopBar />
        <Breadcrumb />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Keyboard Shortcuts Help Modal */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Keyboard size={18} className="text-primary" />
                  </div>
                  <h2 className="text-sm font-bold text-foreground">Keyboard Shortcuts</h2>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setHelpOpen(false)}>
                  <X size={14} />
                </Button>
              </div>
              <div className="space-y-2">
                {SHORTCUT_LIST.map((item) => (
                  <div key={item.description} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                    <div className="flex gap-1">
                      {item.keys.map((key) => (
                        <kbd key={key} className="px-2 py-0.5 text-[10px] font-mono font-medium bg-muted text-muted-foreground border border-border rounded">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 text-center">
                Press <kbd className="px-1 py-0.5 text-[9px] font-mono bg-muted border border-border rounded">?</kbd> to toggle this panel
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <OnboardingTour
        active={onboarding.active}
        step={onboarding.step}
        onNext={onboarding.next}
        onPrev={onboarding.prev}
        onSkip={onboarding.skip}
        onFinish={onboarding.finish}
      />

      {/* Command Palette */}
      <CommandPalette />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
