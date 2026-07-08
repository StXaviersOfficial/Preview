'use client'
import { useEffect, useRef, useState } from 'react'
export function NumberTicker({ value, className = '', delay = 0 }: { value: number; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        setTimeout(() => {
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 1500)
            setDisplay((1 - Math.pow(1 - t, 3)) * value)
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }, delay * 1000)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, delay, started])
  return <span ref={ref} className={className}>{display.toLocaleString('en-IN')}</span>
}
