import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import ServiceIcon from '@/components/common/ServiceIcon'
import { services } from '@/data/services'

/* Tailwind needs full class strings — map data `color` → explicit classes. */
const COLOR_STYLES = {
  primary: 'bg-primary-50 text-primary',
  secondary: 'bg-secondary-50 text-secondary',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  childcare: 'bg-childcare-50 text-childcare',
  daycare: 'bg-daycare-50 text-daycare',
}

/** Six core services in a responsive card grid. */
export default function ServicesOverview() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          tagline="Our Services"
          title="Care for Every Need"
          subtitle="From daily personal assistance to skilled nursing, our trained professionals bring the full range of home healthcare to your doorstep."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.slug} delay={i * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-card border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${COLOR_STYLES[service.color] || COLOR_STYLES.primary}`}
                >
                  <ServiceIcon name={service.icon} className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-primary">
                  {service.shortName}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-light">
                  {service.excerpt}
                </p>
                <Link
                  to={`/services/${service.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-secondary transition-colors hover:text-secondary-700"
                  aria-label={`Learn more about ${service.name}`}
                >
                  Learn More
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
