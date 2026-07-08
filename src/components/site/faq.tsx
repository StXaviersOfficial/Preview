'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { HelpCircle, ChevronDown, RefreshCw, Search, X } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  admissions: "Admissions",
  academics: "Academics",
  facilities: "Facilities",
};

export function FAQ() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [error, setError] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: press / to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const loadFaqs = () => {
    setLoading(true);
    setError(false);
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setFaqs(d.faqs);
          if (d.faqs.length > 0) setOpen(d.faqs[0].id);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("[FAQ] Fetch failed:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => { loadFaqs(); }, []);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  const filtered = useMemo(() => {
    let result = filter === "all" ? faqs : faqs.filter((f) => f.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [faqs, filter, search]);

  return (
    <section id="faq" className="relative py-16 sm:py-24 bg-cream-gradient overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 size-72 rounded-full bg-gold/8 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-80 rounded-full bg-xavier/8 blur-2xl pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-5 sm:px-6 relative">
        {/* Header */}
        <Reveal variant="up" className="text-center mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <HelpCircle className="size-3.5 text-gold" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2
            className="scroll-reveal-up scroll-fade-in text-mask-reveal font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            Got questions? <span className="text-gradient-animate">We&apos;ve got answers.</span>
          </h2>
          <p
            className="mt-4 text-sm sm:text-lg text-muted-foreground"
          >
            Everything parents ask us — about admissions, facilities, academics and life at Xavier&apos;s.
          </p>
        </Reveal>

        {/* Search box */}
        {!loading && !error && faqs.length > 0 && (
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") setSearch(""); }}
              placeholder="Search questions… (press / to focus)"
              aria-label="Search FAQs"
              className="w-full rounded-full border border-xavier/15 bg-card pl-11 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-xavier/30 focus:border-xavier/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-xavier/10 hover:bg-xavier/20 flex items-center justify-center text-xavier-dark transition-colors"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3.5 py-2.5 sm:py-1.5 text-xs font-medium transition-colors ${
                filter === "all" ? "bg-xavier-gradient text-cream-fg" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3.5 py-2.5 sm:py-1.5 text-xs font-medium transition-colors ${
                  filter === c ? "bg-xavier-gradient text-cream-fg" : "bg-card border border-xavier/10 text-foreground/70 hover:text-xavier-dark"
                }`}
              >
                {CATEGORY_LABELS[c] || c}
              </button>
            ))}
          </div>
        )}

        {/* FAQ accordion */}
        {loading ? (
          <div className="space-y-2.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-xavier/10 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-8 bg-gold/10 rounded animate-pulse" />
                  <div className="h-4 flex-1 bg-xavier/10 rounded animate-pulse" />
                  <div className="size-7 bg-xavier/10 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive mb-3">Couldn't load FAQs.</p>
            <button onClick={loadFaqs} className="inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-4 py-2 text-xs font-semibold text-cream-fg">
              <RefreshCw className="size-3.5" /> Tap to retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-xavier/10 bg-card p-8 text-center text-muted-foreground">
            <HelpCircle className="size-10 mx-auto mb-3 text-gold/40" />
            {search ? (
              <>
                <p className="text-sm">No questions match &ldquo;{search}&rdquo;.</p>
                <p className="text-xs mt-1">Try a different search term or browse all FAQs.</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs font-semibold text-cream-fg"
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No FAQs available right now. Please contact the school office for any questions.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((faq, i) => (
              <Reveal
                key={faq.id}
                variant="wave"
                delay={i * 0.05}
                className={`animated-border card-3d-tilt rounded-2xl border overflow-hidden transition-colors hover-shadow ${
                  open === faq.id ? "border-gold/40 bg-card shadow-elegant" : "border-xavier/10 bg-card hover:border-xavier/30"
                }`}
              >
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  onKeyDown={(e) => { if (e.key === "Escape") setOpen(null); }}
                  aria-expanded={open === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-serif text-xs sm:text-sm font-bold text-gold tabular-nums shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif text-sm sm:text-base font-bold text-xavier-dark">{faq.question}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: open === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 size-7 rounded-full bg-xavier/10 flex items-center justify-center"
                  >
                    <ChevronDown className="size-4 text-xavier-dark" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-label={`Answer: ${faq.question}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 pl-12 sm:pl-14">
                        <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <Reveal
          variant="scale"
          className="mt-8 rounded-2xl bg-xavier-gradient p-5 sm:p-7 text-cream-fg text-center"
        >
          <p className="font-serif text-base sm:text-lg font-bold mb-1">Still have a question?</p>
          <p className="text-xs sm:text-sm text-cream-fg/70 mb-3">Our office is happy to help with anything not covered above.</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs sm:text-sm font-bold text-xavier-dark hover:opacity-90 transition-opacity"
          >
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
}
