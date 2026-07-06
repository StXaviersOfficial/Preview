'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * PointerTilt — 3D tilt card that works on BOTH mouse AND touch.
 * Uses the Pointer Events API (onPointerMove/Down/Up/Cancel) which
 * fires uniformly for mouse, touch, AND pen in every modern browser.
 *
 * This replaces the old mouse-only TiltCard/Spotlight/Magnetic components
 * from animations.tsx — fixing the "touch doesn't work on phones" bug.
 *
 * On touch devices: tilt responds to drag position.
 * On desktop: tilt responds to hover position.
 * On gyro-capable devices: could be extended to respond to device tilt.
 */
export function PointerTilt({
  children,
  className = '',
  intensity = 12,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for smooth spring-based tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const isPointerDown = useRef(false);

  const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), { stiffness: 300, damping: 30 });
  const glareX = useTransform(x, [0, 1], ['0%', '100%']);
  const glareY = useTransform(y, [0, 1], ['0%', '100%']);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ref.current) return;
    // Only track if pointer is down (touch) OR if it's a mouse (hover)
    if (e.pointerType === 'touch' && !isPointerDown.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') isPointerDown.current = true;
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    x.set(0.5);
    y.set(0.5);
  };

  const handlePointerLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(201,169,97,0.2), transparent 50%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
}
