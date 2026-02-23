'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
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
    <header className="sticky top-0 z-40 h-16 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-8">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {trans.topbar.title}
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 tracking-normal leading-none">
          {trans.topbar.subtitle}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <input
          type="text"
          placeholder={trans.topbar.search}
          style={{ letterSpacing: 'normal' }}
          className="h-9 w-52 px-4 rounded-xl bg-[var(--bg-tertiary)] border border-[#2a2d3e] text-[13px] text-center text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
        />

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          style={{ letterSpacing: '0.08em' }}
          className="h-9 min-w-[44px] px-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[#2a2d3e] text-[13px] font-bold text-[var(--text-secondary)] hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-[var(--bg-secondary)] transition-all"
          title={lang === 'en' ? 'Türkçeye geç' : 'Switch to English'}
        >
          {lang === 'en' ? 'TR' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] border border-[#2a2d3e] flex items-center justify-center hover:bg-[var(--bg-secondary)] hover:border-indigo-500/50 transition-all"
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
            className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              notifOpen
                ? 'bg-indigo-500/10 border-indigo-500/50'
                : 'bg-[var(--bg-tertiary)] border-[#2a2d3e] hover:bg-[var(--bg-secondary)] hover:border-indigo-500/50'
            }`}
          >
            <Bell
              size={15}
              className={notifOpen ? 'text-indigo-400' : 'text-[var(--text-secondary)]'}
            />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--bg-primary)]" />
          </button>
          {notifOpen && <NotificationPanel />}
        </div>
      </div>
    </header>
  );
}
