import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import StarRating from '@/components/common/StarRating'
import { useLanguage } from '@/hooks/useLanguage'
import { siteConfig } from '@/data/siteConfig'
import { cn } from '@/utils/cn'

const TRUST_BADGES = [
  { icon: BadgeCheck, key: 'hero.trust.nurses' },
  { icon: ShieldCheck, key: 'hero.trust.caregivers' },
  { icon: Clock, key: 'hero.trust.support' },
  { icon: ClipboardCheck, key: 'hero.trust.assessment' },
]

/* Slow gold dust motes drifting in the light shaft (decorative). */
const MOTES = [
  { left: '12%', top: '18%', size: 5, duration: 7, delay: 0 },
  { left: '22%', top: '38%', size: 3, duration: 9, delay: 1.2 },
  { left: '8%', top: '58%', size: 4, duration: 8, delay: 2.1 },
  { left: '30%', top: '12%', size: 3, duration: 10, delay: 0.6 },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * S1 · "Morning light" hero — warm ivory field, one volumetric light shaft,
 * quiet headline, two CTAs. Light is the protagonist.
 */
export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Morning atmosphere: radial warmth + the signature light shaft */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(110% 70% at 18% 0%, rgba(234,217,176,0.35), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="light-shaft absolute -top-32 left-[4%] h-[130%] w-[26rem] max-w-[60vw]" aria-hidden="true" />
      {MOTES.map((mote, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-400/60 motion-reduce:hidden"
          style={{ left: mote.left, top: mote.top, width: mote.size, height: mote.size }}
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: mote.duration, delay: mote.delay, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      ))}

      <div className="container-site relative grid items-center gap-12 pb-24 pt-16 md:pt-24 lg:grid-cols-2 lg:gap-16 lg:pb-28">
        {/* Left: copy + CTAs */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p variants={item} className="tagline flex items-center gap-3">
            <span className="h-px w-10 bg-gold-400" aria-hidden="true" />
            {t('hero.badge')}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-heading text-hero-fluid font-bold text-primary"
          >
            {t('hero.headline1')}{' '}
            <span className="font-accent italic text-secondary-600">{t('hero.headline2')}</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-light md:text-xl">
            {t('hero.sub')}.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/book-consultation" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}>
              {t('cta.bookConsultation')}
              <ArrowRight aria-hidden="true" />
            </Link>
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
          </motion.div>

          <motion.ul variants={item} className="mt-10 flex flex-wrap gap-2.5" aria-label="Why families trust us">
            {TRUST_BADGES.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-primary-700 ring-1 ring-ivory-300"
              >
                <Icon className="h-3.5 w-3.5 text-secondary-500" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: the morning-room shot + floating glass card */}
        <motion.div
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover ring-1 ring-ivory-300">
            <img
              src="/images/hero-banner.svg"
              alt="Morning light falls across a living room as a caregiver sits with an elder over tea"
              className="w-full motion-safe:animate-breathe"
              fetchpriority="high"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(194,154,85,0.08), rgba(10,27,46,0) 40%)' }}
              aria-hidden="true"
            />
          </div>

          <motion.div
            className="glass absolute -bottom-6 left-4 flex items-center gap-3 rounded-card p-4 sm:left-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-50 text-success">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-primary">
                {siteConfig.stats[0].value} {t('stats.families')}
              </p>
              <StarRating rating={5} className="mt-0.5" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue — a breathing gold line */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex" aria-hidden="true">
        <span className="block h-12 w-px origin-top bg-gold-500 motion-safe:animate-cue-pulse" />
        <span className="text-[11px] font-medium uppercase tracking-overline text-primary-500">scroll</span>
      </div>
    </section>
  )
}
