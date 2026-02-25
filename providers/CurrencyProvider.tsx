'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'TRY';

const RATES: Record<Currency, number> = { USD: 1, EUR: 0.92, TRY: 36.5 };
const SYMBOLS: Record<Currency, string> = { USD: '$', EUR: '€', TRY: '₺' };
const STORAGE_KEY = 'settings_preferences';

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
  symbol: string;
}

const Ctx = createContext<CurrencyCtx>({
  currency: 'USD', setCurrency: () => {}, convert: (v) => v, format: (v) => `$${v}`, symbol: '$',
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (prefs.currency && RATES[prefs.currency as Currency]) setCurrencyState(prefs.currency);
    } catch {}
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      prefs.currency = c;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  };

  const convert = (usdAmount: number) => usdAmount * RATES[currency];

  const format = (usdAmount: number) => {
    const val = convert(usdAmount);
    const sym = SYMBOLS[currency];
    if (val >= 1_000_000) return `${sym}${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${sym}${(val / 1_000).toFixed(0)}K`;
    return `${sym}${val.toFixed(0)}`;
  };

  return (
    <Ctx.Provider value={{ currency, setCurrency, convert, format, symbol: SYMBOLS[currency] }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCurrency = () => useContext(Ctx);
