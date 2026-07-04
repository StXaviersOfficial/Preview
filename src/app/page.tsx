'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Navbar } from "@/components/site/navbar";
import { NoticeTicker } from "@/components/site/notice-ticker";
import { Hero } from "@/components/site/hero";
import { HindiOverlay } from "@/components/site/hindi-overlay";
import { ErrorBoundary } from "@/components/site/error-boundary";
import { Showcase3DClient } from "@/components/site/showcase-3d-client";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { StickyApplyBar } from "@/components/site/sticky-apply-bar";

// ─────────────────────────────────────────────────────────────────
// CODE-SPLIT CHUNKS — each section is a separate JS chunk via
// next/dynamic. With ssr:true, the section's HTML is server-rendered
// (for SEO) while the client-side JS (animations, interactivity) loads
// as a separate chunk only when needed.
//
// This gives us:
//   1. SEO: all section content is in the initial HTML
//   2. Code-splitting: each section's JS is a separate chunk
//   3. Fast initial paint: HTML is small (no inline JS for sections)
// ─────────────────────────────────────────────────────────────────

const Stats = dynamic(
  () => import("@/components/site/stats").then(m => ({ default: m.Stats })),
  { ssr: true }
);
const Marquee = dynamic(
  () => import("@/components/site/marquee").then(m => ({ default: m.Marquee })),
  { ssr: true }
);
const About = dynamic(
  () => import("@/components/site/about").then(m => ({ default: m.About })),
  { ssr: true }
);
const Features = dynamic(
  () => import("@/components/site/features").then(m => ({ default: m.Features })),
  { ssr: true }
);
const Academics = dynamic(
  () => import("@/components/site/academics").then(m => ({ default: m.Academics })),
  { ssr: true }
);
const Admissions = dynamic(
  () => import("@/components/site/admissions").then(m => ({ default: m.Admissions })),
  { ssr: true }
);
const Fees = dynamic(
  () => import("@/components/site/fees").then(m => ({ default: m.Fees })),
  { ssr: true }
);
const FAQ = dynamic(
  () => import("@/components/site/faq").then(m => ({ default: m.FAQ })),
  { ssr: true }
);
const Facilities = dynamic(
  () => import("@/components/site/facilities").then(m => ({ default: m.Facilities })),
  { ssr: true }
);
const Gallery = dynamic(
  () => import("@/components/site/gallery").then(m => ({ default: m.Gallery })),
  { ssr: true }
);
const Leadership = dynamic(
  () => import("@/components/site/leadership").then(m => ({ default: m.Leadership })),
  { ssr: true }
);
const Testimonials = dynamic(
  () => import("@/components/site/testimonials").then(m => ({ default: m.Testimonials })),
  { ssr: true }
);
const Timetable = dynamic(
  () => import("@/components/site/timetable").then(m => ({ default: m.Timetable })),
  { ssr: true }
);
const Contact = dynamic(
  () => import("@/components/site/contact").then(m => ({ default: m.Contact })),
  { ssr: true }
);
const Footer = dynamic(
  () => import("@/components/site/footer").then(m => ({ default: m.Footer })),
  { ssr: true }
);

// Content-aware skeleton fallback for Suspense.
// Renders a properly-sized placeholder block that matches the height
// of a typical section, preventing layout jump when the JS chunk loads.
function ChunkSkeleton({ minHeight = 400 }: { minHeight?: number }) {
  return (
    <div
      className="relative overflow-hidden bg-cream-gradient/40"
      style={{ minHeight: `${minHeight}px` }}
      aria-hidden="true"
    >
      {/* Shimmer effect — subtle gradient sweep that looks intentional */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(110deg, transparent 30%, rgba(201,169,97,0.06) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer-sweep 2s ease-in-out infinite",
        }}
      />
      {/* Minimal centered indicator — small, not jarring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-5 rounded-full border-2 border-xavier/15 border-t-gold/60 animate-spin" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <HindiOverlay>
      <div className="relative min-h-screen flex flex-col bg-background pb-16 sm:pb-0">
        {/* Skip to content link for screen readers */}
        <a href="#home" className="sr-only sr-only-focusable">
          Skip to content
        </a>
        <NoticeTicker />
        <Navbar />
        <main className="flex-1">
          {/* Hero loads immediately — above the fold */}
          <Hero />

          {/* Each section is SSR'd for SEO and code-split for performance.
              Suspense + ErrorBoundary ensure a section failure doesn't
              crash the page. */}
          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={200} />}>
              <Stats />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={60} />}>
              <Marquee />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={600} />}>
              <About />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={500} />}>
              <Features />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={600} />}>
              <Academics />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={700} />}>
              <Admissions />
            </Suspense>
          </ErrorBoundary>

          {/* 3D Showcase — lazy, client-only, never blocks initial load.
              Uses Showcase3DClient (a client wrapper) because next/dynamic
              with ssr:false can't be called from a Server Component. */}
          <ErrorBoundary
            fallback={
              <div className="py-16 text-center text-muted-foreground">
                <p className="text-sm">3D showcase could not be loaded.</p>
              </div>
            }
          >
            <Showcase3DClient />
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={500} />}>
              <Fees />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={500} />}>
              <FAQ />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={600} />}>
              <Facilities />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={600} />}>
              <Gallery />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={600} />}>
              <Leadership />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={500} />}>
              <Testimonials />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={600} />}>
              <Timetable />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={<ChunkSkeleton minHeight={700} />}>
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </main>

        <ErrorBoundary>
          <Suspense fallback={<ChunkSkeleton minHeight={400} />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>

        <WhatsAppButton />
        <BackToTop />
        <StickyApplyBar />
      </div>
    </HindiOverlay>
  );
}
