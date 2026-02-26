'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Keyboard, FileDown, DollarSign, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

interface FABItem {
  icon: typeof Plus;
  label: string;
  color: string;
  action: () => void;
}

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();

  const items: FABItem[] = [
    {
      icon: PlusCircle,
      label: lang === 'tr' ? 'Yeni İşlem' : 'New Transaction',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => { router.push('/transactions'); setOpen(false); },
    },
    {
      icon: FileDown,
      label: lang === 'tr' ? 'Rapor İndir' : 'Download Report',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      action: () => { router.push('/reports'); setOpen(false); },
    },
    {
      icon: DollarSign,
      label: lang === 'tr' ? 'Döviz Çevirici' : 'Currency Converter',
      color: 'bg-amber-500 hover:bg-amber-600',
      action: () => {
        setOpen(false);
        // Dispatch custom event for currency converter
        window.dispatchEvent(new CustomEvent('toggle-currency-converter'));
      },
    },
    {
      icon: Keyboard,
      label: lang === 'tr' ? 'Kısayollar' : 'Shortcuts',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => { setOpen(false); document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' })); },
    },
  ];

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 z-50 hidden sm:block">
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {items.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                onClick={item.action}
                className="flex items-center gap-2.5 group"
              >
                <span className="text-xs font-medium text-foreground bg-card border border-border rounded-lg px-3 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
                <div className={`w-10 h-10 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg transition-colors`}>
                  <item.icon size={18} />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow"
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {open ? <X size={20} /> : <Plus size={20} />}
      </motion.button>
    </div>
  );
}
