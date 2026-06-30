'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Quote, Target, Eye, Heart, MapPin, Building2, Users, BookMarked } from "lucide-react";
import { SCHOOL, IMAGES } from "@/lib/site/data";
import { TiltCard } from "@/components/site/animations";
import { Reveal } from "@/components/site/reveal";

const PILLARS = [
  { icon: Target, title: "Our Mission", body: "To form young men and women of competence, conscience and compassion — intellectually sharp, morally grounded and socially responsible — ready to lead and serve." },
  { icon: Eye, title: "Our Vision", body: "To be the most loved and trusted centre of school education in Muzaffarpur — a place where every child is seen, heard and challenged to become the best version of themselves." },
  { icon: Heart, title: "Our Values", body: "Discipline, dignity and devotion. We pair rigorous academics with character formation, so our students leave with both a degree and a moral compass." },
];

const QUICK_FACTS = [
  { icon: Building2, label: "Managing Society", value: "Chandra Children Welfare Society" },
  { icon: MapPin, label: "Campus Area", value: SCHOOL.campusArea },
  { icon: Users, label: "Students Enrolled", value: `${SCHOOL.studentsEnrolled}+` },
  { icon: BookMarked, label: "Library Books", value: `${SCHOOL.libraryBooks.toLocaleString('en-IN')}+` },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const decoY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section id="about" className="relative py-16 sm:py-24 bg-cream-gradient overflow-hidden">
      {/* Animated decorative blobs */}
      <motion.div
        style={{ y: decoY }}
        className="absolute -top-20 -right-20 size-96 rounded-full bg-gold/10 blur-3xl pointer-events-none"
      />
      <div className="absolute bottom-0 left-0 size-72 rounded-full bg-xavier/8 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <span className="size-1.5 rounded-full bg-gold animate-glow-pulse" />
            ESTABLISHED {SCHOOL.established} • NEARLY FIVE DECADES OF LEGACY
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            A legacy of <span className="text-gradient-xavier">excellence</span> on
            <span className="italic text-gold"> Goshala Road</span>.
          </h2>
        </Reveal>

        {/* Two column: image + content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Image column with parallax + tilt */}
          <Reveal variant="left" className="lg:col-span-5">
            <motion.div
              ref={ref}
              className="relative lg:sticky lg:top-24"
            >
              <TiltCard intensity={6} className="relative">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
                  <motion.img
                    style={{ y: imageY, scale: 1.15 }}
                    src={IMAGES.about2}
                    alt="St. Xavier's School campus, Muzaffarpur"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-xavier-dark/70 via-transparent to-transparent" />

                  {/* Floating principal's quote card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-6 left-6 right-6 rounded-2xl glass-dark p-5 text-cream"
                  >
                    <Quote className="size-6 text-gold-light mb-2" />
                    <p className="font-serif italic text-sm leading-relaxed line-clamp-4">
                      &ldquo;{SCHOOL.principalMessage}&rdquo;
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-widest text-cream/60">
                      — {SCHOOL.principalName}, Principal
                    </p>
                  </motion.div>
                </div>

                {/* Floating badge with spring bounce */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  animate={{ y: [0, -8, 0] }}
                  className="absolute -top-5 -right-3 sm:-top-5 sm:-right-5 size-20 sm:size-24 rounded-full bg-gold-gradient flex flex-col items-center justify-center shadow-glow-gold"
                >
                  <span className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark leading-none">
                    {new Date().getFullYear() - SCHOOL.established}+
                  </span>
                  <span className="text-[10px] sm:text-[10px] uppercase tracking-wider text-xavier-dark/80 mt-1">Years of Trust</span>
                </motion.div>
              </TiltCard>

              {/* Decorative side accent */}
              <div className="absolute -bottom-4 -left-4 size-24 border-l-2 border-b-2 border-gold/40 rounded-bl-3xl pointer-events-none" />
            </motion.div>
          </Reveal>

          {/* Content column */}
          <div className="lg:col-span-7">
            <Reveal variant="right">
              <p className="text-sm sm:text-base lg:text-lg text-foreground/75 leading-relaxed">
                Founded in <span className="font-semibold text-xavier-dark">{SCHOOL.established}</span> and administered by the {SCHOOL.managingSociety} ({SCHOOL.societyAct}) under the chairmanship of <span className="font-semibold text-xavier-dark">Mr. S. Chandra</span>, St. Xavier&apos;s Jr./Sr. School is a Co-Educational English Medium School affiliated to CBSE, New Delhi, up to 10+2 level.
              </p>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-foreground/75 leading-relaxed">
                Located on {SCHOOL.addressLine.split(",")[0]}, in a healthy and peaceful locality of Muzaffarpur, the campus spans over two acres of protected, pollution-free land with abundant green surroundings — a congenial setting for serious learning.
              </p>
            </Reveal>

            {/* Quick facts grid with stagger */}
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {QUICK_FACTS.map((fact, i) => (
                <Reveal
                  key={fact.label}
                  variant="elastic"
                  delay={i * 0.05}
                  className="flex items-start gap-3 rounded-2xl border border-xavier/10 bg-card p-3 sm:p-4 hover:border-gold/40 hover:shadow-elegant transition-all"
                >
                  <div className="size-10 rounded-xl bg-xavier-gradient flex items-center justify-center shrink-0">
                    <fact.icon className="size-4 text-gold-light" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{fact.label}</p>
                    <p className="text-xs sm:text-sm font-semibold text-xavier-dark mt-0.5">{fact.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Pillars with scroll-reveal */}
            <div className="mt-6 grid sm:grid-cols-3 gap-3 sm:gap-4">
              {PILLARS.map((p, i) => (
                <Reveal
                  key={p.title}
                  variant="wave"
                  delay={i * 0.05}
                  className="group rounded-2xl border border-xavier/10 bg-card p-4 sm:p-5 hover:border-gold/40 hover:shadow-elegant transition-all"
                >
                  <div className="size-11 rounded-xl bg-xavier-gradient flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <p.icon className="size-5 text-gold-light" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-xavier-dark">{p.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
