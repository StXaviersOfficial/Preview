'use client'

import { useState } from "react";
import { ArrowRight, ChevronDown, Sparkles, Award, BookOpen, Users, Phone } from "lucide-react";
import { SCHOOL, IMAGES } from "@/lib/site/data";
import { Magnetic, ConfettiBurst } from "@/components/site/animations";
import { trackApplyNow, trackOutbound } from "@/lib/site/analytics";
import { Reveal } from "@/components/site/reveal";
import { Name3D } from "@/components/site/name-3d";
import { SmartImage } from "@/components/site/smart-image";

export function Hero() {
  const [confetti, setConfetti] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const triggerConfetti = (e: React.MouseEvent) => {
    setConfetti({ x: e.clientX, y: e.clientY, active: true });
    setTimeout(() => setConfetti({ x: 0, y: 0, active: false }), 2000);
  };

  return (
    <section
      id="home"
      className="relative min-h-[92svh] sm:min-h-[100svh] w-full overflow-hidden bg-xavier-dark"
    >
      {/* Background image — static */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <SmartImage
          src="/school/home.jpg"
          alt="St. Xavier's Jr./Sr. School, Goshala Road, Muzaffarpur"
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-xavier-dark/55 via-xavier-dark/80 to-xavier-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-xavier-dark/90 via-xavier-dark/55 to-xavier-dark/30" />
      </div>

      {/* Static decorative glows */}
      <div
        className="absolute top-[15%] left-[5%] size-64 rounded-full pointer-events-none z-10 animate-float-y"
        style={{ background: "radial-gradient(circle, rgba(201,169,97,0.18), transparent 70%)" }}
      />
      <div
        className="absolute bottom-[15%] right-[8%] size-80 rounded-full pointer-events-none z-10 animate-float-x"
        style={{ background: "radial-gradient(circle, rgba(160,40,55,0.22), transparent 70%)" }}
      />

      {/* Grain texture — removed for performance (mix-blend-overlay is GPU-expensive) */}

      {/* Corner frame — single border, no animated corners (removed 4 glow-pulse animations for performance) */}
      <div className="absolute top-20 left-4 right-4 bottom-20 z-10 pointer-events-none border border-cream/10 rounded-3xl" />

      {/* Main content — CRAZIEST animations via Reveal */}
      <div className="relative z-20 container mx-auto max-w-7xl px-5 sm:px-6 min-h-[92svh] sm:min-h-[100svh] flex flex-col justify-center pt-24 pb-20">
        <div className="max-w-4xl">
          {/* Top badge — ELASTIC spring */}
          <Reveal variant="elastic" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full glass-gold px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-gold-light mb-6 sm:mb-8 animate-pulse-soft">
              <Sparkles className="size-3 sm:size-3.5 playful-bounce" />
              <span className="tracking-wide">{SCHOOL.rank}</span>
              <span className="size-1 rounded-full bg-gold-light/60" />
              <span>CBSE • Est. {SCHOOL.established}</span>
            </div>
          </Reveal>

          {/* Main headline — "St. Xavier's" on top, "Jr./Sr. School" directly below */}
          <Reveal variant="scale" delay={0.2}>
            <h1 className="font-serif font-bold tracking-tight leading-[1.0] mb-2 text-left">
              <Name3D />
              <span className="block text-[clamp(1.25rem,3.5vw,2.5rem)] text-cream-fg/85 font-medium tracking-wide animate-text-shimmer mt-1">
                Jr./Sr. School
              </span>
            </h1>
          </Reveal>

          {/* Sub-tagline — BLUR fade */}
          <Reveal variant="blur" delay={0.3}>
            <p className="mt-5 sm:mt-7 text-cream-fg/85 text-base sm:text-xl lg:text-2xl font-light max-w-2xl leading-relaxed">
              <span className="font-serif italic gradient-scroll-text">Where Discipline Meets Opportunity.</span>
              {" "}
              Nurturing curious minds since {SCHOOL.established}, on Goshala Road, Muzaffarpur.
            </p>
          </Reveal>

          {/* CTAs — scale with spring */}
          <Reveal variant="scale" delay={0.45}>
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              <Magnetic>
                <a
                  href="#admissions"
                  onClick={(e) => { triggerConfetti(e); trackApplyNow("hero"); }}
                  className="btn-shine group relative inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-xavier-dark shadow-glow-gold overflow-hidden hover:scale-105 transition-transform"
                >
                  <span className="relative z-10">Begin Your Journey</span>
                  <ArrowRight className="relative z-10 size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#about"
                  className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full glass px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-cream-fg hover:bg-cream/10 hover:scale-105 transition-all"
                >
                  Explore Campus
                  <ChevronDown className="size-4 transition-transform group-hover:translate-y-1" />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          {/* Quick feature pills — WAVE (rotated cascade) */}
          <Reveal variant="wave" delay={0.6}>
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-2 sm:gap-3">
              {[
                { icon: BookOpen, label: SCHOOL.classesRange },
                { icon: Users, label: SCHOOL.format },
                { icon: Award, label: `${SCHOOL.studentsEnrolled}+ Students` },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="card-lift inline-flex items-center gap-1.5 sm:gap-2 rounded-full glass px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-cream-fg/90 hover:scale-105 transition-transform cursor-default"
                  style={{ animation: `float-soft 6s ease-in-out infinite ${idx * 0.5}s` }}
                >
                  <item.icon className="size-3 sm:size-3.5 text-gold-light" />
                  {item.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Confetti burst */}
      <ConfettiBurst x={confetti.x} y={confetti.y} active={confetti.active} />

      {/* Floating contact bubble */}
      <a
        href={`tel:+91${SCHOOL.phones[0]}`}
        onClick={() => trackOutbound("phone", "hero")}
        className="absolute bottom-6 left-5 sm:bottom-10 sm:left-6 z-20 flex items-center gap-2 rounded-full glass-dark px-4 py-2.5 text-cream-fg hover:bg-cream/10 transition-colors"
      >
        <Phone className="size-4 text-gold-light" />
        <span className="text-xs">+91 {SCHOOL.phones[0]}</span>
      </a>
    </section>
  );
}
