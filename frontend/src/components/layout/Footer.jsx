import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube, Clock } from 'lucide-react'
import Logo from '@/components/common/Logo'
import { siteConfig } from '@/data/siteConfig'
import { services } from '@/data/services'
import { useLanguage } from '@/hooks/useLanguage'
import { telLink } from '@/utils/helpers'

const QUICK_LINKS = [
  { to: '/about', key: 'nav.about' },
  { to: '/services', key: 'nav.services' },
  { to: '/packages', key: 'nav.packages' },
  { to: '/specialties', key: 'nav.specialties' },
  { to: '/team', key: 'nav.team' },
  { to: '/stories', key: 'nav.stories' },
  { to: '/careers', key: 'nav.careers' },
  { to: '/faq', key: 'nav.faq' },
]

/** Site footer (architecture doc §1.10). */
export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="relative bg-primary-900 text-white">
      {/* The last of the light — a gold hairline where day meets night */}
      <div
        className="h-0.5 w-full bg-gradient-to-r from-gold-500/0 via-gold-500/70 to-gold-500/0"
        aria-hidden="true"
      />
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Company info */}
        <div>
          <Logo variant="dark" className="h-11 w-auto" />
          <p className="tagline mt-4 text-white/90">{siteConfig.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{t('footer.blurb')}</p>
          <div className="mt-5 flex gap-3">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-secondary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-secondary">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-secondary">
              <Youtube className="h-4 w-4" />
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-secondary">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="font-heading text-base font-bold text-white">{t('footer.quickLinks')}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map(({ to, key }) => (
              <li key={to}>
                <Link to={to} className="text-white/70 transition-colors hover:text-secondary-300">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services list */}
        <nav aria-label="Services">
          <h3 className="font-heading text-base font-bold text-white">{t('footer.ourServices')}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  to={`/services/${service.slug}`}
                  className="text-white/70 transition-colors hover:text-secondary-300"
                >
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/emergency" className="font-semibold text-accent-300 transition-colors hover:text-accent-50">
                {t('footer.emergencyCare')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact details */}
        <div>
          <h3 className="font-heading text-base font-bold text-white">{t('footer.contactUs')}</h3>
          <ul className="mt-4 space-y-3.5 text-sm text-white/70">
            <li>
              <a href={telLink(siteConfig.phone)} className="flex items-start gap-2.5 transition-colors hover:text-secondary-300">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary-300" />
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-2.5 transition-colors hover:text-secondary-300">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary-300" />
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 transition-colors hover:text-secondary-300"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary-300" />
                {siteConfig.address}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary-300" />
              <span>
                {siteConfig.hours.support}
                <br />
                {siteConfig.hours.office}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-5 text-sm text-white/60 md:flex-row">
          <p>
            © {year} {siteConfig.name}. {t('footer.rights')}{' '}
            <span className="whitespace-nowrap text-gold-300/80">Made with care in Andhra Pradesh.</span>
          </p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="transition-colors hover:text-white">{t('footer.privacy')}</Link>
            <Link to="/terms-conditions" className="transition-colors hover:text-white">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
