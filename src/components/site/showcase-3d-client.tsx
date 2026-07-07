'use client';

/**
 * Showcase3DClient — previously a Three.js 3D scene.
 *
 * The 3D Canvas was causing major lag (multiple useFrame loops, OrbitControls,
 * Environment HDR loading, shadow maps). It has been replaced with a beautiful
 * CSS-animated static showcase that conveys the same "graduation journey"
 * message without any WebGL overhead.
 */

import { GraduationCap, BookOpen, Award } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SCHOOL } from "@/lib/site/data";

export function Showcase3DClient() {
  return (
    <section
      id="showcase-3d"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-cream via-background to-cream overflow-hidden"
      aria-labelledby="showcase-3d-title"
    >
      {/* Decorative background glows */}
      <div className="absolute top-10 left-10 size-72 rounded-full bg-gold/8 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-80 rounded-full bg-xavier/8 blur-2xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-5 sm:px-6 relative">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4">
            <span className="size-1.5 rounded-full bg-gold animate-glow-pulse" />
            THE XAVIER&apos;S EXPERIENCE
          </div>
          <h2 id="showcase-3d-title" className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance">
            Where <span className="text-gradient-xavier">achievements</span> take shape.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Every Xavierite&apos;s journey — from the first page of a textbook to the graduation
            stage. <span className="font-semibold text-xavier-dark">{new Date().getFullYear() - SCHOOL.established} years</span> of shaping
            curious minds into confident leaders.
          </p>
        </Reveal>

        {/* Three-card journey showcase */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <Reveal variant="up" delay={0.1}>
            <div className="group rounded-3xl border border-xavier/10 bg-card p-6 sm:p-8 text-center hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="mx-auto mb-4 size-16 rounded-2xl bg-xavier-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="size-7 text-gold-light" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark mb-2">Learn</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                From Nursery to Class 12, a rigorous CBSE curriculum with smart classes and modern labs.
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.2}>
            <div className="group rounded-3xl border border-xavier/10 bg-card p-6 sm:p-8 text-center hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="mx-auto mb-4 size-16 rounded-2xl bg-gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="size-7 text-xavier-dark" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark mb-2">Excel</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                100% board results, Olympiad toppers, and 80+ awards across academics, sports, and culture.
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.3}>
            <div className="group rounded-3xl border border-xavier/10 bg-card p-6 sm:p-8 text-center hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="mx-auto mb-4 size-16 rounded-2xl bg-xavier-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="size-7 text-gold-light" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-xavier-dark mb-2">Graduate</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Confident, compassionate young adults ready for college, careers, and life beyond.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
