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
import { HindiOverlay } from "@/components/site/hindi-overlay";

export default function Home() {
  return (
    <HindiOverlay>
      <div className="relative min-h-screen flex flex-col bg-background">
        <NoticeTicker />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Stats />
          <Marquee />
          <About />
          <Features />
          <Academics />
          <Admissions />
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
      </div>
    </HindiOverlay>
  );
}
