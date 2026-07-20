import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initSmoothScroll, scrollToTop, ScrollTrigger } from '@/lib/cinema'

/**
 * Mounts the site-wide Lenis smooth scroll (public pages only) and keeps
 * ScrollTrigger honest across route changes. Reduced-motion users get
 * native scrolling untouched.
 */
export default function SmoothScroll() {
  const { pathname } = useLocation()

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    scrollToTop(true)
    // New page, new layout — measure again once the route has painted.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}
