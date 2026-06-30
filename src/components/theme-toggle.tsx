'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full bg-xavier/10 text-xavier-dark transition-colors hover:bg-xavier/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-xavier/40 shadow-sm',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute flex items-center justify-center"
          >
            <Sun className="size-5" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute flex items-center justify-center"
          >
            <Moon className="size-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
