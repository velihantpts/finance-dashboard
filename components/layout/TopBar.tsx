'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import NotificationPanel, { getUnreadCount } from '@/components/ui/NotificationPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, trans, toggleLang } = useLanguage();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnreadCount(getUnreadCount());
  }, [notifOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/transactions?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-background/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-8">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-foreground tracking-tight leading-tight">
          {trans.topbar.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 tracking-normal leading-none">
          {trans.topbar.subtitle}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={trans.topbar.search}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="h-9 w-52 pl-9 text-[13px]"
          />
        </div>

        {/* Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLang}
          className="h-9 min-w-[44px] px-3.5 text-[13px] font-bold"
          title={lang === 'en' ? 'Türkçeye geç' : 'Switch to English'}
        >
          {lang === 'en' ? 'TR' : 'EN'}
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
          title={theme === 'dark' ? trans.theme.light : trans.theme.dark}
        >
          {theme === 'dark'
            ? <Sun size={15} className="text-amber-400" />
            : <Moon size={15} className="text-indigo-400" />}
        </Button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <Button
            variant={notifOpen ? 'secondary' : 'outline'}
            size="icon"
            className={`h-9 w-9 relative ${notifOpen ? 'text-primary border-primary/40' : ''}`}
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
            )}
          </Button>
          {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
