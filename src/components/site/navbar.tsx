'use client'

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Lock } from "lucide-react";
import { NAV_LINKS, SCHOOL } from "@/lib/site/data";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/site/language-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    NAV_LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top contact bar — desktop only */}
      <div
        className={cn(
          "hidden md:block text-xs text-cream/90 transition-all duration-300 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        )}
        style={{ background: "linear-gradient(90deg, oklch(0.30 0.16 16), oklch(0.42 0.18 18))" }}
      >
        <div className="container mx-auto max-w-7xl h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="size-3" /> +91 {SCHOOL.phones[0]}
            </span>
            <span className="text-cream/60">|</span>
            <span>{SCHOOL.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-80">CBSE Affiliated • Est. {SCHOOL.established}</span>
            <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-light font-medium tracking-wide">
              {SCHOOL.rank}
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "py-2 shadow-elegant bg-background/90 backdrop-blur-xl" : "py-2 sm:py-3 bg-background/40 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            {/* LEFT SIDE: hamburger + logo (mobile) / logo only (desktop) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hamburger — LEFT side, all sizes (so users can access menu everywhere) */}
              <button
                onClick={() => setMobileOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-full bg-xavier/10 text-xavier-dark hover:bg-xavier/15 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>

              {/* Logo */}
              <a href="#home" className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="relative">
                  <div className="size-9 sm:size-11 rounded-full bg-xavier-gradient flex items-center justify-center shadow-glow-xavier overflow-hidden">
                    <img
                      src="/school/logo-white.png"
                      alt="St. Xavier's logo"
                      className="h-full w-full object-contain scale-110"
                    />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 size-2 sm:size-3 rounded-full bg-gold" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-serif text-sm sm:text-lg font-bold tracking-tight text-xavier-dark">
                    St. Xavier&apos;s
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.18em] text-muted-foreground font-medium">
                    Jr./Sr. School • Muzaffarpur
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop nav (center-right) */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <Reveal key={link.href} variant="up" delay={i * 0.05}>
                    <a
                      href={link.href}
                      className={cn(
                        "relative px-3.5 py-2 text-sm font-medium transition-colors rounded-full",
                        isActive ? "text-xavier-dark bg-xavier/8" : "text-foreground/70 hover:text-xavier-dark hover:bg-xavier/5"
                      )}
                    >
                      {link.label}
                    </a>
                  </Reveal>
                );
              })}
            </nav>

            {/* CTA (desktop) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LanguageToggle className="hidden sm:inline-flex" />
              <ThemeToggle />
              <a
                href="#admissions"
                className="hidden sm:inline-flex items-center justify-center rounded-full bg-xavier-gradient px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-cream shadow-glow-xavier"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Left drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 z-[70] h-full w-[85%] max-w-sm bg-cream-gradient shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-xavier/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-xavier-gradient flex items-center justify-center overflow-hidden">
                    <img src="/school/logo-white.png" alt="St. Xavier's logo" className="h-full w-full object-contain scale-110" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-xavier-dark text-sm">St. Xavier&apos;s</p>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Muzaffarpur</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="size-9 rounded-full bg-xavier/10 flex items-center justify-center text-xavier-dark"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 overflow-y-auto">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-xavier/8 text-xavier-dark"
                          : "text-foreground/80 hover:bg-xavier/5 hover:text-xavier-dark"
                      }`}
                    >
                      <span className="font-serif">{link.label}</span>
                      <span className="text-gold">→</span>
                    </a>
                  );
                })}

                {/* Admin login — discreet but present */}
                <a
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground hover:bg-xavier/5 hover:text-xavier-dark transition-colors border-t border-xavier/10 pt-4"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="size-3.5" />
                    Admin Login
                  </span>
                  <span className="text-[10px] uppercase tracking-widest">Staff</span>
                </a>
              </nav>

              <div className="p-5 border-t border-xavier/10 space-y-3">
                <div className="flex items-center justify-center">
                  <LanguageToggle className="sm:hidden" />
                </div>
                <a
                  href="#admissions"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center rounded-full bg-xavier-gradient px-5 py-3.5 font-semibold text-cream shadow-glow-xavier"
                >
                  Apply for Admission
                </a>
                <a
                  href={`tel:+91${SCHOOL.phones[0]}`}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <Phone className="size-3.5" /> +91 {SCHOOL.phones[0]}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
