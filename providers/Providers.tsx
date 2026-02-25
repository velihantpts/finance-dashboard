'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import { LanguageProvider } from './LanguageProvider';
import { SidebarProvider } from './SidebarProvider';
import { CurrencyProvider } from './CurrencyProvider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import CommandPalette from '@/components/ui/CommandPalette';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <SidebarProvider>
              <TooltipProvider>
                {children}
                <CommandPalette />
                <Toaster richColors position="bottom-right" />
              </TooltipProvider>
            </SidebarProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
