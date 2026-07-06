'use client';

import { School, Phone, MapPin, RefreshCw, WifiOff } from "lucide-react";
import { SCHOOL } from "@/lib/site/data";

export default function OfflineContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-gradient px-5">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 size-20 rounded-full bg-xavier-gradient flex items-center justify-center shadow-glow-xavier relative">
          <School className="size-10 text-gold-light" />
          <div className="absolute -top-1 -right-1 size-7 rounded-full bg-cream flex items-center justify-center shadow-lg">
            <WifiOff className="size-3.5 text-xavier-dark" />
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold text-xavier-dark mb-3">You&apos;re Offline</h1>
        <p className="text-sm text-foreground/70 mb-6">
          It looks like you&apos;ve lost your internet connection. Some content may not be available.
          Don&apos;t worry — once you&apos;re back online, the full site will load automatically.
        </p>
        <div className="rounded-xl border border-xavier/10 bg-card p-5 text-left">
          <p className="font-serif font-bold text-xavier-dark text-sm mb-3">Need to reach us urgently?</p>
          <div className="space-y-2">
            <a
              href={`tel:+91${SCHOOL.phones[0]}`}
              className="flex items-center gap-2 text-xs text-foreground/80 hover:text-xavier-dark transition-colors"
            >
              <Phone className="size-3.5 text-gold" />
              +91 {SCHOOL.phones[0]}
            </a>
            <a
              href={`tel:+91${SCHOOL.phones[1]}`}
              className="flex items-center gap-2 text-xs text-foreground/80 hover:text-xavier-dark transition-colors"
            >
              <Phone className="size-3.5 text-gold" />
              +91 {SCHOOL.phones[1]}
            </a>
            <a
              href={`tel:+91${SCHOOL.phones[2]}`}
              className="flex items-center gap-2 text-xs text-foreground/80 hover:text-xavier-dark transition-colors"
            >
              <Phone className="size-3.5 text-gold" />
              +91 {SCHOOL.phones[2]}
            </a>
            <p className="flex items-start gap-2 text-xs text-foreground/70 pt-2 border-t border-xavier/10">
              <MapPin className="size-3.5 text-gold shrink-0 mt-0.5" />
              {SCHOOL.addressLine}
            </p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-6 py-3 text-sm font-semibold text-cream-fg shadow-glow-xavier hover:scale-105 transition-transform"
        >
          <RefreshCw className="size-4" />
          Try Again
        </button>
        <p className="mt-4 text-[10px] text-muted-foreground">
          St. Xavier&apos;s Jr./Sr. School • Muzaffarpur
        </p>
      </div>
    </div>
  );
}
