'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useSidebar } from '@/providers/SidebarProvider';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
