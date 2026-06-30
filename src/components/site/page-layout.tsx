import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { BackToTop } from "@/components/site/back-to-top";
import { StickyApplyBar } from "@/components/site/sticky-apply-bar";
import { HindiOverlay } from "@/components/site/hindi-overlay";
import { Reveal } from "@/components/site/reveal";
import type { ReactNode } from "react";

export function PageLayout({
  children,
  badge,
  title,
  subtitle,
}: {
  children: ReactNode;
  badge?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <HindiOverlay>
      <div className="relative min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          {/* Hero header */}
          <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 bg-cream-gradient overflow-hidden">
            <div className="absolute top-10 right-10 size-72 rounded-full bg-gold/8 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 size-72 rounded-full bg-xavier/8 blur-3xl pointer-events-none" />
            <div className="container mx-auto max-w-4xl px-5 sm:px-6 relative">
              <Reveal variant="up">
                {badge && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4">
                    <span className="size-1.5 rounded-full bg-gold animate-glow-pulse" />
                    {badge}
                  </div>
                )}
                <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ink leading-tight text-balance">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-4 text-sm sm:text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
                )}
              </Reveal>
            </div>
          </section>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <StickyApplyBar />
      </div>
    </HindiOverlay>
  );
}
