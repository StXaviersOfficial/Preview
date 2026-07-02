'use client'

import { motion } from "framer-motion";
import React, { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Facebook, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";
import { trackEnquiry, trackOutbound } from "@/lib/site/analytics";
import { Reveal } from "@/components/site/reveal";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", grade: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Inline validation
  const validateField = (name: string, value: string): string => {
    if (name === "name") {
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (value.length > 200) return "Name too long";
    }
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
    }
    if (name === "phone" && value.trim()) {
      if (!/^[+]?[\d\s-]{6,20}$/.test(value)) return "Please enter a valid phone number";
    }
    if (name === "message" && value.length > 5000) return "Message too long (max 5000 chars)";
    return "";
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    errors.name = validateField("name", form.name);
    errors.email = validateField("email", form.email);
    errors.phone = validateField("phone", form.phone);
    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (touched[field]) {
      setValidationErrors({ ...validationErrors, [field]: validateField(field, value) });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    setValidationErrors({ ...validationErrors, [field]: validateField(field, form[field as keyof typeof form]) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validateAll()) {
      setTouched({ name: true, email: true, phone: true, grade: false, message: false });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }
      setSubmitted(true);
      trackEnquiry();
      setForm({ name: "", email: "", phone: "", grade: "", message: "" });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { label: "Parent / Guardian Name", name: "name", type: "text", placeholder: "e.g. Rajesh Kumar", required: true, colSpan: "sm:col-span-2" },
    { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com", required: true, colSpan: "" },
    { label: "Phone Number", name: "phone", type: "tel", placeholder: "+91 90000 00000", required: true, colSpan: "" },
    { label: "Class Seeking Admission To", name: "grade", type: "text", placeholder: "e.g. Class 6", required: false, colSpan: "sm:col-span-2" },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header */}
        <Reveal variant="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
          >
            <Mail className="size-3.5 text-gold" />
            GET IN TOUCH
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-ink leading-tight text-balance"
          >
            Come, see the <span className="text-gradient-xavier">Xavier&apos;s</span> difference.
          </h2>
          <p
            className="mt-4 text-sm sm:text-lg text-muted-foreground"
          >
            Visit us on Goshala Road or send a quick enquiry — we&apos;d love to meet your family.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Contact info card */}
          <Reveal
            variant="left"
            className="lg:col-span-5 rounded-2xl bg-xavier-gradient p-6 sm:p-9 text-cream shadow-glow-xavier"
          >
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-5 sm:mb-7">Visit / Reach Us</h3>

            <div className="space-y-4 sm:space-y-5">
              <ContactRow icon={MapPin} label="Address" lines={[SCHOOL.addressLine]} />
              <ContactRow
                icon={Phone}
                label="Phone"
                lines={SCHOOL.phones.slice(0, 3).map((p) => `+91 ${p}`)}
              />
              <ContactRow icon={Mail} label="Email" lines={[SCHOOL.email, SCHOOL.emailAlt]} />
            </div>

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-cream/15">
              <p className="text-xs uppercase tracking-widest text-cream/60 mb-3">Follow us</p>
              <div className="flex gap-3">
                <a
                  href={SCHOOL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 sm:size-11 rounded-full glass flex items-center justify-center hover:bg-cream/15 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4 sm:size-5" />
                </a>
                <a
                  href={SCHOOL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 sm:size-11 rounded-full glass flex items-center justify-center hover:bg-cream/15 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4 sm:size-5" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal
            variant="right"
            className="lg:col-span-7 rounded-2xl border border-xavier/10 bg-card p-5 sm:p-9"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, duration: 0.4 }}
                  className="size-16 sm:size-20 rounded-full bg-gold-gradient flex items-center justify-center mb-5 shadow-glow-gold"
                >
                  <CheckCircle2 className="size-8 sm:size-10 text-xavier-dark" />
                </motion.div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark mb-2">Enquiry Received!</h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md px-4">
                  Thank you for reaching out to St. Xavier&apos;s. We&apos;ve received your enquiry and will get back to you shortly. For urgent queries, please call us directly.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  <a href={`tel:+91${SCHOOL.phones[0]}`} onClick={() => trackOutbound("phone", "contact_success")} className="inline-flex items-center gap-1.5 rounded-full bg-xavier-gradient px-4 py-2 text-xs font-semibold text-cream">
                    <Phone className="size-3.5" /> Call Now
                  </a>
                  <a href={`https://wa.me/91${SCHOOL.phones[0]}`} target="_blank" rel="noopener noreferrer" onClick={() => trackOutbound("whatsapp", "contact_success")} className="inline-flex items-center gap-1.5 rounded-full border border-xavier/20 px-4 py-2 text-xs font-semibold text-xavier-dark">
                    <MessageCircle className="size-3.5" /> WhatsApp
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-xavier/20 px-4 py-2 text-xs font-semibold text-xavier-dark hover:bg-xavier/5"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-xavier-dark">Send an Enquiry</h3>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {fields.map((field) => (
                    <div key={field.name} className={field.colSpan}>
                      <label htmlFor={field.name} className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wide">
                        {field.label} {field.required && <span className="text-xavier">*</span>}
                      </label>
                      <input
                        id={field.name}
                        type={field.type}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        onBlur={() => handleBlur(field.name)}
                        placeholder={field.placeholder}
                        aria-invalid={!!validationErrors[field.name]}
                        aria-describedby={validationErrors[field.name] ? `${field.name}-error` : undefined}
                        className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-colors ${
                          validationErrors[field.name]
                            ? "border-destructive focus:ring-destructive/30"
                            : "border-xavier/15 focus:ring-xavier/30 focus:border-xavier/40"
                        }`}
                      />
                      {validationErrors[field.name] && (
                        <p id={`${field.name}-error`} className="mt-1 text-xs text-destructive flex items-center gap-1">
                          <span className="size-1 rounded-full bg-destructive" />
                          {validationErrors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wide">
                    Message <span className="text-muted-foreground normal-case">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    placeholder="Tell us about your child or any specific query…"
                    className="w-full rounded-xl border border-xavier/15 bg-cream/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-xavier/30 focus:border-xavier/40 transition-colors resize-none"
                  />
                  <p className="mt-1 text-[10px] text-muted-foreground text-right">{form.message.length}/5000</p>
                </div>
                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-xavier-gradient px-7 py-3.5 text-sm font-semibold text-cream shadow-glow-xavier disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="size-4 rounded-full border-2 border-cream/40 border-t-cream animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <Send className="size-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>

        {/* Map */}
        <Reveal
          variant="blur"
          className="mt-4 sm:mt-6 rounded-2xl overflow-hidden border border-xavier/10 shadow-elegant"
        >
          <iframe
            title="St. Xavier's School location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(SCHOOL.mapQuery)}&z=15&output=embed`}
            className="w-full h-[280px] sm:h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, lines }: { icon: React.ElementType; label: string; lines: string[] }) {
  return (
    <div className="flex gap-3">
      <div className="size-9 sm:size-10 rounded-xl glass flex items-center justify-center shrink-0">
        {React.createElement(Icon as React.ElementType, { className: "size-4 text-gold-light" })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-cream/60 mb-0.5">{label}</p>
        {lines.map((l, i) => (
          <p key={i} className="text-xs sm:text-sm text-cream/90 leading-relaxed break-words">{l}</p>
        ))}
      </div>
    </div>
  );
}
