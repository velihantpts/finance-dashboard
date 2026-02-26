'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Sun, Moon, Search, Menu, Command } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { useSidebar } from '@/providers/SidebarProvider';
import NotificationPanel, { useNotificationCount } from '@/components/ui/NotificationPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, trans, toggleLang } = useLanguage();
  const { setMobileOpen } = useSidebar();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const unreadCount = useNotificationCount();
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/transactions?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-background/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} />
        </Button>

        {/* Title */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-foreground tracking-tight leading-tight">
            {trans.topbar.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 tracking-normal leading-none">
            {trans.topbar.subtitle}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Search */}
        <div data-tour="search" className="relative hidden sm:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={trans.topbar.search}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="h-9 w-40 md:w-52 pl-9 pr-16 text-[13px]"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden md:inline-flex items-center gap-0.5">
            <Command size={9} />K
          </kbd>
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
          data-tour="theme"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={(e) => toggleTheme(e)}
          title={theme === 'dark' ? trans.theme.light : trans.theme.dark}
        >
          {theme === 'dark'
            ? <Sun size={15} className="text-amber-400" />
            : <Moon size={15} className="text-indigo-400" />}
        </Button>

        {/* Notification Bell */}
        <div data-tour="notifications" className="relative" ref={notifRef}>
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
