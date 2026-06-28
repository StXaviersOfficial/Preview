'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from "lucide-react";
import { IMAGES } from "@/lib/site/data";
import { Reveal } from "@/components/site/reveal";

type GalleryItem = { src: string; title: string; category: string };

const GALLERY: GalleryItem[] = [
  { src: IMAGES.galleryGroupPhoto, title: "Annual Day Group Photo", category: "Events" },
  { src: IMAGES.galleryDance, title: "Dance Performance", category: "Cultural" },
  { src: IMAGES.galleryChristmas, title: "Christmas Carnival", category: "Events" },
  { src: IMAGES.galleryIndoor, title: "Indoor Games Session", category: "Sports" },
  { src: IMAGES.galleryStudents, title: "Campus Life", category: "Campus" },
  { src: IMAGES.gallery1, title: "School Gallery — 01", category: "Campus" },
  { src: IMAGES.gallery2, title: "School Gallery — 02", category: "Academics" },
  { src: IMAGES.gallery4, title: "Activities & Sports", category: "Sports" },
  { src: IMAGES.gallery6, title: "School Gallery — 03", category: "Campus" },
];

const CATEGORIES = ["All", "Campus", "Academics", "Events", "Sports", "Cultural"] as const;

export function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? GALLERY : GALLERY.filter((g) => g.category === filter);

  // Reset lightbox when filter changes
  useEffect(() => {
    setLightbox(null);
  }, [filter]);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => setLightbox((i) => (i === null ? i : (i + 1) % filtered.length)), [filtered.length]);
  const prev = useCallback(() => setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)), [filtered.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close, next, prev]);

  return (
    <section id="gallery" className="relative overflow-hidden py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-5 sm:px-6">
        {/* Header + filters */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8 sm:mb-12">
          <Reveal variant="up" className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4"
            >
              <Camera className="size-3.5 text-gold" />
              MOMENTS • CAMPUS LIFE IN PICTURES
            </div>
            <h2
              className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance"
            >
              A peek into <span className="text-gradient-xavier">Xavier&apos;s life</span>.
            </h2>
          </Reveal>

          <Reveal variant="scale" className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`relative rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-medium transition-all ${
                  filter === cat
                    ? "text-cream bg-xavier-gradient shadow-glow-xavier"
                    : "text-foreground/70 hover:text-xavier-dark bg-card border border-xavier/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </Reveal>
        </div>

        {/* Grid with 3D hover + AnimatePresence for filter changes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filtered.map((item, i) => (
            <Reveal
              key={item.title}
              variant="elastic"
              delay={i * 0.05}
              as="button"
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square text-left ${
                i % 7 === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <img
                src={item.src}
                alt={`${item.title} — St. Xavier's Jr./Sr. School, Muzaffarpur`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-xavier-dark/85 via-xavier-dark/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-light/80 mb-0.5">{item.category}</p>
                <p className="font-serif text-xs sm:text-sm font-semibold text-cream leading-tight">{item.title}</p>
              </div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 size-7 sm:size-8 rounded-full glass-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="size-3.5 sm:size-4 text-gold-light" />
              </div>

              {/* Shine sweep on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/15 to-transparent" />
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          All photographs are from the school&apos;s official media gallery.
        </p>
      </div>

      {/* Lightbox with cinematic transitions */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={close}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 size-10 sm:size-11 rounded-full glass flex items-center justify-center text-cream hover:bg-cream/15 transition-colors z-10"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 sm:left-8 size-11 sm:size-12 rounded-full glass flex items-center justify-center text-cream hover:bg-cream/15 transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 sm:right-8 size-11 sm:size-12 rounded-full glass flex items-center justify-center text-cream hover:bg-cream/15 transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="size-6" />
            </button>
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full max-h-[85vh] flex flex-col"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="w-full max-h-[75vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              />
              <figcaption className="mt-3 sm:mt-4 text-center">
                <p className="text-[10px] uppercase tracking-widest text-gold-light/80">{filtered[lightbox].category}</p>
                <p className="font-serif text-base sm:text-lg font-semibold text-cream mt-1">{filtered[lightbox].title}</p>
                <p className="text-xs text-cream/50 mt-1">St. Xavier&apos;s Jr./Sr. School, Muzaffarpur</p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
