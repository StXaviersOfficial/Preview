"use client";

import * as React from "react";
import {
  translations,
  type Lang,
  type TranslationKey,
} from "@/lib/site/translations";

type LanguageProviderState = {
  /** Current language code ("en" | "hi"). */
  lang: Lang;
  /** Switch the active language. Persists to localStorage. */
  setLang: (lang: Lang) => void;
  /** Toggle between "en" and "hi". */
  toggleLang: () => void;
  /**
   * Translate a known key. Falls back to the English value if the key is
   * missing for the active language, and finally to the raw key string.
   */
  t: (key: TranslationKey) => string;
};

const STORAGE_KEY = "xavier-lang";

const LanguageProviderContext =
  React.createContext<LanguageProviderState | undefined>(undefined);

/**
 * LanguageProvider
 * ----------------
 * Lightweight bilingual (EN / HI) controller with localStorage persistence.
 *
 * - Defaults to English on the server and first paint to avoid hydration
 *   mismatch warnings; the stored preference is applied inside an effect.
 * - Exposes a `t(key)` helper so consumer components can stay declarative.
 * - Also sets `document.documentElement.lang` so screen readers / search
 *   crawlers pick up the active language.
 */
export function LanguageProvider({
  children,
  defaultLang = "en",
}: {
  children: React.ReactNode;
  defaultLang?: Lang;
}) {
  const [lang, setLangState] = React.useState<Lang>(defaultLang);

  // Pick up the stored preference on first client mount.
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "hi") {
        setLangState(stored);
      }
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  // Keep <html lang> in sync so AT + crawlers read the correct language.
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore write failures */
    }
    setLangState(next);
  }, []);

  const toggleLang = React.useCallback(() => {
    setLangState((prev) => {
      const next = prev === "en" ? "hi" : "en";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const t = React.useCallback(
    (key: TranslationKey): string => {
      const en = translations.en[key] as string | undefined;
      const hi = translations.hi[key] as string | undefined;
      if (lang === "hi") return hi ?? en ?? String(key);
      return en ?? String(key);
    },
    [lang],
  );

  const value = React.useMemo<LanguageProviderState>(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
  );

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

/**
 * Access the active language + translator from any client component.
 * Throws if used outside of <LanguageProvider>.
 */
export function useLanguage(): LanguageProviderState {
  const ctx = React.useContext(LanguageProviderContext);
  if (ctx === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
