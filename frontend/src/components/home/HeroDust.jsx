import { useEffect, useRef } from 'react'
import { isFinePointer, prefersReducedMotion } from '@/lib/cinema'

/**
 * Gold dust motes drifting in the hero's light shaft — a 2D canvas layer
 * (no WebGL cost, GPU-composited). Motes rise slowly, shimmer, and lean
 * a little toward the pointer. Density scales down on touch devices;
 * reduced-motion users get nothing (the scene stays a still frame).
 */
export default function HeroDust({ className, ...rest }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const fine = isFinePointer()
    const COUNT = fine ? 90 : 36
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let raf = 0
    let running = true
    const pointer = { x: 0.35, y: 0.35 } // normalized bias toward the shaft

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Seed motes inside the left half — where the light falls.
    const motes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 0.62,
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      speed: 0.008 + Math.random() * 0.02, // % of height per second, upward
      drift: (Math.random() - 0.5) * 0.008,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.15 + Math.random() * 0.4,
    }))

    let last = performance.now()
    const frame = (now) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)
      for (const m of motes) {
        m.y -= m.speed * dt * 8
        m.x += m.drift * dt * 8 + Math.sin(now / 1400 + m.phase) * 0.00035
        if (m.y < -0.05) {
          m.y = 1.05
          m.x = Math.random() * 0.62
        }
        const px = (m.x + (pointer.x - 0.5) * 0.03) * width
        const py = (m.y + (pointer.y - 0.5) * 0.02) * height
        const twinkle = 0.65 + 0.35 * Math.sin(now / 900 + m.phase)
        ctx.beginPath()
        ctx.arc(px, py, m.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(194, 154, 85, ${(m.alpha * twinkle).toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onPointer = (e) => {
      pointer.x = e.clientX / window.innerWidth
      pointer.y = e.clientY / window.innerHeight
    }
    const onVisibility = () => {
      running = !document.hidden
      if (running) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    window.addEventListener('resize', resize)
    if (fine) window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (fine) window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" {...rest} />
}
