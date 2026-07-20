import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, magnetic, prefersReducedMotion } from '@/lib/cinema'

/**
 * Scoped GSAP scene: `build({ scope, reduced })` runs inside gsap.context tied
 * to the returned ref, and everything (tweens, ScrollTriggers, pins, splits)
 * reverts automatically on unmount — leak-proof and StrictMode-safe.
 */
export function useScene(build, deps = []) {
  const scope = useRef(null)
  useLayoutEffect(() => {
    if (!scope.current) return undefined
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => build({ scope: scope.current, reduced }), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return scope
}

/** Magnetic CTA: attach the returned ref to any button/link wrapper. */
export function useMagnetic(options) {
  const ref = useRef(null)
  useEffect(() => magnetic(ref.current, options), []) // eslint-disable-line react-hooks/exhaustive-deps
  return ref
}
