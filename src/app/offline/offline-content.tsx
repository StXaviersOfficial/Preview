'use client';

import { School } from "lucide-react";

export default function OfflineContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-gradient px-5">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 size-20 rounded-full bg-xavier-gradient flex items-center justify-center shadow-glow-xavier">
          <School className="size-10 text-gold-light" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-xavier-dark mb-3">You're Offline</h1>
        <p className="text-sm text-foreground/70 mb-6">
          It looks like you've lost your internet connection. Some content may not be available.
          Don't worry — once you're back online, the full site will load automatically.
        </p>
        <div className="rounded-xl border border-xavier/10 bg-card p-5 text-left">
          <p className="font-serif font-bold text-xavier-dark text-sm mb-2">Need to reach us urgently?</p>
          <p className="text-xs text-foreground/70 mb-1">📞 +91 98350 61341</p>
          <p className="text-xs text-foreground/70 mb-1">📞 +91 93342 57335</p>
          <p className="text-xs text-foreground/70">📍 Goshala Road, Ramna, Muzaffarpur — 842002 (Bihar)</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-6 py-3 text-sm font-semibold text-cream shadow-glow-xavier"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
