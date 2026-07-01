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
  const [lang, setLangState] = useState<Lang>(defaultLang);
  // Track whether we've read from localStorage yet — prevents the write
  // effect from overwriting the stored value with the default 'en' on
  // the very first mount.
  const [hasReadStorage, setHasReadStorage] = useState(false);

  // Read localStorage on mount ONLY — set state and mark as read.
  useEffect(() => {
    try {
      const stored = localStorage.getItem('xavier-lang') as Lang;
      if (stored === 'en' || stored === 'hi') setLangState(stored);
    } catch {}
    setHasReadStorage(true);
  }, []);

  // Write to localStorage when lang changes — but ONLY after we've read.
  useEffect(() => {
    if (!hasReadStorage) return;
    try {
      localStorage.setItem('xavier-lang', lang);
      document.documentElement.lang = lang;
    } catch {}
  }, [lang, hasReadStorage]);

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
