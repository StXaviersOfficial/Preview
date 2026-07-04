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
];

export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Pause CSS animation when offscreen (saves CPU/battery on mobile).
  // We toggle animation-play-state via inline style on the animated divs.
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

  const playState = inView ? "running" : "paused";

  return (
    <section ref={ref} className="relative py-4 bg-xavier-gradient overflow-hidden">
      <div className="relative flex overflow-hidden mask-fade-r">
        <div
          className="flex shrink-0 animate-marquee gap-8 pr-8"
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
          className="flex shrink-0 animate-marquee gap-8 pr-8"
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
