import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import AnimatedSection from '@/components/common/AnimatedSection'
import { siteConfig } from '@/data/siteConfig'
import { useLanguage } from '@/hooks/useLanguage'

/** siteConfig stat labels → translation keys (fallback: original label). */
const STAT_LABEL_KEYS = {
  'Happy Families': 'stats.families',
  'Healthcare Professionals': 'stats.professionals',
  Support: 'stats.support',
  'Years Experience': 'stats.experience',
}

/** Tabular count-up that starts when the numeral enters the viewport. */
function CountUp({ value }) {
  const match = /^(\d+)(.*)$/.exec(value)
  const target = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView || target === null) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return undefined
    }
    const duration = 1600
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCurrent(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])

  if (target === null) return <span ref={ref}>{value}</span>
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {current.toLocaleString('en-IN')}
        {suffix}
      </span>
    </span>
  )
}

/**
 * S6 · "Numbers born from light" — proof rendered in the signature gold:
 * large counting numerals with a gold hairline drawn beneath each.
 */
export default function StatsSection() {
  const { t } = useLanguage()

  return (
    <section
      aria-label="Dhrishta at a glance"
      className="section-padding relative overflow-hidden bg-white"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 90% at 50% 0%, rgba(234,217,176,0.3), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="container-site relative">
        <AnimatedSection>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 text-center lg:grid-cols-4">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center">
                <dt className="mt-3 text-sm font-medium text-ink-light md:text-base">
                  {STAT_LABEL_KEYS[stat.label] ? t(STAT_LABEL_KEYS[stat.label]) : stat.label}
                </dt>
                <dd className="gold-underline font-heading text-5xl font-extrabold text-primary md:text-6xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </AnimatedSection>
      </div>
    </section>
  )
}
