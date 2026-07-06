'use client';

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-gradient px-5">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 size-20 rounded-full bg-xavier-gradient flex items-center justify-center shadow-glow-xavier">
          <AlertTriangle className="size-10 text-gold-light" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-xavier-dark mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-foreground/70 mb-8">
          An unexpected error occurred. Our team has been notified.
          You can try again or return to the homepage.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-6 py-3 text-sm font-semibold text-cream-fg shadow-glow-xavier hover:scale-105 transition-transform"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-xavier/20 px-6 py-3 text-sm font-semibold text-xavier-dark hover:bg-xavier/5 transition-colors"
          >
            <Home className="size-4" />
            Back to Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[10px] text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
