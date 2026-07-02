'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D animated section divider — a flowing wave of particles
 * that sits between sections. Lightweight, GPU-accelerated.
 */

function WaveStripes() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      const geom = ref.current.geometry as THREE.PlaneGeometry;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const wave = Math.sin(x * 0.5 + state.clock.elapsedTime * 2) * 0.3
                   + Math.cos(y * 0.5 + state.clock.elapsedTime * 1.5) * 0.2;
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;
      geom.computeVertexNormals();
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[30, 6, 80, 20]} />
      <meshStandardMaterial
        color="#7a1c2f"
        emissive="#c9a961"
        emissiveIntensity={0.2}
        wireframe
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export function SectionDivider3D({ height = 120 }: { height?: number }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
      <Canvas
        camera={{ position: [0, 3, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#c9a961" />
          <WaveStripes />
        </Suspense>
      </Canvas>
    </div>
  );
}
