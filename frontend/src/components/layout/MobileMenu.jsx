import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { cn } from '@/utils/cn'

const MOBILE_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/specialties', label: 'Specialties' },
  { to: '/who-we-serve', label: 'Who We Serve' },
  { to: '/packages', label: 'Packages' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/team', label: 'Team' },
  { to: '/stories', label: 'Stories' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

/** Slide-in mobile navigation drawer. */
export default function MobileMenu({ open, onClose }) {
  const { openChat } = useWhatsApp()

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-primary-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-card-hover"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <img src="/images/logo.svg" alt={siteConfig.name} className="h-9 w-auto" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="rounded-lg p-2 text-ink-light hover:bg-surface hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {MOBILE_LINKS.map(({ to, label, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-4 py-2.5 font-heading font-semibold transition-colors',
                          isActive ? 'bg-primary-50 text-primary' : 'text-ink hover:bg-surface'
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-2.5 border-t border-slate-100 p-4">
              <Link to="/book-consultation" onClick={onClose} className="block">
                <Button className="w-full">Book Consultation</Button>
              </Link>
              <a href={telLink(siteConfig.phone)} className="block">
                <Button variant="accent" className="w-full">
                  <Phone className="h-4 w-4" /> Call {siteConfig.phoneDisplay}
                </Button>
              </a>
              <Button variant="whatsapp" className="w-full" onClick={() => openChat()}>
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </Button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
