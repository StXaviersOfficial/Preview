'use client'

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, ArrowUp, Globe, Heart } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { Reveal } from "@/components/site/reveal";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Campus & Facilities", href: "#campus" },
  { label: "Photo Gallery", href: "#gallery" },
  { label: "Leadership", href: "#leadership" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="relative bg-xavier-dark text-cream mt-auto">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6 pt-12 sm:pt-16 pb-8">
        {/* Top CTA strip */}
        <Reveal
          variant="scale"
          className="rounded-2xl glass-dark p-5 sm:p-10 mb-10 sm:mb-14 flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left"
        >
          <div>
            <h3 className="font-serif text-xl sm:text-3xl font-bold text-cream">
              Ready to give your child the Xavier&apos;s edge?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-cream/70 max-w-xl">
              Admissions open for Nursery — Class 11. Limited seats — apply early to avoid disappointment.
            </p>
          </div>
          <a
            href="#admissions"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 sm:px-7 py-3.5 text-sm font-bold text-xavier-dark shadow-glow-gold"
          >
            Apply Now
            <ArrowUp className="size-4 rotate-45" />
          </a>
        </Reveal>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 mb-10 sm:mb-14">
          {/* Brand */}
          <Reveal variant="up" className="sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 sm:size-12 rounded-full bg-xavier-gradient flex items-center justify-center shadow-glow-xavier overflow-hidden">
                <img src="/school/logo-white.png" alt="St. Xavier's logo" className="h-full w-full object-contain scale-110" />
              </div>
              <div>
                <p className="font-serif text-lg sm:text-xl font-bold">St. Xavier&apos;s</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-cream/60">Jr./Sr. School • Muzaffarpur</p>
              </div>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed mb-5 max-w-sm">
              A premier CBSE co-educational institution since {SCHOOL.established}, where discipline meets opportunity on Goshala Road, Muzaffarpur.
            </p>
            <div className="flex gap-3">
              <a
                href={SCHOOL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full glass-dark flex items-center justify-center hover:bg-cream/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={SCHOOL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 rounded-full glass-dark flex items-center justify-center hover:bg-cream/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href={`mailto:${SCHOOL.email}`}
                className="size-10 rounded-full glass-dark flex items-center justify-center hover:bg-cream/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </Reveal>

          {/* Quick links */}
          <Reveal variant="up" delay={0.05} className="lg:col-span-3">
            <FooterHeading>Explore</FooterHeading>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-gold-light transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal variant="up" delay={0.1} className="lg:col-span-4">
            <FooterHeading>Reach Us</FooterHeading>
            <ul className="space-y-3 text-sm text-cream/70">
              <li className="flex gap-2.5">
                <MapPin className="size-4 text-gold-light mt-0.5 shrink-0" />
                <span>{SCHOOL.addressLine}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="size-4 text-gold-light mt-0.5 shrink-0" />
                <a href={`tel:+91${SCHOOL.phones[0]}`} className="hover:text-gold-light transition-colors">
                  +91 {SCHOOL.phones[0]}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="size-4 text-gold-light mt-0.5 shrink-0" />
                <a href={`mailto:${SCHOOL.email}`} className="hover:text-gold-light transition-colors break-all">
                  {SCHOOL.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Globe className="size-4 text-gold-light mt-0.5 shrink-0" />
                <span>{SCHOOL.website}</span>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* Divider with motto */}
        <div className="py-5 sm:py-6 border-y border-cream/10 text-center">
          <p className="font-serif italic text-cream/80 text-sm sm:text-base">
            &ldquo;{SCHOOL.tagline}&rdquo;
          </p>
        </div>

        {/* Bottom row */}
        <div className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} St. Xavier&apos;s Jr./Sr. School, Muzaffarpur. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="size-3 text-gold fill-gold" /> for the St. Xavier's community
          </p>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 size-11 sm:size-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-glow-gold"
        aria-label="Back to top"
      >
        <ArrowUp className="size-5 text-xavier-dark" />
      </motion.button>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-xs sm:text-sm font-bold text-gold-light uppercase tracking-widest mb-3 sm:mb-4">
      {children}
    </p>
  );
}
