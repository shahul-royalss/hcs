import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import StarRating from '@/components/common/StarRating'
import HeroDust from '@/components/home/HeroDust'
import { useScene, useMagnetic } from '@/hooks/useCinema'
import { gsap, SplitText } from '@/lib/cinema'
import { useLanguage } from '@/hooks/useLanguage'
import { siteConfig } from '@/data/siteConfig'
import { cn } from '@/utils/cn'

const TRUST_BADGES = [
  { icon: BadgeCheck, key: 'hero.trust.nurses' },
  { icon: ShieldCheck, key: 'hero.trust.caregivers' },
  { icon: Clock, key: 'hero.trust.support' },
  { icon: ClipboardCheck, key: 'hero.trust.assessment' },
]

/**
 * S1 · "Morning light" — the opening shot, directed by scroll.
 *
 * Entrance (time-based, runs once): the headline's words rise out of masks,
 * the sub-line and CTAs breathe in, the shot settles from a slow push-in.
 *
 * Scroll (scrubbed, desktop): the section pins for one extra viewport while
 * the camera pushes into the photo, the copy dissolves upward and the dust
 * thins — arrival means stillness. Mobile keeps a light unpinned parallax.
 * Reduced motion: the final art-directed frame, no movement.
 */
export default function HeroSection() {
  const { t, language } = useLanguage()
  const magnetRef = useMagnetic()

  const scope = useScene(
    ({ reduced }) => {
      if (reduced) return

      // ── Entrance ────────────────────────────────────────────────
      const split = SplitText.create('[data-hero-headline]', { type: 'words', mask: 'words' })
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-hero-canvas]', { scale: 1.06 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
        .from('[data-hero-overline]', { opacity: 0, y: 14, duration: 0.7 }, 0.15)
        .from(split.words, { yPercent: 118, duration: 1.05, stagger: 0.07 }, 0.25)
        .from('[data-hero-sub]', { y: 24, opacity: 0, duration: 0.8 }, 0.8)
        .from('[data-hero-cta] > *', { y: 18, opacity: 0, stagger: 0.08, duration: 0.7 }, 1.0)
        .from('[data-hero-trust] li', { y: 14, opacity: 0, stagger: 0.06, duration: 0.5 }, 1.15)
        .from('[data-hero-card]', { y: 20, opacity: 0, duration: 0.7 }, 1.2)
        .from('[data-hero-cue]', { opacity: 0, duration: 0.6 }, 1.6)

      // ── The scroll film ─────────────────────────────────────────
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '[data-hero]',
              start: 'top top',
              end: '+=120%',
              scrub: true,
              pin: true,
              anticipatePin: 1,
            },
            defaults: { ease: 'none' },
          })
          .to('[data-hero-canvas]', { scale: 1.09, yPercent: -4, duration: 1 }, 0)
          .to('[data-hero-copy]', { yPercent: -18, opacity: 0, duration: 0.55 }, 0.18)
          .to('[data-hero-cue]', { opacity: 0, duration: 0.1 }, 0)
          .to('[data-hero-shaft]', { xPercent: 14, opacity: 0.5, duration: 1 }, 0)
          .to('[data-hero-dust]', { opacity: 0.35, duration: 1 }, 0)
          .to('[data-hero-card]', { yPercent: -30, duration: 1 }, 0)
      })
      mm.add('(max-width: 1023px)', () => {
        gsap.to('[data-hero-canvas]', {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      })

      return () => split.revert()
    },
    [language]
  )

  return (
    <section ref={scope}>
      <div data-hero className="relative overflow-hidden bg-white">
        {/* Morning atmosphere: radial warmth + the signature light shaft + dust */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(110% 70% at 18% 0%, rgba(234,217,176,0.35), transparent 60%)' }}
          aria-hidden="true"
        />
        <div data-hero-shaft className="light-shaft absolute -top-32 left-[4%] h-[130%] w-[26rem] max-w-[60vw]" aria-hidden="true" />
        <HeroDust data-hero-dust className="absolute inset-0 h-full w-full" />

        <div className="container-site relative grid min-h-[calc(100svh-4rem)] items-center gap-12 pb-24 pt-14 md:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          {/* Left: copy + CTAs */}
          <div data-hero-copy>
            <p data-hero-overline className="tagline flex items-center gap-3">
              <span className="h-px w-10 bg-gold-400" aria-hidden="true" />
              {t('hero.badge')}
            </p>

            <h1 data-hero-headline className="mt-6 text-balance font-heading text-hero-fluid font-bold text-primary">
              {t('hero.headline1')}{' '}
              <span className="font-accent italic text-secondary-600">{t('hero.headline2')}</span>
            </h1>

            <p data-hero-sub className="mt-6 max-w-xl text-lg leading-relaxed text-ink-light md:text-xl">
              {t('hero.sub')}.
            </p>

            <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-4">
              <span ref={magnetRef} className="inline-block">
                <Link to="/book-consultation" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}>
                  {t('cta.bookConsultation')}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </span>
              <Link
                to="/services"
                className="group inline-flex h-12 items-center gap-1.5 px-2 font-heading text-base font-semibold text-primary transition-colors hover:text-secondary-600"
              >
                {t('cta.exploreCare')}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <ul data-hero-trust className="mt-10 flex flex-wrap gap-2.5" aria-label="Why families trust us">
              {TRUST_BADGES.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-ivory-300"
                >
                  <Icon className="h-3.5 w-3.5 text-secondary-500" aria-hidden="true" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: the morning-room shot + floating glass card */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover ring-1 ring-ivory-300">
              <img
                data-hero-canvas
                src="/images/hero-banner.svg"
                alt="Morning light falls across a living room as a caregiver sits with an elder over tea"
                className="w-full will-change-transform"
                fetchpriority="high"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(194,154,85,0.08), rgba(10,27,46,0) 40%)' }}
                aria-hidden="true"
              />
            </div>

            <div data-hero-card className="glass absolute -bottom-6 left-4 flex items-center gap-3 rounded-card p-4 sm:left-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-50 text-success">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-primary">
                  {siteConfig.stats[0].value} {t('stats.families')}
                </p>
                <StarRating rating={5} className="mt-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue — a breathing gold line */}
        <div
          data-hero-cue
          className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
          aria-hidden="true"
        >
          <span className="block h-12 w-px origin-top bg-gold-500 motion-safe:animate-cue-pulse" />
          <span className="text-[11px] font-medium uppercase tracking-overline text-primary-500">scroll</span>
        </div>
      </div>
    </section>
  )
}
