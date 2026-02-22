'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import { SidebarProvider } from './SidebarProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
