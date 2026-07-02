import { Navbar } from "@/components/site/navbar";
import { NoticeTicker } from "@/components/site/notice-ticker";
import { Hero } from "@/components/site/hero";
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
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { StickyApplyBar } from "@/components/site/sticky-apply-bar";
import { HindiOverlay } from "@/components/site/hindi-overlay";
import { SectionDivider3D } from "@/components/three/section-divider-3d";

export default function Home() {
  return (
    <HindiOverlay>
      <div className="relative min-h-screen flex flex-col bg-background">
        {/* Skip to content link for screen readers */}
        <a href="#home" className="sr-only sr-only-focusable">
          Skip to content
        </a>
        <NoticeTicker />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Stats />
          <Marquee />
          <About />
          <SectionDivider3D height={100} />
          <Features />
          <Academics />
          <SectionDivider3D height={100} />
          <Admissions />
          <Fees />
          <FAQ />
          <SectionDivider3D height={100} />
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
