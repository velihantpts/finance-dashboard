'use client';

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { translations, type Lang, type Translations } from '@/lib/translations';

interface LangCtx {
  lang: Lang;
  trans: Translations;
  toggleLang: () => void;
}

const CHANNEL_NAME = 'financehub-lang-sync';

const Ctx = createContext<LangCtx>({
  lang: 'en',
  trans: translations.en,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'tr') setLang(saved);

    // Multi-tab sync
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (e: MessageEvent<{ lang: Lang }>) => {
        const next = e.data.lang;
        setLang(next);
        localStorage.setItem('lang', next);
      };

      return () => channel.close();
    }
  }, []);

  const toggleLang = () =>
    setLang((l) => {
      const next = l === 'en' ? 'tr' : 'en';
      localStorage.setItem('lang', next);
      channelRef.current?.postMessage({ lang: next });
      return next;
    });

  return (
    <Ctx.Provider value={{ lang, trans: translations[lang] as Translations, toggleLang }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLanguage = () => useContext(Ctx);
