'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Blocks, FlaskConical, Calculator, Palette, GraduationCap, ArrowUpRight, BookMarked, Atom, Beaker } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { Reveal } from "@/components/site/reveal";

const STAGES = [
  {
    id: "pre-primary",
    icon: Blocks,
    name: "Pre-Primary",
    grades: "Nursery — UKG",
    age: "Age 3–5",
    desc: "A play-based foundation where curiosity is kindled through stories, songs, art and gentle structure. Focus on motor skills, phonics, socialisation and the joy of learning, in our dedicated colourful Kindergarten wing.",
    highlights: ["Dedicated Kindergarten block", "Phonics & number readiness", "Activity-based learning", "Trained early-childhood educators"],
  },
  {
    id: "primary",
    icon: BookMarked,
    name: "Primary",
    grades: "Class 1 — 5",
    age: "Age 6–10",
    desc: "Strong literacy, numeracy and inquiry skills are built through experiential learning. Children begin exploring science, social studies, computers and a third language, supported by our 6,500+ book library.",
    highlights: ["Reading & writing fluency programmes", "Hands-on EVS projects", "Computer education from Class 1", "Annual sport & cultural houses"],
  },
  {
    id: "middle",
    icon: FlaskConical,
    name: "Middle School",
    grades: "Class 6 — 8",
    age: "Age 11–13",
    desc: "Conceptual depth increases across all CBSE subjects. Students rotate through our Physics, Chemistry, Biology and Computer labs, take up science exhibitions and begin structured career-awareness conversations.",
    highlights: ["Subject-specialist faculty", "Well-equipped science labs", "Mandatory library hours", "Science exhibition & seminars"],
  },
  {
    id: "secondary",
    icon: Calculator,
    name: "Secondary",
    grades: "Class 9 — 10",
    age: "Age 14–15",
    desc: "Focused CBSE Board preparation (AISSE) with rigorous assessments, doubt-clearing cells and personalised mentoring. Every student is paired with a teacher-mentor for the year.",
    highlights: ["Board-exam strategy workshops", "Regular tests & analysis", "Mentor-mentee pairing", "Life-skills & value education"],
  },
  {
    id: "senior",
    icon: GraduationCap,
    name: "Senior Secondary",
    grades: "Class 11 — 12",
    age: "Age 16–17",
    desc: "Four streams — PCM, PCB, Commerce and Arts — affiliated to CBSE up to 10+2. Recent AISSCE 2026 topper Krishna Saraf scored 97.2%, with 100% result for the batch.",
    highlights: ["PCM • PCB • Commerce • Arts", "Science exhibition & seminars", "Youth parliament & workshops", "Dedicated senior study lounges"],
  },
];

const STREAMS = [
  { icon: Atom, name: "PCM", subjects: "Physics • Chemistry • Mathematics • Optional CS" },
  { icon: Beaker, name: "PCB", subjects: "Physics • Chemistry • Biology • Optional Maths" },
  { icon: Calculator, name: "Commerce", subjects: "Accountancy • Business Studies • Economics • Maths" },
  { icon: Palette, name: "Arts", subjects: "History • Political Science • Geography • Psychology" },
];

export function Academics() {
  const [active, setActive] = useState(0);

  return (
    <section id="academics" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-cream to-background">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <BookMarked className="size-3.5 text-gold" />
            ACADEMIC JOURNEY • {SCHOOL.classesRange.toUpperCase()}
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            From first steps to <span className="text-gradient-xavier">graduation walk</span>.
          </h2>
        </Reveal>

        {/* Stage selector tabs — scrollable on mobile */}
        <Reveal variant="scale" className="flex flex-wrap gap-2 mb-6 sm:mb-10">
          {STAGES.map((stage, i) => (
            <button
              key={stage.id}
              onClick={() => setActive(i)}
              className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                active === i
                  ? "text-cream bg-xavier-gradient"
                  : "text-foreground/70 hover:text-xavier-dark bg-card border border-xavier/10"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <stage.icon className="size-3.5 sm:size-4" />
                {stage.name}
              </span>
            </button>
          ))}
        </Reveal>

        {/* Active stage detail */}
        <Reveal variant="flip">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12 gap-6 rounded-2xl border border-xavier/10 bg-card p-5 sm:p-10"
            >
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3">
                  <div className="size-12 sm:size-14 rounded-xl bg-xavier-gradient flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = STAGES[active].icon;
                      return <Icon className="size-6 sm:size-7 text-gold-light" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark">{STAGES[active].name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{STAGES[active].grades} • {STAGES[active].age}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm sm:text-base text-foreground/80 leading-relaxed">{STAGES[active].desc}</p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gold font-semibold mb-3 sm:mb-4">Programme Highlights</p>
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                  {STAGES[active].highlights.map((h, i) => (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      className="flex items-start gap-2.5 rounded-xl bg-cream/60 p-3 sm:p-4 border border-xavier/5"
                    >
                      <div className="mt-0.5 size-4 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                        <ArrowUpRight className="size-2.5 text-xavier-dark" />
                      </div>
                      <span className="text-xs sm:text-sm text-foreground/80 font-medium">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        {/* Streams */}
        <div className="mt-12 sm:mt-16">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-xl sm:text-3xl font-bold text-ink text-center mb-2"
          >
            Senior Secondary Streams
          </motion.h3>
          <p className="text-center text-xs sm:text-base text-muted-foreground mb-3">Four pathways. One promise — your child is ready for what comes next.</p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-8 sm:mb-10 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 sm:px-5 py-2 sm:py-2.5 text-xavier-dark shadow-glow-gold"
          >
            <GraduationCap className="size-3.5 sm:size-4" />
            <span className="text-xs sm:text-sm font-semibold text-center">
              AISSCE 2026 Topper: {SCHOOL.topScorer.name} — {SCHOOL.topScorer.score} • 100% Result
            </span>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {STREAMS.map((s, i) => (
              <Reveal
                key={s.name}
                variant="glitch"
                delay={i * 0.05}
                className="rounded-2xl bg-card border border-xavier/10 p-4 sm:p-7"
              >
                <div
                  className="size-11 sm:size-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                  style={{ background: "linear-gradient(135deg, var(--xavier), var(--xavier-dark))" }}
                >
                  <s.icon className="size-6 sm:size-7 text-gold-light" />
                </div>
                <h4 className="font-serif text-lg sm:text-2xl font-bold text-xavier-dark">{s.name}</h4>
                <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{s.subjects}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
