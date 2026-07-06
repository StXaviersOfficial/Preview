'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Text3D, Center } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Name3D — premium 3D animated treatment of "St. Xavier's" for the hero.
 *
 * Uses drei's <Text3D> with extruded geometry and a helvetiker bold font.
 * Gold metallic material with environment reflections, subtle float +
 * rotation animation, and an intro scale-up animation.
 *
 * Falls back to a CSS 3D text effect while the font/canvas loads.
 */

function TextMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const [introProgress, setIntroProgress] = useState(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Intro scale-up with ease-out-back
    if (introProgress < 1) {
      const elapsed = state.clock.elapsedTime;
      const progress = Math.min(elapsed / 1.2, 1);
      const eased = 1 + 2.5 * Math.pow(progress - 1, 3) + 1.5 * Math.pow(progress - 1, 2);
      meshRef.current.scale.setScalar(Math.max(0.001, eased));
      if (progress >= 1) setIntroProgress(1);
    }

    // Subtle rotation after intro
    if (introProgress >= 1) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <Center>
        <Text3D
          font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
          size={0.7}
          height={0.25}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          castShadow
          receiveShadow
        >
          St. Xavier's
          <meshStandardMaterial
            color="#c9a961"
            metalness={0.95}
            roughness={0.15}
            envMapIntensity={1.5}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function Name3DFallback() {
  return (
    <div
      className="font-serif text-5xl sm:text-7xl font-bold tracking-tight"
      style={{
        color: '#c9a961',
        textShadow: '0 0 30px rgba(201,169,97,0.5), 0 0 60px rgba(201,169,97,0.3)',
        animation: 'name-glow 2s ease-in-out infinite alternate',
      }}
    >
      St. Xavier's
    </div>
  );
}

export function Name3D({ className = '' }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // If reduced motion, render a static CSS text instead of 3D canvas
  if (reducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ height: '100px' }}>
        <div
          className="font-serif text-5xl sm:text-7xl font-bold tracking-tight"
          style={{
            color: '#c9a961',
            textShadow: '0 0 30px rgba(201,169,97,0.5), 0 0 60px rgba(201,169,97,0.3)',
          }}
        >
          St. Xavier's
        </div>
      </div>
    );
  }
  return (
    <div className={`relative ${className}`} style={{ height: '140px', width: '100%' }}>
      {/* CSS fallback always visible behind canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Name3DFallback />
      </div>

      {/* 3D canvas renders on top once loaded */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', position: 'relative', zIndex: 10 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#7a1c2f" />
          <pointLight position={[0, -2, 3]} intensity={0.8} color="#c9a961" />
          <Environment preset="sunset" />
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <TextMesh />
          </Float>
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.3}
            scale={8}
            blur={2.5}
            far={4}
            color="#7a1c2f"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
