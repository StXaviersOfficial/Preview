'use client'

import { useState } from "react";
import { ClipboardCheck, FileText, CalendarCheck, HandCoins, ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { Reveal } from "@/components/site/reveal";
import { AdmissionForm } from "@/components/site/admission-form";
import { play } from "@/lib/site/sounds";

const STEPS = [
  {
    icon: FileText,
    title: "Registration",
    desc: "Collect & submit the Registration Form from the school office along with the registration fee and required documents.",
    meta: "~30 min at office",
  },
  {
    icon: ClipboardCheck,
    title: "Interaction / Assessment",
    desc: "An age-appropriate interaction (Nursery–Class 1) or written assessment (Class 2 onwards) to understand the child's readiness.",
    meta: "~1–2 hours",
  },
  {
    icon: CalendarCheck,
    title: "Offer & Confirmation",
    desc: "Selected candidates receive a provisional admission offer. Confirm the seat by paying the first instalment to lock it in.",
    meta: "~30 min confirmation",
  },
  {
    icon: HandCoins,
    title: "Fee Payment & Joining",
    desc: "Complete fee formalities, submit original documents and collect uniform, books and the joining kit. Welcome to Xavier's!",
    meta: "~1 hour for kit",
  },
];

const DOCS = [
  "Birth certificate (photocopy & original)",
  "4 recent passport-size photographs",
  "Aadhaar card of student & parents",
  "Previous school's Transfer Certificate (Class 2+)",
  "Last report card / mark sheet",
  "Caste / income certificate (if applicable)",
];

export function Admissions() {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <section id="admissions" className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-cream to-background">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6 relative">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-5"
          >
            <span className="size-1.5 rounded-full bg-xavier" />
            ADMISSIONS OPEN • SESSION 2026 – 27
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
          >
            Four steps to <span className="text-gradient-xavier">admission</span>.
          </h2>
          <p
            className="mt-4 text-base sm:text-lg text-muted-foreground"
          >
            A simple, transparent admission process for {SCHOOL.classesRange}. Reach out at any stage — our admissions team is happy to walk you through it.
          </p>
        </Reveal>

        {/* Steps grid — single column on mobile, 2 on small, 4 on large */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              variant="explode"
              delay={i * 0.05}
              className="group relative rounded-2xl border border-xavier/10 bg-card p-5 sm:p-6"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-5 size-8 rounded-full bg-gold-gradient flex items-center justify-center font-serif font-bold text-xavier-dark text-xs shadow-glow-gold">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="mt-4">
                <div className="size-11 rounded-xl bg-xavier-gradient flex items-center justify-center mb-3">
                  <step.icon className="size-5 text-gold-light" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-xavier-dark">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                <p className="mt-3 inline-block text-[10px] uppercase tracking-widest font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                  {step.meta}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Contact CTA — full width, no fee card */}
        <Reveal
          variant="scale"
          className="rounded-3xl bg-xavier-gradient p-6 sm:p-9 text-cream relative overflow-hidden shadow-glow-xavier"
        >
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Have a question about admissions or fees?</h3>
              <p className="text-sm sm:text-base text-cream/80">
                Speak directly with our Admissions Office for the latest fee structure, important dates, and any queries. We&apos;re happy to help.
              </p>
            </div>
            <div className="space-y-3">
              {SCHOOL.phones.slice(0, 3).map((p) => (
                <a
                  key={p}
                  href={`tel:+91${p}`}
                  className="flex items-center gap-3 rounded-2xl glass px-4 py-3 text-sm hover:bg-cream/10 transition-colors"
                >
                  <Phone className="size-4 text-gold-light" />
                  <span>+91 {p}</span>
                  <ArrowRight className="ml-auto size-4 text-cream/60" />
                </a>
              ))}
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-cream/10 border border-cream/20 px-5 py-3 text-sm font-bold text-cream hover:bg-cream/15 transition-colors"
              >
                Send an Enquiry
                <ArrowRight className="size-4" />
              </a>
              <button
                onClick={() => { play("click"); setFormOpen(true); }}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-gold-gradient px-5 py-3 text-sm font-bold text-xavier-dark hover:opacity-90 transition-opacity"
              >
                Apply for Admission
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Required docs strip */}
        <div className="mt-6 rounded-3xl border border-xavier/10 bg-card p-6 sm:p-9">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-1">Documents to bring</h3>
          <p className="text-sm text-muted-foreground mb-5">Keep these ready to make registration a breeze.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOCS.map((doc, i) => (
              <Reveal
                key={doc}
                variant="wave"
                delay={i * 0.05}
                className="flex items-start gap-2.5"
              >
                <CheckCircle2 className="size-5 text-gold shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{doc}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <AdmissionForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
}
