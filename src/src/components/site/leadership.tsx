'use client'

import { motion } from "framer-motion";
import { Crown, Briefcase, Users, GraduationCap, Quote } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { Reveal } from "@/components/site/reveal";

const ROLE_ICONS: Record<string, React.ElementType> = {
  "Chairman": Crown,
  "Managing Director": Briefcase,
  "Joint Director": Users,
  "Principal": GraduationCap,
};

export function Leadership() {
  return (
    <section id="leadership" className="relative overflow-hidden py-16 sm:py-24 bg-xavier-dark text-cream">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full glass-gold px-4 py-1.5 text-xs font-medium text-gold-light mb-4"
          >
            <span className="size-1.5 rounded-full bg-gold-light" />
            OUR LEADERSHIP TEAM
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-cream leading-tight text-balance"
          >
            Meet the people <span className="text-gradient-gold">behind Xavier&apos;s</span>.
          </h2>
          <p
            className="mt-4 text-sm sm:text-lg text-cream/70"
          >
            A dedicated team whose passion, expertise and commitment form the foundation of everything we do — since {SCHOOL.established}.
          </p>
        </Reveal>

        {/* Leadership cards — 2 cols on mobile, 4 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {SCHOOL.leadership.map((leader, i) => {
            const Icon = ROLE_ICONS[leader.role] ?? Users;
            return (
              <Reveal
                key={leader.name}
                variant="glitch"
                delay={i * 0.05}
                className="group relative rounded-2xl overflow-hidden border border-cream/10 bg-cream/5"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={leader.image}
                    alt={`${leader.name}, ${leader.role}, St. Xavier's Jr./Sr. School`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-xavier-dark via-xavier-dark/30 to-transparent" />

                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 inline-flex items-center gap-1 rounded-full glass-dark px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] uppercase tracking-widest font-semibold text-gold-light">
                    <Icon className="size-2.5 sm:size-3" />
                    {leader.role}
                  </div>
                </div>

                <div className="p-3 sm:p-5">
                  <p className="font-serif text-sm sm:text-xl font-bold text-cream">{leader.name}</p>
                  <p className="text-[10px] sm:text-sm text-cream/60 mt-0.5">{leader.role}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Principal's message feature */}
        <Reveal
          variant="scale"
          className="mt-8 sm:mt-12 rounded-2xl glass-dark p-5 sm:p-10 flex flex-col lg:flex-row items-start gap-4 sm:gap-8"
        >
          <div className="shrink-0">
            <div className="size-14 sm:size-16 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-glow-gold">
              <GraduationCap className="size-7 sm:size-8 text-xavier-dark" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light font-semibold mb-2">Principal&apos;s Message</p>
            <Quote className="size-6 text-gold/60 mb-3" />
            <p className="font-serif italic text-sm sm:text-lg text-cream/85 leading-relaxed">
              &ldquo;{SCHOOL.principalMessage}&rdquo;
            </p>
            <p className="mt-4 text-xs sm:text-sm text-cream/60">
              — <span className="font-semibold text-gold-light">{SCHOOL.principalName}</span>, Principal, St. Xavier&apos;s Jr./Sr. School
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
