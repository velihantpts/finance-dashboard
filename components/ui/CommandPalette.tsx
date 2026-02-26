'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, BarChart3, Wallet, FileText, Shield,
  Settings, Activity, Sun, Moon, Keyboard, Globe, ArrowRight, Command,
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: typeof Search;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  useEffect(() => { setMounted(true); }, []);

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const commands: CommandItem[] = useMemo(() => [
    { id: 'dashboard', label: lang === 'tr' ? 'Panel' : 'Dashboard', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: LayoutDashboard, action: () => navigate('/'), keywords: ['home', 'ana'] },
    { id: 'analytics', label: lang === 'tr' ? 'Analitik' : 'Analytics', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: BarChart3, action: () => navigate('/analytics'), keywords: ['charts', 'grafik'] },
    { id: 'transactions', label: lang === 'tr' ? 'İşlemler' : 'Transactions', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: Wallet, action: () => navigate('/transactions'), keywords: ['trade', 'alım'] },
    { id: 'reports', label: lang === 'tr' ? 'Raporlar' : 'Reports', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: FileText, action: () => navigate('/reports'), keywords: ['export', 'dışa'] },
    { id: 'risk', label: lang === 'tr' ? 'Risk Yönetimi' : 'Risk Management', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: Shield, action: () => navigate('/risk'), keywords: ['compliance'] },
    { id: 'activity', label: lang === 'tr' ? 'Aktivite' : 'Activity Log', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: Activity, action: () => navigate('/activity'), keywords: ['audit', 'log'] },
    { id: 'settings', label: lang === 'tr' ? 'Ayarlar' : 'Settings', category: lang === 'tr' ? 'Navigasyon' : 'Navigation', icon: Settings, action: () => navigate('/settings'), keywords: ['preferences', 'tercih'] },
    { id: 'toggle-theme', label: theme === 'dark' ? (lang === 'tr' ? 'Aydınlık Temaya Geç' : 'Switch to Light Theme') : (lang === 'tr' ? 'Karanlık Temaya Geç' : 'Switch to Dark Theme'), category: lang === 'tr' ? 'Eylemler' : 'Actions', icon: theme === 'dark' ? Sun : Moon, action: () => { toggleTheme(); setOpen(false); }, keywords: ['theme', 'tema', 'dark', 'light'] },
    { id: 'toggle-lang', label: lang === 'en' ? 'Türkçeye Geç' : 'Switch to English', category: lang === 'tr' ? 'Eylemler' : 'Actions', icon: Globe, action: () => { toggleLang(); setOpen(false); }, keywords: ['language', 'dil', 'english', 'turkish'] },
    { id: 'shortcuts', label: lang === 'tr' ? 'Klavye Kısayolları' : 'Keyboard Shortcuts', category: lang === 'tr' ? 'Eylemler' : 'Actions', icon: Keyboard, action: () => { setOpen(false); setTimeout(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' })), 100); }, keywords: ['help', 'yardım'] },
  ], [lang, theme, navigate, toggleTheme, toggleLang]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.includes(q))
    );
  }, [query, commands]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return map;
  }, [filtered]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelectedIndex(0); }, [filtered.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) filtered[selectedIndex].action();
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!mounted || !open) return null;

  let flatIndex = -1;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder={lang === 'tr' ? 'Komut ara...' : 'Type a command...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <kbd className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border shrink-0">
              ESC
            </kbd>
          </div>

          <div ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground">
                  {lang === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
                </p>
              </div>
            ) : (
              Array.from(grouped.entries()).map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">
                    {category}
                  </p>
                  {items.map((item) => {
                    flatIndex++;
                    const idx = flatIndex;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isSelected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon size={16} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                        <span className="text-sm flex-1">{item.label}</span>
                        {isSelected && <ArrowRight size={12} className="text-primary" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 font-mono bg-muted border border-border rounded text-[9px]">↑↓</kbd>
                {lang === 'tr' ? 'gezin' : 'navigate'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 font-mono bg-muted border border-border rounded text-[9px]">↵</kbd>
                {lang === 'tr' ? 'seç' : 'select'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Command size={10} />
              <span>K</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
