import { useEffect, useRef, useState } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/cinema'

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary'

/**
 * Desktop-only contextual cursor: an 8px navy dot with an 80ms trail that
 * grows into a soft gold halo over interactive elements. Purely decorative —
 * the native cursor and hit areas are untouched, and it never mounts for
 * touch devices or reduced-motion users.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const haloRef = useRef(null)

  useEffect(() => {
    setEnabled(isFinePointer() && !prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (!enabled) return undefined
    const dot = dotRef.current
    const halo = haloRef.current
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const haloX = gsap.quickTo(halo, 'x', { duration: 0.32, ease: 'power3.out' })
    const haloY = gsap.quickTo(halo, 'y', { duration: 0.32, ease: 'power3.out' })

    const move = (e) => {
      dotX(e.clientX)
      dotY(e.clientY)
      haloX(e.clientX)
      haloY(e.clientY)
    }
    const over = (e) => {
      const interactive = e.target.closest?.(INTERACTIVE)
      gsap.to(halo, { scale: interactive ? 2.4 : 1, opacity: interactive ? 0.9 : 0.45, duration: 0.28, ease: 'power2.out' })
    }
    const hide = () => gsap.to([dot, halo], { opacity: 0, duration: 0.2 })
    const show = () => {
      gsap.to(dot, { opacity: 1, duration: 0.2 })
      gsap.to(halo, { opacity: 0.45, duration: 0.2 })
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    document.documentElement.addEventListener('pointerenter', show)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.removeEventListener('pointerenter', show)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <span
        ref={haloRef}
        className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-gold-500/70 bg-gold-200/20 opacity-45"
      />
      <span ref={dotRef} className="cursor-dot absolute -left-1 -top-1 h-2 w-2 rounded-full" />
    </div>
  )
}
