'use client';

import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useSidebar } from '@/providers/SidebarProvider';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <main className="main-transition" style={{ marginLeft: collapsed ? 64 : 240 }}>
        <TopBar />
        {children}
      </main>
    </div>
  );
}
