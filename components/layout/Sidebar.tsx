'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Activity,
  LayoutDashboard,
  BarChart3,
  Wallet,
  FileText,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useSidebar } from '@/providers/SidebarProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import LogoutModal from '@/components/ui/LogoutModal';

interface NavItem {
  icon: ComponentType<{ size?: number; className?: string }>;
  labelKey: 'dashboard' | 'analytics' | 'transactions' | 'reports' | 'riskManagement' | 'settings';
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/' },
  { icon: BarChart3, labelKey: 'analytics', href: '/analytics' },
  { icon: Wallet, labelKey: 'transactions', href: '/transactions' },
  { icon: FileText, labelKey: 'reports', href: '/reports' },
  { icon: Shield, labelKey: 'riskManagement', href: '/risk' },
  { icon: Settings, labelKey: 'settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const { trans, lang } = useLanguage();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    setLogoutOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <aside
        className="sidebar-transition fixed left-0 top-0 h-screen bg-[var(--bg-primary)] border-r border-[var(--border)] flex flex-col z-50 overflow-hidden"
        style={{ width: collapsed ? 64 : 240 }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center border-b border-[var(--border)] shrink-0"
          style={{
            padding: collapsed ? '0 16px' : '0 24px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 12,
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0">
            <Activity size={16} className="text-white" />
          </div>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
          >
            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight whitespace-nowrap">
              {trans.app.name}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block -mt-0.5 whitespace-nowrap">
              {trans.app.subtitle}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 space-y-1 overflow-hidden"
          style={{ padding: collapsed ? '16px 8px' : '16px 12px' }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const label = trans.nav[item.labelKey];
            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  title={collapsed ? label : undefined}
                  className={`flex items-center rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                  style={{
                    padding: collapsed ? '10px 0' : '10px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: collapsed ? 0 : 12,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span
                    className="overflow-hidden whitespace-nowrap transition-all duration-300"
                    style={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
                  >
                    {label}
                  </span>
                </Link>
                {collapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60] shadow-lg">
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div style={{ padding: collapsed ? '0 8px 8px' : '0 12px 8px' }}>
          <button
            onClick={toggle}
            className="w-full flex items-center gap-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all duration-200 text-xs"
            style={{
              padding: collapsed ? '8px 0' : '8px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            title={collapsed
              ? (lang === 'tr' ? 'Genişlet' : 'Expand')
              : (lang === 'tr' ? 'Küçült' : 'Collapse')}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>{lang === 'tr' ? 'Küçült' : 'Collapse'}</span>
              </>
            )}
          </button>
        </div>

        {/* User Card */}
        <div
          className="border-t border-[var(--border)]"
          style={{ padding: collapsed ? '12px 8px' : '12px 12px' }}
        >
          <div
            className="flex items-center rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            style={{
              padding: collapsed ? '8px 0' : '8px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 12,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              VT
            </div>
            <div
              className="flex-1 min-w-0 overflow-hidden transition-all duration-300"
              style={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
            >
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">Velihan T.</p>
              <p className="text-[10px] text-[var(--text-muted)]">{lang === 'tr' ? 'Yönetici' : 'Admin'}</p>
            </div>
            {!collapsed && (
              <button
                onClick={(e) => { e.stopPropagation(); setLogoutOpen(true); }}
                className="hover:text-red-400 transition-colors"
                title={trans.logout.button}
              >
                <LogOut size={14} className="text-[var(--text-muted)]" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={() => setLogoutOpen(true)}
              className="w-full flex justify-center mt-1 py-2 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-secondary)] transition-all"
              title={trans.logout.button}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </aside>

      {logoutOpen && (
        <LogoutModal onClose={() => setLogoutOpen(false)} onConfirm={handleLogout} />
      )}
    </>
  );
}
