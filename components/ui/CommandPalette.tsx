'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, BarChart3, Wallet, FileText, Shield, Settings, Plus, Command } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLanguage } from '@/providers/LanguageProvider';

interface PaletteItem {
  id: string;
  icon: typeof LayoutDashboard;
  label: string;
  href?: string;
  action?: () => void;
  shortcut?: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { trans } = useLanguage();

  const items: PaletteItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: trans.nav.dashboard, href: '/' },
    { id: 'analytics', icon: BarChart3, label: trans.nav.analytics, href: '/analytics' },
    { id: 'transactions', icon: Wallet, label: trans.nav.transactions, href: '/transactions' },
    { id: 'reports', icon: FileText, label: trans.nav.reports, href: '/reports' },
    { id: 'risk', icon: Shield, label: trans.nav.riskManagement, href: '/risk' },
    { id: 'settings', icon: Settings, label: trans.nav.settings, href: '/settings' },
    { id: 'new-txn', icon: Plus, label: trans.nav.transactions + ' — New', href: '/transactions?new=1', shortcut: 'Ctrl+N' },
  ];

  const filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  const execute = useCallback((item: PaletteItem) => {
    setOpen(false);
    setQuery('');
    if (item.href) router.push(item.href);
    if (item.action) item.action();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/transactions?new=1');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) { execute(filtered[selected]); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden [&>button]:hidden">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder={trans.topbar.search}
            className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">{trans.table.noResults}</p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => execute(item)}
                onMouseEnter={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  i === selected ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                <span className="text-sm flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.shortcut}</kbd>
                )}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Command size={10} />K {trans.topbar.search}</span>
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
