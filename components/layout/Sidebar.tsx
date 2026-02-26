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
import { useSession, signOut } from 'next-auth/react';
import { useSidebar } from '@/providers/SidebarProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import LogoutModal from '@/components/ui/LogoutModal';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  icon: ComponentType<{ size?: number; className?: string }>;
  labelKey: 'dashboard' | 'analytics' | 'transactions' | 'reports' | 'riskManagement' | 'activity' | 'settings';
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/' },
  { icon: BarChart3, labelKey: 'analytics', href: '/analytics' },
  { icon: Wallet, labelKey: 'transactions', href: '/transactions' },
  { icon: FileText, labelKey: 'reports', href: '/reports' },
  { icon: Shield, labelKey: 'riskManagement', href: '/risk' },
  { icon: Activity, labelKey: 'activity', href: '/activity' },
  { icon: Settings, labelKey: 'settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();
  const { trans, lang } = useLanguage();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { data: session } = useSession();

  const userName = session?.user?.name ?? 'Loading...';
  const userInitials = userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const userRole = (session?.user as { role?: string })?.role ?? '';
  const userImage = (session?.user as { image?: string | null })?.image ?? null;

  const handleLogout = () => {
    setLogoutOpen(false);
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <aside
        data-tour="sidebar"
        className={`sidebar-transition fixed left-0 top-0 h-screen bg-background border-r border-border flex flex-col z-50 overflow-hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
        style={{ width: collapsed ? 64 : 240 }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center border-b border-border shrink-0"
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
            <span className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">
              {trans.app.name}
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-0.5 whitespace-nowrap">
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
            const linkEl = (
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
            );

            return (
              <div key={item.href} className="relative">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                  </Tooltip>
                ) : linkEl}
              </div>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div style={{ padding: collapsed ? '0 8px 8px' : '0 12px 8px' }}>
          <Button
            variant="ghost"
            onClick={toggle}
            className="w-full gap-2 text-xs text-muted-foreground justify-center"
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
          </Button>
        </div>

        {/* User Card */}
        <div
          className="border-t border-border"
          style={{ padding: collapsed ? '12px 8px' : '12px 12px' }}
        >
          <div
            className="flex items-center rounded-xl bg-secondary hover:bg-accent transition-colors"
            style={{
              padding: collapsed ? '8px 0' : '8px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? 0 : 12,
            }}
          >
            {userImage ? (
              <img src={userImage} alt="Avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {userInitials || 'VT'}
              </div>
            )}
            <div
              className="flex-1 min-w-0 overflow-hidden transition-all duration-300"
              style={{ width: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
            >
              <p className="text-xs font-medium text-foreground truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground">
                {userRole || (lang === 'tr' ? 'Yönetici' : 'Admin')}
              </p>
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); setLogoutOpen(true); }}
                title={trans.logout.button}
              >
                <LogOut size={14} />
              </Button>
            )}
          </div>
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="w-full mt-1 h-8 text-muted-foreground hover:text-destructive"
              onClick={() => setLogoutOpen(true)}
              title={trans.logout.button}
            >
              <LogOut size={15} />
            </Button>
          )}
        </div>
      </aside>

      {logoutOpen && (
        <LogoutModal onClose={() => setLogoutOpen(false)} onConfirm={handleLogout} />
      )}
    </>
  );
}
