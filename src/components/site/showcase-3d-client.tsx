'use client';

import dynamic from "next/dynamic";

/**
 * Showcase3DClient — client-side wrapper that lazy-loads the 3D showcase
 * with ssr:false (Three.js requires browser APIs).
 *
 * This wrapper exists because `next/dynamic` with `ssr: false` cannot be
 * called from a Server Component in Next.js 16. By wrapping it in a Client
 * Component, the parent page can stay a Server Component for SEO while the
 * 3D scene loads only on the client.
 */

const Showcase3D = dynamic(
  () => import("@/components/site/showcase-3d").then(m => ({ default: m.Showcase3D })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-cream via-background to-cream">
        <div className="size-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    ),
  }
);

export function Showcase3DClient() {
  return <Showcase3D />;
}
