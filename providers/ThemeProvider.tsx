'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const CHANNEL_NAME = 'financehub-theme-sync';
const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
    }

    // Multi-tab sync
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (e: MessageEvent<{ theme: Theme }>) => {
        const next = e.data.theme;
        setTheme(next);
        localStorage.setItem('theme', next);
        document.documentElement.classList.toggle('light', next === 'light');
      };

      return () => channel.close();
    }
  }, []);

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    const update = () => {
      setTheme(next);
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('light', next === 'light');
      // Broadcast to other tabs
      channelRef.current?.postMessage({ theme: next });
    };

    // Use View Transition API for circular reveal if available
    if (e && document.startViewTransition) {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = document.startViewTransition(update);
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      });
    } else {
      update();
    }
  }, [theme]);

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
