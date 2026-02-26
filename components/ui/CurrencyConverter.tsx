'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/providers/LanguageProvider';

// Static exchange rates (no external API dependency)
const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 36.45,
  JPY: 149.80,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  CNY: 7.24,
  BTC: 0.0000104,
};

const SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', TRY: '₺', JPY: '¥', CHF: 'Fr',
  CAD: 'C$', AUD: 'A$', CNY: '¥', BTC: '₿',
};

const currencies = Object.keys(RATES);

export default function CurrencyConverter() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('1000');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('TRY');
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener('toggle-currency-converter', handler);
    return () => window.removeEventListener('toggle-currency-converter', handler);
  }, []);

  const convert = useCallback(() => {
    const val = parseFloat(amount) || 0;
    const inUSD = val / RATES[from];
    return inUSD * RATES[to];
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const result = convert();

  if (!mounted || !open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9997] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <DollarSign size={18} className="text-amber-400" />
              </div>
              <h2 className="text-sm font-bold text-foreground">
                {lang === 'tr' ? 'Döviz Çevirici' : 'Currency Converter'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
              <X size={14} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Amount */}
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
                {lang === 'tr' ? 'Tutar' : 'Amount'}
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-semibold h-11"
              />
            </div>

            {/* From / To */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
                  {lang === 'tr' ? 'Kaynak' : 'From'}
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full h-10 rounded-lg bg-muted border border-border px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{SYMBOLS[c]} {c}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={swap}
                className="mt-5 w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors shrink-0"
              >
                <ArrowLeftRight size={14} className="text-muted-foreground" />
              </button>

              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
                  {lang === 'tr' ? 'Hedef' : 'To'}
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full h-10 rounded-lg bg-muted border border-border px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{SYMBOLS[c]} {c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
                {lang === 'tr' ? 'Sonuç' : 'Result'}
              </p>
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {SYMBOLS[to]}{result < 0.01 ? result.toFixed(8) : result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                1 {from} = {SYMBOLS[to]}{(RATES[to] / RATES[from]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: RATES[to] / RATES[from] < 0.01 ? 8 : 4 })}
              </p>
            </div>

            <p className="text-[9px] text-muted-foreground text-center">
              {lang === 'tr' ? 'Kurlar tahminidir, yatırım tavsiyesi değildir.' : 'Rates are indicative and not investment advice.'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
