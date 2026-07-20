import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Menu, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageSelector from '@/components/common/LanguageSelector'
import Logo from '@/components/common/Logo'
import ThemeToggle from '@/components/common/ThemeToggle'
import MobileMenu from './MobileMenu'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export const NAV_LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/services', key: 'nav.services' },
  { to: '/packages', key: 'nav.packages' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
]

/** Sticky navigation bar (architecture doc §1.1) with EN/हिंदी toggle. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openChat } = useWhatsApp()
  const { t } = useLanguage()
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const readProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-ivory-300 bg-white/95 shadow-card backdrop-blur'
          : 'border-transparent bg-white'
      )}
    >
      {/* Reading progress — a 2px gold hairline */}
      <motion.div
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-gold-500 to-gold-300"
        style={{ scaleX: readProgress }}
        aria-hidden="true"
      />
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[72px]">
        {/* Logo */}
        <Link to="/" aria-label={`${siteConfig.name} — Home`} className="flex shrink-0 items-center">
          <Logo className="h-10 w-auto md:h-11" />
        </Link>

        {/* Desktop menu */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ to, key, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-colors xl:px-4',
                  isActive ? 'bg-primary-50 text-primary' : 'text-ink hover:text-primary'
                )
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs — Call Now / WhatsApp join at xl so the bar never overflows */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSelector />
          <ThemeToggle />
          <a
            href={telLink(siteConfig.phone)}
            aria-label={t('cta.callNow')}
            title={t('cta.callNow')}
            className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-secondary-700 transition-colors hover:bg-secondary-50 xl:inline-flex"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden 2xl:inline">{t('cta.callNow')}</span>
          </a>
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() => openChat()}
            aria-label="Chat on WhatsApp"
            title={t('cta.whatsapp')}
            className="hidden shrink-0 xl:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden 2xl:inline">{t('cta.whatsapp')}</span>
          </Button>
          <Link to="/book-consultation" className="shrink-0">
            <Button size="sm" className="whitespace-nowrap">{t('cta.bookConsultation')}</Button>
          </Link>
        </div>

        {/* Mobile: language selector + theme toggle + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSelector compact />
          <ThemeToggle compact />
          <button
            type="button"
            className="rounded-lg p-2 text-primary"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
