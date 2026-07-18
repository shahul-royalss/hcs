import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube, Clock } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { services } from '@/data/services'
import { telLink } from '@/utils/helpers'

const QUICK_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Our Services' },
  { to: '/packages', label: 'Packages' },
  { to: '/specialties', label: 'Specialties' },
  { to: '/team', label: 'Our Team' },
  { to: '/stories', label: 'Stories' },
  { to: '/careers', label: 'Careers' },
  { to: '/faq', label: 'FAQ' },
]

/** Site footer (architecture doc §1.10). */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Company info */}
        <div>
          <img src="/images/logo.svg" alt={siteConfig.name} className="h-11 w-auto rounded-lg bg-white p-1.5" />
          <p className="tagline mt-4 text-white/90">{siteConfig.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Professional home healthcare services — certified nurses, verified caregivers and 24/7
            support for the people you love most.
          </p>
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
          <h3 className="font-heading text-base font-bold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-white/70 transition-colors hover:text-secondary-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services list */}
        <nav aria-label="Services">
          <h3 className="font-heading text-base font-bold text-white">Our Services</h3>
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
              <Link to="/emergency" className="font-semibold text-red-300 transition-colors hover:text-red-200">
                Emergency Care
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact details */}
        <div>
          <h3 className="font-heading text-base font-bold text-white">Contact Us</h3>
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
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms-conditions" className="transition-colors hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
