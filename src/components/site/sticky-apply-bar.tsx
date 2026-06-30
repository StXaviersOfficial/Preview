'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { trackApplyNow, trackOutbound } from "@/lib/site/analytics";

/**
 * Sticky mobile Apply Now bar.
 * Shows on mobile when user scrolls past hero.
 * Contains: Apply Now CTA + WhatsApp + Call.
 */
export function StickyApplyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past hero (roughly 90% of viewport height)
      setVisible(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
        >
          <div className="bg-xavier-dark/95 backdrop-blur-xl border-t border-gold/20 shadow-2xl">
            <div className="flex items-center gap-2 px-3 py-2.5 safe-area-inset-bottom">
              {/* Call */}
              <a
                href={`tel:+91${SCHOOL.phones[0]}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream/10 text-cream"
                aria-label="Call school"
                onClick={() => trackOutbound("phone", "sticky_bar")}
              >
                <Phone className="size-4" />
              </a>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/91${SCHOOL.phones[0]}?text=${encodeURIComponent("Hello! I'm interested in admission at St. Xavier's School. Please share details.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
                aria-label="Chat on WhatsApp"
                onClick={() => trackOutbound("whatsapp", "sticky_bar")}
              >
                <MessageCircle className="size-4" />
              </a>
              {/* Apply Now CTA */}
              <a
                href="#admissions"
                onClick={() => trackApplyNow("sticky")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2.5 text-xs font-bold text-xavier-dark shadow-glow-gold"
              >
                Apply Now
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
