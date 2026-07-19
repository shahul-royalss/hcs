import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, ClipboardCheck, Clock, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import CallButton from '@/components/common/CallButton'
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

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

/** Full-width gradient hero — headline, CTAs, trust badges and hero image. */
export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-secondary-700 text-white">
      {/* Decorative shapes */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute right-1/4 top-10 h-24 w-24 rounded-full bg-secondary-400/10" aria-hidden="true" />

      <div className="container-site relative grid items-center gap-12 pb-24 pt-14 md:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-32">
        {/* Left: copy + CTAs */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={item}>
            <Badge variant="white" className="px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t('hero.badge')}
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 text-balance font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl xl:text-6xl"
          >
            {t('hero.headline1')}{' '}
            <span className="font-accent italic text-secondary-200">
              {t('hero.headline2')}
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">
            {t('hero.sub')}. {t('hero.support')}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/book-consultation"
              className={cn(
                buttonVariants({ variant: 'primary', size: 'lg' }),
                'bg-white text-primary shadow-lg hover:bg-primary-50 hover:text-primary'
              )}
            >
              {t('cta.bookConsultation')}
              <ArrowRight aria-hidden="true" />
            </Link>
            <CallButton size="lg" />
          </motion.div>

          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-2.5" aria-label="Why families trust us">
            {TRUST_BADGES.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/20"
              >
                <Icon className="h-3.5 w-3.5 text-secondary-200" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: hero image + floating stat card */}
        <motion.div
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          <img
            src="/images/hero-banner.svg"
            alt="A Dhrishta nurse caring for an elderly patient at home"
            className="w-full rounded-card bg-white/10 shadow-card-hover ring-1 ring-white/20"
          />
          <motion.div
            className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-card bg-white p-4 shadow-card-hover sm:left-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
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
    </section>
  )
}
