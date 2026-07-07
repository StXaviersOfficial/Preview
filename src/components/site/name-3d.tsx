'use client';

/**
 * Name3D — animated school name for the hero.
 *
 * Pure CSS animated gold text with:
 * - Continuous floating animation (GPU-accelerated transform)
 * - Animated gradient shimmer (background-position shift)
 * - Glow pulse effect (text-shadow animation)
 * - All animations respect prefers-reduced-motion
 *
 * Renders "St. Xavier's" as the main name. "Jr./Sr. School" is rendered
 * separately in the hero but on the same visual line.
 */

import { useEffect, useState } from 'react';

export function Name3D({ className = '' }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <span
      className={`inline-block font-serif font-bold tracking-tight ${className}`}
      style={{
        background: 'linear-gradient(110deg, #f4d98a 0%, #c9a961 25%, #fff4d4 50%, #c9a961 75%, #f4d98a 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 4px 20px rgba(201,169,97,0.5))',
        animation: reducedMotion
          ? 'none'
          : 'name-gradient-shift 4s ease-in-out infinite, name-glow 2.5s ease-in-out infinite alternate, hero-float 6s ease-in-out infinite',
        fontSize: 'clamp(2.5rem, 8vw, 6rem)',
        lineHeight: 1,
      }}
    >
      St. Xavier&apos;s
    </span>
  );
}
