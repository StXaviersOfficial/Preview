'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";

/**
 * CookieConsent — shows a cookie consent banner on first visit.
 *
 * Stores consent in localStorage. If user accepts, analytics scripts
 * (if configured) will fire. If user declines, only essential cookies
 * are used (theme, language, admin session).
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("sx-cookie-consent");
      if (!consent) {
        // Small delay so it doesn't appear immediately on page load
        const t = setTimeout(() => setShow(true), 2000);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage may be unavailable — skip banner
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("sx-cookie-consent", "accepted");
    } catch {}
    setShow(false);
  };

  const decline = () => {
    try {
      localStorage.setItem("sx-cookie-consent", "declined");
    } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[80] p-4 sm:p-6 pointer-events-none"
        >
          <div className="mx-auto max-w-3xl rounded-2xl bg-xavier-dark text-cream-fg shadow-2xl border border-gold/20 p-5 sm:p-6 pointer-events-auto">
            <div className="flex items-start gap-4">
              <div className="size-10 sm:size-12 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Cookie className="size-5 sm:size-6 text-gold-light" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-base sm:text-lg font-bold mb-1">We use cookies</h2>
                <p className="text-xs sm:text-sm text-cream-fg/80 leading-relaxed">
                  We use essential cookies for theme, language, and admin sessions.
                  Analytics cookies (if enabled) are anonymous and help us improve.
                  See our{" "}
                  <a href="/privacy" className="underline hover:text-gold-light transition-colors">
                    Privacy Policy
                  </a>{" "}
                  for details.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={accept}
                    className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs sm:text-sm font-bold text-xavier-dark shadow-glow-gold hover:scale-105 transition-transform"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={decline}
                    className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-xs sm:text-sm font-semibold text-cream-fg hover:bg-cream/10 transition-colors"
                  >
                    Essential only
                  </button>
                </div>
              </div>
              <button
                onClick={decline}
                className="size-8 rounded-full hover:bg-cream/10 flex items-center justify-center text-cream-fg/60 hover:text-cream-fg transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
