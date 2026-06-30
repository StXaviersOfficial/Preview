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
        "relative inline-flex h-8 items-center gap-1 rounded-full bg-xavier/10 px-2.5 text-[10px] font-bold text-xavier-dark transition-colors hover:bg-xavier/20 shadow-sm",
        className
      )}
    >
      <span className={lang === 'en' ? 'text-xavier-dark' : 'text-foreground/40'}>EN</span>
      <span className="text-foreground/25">/</span>
      <span className={lang === 'hi' ? 'text-xavier-dark' : 'text-foreground/40'}>हिं</span>
    </button>
  );
}
