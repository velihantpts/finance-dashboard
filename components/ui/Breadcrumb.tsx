'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const routeMap: Record<string, { labelKey: string }> = {
  '/analytics': { labelKey: 'analytics' },
  '/transactions': { labelKey: 'transactions' },
  '/reports': { labelKey: 'reports' },
  '/risk': { labelKey: 'riskManagement' },
  '/settings': { labelKey: 'settings' },
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const { trans } = useLanguage();

  if (pathname === '/') return null;

  const route = routeMap[pathname];
  if (!route) return null;

  const label = trans.nav[route.labelKey as keyof typeof trans.nav];

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground px-4 md:px-6 lg:px-8 py-2 border-b border-border/50">
      <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home size={12} />
        <span>{trans.nav.dashboard}</span>
      </Link>
      <ChevronRight size={11} className="text-muted-foreground/50" />
      <span className="text-foreground font-medium">{label}</span>
    </nav>
  );
}
