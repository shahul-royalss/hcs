/**
 * cinema.js — the motion core of the "morning light" experience.
 *
 * Ownership law (docs/design/MORNING_LIGHT_BLUEPRINT.md §07):
 * anything driven by SCROLL POSITION is GSAP's; anything driven by state or
 * pointer is Framer Motion's. Lenis interpolates the scroll itself, and GSAP's
 * ticker drives Lenis so timelines and scrolling share one clock.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** The blueprint's "power curtain" ease — every entrance uses it. */
export const EASE_OUT = 'power3.out'
export const EASE_CURTAIN = [0.22, 1, 0.36, 1]

export { gsap, ScrollTrigger, SplitText }

/** Reduced-motion gate: scrub scenes resolve to final frames, loops go still. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Coarse pointers (touch) get the lighter grammar. */
export function isFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
}

let lenis = null

/**
 * One Lenis instance for the public site, driven by GSAP's ticker
 * (single clock — no drift, no double-rAF). Returns a destroy function.
 */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {}

  lenis = new Lenis({
    lerp: 0.09, // the feel: lower = heavier/cinema. Ship 0.09 per blueprint.
    wheelMultiplier: 0.9, // slightly slower than native = deliberate
    smoothWheel: true,
    syncTouch: false, // thumbs keep native momentum
  })

  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.config({ ignoreMobileResize: true })

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

/** Jump helper that respects Lenis (route changes, anchors). */
export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate })
  else window.scrollTo(0, 0)
}

/**
 * Magnetic attraction for CTAs: the element leans toward the pointer within
 * `radius` px at `strength`, and springs home on leave. Decorative only —
 * disabled for coarse pointers and reduced motion. Returns a cleanup fn.
 */
export function magnetic(el, { strength = 0.35, radius = 64 } = {}) {
  if (!el || !isFinePointer() || prefersReducedMotion()) return () => {}
  const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
  const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
  const move = (e) => {
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    if (Math.hypot(dx, dy) < radius + r.width / 2) {
      x(dx * strength)
      y(dy * strength)
    } else {
      x(0)
      y(0)
    }
  }
  window.addEventListener('pointermove', move, { passive: true })
  return () => {
    window.removeEventListener('pointermove', move)
    x(0)
    y(0)
  }
}
