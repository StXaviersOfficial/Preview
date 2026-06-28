'use client'

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useVelocity, useAnimationFrame } from "framer-motion";

/* ============================================================
   Custom cursor: dot + ring follower (desktop only)
   ============================================================ */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover], input, textarea, select")) {
        ringRef.current?.classList.add("hovering");
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover], input, textarea, select")) {
        ringRef.current?.classList.remove("hovering");
      }
    };

    const tick = () => {
      // Easing follow for ring
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="sx-cursor">
        <div className="sx-cursor-dot" />
      </div>
      <div ref={ringRef} className="sx-cursor-ring" />
    </>
  );
}

/* ============================================================
   Page load curtain — sweeps up to reveal the site.
   Only plays ONCE per browser session (sessionStorage), so it
   doesn't replay on every route change or refresh.
   ============================================================ */
export function PageCurtain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("sx-curtain-played");
      if (seen) return; // already played this session
      sessionStorage.setItem("sx-curtain-played", "1");
      // Defer the show to next tick so the curtain renders with its initial state
      // and the exit animation can play cleanly.
      requestAnimationFrame(() => {
        setShow(true);
        const t = setTimeout(() => setShow(false), 1700);
        return () => clearTimeout(t);
      });
    } catch {
      // sessionStorage may be unavailable (private mode) — skip curtain
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="sx-curtain"
          initial={{ opacity: 1 }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="sx-curtain-logo">
            St. <span style={{ color: "oklch(0.88 0.10 80)" }}>Xavier&apos;s</span>
          </div>
          <div className="sx-curtain-bar" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   Scroll progress ring — top-right SVG that fills with scroll
   ============================================================ */
export function ScrollProgressRing() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <div className="sx-scroll-ring">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r="24"
          fill="none"
          stroke="rgba(139,26,43,0.12)"
          strokeWidth="3"
        />
        <motion.circle
          cx="28" cy="28" r="24"
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength, rotate: -90, transformOrigin: "center" }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.42 0.18 18)" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 75)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ============================================================
   Kinetic text reveal — splits text into words, fades up
   ============================================================ */
export function KineticText({
  text,
  className = "",
  as: As = "div",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setRevealed(true), delay);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  const words = text.split(" ");

  return (
    <As ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <span
            className={`sx-word ${revealed ? "revealed" : ""}`}
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </As>
  );
}

/* ============================================================
   3D Tilt wrapper — tilts child based on mouse position
   ============================================================ */
export function TiltCard({
  children,
  className = "",
  intensity = 12,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 200, damping: 15 });
  const sRy = useSpring(ry, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * intensity * 2);
    rx.set(-py * intensity * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sRx, rotateY: sRy, transformStyle: "preserve-3d" }}
      className={`sx-tilt ${className}`}
    >
      <div style={{ transform: "translateZ(40px)" }}>{children}</div>
    </motion.div>
  );
}

/* ============================================================
   Spotlight follow — radial gradient follows mouse on hover
   ============================================================ */
export function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`sx-spotlight ${className}`}>
      {children}
    </div>
  );
}

/* ============================================================
   Magnetic button — pulls toward cursor on hover.
   Pure JS (no Framer Motion) = no hydration flash.
   ============================================================ */
export function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`sx-magnetic ${className}`}
      style={{ transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)" }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   Velocity marquee — skews based on scroll velocity
   ============================================================ */
export function VelocityMarquee({ children, baseVelocity = 2 }: { children: React.ReactNode; baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="sx-marquee-wrap">
      <motion.div className="sx-marquee-track" style={{ x }}>
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  const wrapped = (((v - min) % range) + range) % range + min;
  return wrapped;
}

/* ============================================================
   Parallax layer — translates based on scroll position
   ============================================================ */
export function Parallax({
  children,
  offset = 100,
  className = "",
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={`sx-parallax ${className}`}>
      {children}
    </motion.div>
  );
}

/* ============================================================
   Staggered grid reveal — children ripple in with stagger
   ============================================================ */
export function StaggerReveal({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 200, damping: 20 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Scroll-driven 3D rotateY — element rotates as it enters view
   ============================================================ */
export function ScrollRotate3D({
  children,
  className = "",
  rotate = 30,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [rotate, 0, -rotate]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateY, opacity, scale, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Drawing SVG path — strokes draw on scroll into view
   ============================================================ */
export function DrawPath({
  d,
  className = "",
  duration = 2,
}: {
  d: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setDrawn(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <svg className={className} viewBox="0 0 1000 100" preserveAspectRatio="none">
      <path
        ref={ref}
        d={d}
        fill="none"
        stroke="url(#draw-gradient)"
        strokeWidth="2"
        className="sx-draw-path"
        style={{
          strokeDashoffset: drawn ? 0 : 1000,
          transitionDuration: `${duration}s`,
        }}
      />
      <defs>
        <linearGradient id="draw-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.42 0.18 18)" />
          <stop offset="100%" stopColor="oklch(0.78 0.14 75)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ============================================================
   Animated counter with morph — counts up on view
   ============================================================ */
export function AnimatedCounter({
  value,
  suffix = "",
  className = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(Math.round(eased * value));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration, started]);

  return (
    <span ref={ref} className={`sx-counter ${className}`}>
      {display.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

/* ============================================================
   Particle field — canvas-based floating particles
   ============================================================ */
export function ParticleField({ className = "", density = 40 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const particles = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${p.alpha})`;
        ctx.fill();
      });
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,169,97,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} />;
}

/* ============================================================
   Glow halo wrapper
   ============================================================ */
export function Halo({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`sx-halo ${className}`}>{children}</div>;
}

/* ============================================================
   Border shimmer wrapper
   ============================================================ */
export function BorderShimmer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`sx-border-shimmer ${className}`}>{children}</div>;
}

/* ============================================================
   Text Scramble — letters shuffle then resolve into final text
   ============================================================ */
export function TextScramble({
  text,
  className = "",
  trigger = "view",
  speed = 30,
}: {
  text: string;
  className?: string;
  trigger?: "view" | "mount";
  speed?: number;
}) {
  const [display, setDisplay] = useState(trigger === "mount" ? scramble(text, 0.3) : text);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*!?";

  useEffect(() => {
    if (trigger === "mount") {
      runScramble();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            runScramble();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [trigger, started]);

  function runScramble() {
    setStarted(true);
    let frame = 0;
    const totalFrames = text.length * 3;
    const interval = setInterval(() => {
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * text.length);
      setDisplay(
        text
          .split("")
          .map((c, i) => {
            if (i < resolved) return text[i];
            if (c === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      frame++;
      if (frame > totalFrames) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, speed);
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function scramble(text: string, ratio: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*!?";
  const resolveCount = Math.floor(text.length * (1 - ratio));
  return text
    .split("")
    .map((c, i) => {
      if (i < resolveCount) return text[i];
      if (c === " ") return " ";
      return chars[Math.floor(Math.random() * chars.length)];
    })
    .join("");
}

/* ============================================================
   Cursor Trail — canvas-based liquid trail behind cursor
   ============================================================ */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const points: { x: number; y: number; life: number }[] = [];

    const onMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (points.length > 25) points.shift();
    };

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.life -= 0.04;
        if (p.life <= 0) continue;
        const next = points[i + 1];
        if (next) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(201,169,97,${p.life * 0.6})`;
          ctx.lineWidth = p.life * 3;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        // Glowing dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${p.life * 0.4})`;
        ctx.fill();
      }
      // Remove dead points
      while (points.length > 0 && points[0].life <= 0) points.shift();
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

/* ============================================================
   Confetti burst — call via ref or trigger on click
   ============================================================ */
export function ConfettiBurst({ x, y, active }: { x: number; y: number; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;
    const rect = canvas.getBoundingClientRect();
    canvas.style.left = `${x - 200}px`;
    canvas.style.top = `${y - 200}px`;

    const colors = ["oklch(0.78 0.14 75)", "oklch(0.42 0.18 18)", "oklch(0.88 0.10 80)", "oklch(0.55 0.18 20)"];
    const particles = Array.from({ length: 60 }, () => ({
      x: 200,
      y: 200,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
      r: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      life: 1,
    }));

    let raf = 0;
    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, 400, 400);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // gravity
        p.vx *= 0.99;
        p.rotation += p.vr;
        p.life -= 0.012;
        if (p.life > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
          ctx.restore();
        }
      });
      frame++;
      if (frame < 120) {
        raf = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, 400, 400);
      }
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [active, x, y]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed pointer-events-none z-[9996]"
      style={{ width: 400, height: 400 }}
    />
  );
}

/* ============================================================
   Liquid blob divider — animated SVG between sections
   ============================================================ */
export function LiquidDivider({
  color = "oklch(0.97 0.012 75)",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={`sx-wave-divider ${className}`} style={{ transform: flip ? "rotate(180deg)" : "none" }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={color}
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z;
              M0,40 C240,10 480,50 720,20 C960,50 1200,10 1440,40 L1440,60 L0,60 Z;
              M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}

/* ============================================================
   Glitch text — RGB split with clip-path animation
   ============================================================ */
export function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`sx-glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}

/* ============================================================
   Typewriter text — types out character by character
   ============================================================ */
export function TypewriterText({
  text,
  className = "",
  speed = 50,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [display, setDisplay] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
            setTimeout(() => {
              let i = 0;
              const interval = setInterval(() => {
                if (i <= text.length) {
                  setDisplay(text.slice(0, i));
                  i++;
                } else {
                  clearInterval(interval);
                }
              }, speed);
            }, delay);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [text, speed, delay, started]);

  return (
    <span ref={ref} className={className}>
      {display}
      <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-pulse align-middle" />
    </span>
  );
}

/* ============================================================
   3D Flip Card — flips on hover to reveal back face
   ============================================================ */
export function FlipCard({
  front,
  back,
  className = "",
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`group relative h-full [perspective:1200px] cursor-pointer ${className}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   Marquee row (simple CSS-driven, with hover pause)
   ============================================================ */
export function MarqueeRow({
  children,
  className = "",
  duration = 30,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className={`sx-marquee-wrap ${className}`}>
      <div
        className="sx-marquee-track animate-marquee"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Floating action button (FAB) with bounce
   ============================================================ */
export function FloatingButton({
  children,
  onClick,
  className = "",
  position = "bottom-right",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const posClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-24 right-6",
    "top-left": "top-24 left-6",
  };
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed ${posClasses[position]} z-40 ${className}`}
    >
      {children}
    </motion.button>
  );
}
