'use client'

import { useEffect, useRef, useState } from "react";
import { Sparkle } from "lucide-react";

const items = [
  "CBSE Affiliated",
  "Smart Classes",
  "Day School",
  "Nursery → Class 12",
  "Co-Educational",
  "Holistic Development",
  "Expert Faculty",
  "Modern Labs",
  "Sports Academy",
  "Cultural Excellence",
  "Swimming Pool",
  "Library 6,500+ Books",
  "Auditorium",
  "Music & Dance Rooms",
];

export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Pause CSS animation when offscreen (saves CPU/battery on mobile).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playState = hovered ? "paused" : (inView ? "running" : "paused");

  return (
    <section
      ref={ref}
      className="relative py-3 sm:py-4 bg-xavier-gradient overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="School highlights"
    >
      <div className="relative flex overflow-hidden mask-fade-r">
        <div
          className="flex shrink-0 animate-marquee gap-6 sm:gap-8 pr-6 sm:pr-8"
          style={{ animationPlayState: playState }}
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-xs sm:text-sm font-medium text-cream-fg/90 whitespace-nowrap"
            >
              <Sparkle className="size-3.5 text-gold-light shrink-0" />
              <span className="font-serif italic">{item}</span>
            </span>
          ))}
        </div>
        <div
          className="flex shrink-0 animate-marquee gap-6 sm:gap-8 pr-6 sm:pr-8"
          style={{ animationPlayState: playState }}
          aria-hidden
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-xs sm:text-sm font-medium text-cream-fg/90 whitespace-nowrap"
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
