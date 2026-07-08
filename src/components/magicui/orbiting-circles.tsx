'use client'
export function OrbitingCircles({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="orbit-item absolute" style={{ '--orbit-radius': '80px', '--orbit-duration': '8s' } as React.CSSProperties}>
          <div className="size-3 rounded-full bg-gold/60" />
        </div>
        <div className="orbit-item absolute" style={{ '--orbit-radius': '120px', '--orbit-duration': '12s', animationDirection: 'reverse' } as React.CSSProperties}>
          <div className="size-2 rounded-full bg-xavier/50" />
        </div>
        <div className="orbit-item absolute" style={{ '--orbit-radius': '160px', '--orbit-duration': '16s' } as React.CSSProperties}>
          <div className="size-2.5 rounded-full bg-gold-light/40" />
        </div>
      </div>
    </div>
  )
}
