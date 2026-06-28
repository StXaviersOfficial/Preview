"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BackToTop
 * ---------
 * Floating button that smooth-scrolls the page back to the top.
 * - Appears after the user scrolls 400px down the page.
 * - Sits at the bottom-right, below the WhatsApp button.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "fixed right-4 sm:right-6 bottom-6 z-50",
            "inline-flex size-12 items-center justify-center rounded-full",
            "bg-xavier-gradient text-cream shadow-glow-xavier",
            "transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-xavier/40"
          )}
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
