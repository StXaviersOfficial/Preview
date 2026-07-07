'use client';

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Reveal } from "@/components/site/reveal";

/**
 * Showcase3D — scroll-driven 3D assembly scene.
 *
 * A graduation cap + open book + diploma scroll that ASSEMBLES as the user
 * scrolls down through the section, and disassembles as they scroll back up.
 * Fully interactive (drag to rotate), with auto-rotation when idle.
 *
 * Built procedurally with React Three Fiber primitives — no external GLB
 * asset needed. This keeps the bundle small and avoids licensing concerns.
 *
 * The scene is gated behind a lazy chunk (loaded via next/dynamic with
 * ssr:false) so Three.js never blocks initial page load.
 *
 * Accessibility: respects prefers-reduced-motion (renders a static frame),
 * and provides a text alternative for screen readers.
 */

// ─────────────────────────────────────────────────────────────────
// GRADUATION CAP (mortarboard)
// ─────────────────────────────────────────────────────────────────
function GraduationCap({ assemblyProgress }: { assemblyProgress: number }) {
  const group = useRef<THREE.Group>(null);

  // The cap "drops in" from above as assembly progresses (0 → 1)
  useFrame(() => {
    if (!group.current) return;
    // Y position: starts at +5, drops to 0
    group.current.position.y = 5 * (1 - assemblyProgress);
    // Rotate slightly during drop
    group.current.rotation.y = (1 - assemblyProgress) * Math.PI * 0.5;
    // Opacity via scale (start small, grow to full)
    const scale = 0.3 + 0.7 * assemblyProgress;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Mortarboard top — flat square */}
      <mesh rotation={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.12, 2.4]} />
        <meshStandardMaterial color="#4a121d" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Cap base (the head-fitting part) */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.8, 0.5, 32]} />
        <meshStandardMaterial color="#3a0e17" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Tassel button on top */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#c9a961" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Tassel cord hanging off the side */}
      <group position={[0.9, 0.05, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2.5]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.2, 8]} />
          <meshStandardMaterial color="#c9a961" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Tassel fringe */}
        <mesh position={[0.5, -0.5, 0]} castShadow>
          <coneGeometry args={[0.08, 0.3, 8]} />
          <meshStandardMaterial color="#c9a961" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
// OPEN BOOK
// ─────────────────────────────────────────────────────────────────
function OpenBook({ assemblyProgress }: { assemblyProgress: number }) {
  const leftPage = useRef<THREE.Group>(null);
  const rightPage = useRef<THREE.Group>(null);

  // Book "opens" as assembly progresses (pages rotate from closed to open)
  useFrame(() => {
    if (!leftPage.current || !rightPage.current) return;
    // Left page rotates from -π/2 (closed) to 0 (open)
    const openAngle = (1 - assemblyProgress) * Math.PI * 0.5;
    leftPage.current.rotation.y = openAngle;
    rightPage.current.rotation.y = -openAngle;
  });

  return (
    <group position={[0, -1.6, 0.2]} scale={1.1}>
      {/* Spine */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.04, 1.4]} />
        <meshStandardMaterial color="#5a1521" roughness={0.6} />
      </mesh>

      {/* Left page group — pivot at spine */}
      <group ref={leftPage} position={[-0.04, 0, 0]}>
        <mesh position={[-0.7, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.03, 1.4]} />
          <meshStandardMaterial color="#f5ebd6" roughness={0.8} />
        </mesh>
        {/* Page lines (text suggestion) */}
        {[0.2, 0.4, 0.6, 0.8].map((y, i) => (
          <mesh key={i} position={[-0.7, 0.02, -0.5 + y * 0.8]}>
            <boxGeometry args={[1.0, 0.001, 0.04]} />
            <meshStandardMaterial color="#8a7a60" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Right page group — pivot at spine */}
      <group ref={rightPage} position={[0.04, 0, 0]}>
        <mesh position={[0.7, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.03, 1.4]} />
          <meshStandardMaterial color="#f5ebd6" roughness={0.8} />
        </mesh>
        {[0.2, 0.4, 0.6, 0.8].map((y, i) => (
          <mesh key={i} position={[0.7, 0.02, -0.5 + y * 0.8]}>
            <boxGeometry args={[1.0, 0.001, 0.04]} />
            <meshStandardMaterial color="#8a7a60" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
// DIPLOMA SCROLL
// ─────────────────────────────────────────────────────────────────
function DiplomaScroll({ assemblyProgress }: { assemblyProgress: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    // Scroll "rolls in" from the right side
    group.current.position.x = 3 * (1 - assemblyProgress);
    group.current.position.y = -0.5 + 0.3 * Math.sin(assemblyProgress * Math.PI);
    group.current.rotation.z = (1 - assemblyProgress) * Math.PI * 0.25;
    const scale = 0.5 + 0.5 * assemblyProgress;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={[3, -0.5, -0.5]}>
      {/* Scroll body — cylinder lying on its side */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 1.4, 24]} />
        <meshStandardMaterial color="#f5ebd6" roughness={0.7} />
      </mesh>
      {/* End caps */}
      <mesh position={[-0.7, 0, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.06, 24]} />
        <meshStandardMaterial color="#c9a961" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.7, 0, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.06, 24]} />
        <meshStandardMaterial color="#c9a961" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Ribbon */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.02]} />
        <meshStandardMaterial color="#7a1c2f" roughness={0.5} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCROLL-DRIVEN SCENE — wires scroll position to assembly progress
// ─────────────────────────────────────────────────────────────────
function ScrollDrivenScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // useScroll requires the Canvas to be inside a scroll container — we use
  // the page's native scroll via a custom approach: track scrollYProgress
  // of the section element.
  const scrollProgress = useRef(0);

  // Track scroll of the section element
  useFrame(() => {
    const section = document.getElementById('showcase-3d');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Progress: 0 when section top hits bottom of viewport, 1 when section bottom hits top
    const total = rect.height + windowHeight;
    const passed = windowHeight - rect.top;
    const progress = Math.max(0, Math.min(1, passed / total));
    scrollProgress.current = progress;

    if (groupRef.current) {
      // Auto-rotate the whole scene slowly
      groupRef.current.rotation.y = progress * Math.PI * 0.8;
    }
  });

  // Assembly happens in the middle of the scroll (0.2 → 0.8)
  const assemblyProgress = Math.max(0, Math.min(1, (scrollProgress.current - 0.2) / 0.6));

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <GraduationCap assemblyProgress={assemblyProgress} />
        <OpenBook assemblyProgress={assemblyProgress} />
        <DiplomaScroll assemblyProgress={assemblyProgress} />
      </Float>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
// STATIC SCENE (prefers-reduced-motion fallback)
// ─────────────────────────────────────────────────────────────────
function StaticScene() {
  return (
    <group>
      <GraduationCap assemblyProgress={1} />
      <OpenBook assemblyProgress={1} />
      <DiplomaScroll assemblyProgress={1} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export function Showcase3D() {
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  return (
    <section
      id="showcase-3d"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-cream via-background to-cream overflow-hidden"
      aria-labelledby="showcase-3d-title"
    >
      {/* Decorative background glows */}
      <div className="absolute top-10 left-10 size-72 rounded-full bg-gold/8 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 size-80 rounded-full bg-xavier/8 blur-2xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-5 sm:px-6 relative">
        {/* Header */}
        <Reveal variant="up" className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-xavier/15 bg-xavier/5 px-4 py-1.5 text-xs font-medium text-xavier-dark mb-4">
            <span className="size-1.5 rounded-full bg-gold animate-glow-pulse" />
            THE XAVIER&apos;S EXPERIENCE • IN 3D
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-tight text-balance">
            Where <span className="text-gradient-xavier">achievements</span> take shape.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Scroll to watch a graduate&apos;s journey assemble — cap, book, and diploma coming together.
            Drag the scene to explore from any angle.
          </p>
        </Reveal>

        {/* 3D Canvas — tall section to allow scroll-driven animation */}
        <Reveal variant="scale" className="rounded-3xl overflow-hidden border border-xavier/10 shadow-elegant bg-gradient-to-b from-xavier-dark/95 to-xavier-darker">
          <div className="relative h-[60vh] sm:h-[70vh]">
            {/* Screen-reader text alternative */}
            <span className="sr-only">
              An interactive 3D scene showing a graduation cap, an open book, and a diploma scroll
              that assemble as you scroll. The scene represents the journey of a St. Xavier&apos;s
              student from learning to graduation.
            </span>

            <Canvas
              shadows
              camera={{ position: [0, 1, 6], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[5, 8, 5]}
                  intensity={1.2}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#c9a961" />
                <pointLight position={[5, 3, 5]} intensity={0.3} color="#7a1c2f" />

                {prefersReducedMotion ? <StaticScene /> : <ScrollDrivenScene />}

                <ContactShadows
                  position={[0, -2.2, 0]}
                  opacity={0.4}
                  scale={10}
                  blur={2.5}
                  far={4}
                />
                <Environment preset="studio" />

                {!prefersReducedMotion && (
                  <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.1}
                    autoRotate
                    autoRotateSpeed={0.3}
                  />
                )}
              </Suspense>
            </Canvas>

            {/* Scroll hint overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex flex-col items-center gap-1 text-cream-fg/60">
                <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to assemble</span>
                <div className="relative size-8 rounded-full border border-cream/30 flex items-start justify-center p-1.5">
                  <span
                    className="size-1.5 rounded-full bg-gold-light"
                    style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
                  />
                </div>
              </div>
            </div>

            {/* Interaction hint */}
            <div className="absolute top-4 right-4 pointer-events-none">
              <span className="text-[10px] uppercase tracking-widest text-cream-fg/40">
                Drag to rotate
              </span>
            </div>
          </div>
        </Reveal>

        {/* Caption */}
        <Reveal variant="up" className="mt-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Every Xavierite&apos;s journey — from the first page of a textbook to the graduation
            stage. <span className="font-semibold text-xavier-dark">48 years</span> of shaping
            curious minds into confident leaders.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
