'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SidebarCtx {
  collapsed: boolean;
  toggle: () => void;
}

const Ctx = createContext<SidebarCtx>({ collapsed: false, toggle: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar');
    if (saved === 'collapsed') setCollapsed(true);
  }, []);

  const toggle = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem('sidebar', next ? 'collapsed' : 'expanded');
      return next;
    });

  return <Ctx.Provider value={{ collapsed, toggle }}>{children}</Ctx.Provider>;
}

export const useSidebar = () => useContext(Ctx);
