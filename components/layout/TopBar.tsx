'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import NotificationPanel from '@/components/ui/NotificationPanel';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, trans, toggleLang } = useLanguage();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
          {trans.topbar.title}
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {trans.topbar.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder={trans.topbar.search}
            className="h-9 w-52 pl-9 pr-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-indigo-400 hover:border-indigo-500/40 transition-all"
          title={lang === 'en' ? 'Türkçeye geç' : 'Switch to English'}
        >
          {lang === 'en' ? 'TR' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-all"
          title={theme === 'dark' ? trans.theme.light : trans.theme.dark}
        >
          {theme === 'dark'
            ? <Sun size={15} className="text-amber-400" />
            : <Moon size={15} className="text-indigo-400" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Bell size={15} className="text-[var(--text-muted)]" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--bg-primary)]" />
          </button>
          {notifOpen && <NotificationPanel />}
        </div>
      </div>
    </header>
  );
}
