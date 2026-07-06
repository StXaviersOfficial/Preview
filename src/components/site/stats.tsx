'use client'

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { STATS, SCHOOL } from "@/lib/site/data";
import { AnimatedCounter, TiltCard, Halo, BorderShimmer } from "@/components/site/animations";
import { Reveal } from "@/components/site/reveal";

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <>
      {/* Achievement banner — 100% AISSCE Result */}
      <section className="relative z-30 px-4 sm:px-6 pt-2 pb-1">
        <div className="container mx-auto max-w-7xl">
          <Reveal variant="elastic" delay={0}>
            <div className="rounded-2xl bg-gradient-to-r from-xavier-dark via-xavier to-xavier-dark text-cream-fg p-3 sm:p-4 flex items-center justify-center gap-3 sm:gap-4 shadow-elegant">
              <Sparkles className="size-5 sm:size-6 text-gold-light shrink-0 animate-glow-pulse" />
              <p className="text-xs sm:text-sm font-medium text-center">
                <span className="font-serif italic text-gold-light">100% AISSCE 2026 Result</span>
                {" — "}
                Topper <span className="font-bold">{SCHOOL.topScorer.name}</span> scored{" "}
                <span className="font-bold text-gold-light">{SCHOOL.topScorer.score}</span>
                <span className="hidden sm:inline"> in {SCHOOL.topScorer.exam}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative -mt-4 sm:-mt-6 z-30 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              variant="elastic"
              delay={i * 0.05}
            >
              <TiltCard intensity={8} className="h-full">
                <Halo className="h-full">
                  <BorderShimmer className="h-full rounded-3xl">
                    <div className="relative h-full rounded-3xl border border-xavier/10 bg-card/70 backdrop-blur-md p-4 sm:p-6 lg:p-8 overflow-hidden">
                      {/* Animated gradient backdrop on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-xavier/8 to-gold/8 opacity-0 hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative">
                        <div className="flex items-baseline gap-1">
                          <AnimatedCounter
                            value={stat.value}
                            suffix={stat.suffix}
                            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-xavier"
                          />
                        </div>
                        <p className="mt-2 font-serif text-sm sm:text-base lg:text-lg font-semibold text-foreground">{stat.label}</p>
                        <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{stat.sub}</p>
                        <motion.div
                          className="mt-3 h-px bg-gradient-to-r from-xavier via-gold to-transparent"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={inView ? { scaleX: 1 } : {}}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        />
                      </div>

                      {/* Floating gold accent */}
                      <motion.span
                        className="absolute top-2 right-3 size-1.5 rounded-full bg-gold"
                        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </div>
                  </BorderShimmer>
                </Halo>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
