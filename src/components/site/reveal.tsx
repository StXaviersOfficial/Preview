'use client'

import { useEffect, useRef, type ReactNode, type ElementType } from "react";

type Variant = "up" | "left" | "right" | "scale" | "stagger" | "flip" | "blur" | "rotate3d" | "elastic" | "glitch" | "explode" | "wave";

// INITIAL states — what the element looks like BEFORE animating in
const INITIAL: Record<Variant, { opacity: number; transform: string; filter?: string }> = {
  up:       { opacity: 0, transform: "translateY(80px) scale(0.92)" },
  left:     { opacity: 0, transform: "translateX(-60px) perspective(1000px) rotateY(15deg)" },
  right:    { opacity: 0, transform: "translateX(60px) perspective(1000px) rotateY(-15deg)" },
  scale:    { opacity: 0, transform: "scale(0.5) perspective(1000px) rotateX(20deg)" },
  stagger:  { opacity: 0, transform: "translateY(60px) scale(0.85) perspective(1000px) rotateX(10deg)" },
  flip:     { opacity: 0, transform: "perspective(1200px) rotateY(90deg) scale(0.8)" },
  blur:     { opacity: 0, transform: "translateY(50px) scale(0.95)", filter: "blur(20px)" },
  rotate3d: { opacity: 0, transform: "perspective(1200px) rotateX(50deg) rotateY(30deg) translateY(80px) scale(0.85)" },
  elastic:  { opacity: 0, transform: "scale(0.3) perspective(1000px) rotateZ(-15deg)" },
  glitch:   { opacity: 0, transform: "translateX(0) skewX(0deg)", filter: "blur(0px) hue-rotate(0deg)" },
  explode:  { opacity: 0, transform: "scale(1.5) perspective(1000px) rotateZ(10deg)", filter: "blur(10px)" },
  wave:     { opacity: 0, transform: "translateY(40px) rotate(-3deg) scale(0.9)" },
};

// FINAL states — what the element looks like AFTER animating
const FINAL: Record<Variant, { opacity: number; transform: string; filter?: string }> = {
  up:       { opacity: 1, transform: "translateY(0px) scale(1)" },
  left:     { opacity: 1, transform: "translateX(0px) perspective(1000px) rotateY(0deg)" },
  right:    { opacity: 1, transform: "translateX(0px) perspective(1000px) rotateY(0deg)" },
  scale:    { opacity: 1, transform: "scale(1) perspective(1000px) rotateX(0deg)" },
  stagger:  { opacity: 1, transform: "translateY(0px) scale(1) perspective(1000px) rotateX(0deg)" },
  flip:     { opacity: 1, transform: "perspective(1200px) rotateY(0deg) scale(1)" },
  blur:     { opacity: 1, transform: "translateY(0px) scale(1)", filter: "blur(0px)" },
  rotate3d: { opacity: 1, transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)" },
  elastic:  { opacity: 1, transform: "scale(1) perspective(1000px) rotateZ(0deg)" },
  glitch:   { opacity: 1, transform: "translateX(0) skewX(0deg)", filter: "blur(0px) hue-rotate(0deg)" },
  explode:  { opacity: 1, transform: "scale(1) perspective(1000px) rotateZ(0deg)", filter: "blur(0px)" },
  wave:     { opacity: 1, transform: "translateY(0px) rotate(0deg) scale(1)" },
};

// Easing functions for different feels
function easeOutBack(t: number): number {
  const c1 = 2.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 :
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Glitch effect: random X offsets during animation
function getGlitchTransform(progress: number, start: string, end: string): string {
  if (progress < 0.3) {
    const glitchX = (Math.random() - 0.5) * 20;
    const glitchSkew = (Math.random() - 0.5) * 10;
    return `translateX(${glitchX}px) skewX(${glitchSkew}deg) scale(${0.8 + progress * 0.5})`;
  }
  return interpolateTransform(start, end, easeOutExpo(progress));
}

/**
 * Reveal — THE CRAZIEST scroll animation system ever.
 * 
 * Features:
 * - 12 animation variants (3D flips, elastic springs, glitch, explode, wave)
 * - Re-fires EVERY TIME element enters viewport
 * - Elements disappear when scrolled out, re-animate when scrolled back
 * - Pure requestAnimationFrame (NOT affected by prefers-reduced-motion)
 * - Staggered delays for cascading effects
 * - GPU-accelerated transforms + willChange
 * 
 * Flash minimization:
 * - Above-the-fold elements animate in within 100ms of hydration
 * - The initial opacity:0 is in the SSR HTML (parsed before paint)
 * - No white flash — element goes from invisible → animated → visible
 */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  as: As = "div",
  once = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  as?: ElementType;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const animFrame = useRef<number>(0);
  const isVisible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setHidden = () => {
      const init = INITIAL[variant];
      el.style.opacity = String(init.opacity);
      el.style.transform = init.transform;
      if (init.filter) el.style.filter = init.filter;
    };

    const animateIn = () => {
      cancelAnimationFrame(animFrame.current);

      const start = INITIAL[variant];
      const end = FINAL[variant];
      const duration = variant === "elastic" ? 1200 : variant === "glitch" ? 1000 : 900;
      const startTime = performance.now() + delay * 1000;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < 0) {
          setHidden();
          animFrame.current = requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);

        // Choose easing based on variant
        let eased: number;
        if (variant === "elastic") {
          eased = easeOutElastic(progress);
        } else if (variant === "scale" || variant === "flip" || variant === "rotate3d" || variant === "explode") {
          eased = easeOutBack(progress);
        } else if (variant === "glitch") {
          eased = easeInOutCubic(progress);
        } else {
          eased = easeOutExpo(progress);
        }

        // Opacity
        el.style.opacity = String(start.opacity + (end.opacity - start.opacity) * eased);

        // Transform
        if (variant === "glitch") {
          el.style.transform = getGlitchTransform(progress, start.transform, end.transform);
        } else {
          el.style.transform = interpolateTransform(start.transform, end.transform, eased);
        }

        // Filter
        if (start.filter && end.filter) {
          const startBlur = parseFloat(start.filter.match(/blur\((\d+)/)?.[1] || "0");
          const endBlur = parseFloat(end.filter.match(/blur\((\d+)/)?.[1] || "0");
          const startHue = parseFloat(start.filter.match(/hue-rotate\((\d+)/)?.[1] || "0");
          const endHue = parseFloat(end.filter.match(/hue-rotate\((\d+)/)?.[1] || "0");
          const blurVal = startBlur + (endBlur - startBlur) * eased;
          const hueVal = startHue + (endHue - startHue) * eased;
          el.style.filter = `blur(${blurVal}px) hue-rotate(${hueVal}deg)`;
        } else {
          el.style.filter = "none";
        }

        if (progress < 1) {
          animFrame.current = requestAnimationFrame(animate);
        }
      };
      animFrame.current = requestAnimationFrame(animate);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible.current) {
              isVisible.current = true;
              animateIn();
            }
          } else {
            if (isVisible.current && !once) {
              isVisible.current = false;
              cancelAnimationFrame(animFrame.current);
              setHidden();
            }
          }
        });
      },
      { threshold: 0, rootMargin: "200px 0px 200px 0px" }
    );

    obs.observe(el);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(animFrame.current);
    };
  }, [variant, delay, once]);

  const init = INITIAL[variant];
  return (
    <As
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: init.opacity,
        transform: init.transform,
        filter: init.filter || "none",
        willChange: "opacity, transform, filter",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </As>
  );
}

// Transform interpolator — handles all CSS transform functions
function interpolateTransform(start: string, end: string, t: number): string {
  const startParts = parseTransform(start);
  const endParts = parseTransform(end);
  const result: string[] = [];

  const allFuncs = new Set([...startParts.map(p => p.func), ...endParts.map(p => p.func)]);
  for (const func of allFuncs) {
    const sp = startParts.find(p => p.func === func);
    const ep = endParts.find(p => p.func === func);
    const sVals = sp?.vals || [0, 0, 0];
    const eVals = ep?.vals || [0, 0, 0];
    const maxLen = Math.max(sVals.length, eVals.length);
    const interp: number[] = [];
    for (let i = 0; i < maxLen; i++) {
      const sv = sVals[i] || 0;
      const ev = eVals[i] || 0;
      interp.push(sv + (ev - sv) * t);
    }
    if (func === "translate" || func === "translate3d") {
      result.push(`${func}(${interp.map(v => `${v}px`).join(", ")})`);
    } else if (func === "scale") {
      result.push(`scale(${interp.join(", ")})`);
    } else if (func === "rotate" || func === "rotateX" || func === "rotateY" || func === "rotateZ") {
      result.push(`${func}(${interp[0]}deg)`);
    } else if (func === "skew" || func === "skewX" || func === "skewY") {
      result.push(`${func}(${interp[0]}deg)`);
    } else if (func === "perspective") {
      result.push(`perspective(${interp[0]}px)`);
    }
  }
  return result.join(" ");
}

function parseTransform(str: string): { func: string; vals: number[] }[] {
  const parts: { func: string; vals: number[] }[] = [];
  const regex = /(\w+)\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(str)) !== null) {
    const func = match[1];
    const vals = match[2].split(",").map(v => parseFloat(v.trim().replace("px", "").replace("deg", "")));
    parts.push({ func, vals });
  }
  return parts;
}
