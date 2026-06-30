'use client';

import { useLanguage } from "@/components/site/language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang } = useLanguage();
  
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Switch language"
      title={lang === 'en' ? "हिंदी में देखें" : "View in English"}
      className={cn(
        "relative inline-flex h-11 items-center gap-1.5 rounded-full bg-xavier/10 px-4 text-xs font-bold text-xavier-dark transition-colors hover:bg-xavier/20 shadow-sm",
        className
      )}
    >
      <span className={lang === 'en' ? 'text-xavier-dark' : 'text-foreground/40'}>EN</span>
      <span className="text-foreground/20 text-xs">/</span>
      <span className={lang === 'hi' ? 'text-xavier-dark' : 'text-foreground/40'}>हिं</span>
    </button>
  );
}
