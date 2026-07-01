'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = 'en' | 'hi';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children, defaultLang = 'en' }: { children: ReactNode; defaultLang?: Lang }) {
  // Initialize from localStorage IMMEDIATELY (synchronous) to prevent flash.
  // The inline script in layout.tsx already set <html lang="hi"> if needed,
  // so we match that here to avoid any English->Hindi flash on reload.
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return defaultLang;
    try {
      const stored = localStorage.getItem('xavier-lang') as Lang;
      if (stored === 'en' || stored === 'hi') return stored;
    } catch {}
    return defaultLang;
  });

  // Write to localStorage + update <html lang> when lang changes
  useEffect(() => {
    try {
      localStorage.setItem('xavier-lang', lang);
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState(prev => prev === 'en' ? 'hi' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
