'use client';

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-cream-gradient px-5">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 size-20 rounded-full bg-xavier-gradient flex items-center justify-center shadow-glow-xavier">
            <AlertTriangle className="size-10 text-gold-light" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-xavier-dark mb-3">
            Something went wrong
          </h1>
          <p className="text-sm text-foreground/70 mb-8">
            An unexpected error occurred. Please try again.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-xavier-gradient px-6 py-3 text-sm font-semibold text-cream-fg shadow-glow-xavier"
            >
              <RefreshCw className="size-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-xavier/20 px-6 py-3 text-sm font-semibold text-xavier-dark"
            >
              <Home className="size-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
