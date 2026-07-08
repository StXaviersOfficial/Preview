'use client'
import { useEffect, useRef, useState } from 'react'

export function AnimatedText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTimeout(() => setVisible(true), delay * 1000)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])
  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.03}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
