'use client';

import { useEffect, useState, useRef, type ComponentType, type ReactNode } from "react";

/**
 * LazyChunk — IntersectionObserver-gated lazy mounting for page sections.
 *
 * Architecture ("Minecraft chunk loading"):
 * - Renders a lightweight placeholder skeleton until the section is about to
 *   enter the viewport (200px preload margin).
 * - Mounts the actual component (and its JS chunk + animation logic) only
 *   when about to be visible.
 * - For sections WITHOUT critical state (e.g., static content), optionally
 *   unmounts when far offscreen to free memory.
 * - For sections WITH critical state (FAQ accordion, Fees filter, Timetable,
 *   Gallery lightbox), keeps mounted once loaded.
 *
 * This is the single biggest performance win for the page: instead of loading
 * ALL 17 sections' JS + animation libraries upfront, we load them progressively
 * as the user scrolls.
 */

type LazyChunkProps = {
  /** The component to render when in view. Passed as a factory so it can be
   *  paired with next/dynamic for code-splitting. */
  component: ComponentType<{ children?: ReactNode }>;
  /** Fallback shown while loading / before entering viewport. */
  fallback?: ReactNode;
  /** Minimum height to reserve while loading (prevents layout shift). */
  minHeight?: number | string;
  /** Preload margin — start loading when within this many pixels of viewport. */
  rootMargin?: string;
  /** Once mounted, keep mounted (don't unmount when offscreen). Default true.
   *  Set false for purely-visual sections to free memory when far away. */
  keepMounted?: boolean;
  /** Distance from viewport (in px) at which to unmount when keepMounted=false.
   *  Default 1500. */
  unmountDistance?: number;
  /** id for the section (passed through to wrapper). */
  id?: string;
  /** className for the wrapper. */
  className?: string;
};

export function LazyChunk({
  component: Component,
  fallback,
  minHeight = 200,
  rootMargin = "200px 0px 200px 0px",
  keepMounted = true,
  unmountDistance = 1500,
  id,
  className,
}: LazyChunkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip on reduced-motion? No — we still want lazy loading, just no anims.

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasMounted) {
              setShouldMount(true);
              setHasMounted(true);
            }
          } else {
            // Only unmount if keepMounted is false AND we're far away
            if (!keepMounted && hasMounted) {
              const rect = entry.boundingClientRect;
              const distanceFromViewport = Math.max(
                -rect.top - rect.height,
                rect.bottom - window.innerHeight,
                0
              );
              if (distanceFromViewport > unmountDistance) {
                setShouldMount(false);
              }
            }
          }
        });
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasMounted, keepMounted, unmountDistance, rootMargin]);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{ minHeight: shouldMount ? undefined : minHeight }}
    >
      {shouldMount ? (
        <Component />
      ) : (
        fallback ?? <DefaultFallback minHeight={minHeight} />
      )}
    </div>
  );
}

function DefaultFallback({ minHeight }: { minHeight: number | string }) {
  return (
    <div
      style={{ minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight }}
      className="flex items-center justify-center bg-cream-gradient/30"
      aria-hidden="true"
    >
      <div className="size-8 rounded-full border-2 border-xavier/20 border-t-xavier animate-spin" />
    </div>
  );
}
