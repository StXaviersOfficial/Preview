'use client'

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { play } from "@/lib/site/sounds";
import { Megaphone, ChevronRight, X } from "lucide-react";

type Notice = {
  id: string;
  text: string;
  link: string | null;
  active: boolean;
};

export function NoticeTicker() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/notices")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) { play("notification"); setNotices(d.notices); }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % notices.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [notices.length]);

  if (notices.length === 0) return null;

  const notice = notices[current];

  return (
    <AnimatePresence>
    {!dismissed && (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative z-40 bg-xavier-gradient text-cream overflow-hidden"
    >
      {/* Animated shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(201,169,97,0.25) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center gap-3 relative">
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Megaphone className="size-4 text-gold-light" />
          </motion.div>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-gold-light font-bold">Notice</span>
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={notice.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs sm:text-sm font-medium"
            >
              {notice.link ? (
                <a href={notice.link} className="hover:text-gold-light transition-colors inline-flex items-center gap-1">
                  {notice.text}
                  <ChevronRight className="size-3" />
                </a>
              ) : (
                <span>{notice.text}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Dots indicator */}
        {notices.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {notices.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`size-1.5 rounded-full transition-all ${i === current ? "bg-gold-light w-4" : "bg-cream/40"}`}
                aria-label={`Notice ${i + 1}`}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 size-5 rounded-full hover:bg-cream/20 flex items-center justify-center transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="size-3" />
        </button>
      </div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}
