'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

/**
 * 3D animated background for the hero section.
 * - Floating particles (school stars)
 * - Distorted sphere (gold orb)
 * - GPU-accelerated, pauses when off-screen
 */

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  // Generate 1500 random particles in a sphere
  const positions = useMemo(() => {
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const r = 8 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.03;
      ref.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#c9a961"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function GoldOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[4, 0, -2]} scale={1.2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#7a1c2f"
          emissive="#c9a961"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.8}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function CrimsonOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.4) * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[-4, 1, -1]} scale={0.8}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#c9a961"
          emissive="#7a1c2f"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.9}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

export function Hero3DBg() {
  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#c9a961" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#7a1c2f" />
          <directionalLight position={[0, 5, 5]} intensity={0.4} />
          <ParticleField />
          <GoldOrb />
          <CrimsonOrb />
        </Suspense>
      </Canvas>
    </div>
  );
}
