'use client'
export function ShimmerButton({ children, className = '', href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
    </>
  )
  if (href) return <a href={href} className={`group relative overflow-hidden ${className}`} onClick={onClick}>{inner}</a>
  return <button className={`group relative overflow-hidden ${className}`} onClick={onClick}>{inner}</button>
}
