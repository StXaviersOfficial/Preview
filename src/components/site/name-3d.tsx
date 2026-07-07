'use client';

/**
 * Name3D — animated school name for the hero.
 *
 * Pure CSS animated gold text with:
 * - Continuous floating animation (GPU-accelerated transform)
 * - Animated gradient shimmer (background-position shift)
 * - Glow pulse effect (text-shadow animation)
 * - All animations respect prefers-reduced-motion
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
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        animation: reducedMotion ? 'none' : 'hero-float 6s ease-in-out infinite',
      }}
    >
      <div
        className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-center"
        style={{
          background: 'linear-gradient(110deg, #f4d98a 0%, #c9a961 25%, #fff4d4 50%, #c9a961 75%, #f4d98a 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 20px rgba(201,169,97,0.5))',
          animation: reducedMotion
            ? 'none'
            : 'name-gradient-shift 4s ease-in-out infinite, name-glow 2.5s ease-in-out infinite alternate',
        }}
      >
        St. Xavier&apos;s
      </div>
    </div>
  );
}
