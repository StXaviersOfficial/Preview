'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float, Environment, ContactShadows, Text3D, Center, Sparkles,
} from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Name3D — premium 3D animated treatment of "St. Xavier's" for the hero.
 *
 * PASS 4 FIX: Removed CSS text fallback entirely. The font is self-hosted
 * (61KB, loads in <100ms), so there's no need for a text fallback. The 3D
 * text appears with its intro animation — no ghost/double text possible.
 *
 * PREMIUM 3D:
 * - meshPhysicalMaterial with clearcoat for liquid-gold look
 * - Orbiting gold point light for dynamic highlights
 * - Gold sparkle particles floating around the text
 * - Dramatic intro: scale 0 → 1 with strong ease-out-back overshoot
 * - Subtle floating rotation post-intro
 * - Contact shadows for grounding
 * - Responsive sizing for mobile
 */

function TextMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const startTime = useRef<number>(-1);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Track start time on first frame
    if (startTime.current < 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const progress = Math.min(elapsed / 1.5, 1);

    // Intro: dramatic scale-up with strong ease-out-back
    if (progress < 1) {
      const c1 = 2.5;
      const c3 = c1 + 1;
      const eased = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
      meshRef.current.scale.setScalar(Math.max(0.001, eased));
    } else {
      meshRef.current.scale.setScalar(1);
      // Post-intro: subtle floating rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.04;
    }

    // Orbiting gold light for dynamic highlights
    if (lightRef.current) {
      const t = state.clock.elapsedTime;
      lightRef.current.position.x = Math.cos(t * 0.8) * 4;
      lightRef.current.position.z = Math.sin(t * 0.8) * 4;
      lightRef.current.position.y = Math.sin(t * 0.5) * 2;
    }
  });

  return (
    <group ref={meshRef}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.65}
          height={0.3}
          curveSegments={16}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={8}
          castShadow
          receiveShadow
        >
          St. Xavier's
          <meshPhysicalMaterial
            color="#c9a961"
            metalness={0.95}
            roughness={0.12}
            envMapIntensity={1.8}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            reflectivity={0.8}
          />
        </Text3D>
      </Center>

      {/* Orbiting gold light for dynamic highlights */}
      <pointLight ref={lightRef} intensity={2} color="#c9a961" distance={8} />
    </group>
  );
}

function GoldParticles() {
  return (
    <Sparkles
      count={60}
      scale={[6, 3, 3]}
      size={4}
      speed={0.3}
      opacity={0.6}
      color="#c9a961"
    />
  );
}

export function Name3D({ className = '' }: { className?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Responsive camera + height — smaller on mobile to prevent clipping
  const cameraZ = isMobile ? 4.0 : 5;
  const containerHeight = isMobile ? 80 : 130;

  return (
    <div
      className={`relative ${className}`}
      style={{ height: `${containerHeight}px`, width: '100%' }}
    >
      {/* No CSS text fallback — font is self-hosted (61KB, <100ms load).
          The 3D text appears with its intro scale-up animation. */}
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
          <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#7a1c2f" />
          <pointLight position={[0, -2, 3]} intensity={0.6} color="#c9a961" />
          <Environment preset="sunset" />

          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
            <TextMesh />
          </Float>

          <GoldParticles />

          <ContactShadows
            position={[0, -1.0, 0]}
            opacity={0.25}
            scale={8}
            blur={3}
            far={4}
            color="#7a1c2f"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
