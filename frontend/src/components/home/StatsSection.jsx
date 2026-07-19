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

/** Quick-stats band that overlaps the bottom of the hero. */
export default function StatsSection() {
  const { t } = useLanguage()

  return (
    <section aria-label="Dhrishta at a glance" className="relative z-10">
      <div className="container-site">
        <AnimatedSection className="-mt-12 lg:-mt-16">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-slate-100 shadow-card-hover ring-1 ring-slate-100 lg:grid-cols-4">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse bg-white px-4 py-6 text-center md:py-8">
                <dt className="mt-1 text-sm font-medium text-ink-light">
                  {STAT_LABEL_KEYS[stat.label] ? t(STAT_LABEL_KEYS[stat.label]) : stat.label}
                </dt>
                <dd className="font-heading text-3xl font-extrabold text-primary md:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </AnimatedSection>
      </div>
    </section>
  )
}
