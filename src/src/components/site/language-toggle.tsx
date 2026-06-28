"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/site/language-provider";
import { cn } from "@/lib/utils";

/**
 * LanguageToggle
 * --------------
 * Compact EN ⇄ HI pill button. Sits next to <ThemeToggle> in the navbar.
 * - Active language is shown bold; the inactive one is muted.
 * - A tiny rotating globe icon reinforces the meaning at a glance.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={
        lang === "en"
          ? "हिंदी में देखें (Switch to Hindi)"
          : "View in English"
      }
      title={lang === "en" ? "हिंदी" : "English"}
      className={cn(
        "relative inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-xavier/10 px-3 text-xavier-dark transition-colors hover:bg-xavier/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xavier/40",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key="globe"
          initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <Languages className="size-4" />
        </motion.span>
      </AnimatePresence>

      <span className="flex items-center gap-1 text-xs font-bold tracking-wide">
        <span className={lang === "en" ? "text-xavier-dark" : "text-xavier-dark/40"}>
          EN
        </span>
        <span className="text-xavier-dark/30" aria-hidden="true">
          /
        </span>
        <span
          className={
            lang === "hi" ? "text-xavier-dark" : "text-xavier-dark/40"
          }
        >
          हिं
        </span>
      </span>
    </button>
  );
}
