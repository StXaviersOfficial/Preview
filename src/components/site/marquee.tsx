'use client'

import { Sparkle } from "lucide-react";

const items = [
  "CBSE Affiliated",
  "Smart Classes",
  "Day Scholar + Boarding",
  "Nursery → Class 12",
  "Co-Educational",
  "Holistic Development",
  "Expert Faculty",
  "Modern Labs",
  "Sports Academy",
  "Cultural Excellence",
];

export function Marquee() {
  return (
    <section className="relative py-4 bg-xavier-gradient overflow-hidden">
      <div className="relative flex overflow-hidden mask-fade-r">
        <div className="flex shrink-0 animate-marquee gap-8 pr-8">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-xs sm:text-sm font-medium text-cream/90 whitespace-nowrap"
            >
              <Sparkle className="size-3.5 text-gold-light shrink-0" />
              <span className="font-serif italic">{item}</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee gap-8 pr-8" aria-hidden>
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-xs sm:text-sm font-medium text-cream/90 whitespace-nowrap"
            >
              <Sparkle className="size-3.5 text-gold-light shrink-0" />
              <span className="font-serif italic">{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
