'use client';

/**
 * Name3D — animated school name for the hero.
 *
 * Previously this used a full Three.js Canvas with Text3D, Environment,
 * ContactShadows, and Float — all running useFrame 60x/second. This caused
 * significant lag on both desktop and mobile.
 *
 * Now it uses a pure CSS animated gold text effect that looks premium
 * but uses zero JavaScript CPU time. The 3D Canvas has been removed.
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
    <div className={`relative flex items-center justify-center ${className}`} style={{ height: 'auto', minHeight: '80px' }}>
      <div
        className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-center"
        style={{
          color: '#c9a961',
          textShadow: reducedMotion
            ? '0 0 30px rgba(201,169,97,0.5), 0 0 60px rgba(201,169,97,0.3)'
            : '0 0 30px rgba(201,169,97,0.6), 0 0 60px rgba(201,169,97,0.4), 0 0 90px rgba(201,169,97,0.2)',
          animation: reducedMotion ? 'none' : 'name-glow 2.5s ease-in-out infinite alternate',
          background: 'linear-gradient(180deg, #f4d98a 0%, #c9a961 50%, #a8862e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 12px rgba(201,169,97,0.4))',
        }}
      >
        St. Xavier&apos;s
      </div>
    </div>
  );
}
