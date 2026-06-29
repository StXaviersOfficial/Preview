'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = 'en' | 'hi';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
});

import { translations } from "@/lib/site/translations";

export function LanguageProvider({ children, defaultLang = 'en' }: { children: ReactNode; defaultLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('xavier-lang') as Lang;
      if (stored === 'en' || stored === 'hi') setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('xavier-lang', lang);
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState(prev => prev === 'en' ? 'hi' : 'en');

  const t = (key: string): string => {
    const dict = translations[lang] as Record<string, string>;
    const fallback = translations.en as Record<string, string>;
    return dict?.[key] ?? fallback?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
