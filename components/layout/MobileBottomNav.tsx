'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Wallet, Shield, Settings } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const navItems = [
  { icon: LayoutDashboard, labelKey: 'dashboard' as const, href: '/' },
  { icon: BarChart3, labelKey: 'analytics' as const, href: '/analytics' },
  { icon: Wallet, labelKey: 'transactions' as const, href: '/transactions' },
  { icon: Shield, labelKey: 'riskManagement' as const, href: '/risk' },
  { icon: Settings, labelKey: 'settings' as const, href: '/settings' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { trans } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const label = trans.nav[item.labelKey];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                <item.icon size={20} />
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[9px] font-medium leading-none truncate max-w-[56px]">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
