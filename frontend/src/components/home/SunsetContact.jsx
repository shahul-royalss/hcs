import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import { buttonVariants } from '@/components/ui/button'
import { useMagnetic } from '@/hooks/useCinema'
import { siteConfig } from '@/data/siteConfig'
import { useLanguage } from '@/hooks/useLanguage'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { telLink } from '@/utils/helpers'
import { cn } from '@/utils/cn'

/* First stars, pre-scattered over the deepening sky (decorative). */
const STARS = [
  { left: '8%', top: '58%', size: 2 }, { left: '16%', top: '70%', size: 1.5 },
  { left: '26%', top: '63%', size: 2 }, { left: '38%', top: '74%', size: 1.5 },
  { left: '55%', top: '60%', size: 2 }, { left: '64%', top: '72%', size: 1.5 },
  { left: '74%', top: '58%', size: 2.5 }, { left: '85%', top: '68%', size: 1.5 },
  { left: '92%', top: '61%', size: 2 }, { left: '47%', top: '66%', size: 1.5 },
]

/**
 * S10 · "The sunset walk" — the film's last shot. A dusk sky deepens from
 * ivory to navy, two silhouettes walk a gentle rise, and a warm glass card
 * extends the hand.
 */
export default function SunsetContact() {
  const { t } = useLanguage()
  const { openChat } = useWhatsApp()
  const magnetRef = useMagnetic()

  return (
    <section
      aria-label="Plan care with us"
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #FAF7F1 0%, #F3E3C6 20%, #E4BA79 44%, #9A6440 64%, #16324F 84%, #0A1B2E 100%)',
      }}
    >
      {/* The setting sun — the signature shaft's final descent */}
      <div
        className="pointer-events-none absolute left-1/2 top-[30%] h-72 w-72 -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(234,217,176,0.9), rgba(194,154,85,0.35) 45%, transparent 70%)' }}
        aria-hidden="true"
      />
      {/* First stars */}
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/80"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          aria-hidden="true"
        />
      ))}

      <div className="container-site relative flex min-h-[42rem] flex-col items-center justify-center py-24 md:py-32">
        <AnimatedSection className="w-full max-w-2xl">
          <div className="glass-night rounded-[2rem] p-8 text-center md:p-12">
            <p className="tagline !text-gold-300">The sunset walk</p>
            <h2 className="mt-4 text-balance font-heading text-d1-fluid font-bold !text-white">
              Let&rsquo;s plan the right care, together.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-white/80">
              One conversation is enough to begin. Tell us about the person you love —
              we&rsquo;ll listen first, then walk the road with you.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <span ref={magnetRef} className="inline-block">
                <Link to="/book-consultation" className={cn(buttonVariants({ variant: 'gold', size: 'lg' }))}>
                  {t('cta.bookConsultation')}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </span>
              <a
                href={telLink(siteConfig.phone)}
                className={cn(buttonVariants({ variant: 'outline-white', size: 'lg' }))}
              >
                <Phone aria-hidden="true" />
                {siteConfig.phoneDisplay}
              </a>
            </div>

            {/* Families in a hurry skip forms */}
            <ul className="mt-10 flex flex-col flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/15 pt-7 text-sm text-white/75 sm:flex-row">
              <li>
                <button
                  type="button"
                  onClick={() => openChat()}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold-200"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {t('cta.whatsappUs')}
                </button>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-gold-200">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {siteConfig.city}, {siteConfig.state}
              </li>
            </ul>
          </div>
        </AnimatedSection>
      </div>

      {/* The gentle rise: hill + two silhouettes, arm in arm */}
      <svg
        className="relative block w-full"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 180 L0 120 Q 360 60 720 92 T 1440 70 L1440 180 Z" fill="#0A1B2E" />
        <g transform="translate(1050, 22)" fill="#0A1B2E">
          {/* elder with cane */}
          <circle cx="14" cy="14" r="7" />
          <path d="M7 62 c0-24 2-40 7-40 s7 16 7 40 z" />
          <rect x="26" y="30" width="2.4" height="32" rx="1.2" />
          {/* caregiver, arm linked */}
          <circle cx="42" cy="10" r="7.5" />
          <path d="M34 62 c0-26 3-44 8-44 s8 18 8 44 z" />
          <path d="M22 36 q8 6 16 2" stroke="#0A1B2E" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </section>
  )
}
