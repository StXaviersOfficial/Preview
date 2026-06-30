'use client'

import { Quote, Award } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const TESTIMONIALS = [
  {
    name: "Krishna Saraf",
    role: "AISSCE 2026 Topper • 97.2%",
    quote:
      `St. Xavier's didn't just prepare me for the boards — it made me curious. The teachers knew me by name, knew my weak spots, and refused to let me settle for less. Scoring 97.2% in AISSCE 2026 was only possible because of the after-class doubt sessions and the constant push to aim higher.`,
    initials: "KS",
    highlight: true,
  },
  {
    name: "Parent of a Class 10 Student",
    role: "Day Scholar Family • Ramna, Muzaffarpur",
    quote:
      "We chose Xavier's for the CBSE affiliation and stayed for the people. The transport is punctual, the teachers respond within hours, and the campus with its swimming pool and auditorium feels genuinely world-class for Muzaffarpur.",
    initials: "PA",
  },
  {
    name: "Senior Secondary Student",
    role: "PCB Stream • Class 12",
    quote:
      "What stays with me isn't just the science coaching — it's the morning assemblies, the value-education classes, the way our Principal ma'am makes sure every girl feels heard. The 100% result this year was a team effort between students and teachers.",
    initials: "SS",
  },
  {
    name: "Alumnus, Batch of 2018",
    role: "Now pursuing B.Tech, NIT Patna",
    quote:
      "The well-equipped labs at Xavier's made physics and chemistry feel real, not theoretical. When I reached engineering college, I realised how far ahead I was thanks to the hands-on lab culture here. Discipline was drilled into us — and that discipline is what got me through JEE.",
    initials: "AB",
  },
  {
    name: "Commerce Stream Alumna",
    role: "Class of 2020 • CA Finalist",
    quote:
      "The Commerce stream at Xavier's was rigorous but never rigid. We did mock stock-market projects, visited local industries, and our Accounts sir refused to let us memorise — he made us understand. That foundation is why I cleared CA Foundation in my first attempt.",
    initials: "CA",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <Award className="size-3.5 text-gold fill-gold" />
            VOICES FROM OUR COMMUNITY
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            Stories from the <span className="text-gradient-xavier">Xavier&apos;s family</span>.
          </h2>
        </Reveal>

        {/* Masonry layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              as="figure"
              variant="wave"
              delay={i * 0.05}
              className={`break-inside-avoid rounded-2xl border bg-card p-5 sm:p-7 ${
                t.highlight ? "border-gold/40 bg-gradient-to-br from-gold/8 to-xavier/5" : "border-xavier/10"
              }`}
            >
              <Quote className={`size-6 mb-3 ${t.highlight ? "text-gold" : "text-gold/40"}`} />
              <blockquote className="text-sm sm:text-base text-foreground/85 leading-relaxed font-serif italic">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="size-10 sm:size-11 rounded-full bg-xavier-gradient flex items-center justify-center font-serif font-bold text-gold-light text-sm shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xavier-dark text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
              <div className="mt-3 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Award key={j} className="size-3.5 text-gold fill-gold" />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
