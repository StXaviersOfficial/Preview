'use client'

import { motion } from "framer-motion";
import {
  Cpu, ShieldCheck,
  FlaskConical, BookOpen, Waves, Dumbbell, Music, Building2, Sparkles, Stethoscope, Truck, Users, GraduationCap, Globe2,
} from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { StaggerReveal, StaggerItem, Spotlight, TiltCard } from "@/components/site/animations";

const FEATURES = [
  { icon: Waves, title: "Swimming Pool", body: "A dedicated swimming pool — among the very few school pools in Muzaffarpur — coached by certified trainers." },
  { icon: FlaskConical, title: "Well-Equipped Labs", body: "Modern Physics, Chemistry, Biology, Computer & Language labs providing hands-on scientific curiosity." },
  { icon: Dumbbell, title: "Sports Academy", body: "Structured sports academy with basketball, indoor games, yoga, aerobics and annual sports day events." },
  { icon: Building2, title: "Auditorium", body: "A full-fledged auditorium hosting annual day, seminars, youth parliament and cultural performances." },
  { icon: Music, title: "Music & Dance Rooms", body: "Dedicated music rooms and dance rooms nurturing both classical and contemporary performing arts." },
  { icon: BookOpen, title: "Library", body: `Over ${SCHOOL.libraryBooks.toLocaleString('en-IN')} books, journals and reference material fostering a lifelong reading culture.` },
  { icon: Cpu, title: "IT Infrastructure", body: "Smart classrooms and modern IT infrastructure with high-speed connectivity across the campus." },
  { icon: ShieldCheck, title: "Security & CCTV", body: "Round-the-clock CCTV surveillance and trained security personnel for complete peace of mind." },
  { icon: Stethoscope, title: "Medical Facility", body: "On-campus medical facility with regular health and medical check-ups for every student." },
  { icon: Truck, title: "Transport", body: "Safe, punctual school transport fleet covering Muzaffarpur town and nearby areas." },
  { icon: GraduationCap, title: "Kindergarten Wing", body: "A dedicated, colourful kindergarten block designed for our youngest learners at Nursery–UKG." },
  { icon: Globe2, title: "Cultural Exchange", body: "Cultural exchange programmes connecting students with peers across the school chain." },
  { icon: Users, title: "Symposium & Seminars", body: "Regular seminars, science exhibitions, youth parliament and workshops beyond the textbook." },
];

export function Features() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <Sparkles className="size-3.5 text-gold" />
            WHY FAMILIES CHOOSE ST. XAVIER&apos;S
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            World-class facilities, <span className="text-gradient-xavier">for every student</span>.
          </motion.h2>
        </div>

        {/* Feature grid with ripple stagger + 3D tilt + spotlight */}
        <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5" stagger={0.06}>
          {FEATURES.map((f, i) => (
            <StaggerItem key={f.title}>
              <TiltCard intensity={10} className="h-full">
                <Spotlight className="h-full">
                  <div className="group relative rounded-2xl border border-xavier/10 bg-card p-5 sm:p-6 transition-colors hover:border-gold/50 overflow-hidden h-full">
                    {/* Number watermark */}
                    <span className="absolute top-3 right-4 font-serif text-6xl sm:text-7xl font-bold text-xavier/5 group-hover:text-gold/15 transition-colors duration-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="relative z-10">
                      <div className="size-11 rounded-xl bg-xavier-gradient flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        <f.icon className="size-5 text-gold-light" />
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-xavier-dark mb-1.5">{f.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                    </div>

                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-xavier to-gold group-hover:w-full transition-all duration-500" />

                    {/* Shine sweep on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-xavier/8" />
                    </div>
                  </div>
                </Spotlight>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
