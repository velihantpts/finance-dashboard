'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeCtx {
  theme: Theme;
  toggleTheme: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('light', next === 'light');
      return next;
    });

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
