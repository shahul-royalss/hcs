import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTop } from '@/utils/helpers'

/** Scrolls to top on every route change. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop()
  }, [pathname])

  return null
}
