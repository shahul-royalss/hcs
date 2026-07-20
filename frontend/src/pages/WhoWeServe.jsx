import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import ServiceIcon from '@/components/common/ServiceIcon'
import CallButton from '@/components/common/CallButton'
import { buttonVariants } from '@/components/ui/button'
import { audiences } from '@/data/whoWeServe'
import { getServiceBySlug } from '@/data/services'
import { cn } from '@/utils/cn'

/* Tailwind needs full class strings — map data `color` → explicit classes. */
const COLOR_STYLES = {
  primary: 'bg-primary-50 text-primary',
  secondary: 'bg-secondary-50 text-secondary',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  childcare: 'bg-childcare-50 text-childcare',
  daycare: 'bg-daycare-50 text-daycare',
}

/** Who We Serve — the six audiences our care is designed around. */
export default function WhoWeServe() {
  return (
    <>
      <Seo
        title="Who We Serve"
        description="Home healthcare for senior citizens, post-surgery patients, children with special needs, disabled individuals, chronic illness patients and families seeking home care in Chittoor."
      />
      <PageHeader
        title="Who We Serve"
        subtitle="Care designed around real people — at every age and every stage of health."
        crumbs={[{ label: 'Who We Serve' }]}
      />

      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            tagline="Care for Everyone"
            title="Built Around the People We Care For"
            subtitle="Whoever needs support in your family, we have trained professionals and a proven care plan for them."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {audiences.map((audience, i) => {
              const service = getServiceBySlug(audience.relatedService)
              return (
                <AnimatedSection key={audience.id} delay={i * 0.07} className="h-full">
                  <article className="group flex h-full flex-col rounded-card border border-ivory-300 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${COLOR_STYLES[audience.color] || COLOR_STYLES.primary}`}
                    >
                      <ServiceIcon name={audience.icon} className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-heading text-xl font-bold text-primary">
                      {audience.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-light">
                      {audience.description}
                    </p>

                    <h4 className="mt-5 font-heading text-sm font-bold uppercase tracking-wide text-secondary">
                      How we help
                    </h4>
                    <ul className="mt-2 flex-1 space-y-2">
                      {audience.howWeHelp.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-ink-light">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/services/${audience.relatedService}`}
                      className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-secondary transition-colors hover:text-secondary-700"
                    >
                      Explore {service ? service.shortName : 'Our Services'}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </article>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gradient-to-r from-primary via-primary-700 to-secondary-700 text-white">
        <div className="container-site py-14 md:py-16">
          <AnimatedSection>
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">
                  Not Sure Which Care Fits? Talk to Us
                </h2>
                <p className="mt-2 max-w-xl text-white/85">
                  Every situation is different. Tell us about your loved one and we will recommend
                  the right care — honestly and free of charge.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-white text-primary shadow-lg hover:bg-primary-50 hover:text-primary'
                  )}
                >
                  Contact Us
                  <ArrowRight aria-hidden="true" />
                </Link>
                <CallButton size="lg" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
