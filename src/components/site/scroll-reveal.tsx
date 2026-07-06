'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ScrollReveal — GSAP ScrollTrigger-powered entrance animation.
 * Fires at 15-20% visibility (earlier than the old IntersectionObserver).
 * Uses GSAP for buttery smooth easing + GPU-accelerated transforms.
 *
 * Variants:
 * - fade-up: opacity 0→1, y 40px→0 (default, 800ms)
 * - fade-scale: opacity 0→1, scale 0.95→1 (600ms)
 * - fade-left/right: x offset → 0
 * - stagger: children stagger in sequence
 */
type Variant = 'fade-up' | 'fade-scale' | 'fade-left' | 'fade-right' | 'stagger';

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
  stagger = 0.08,
  as: Tag = 'div',
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  stagger?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const config: Record<Variant, gsap.TweenVars> = {
      'fade-up': { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' },
      'fade-scale': { opacity: 0, scale: 0.95, duration: 0.6, ease: 'power2.out' },
      'fade-left': { opacity: 0, x: -50, duration: 0.8, ease: 'power3.out' },
      'fade-right': { opacity: 0, x: 50, duration: 0.8, ease: 'power3.out' },
      'stagger': { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' },
    };

    // Set initial state
    const initial = { ...config[variant] };
    delete initial.duration;
    delete initial.ease;
    gsap.set(el, initial);

    const tween = gsap.to(el, {
      ...config[variant],
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%', // Fire when element top reaches 85% of viewport (earlier)
        toggleActions: 'play none none reverse',
      },
    });

    // For stagger variant, animate children
    if (variant === 'stagger' && el.children.length > 1) {
      gsap.fromTo(
        el.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger,
          ease: 'power2.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, [variant, delay, stagger]);

  const Component = Tag as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    children?: React.ReactNode;
  }>;
  return (
    <Component ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </Component>
  );
}
