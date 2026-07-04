'use client';

import { Navbar } from "@/components/site/navbar";
import { NoticeTicker } from "@/components/site/notice-ticker";
import { Hero } from "@/components/site/hero";
import { HindiOverlay } from "@/components/site/hindi-overlay";
import { ErrorBoundary } from "@/components/site/error-boundary";
import { Showcase3DClient } from "@/components/site/showcase-3d-client";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { StickyApplyBar } from "@/components/site/sticky-apply-bar";
import { Stats } from "@/components/site/stats";
import { Marquee } from "@/components/site/marquee";
import { About } from "@/components/site/about";
import { Features } from "@/components/site/features";
import { Academics } from "@/components/site/academics";
import { Admissions } from "@/components/site/admissions";
import { Fees } from "@/components/site/fees";
import { FAQ } from "@/components/site/faq";
import { Facilities } from "@/components/site/facilities";
import { Gallery } from "@/components/site/gallery";
import { Leadership } from "@/components/site/leadership";
import { Testimonials } from "@/components/site/testimonials";
import { Timetable } from "@/components/site/timetable";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

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

          {/* All sections render statically — no code-splitting, no Suspense,
              no skeleton flash. Each section appears immediately in the
              initial HTML. The Reveal component handles scroll animations. */}
          <Stats />
          <Marquee />
          <About />
          <Features />
          <Academics />
          <Admissions />

          {/* 3D Showcase — wrapped in ErrorBoundary because Three.js can
              fail on unsupported browsers. Client-only (ssr:false) via
              Showcase3DClient wrapper. */}
          <ErrorBoundary
            fallback={
              <div className="py-16 text-center text-muted-foreground">
                <p className="text-sm">3D showcase could not be loaded.</p>
              </div>
            }
          >
            <Showcase3DClient />
          </ErrorBoundary>

          <Fees />
          <FAQ />
          <Facilities />
          <Gallery />
          <Leadership />
          <Testimonials />
          <Timetable />
          <Contact />
        </main>

        <Footer />

        <WhatsAppButton />
        <BackToTop />
        <StickyApplyBar />
      </div>
    </HindiOverlay>
  );
}
