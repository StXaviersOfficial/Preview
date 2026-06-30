'use client'

import { motion } from "framer-motion";
import { IMAGES, SCHOOL } from "@/lib/site/data";
import { Waves, FlaskConical, Dumbbell, BookOpen, Music, Building2, Users, Home } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const FACILITIES = [
  { name: "Group Photo — Annual Event", icon: Users, image: IMAGES.galleryGroupPhoto, desc: "Our school family at annual celebrations.", span: "sm:col-span-2 sm:row-span-2" },
  { name: "Indoor Games", icon: Dumbbell, image: IMAGES.galleryIndoor, desc: "Carrom, chess, table tennis & more.", span: "" },
  { name: "Dance Performance", icon: Music, image: IMAGES.galleryDance, desc: "Classical & contemporary dance rooms in action.", span: "" },
  { name: "Christmas Carnival", icon: BookOpen, image: IMAGES.galleryChristmas, desc: "Annual Christmas Carnival — a Xavier's tradition.", span: "" },
  { name: "Campus Life", icon: Home, image: IMAGES.galleryStudents, desc: "Students at the heart of everything we do.", span: "sm:col-span-2" },
  { name: "School Gallery — 01", icon: Building2, image: IMAGES.gallery1, desc: "Inside our vibrant campus.", span: "" },
  { name: "School Gallery — 02", icon: FlaskConical, image: IMAGES.gallery2, desc: "Hands-on learning across disciplines.", span: "" },
  { name: "Sports & Activities", icon: Waves, image: IMAGES.gallery4, desc: "Swimming pool, sports academy & more.", span: "sm:col-span-2" },
];

export function Facilities() {
  return (
    <section id="campus" className="relative py-16 sm:py-24 bg-xavier-dark text-cream overflow-hidden">
      {/* Flowing aurora background */}
      <div className="sx-aurora-flow opacity-40" />

      <div className="container mx-auto max-w-7xl px-5 sm:px-6 relative">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-10 sm:mb-14">
          <div
            className="inline-flex items-center gap-2 rounded-full glass-gold px-4 py-1.5 text-xs font-medium text-gold-light mb-4"
          >
            <span className="size-1.5 rounded-full bg-gold-light animate-glow-pulse" />
            CAMPUS &amp; FACILITIES
          </div>
          <h2
            className="font-serif text-3xl sm:text-5xl font-bold text-cream leading-tight text-balance"
          >
            Spaces designed for <span className="text-gradient-gold">discovery</span>.
          </h2>
          <p
            className="mt-4 text-sm sm:text-lg text-cream/70"
          >
            {SCHOOL.campusArea} of thoughtfully designed learning environments on Goshala Road — where every corner invites curiosity.
          </p>
        </Reveal>

        {/* Bento grid with 3D tilt + image zoom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] gap-3 sm:gap-4">
          {FACILITIES.map((f, i) => (
            <Reveal
              key={f.name}
              variant="explode"
              delay={i * 0.05}
              className={`group relative overflow-hidden rounded-2xl border border-cream/10 ${f.span}`}
            >
              <img
                src={f.image}
                alt={`${f.name} — St. Xavier's Jr./Sr. School, Muzaffarpur`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-xavier-dark via-xavier-dark/40 to-transparent" />

              {/* Animated gold corner accent on hover */}
              <div className="absolute top-0 right-0 size-16 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-gold to-transparent"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="absolute top-0 right-0 h-px w-12 bg-gradient-to-l from-gold to-transparent"
                />
              </div>

              <div className="absolute top-3 left-3 size-9 rounded-lg glass-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                <f.icon className="size-4 text-gold-light" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-serif text-sm sm:text-base font-bold text-cream">{f.name}</h3>
                <p className="text-[11px] sm:text-xs text-cream/70 mt-1 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-500">
                  {f.desc}
                </p>
              </div>

              {/* Shine sweep on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/10 to-transparent" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats row at bottom */}
        <Reveal
          variant="scale"
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl glass-dark p-5 sm:p-8 relative overflow-hidden"
        >
          {/* Animated shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(110deg, transparent 30%, rgba(201,169,97,0.15) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          {[
            { value: "2+ acres", label: "Green Campus" },
            { value: `${SCHOOL.classroomsCount}`, label: "Classrooms" },
            { value: "Swimming Pool", label: "Plus Sports Academy" },
            { value: "Safe Fleet", label: "Transport" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              className="text-center relative"
            >
              <p className="font-serif text-lg sm:text-2xl font-bold text-gradient-gold">{s.value}</p>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-cream/60">{s.label}</p>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
