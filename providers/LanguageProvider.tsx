'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Lang, type Translations } from '@/lib/translations';

interface LangCtx {
  lang: Lang;
  trans: Translations;
  toggleLang: () => void;
}

const Ctx = createContext<LangCtx>({
  lang: 'en',
  trans: translations.en,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'tr') setLang(saved);
  }, []);

  const toggleLang = () =>
    setLang((l) => {
      const next = l === 'en' ? 'tr' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });

  return (
    <Ctx.Provider value={{ lang, trans: translations[lang] as Translations, toggleLang }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLanguage = () => useContext(Ctx);
