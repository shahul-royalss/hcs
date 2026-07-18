import { Link } from 'react-router-dom'
import { CalendarCheck, Check, CheckCircle2, Info } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import CallButton from '@/components/common/CallButton'
import ServiceIcon from '@/components/common/ServiceIcon'
import ServiceCategories from '@/components/services/ServiceCategories'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { getRelatedServices } from '@/data/services'
import { formatINR } from '@/utils/formatters'
import { cn } from '@/utils/cn'

/** Static lookup so Tailwind can see the full class strings. */
const COLOR = {
  primary: 'bg-primary-50 text-primary',
  secondary: 'bg-secondary-50 text-secondary',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  childcare: 'bg-childcare-50 text-childcare',
  daycare: 'bg-daycare-50 text-daycare',
}

/** Full detail layout for a single service (used by the ServiceDetail page). */
export default function ServiceDetail({ service }) {
  const related = getRelatedServices(service.related)

  return (
    <>
      {/* Overview: image + description with feature checklist */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <AnimatedSection>
              <img
                src={service.image}
                alt={service.name}
                loading="lazy"
                className="w-full rounded-card border border-slate-100 shadow-card"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div
                className={cn(
                  'mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full',
                  COLOR[service.color] || COLOR.primary
                )}
              >
                <ServiceIcon name={service.icon} className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-primary md:text-3xl">
                About {service.shortName}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-light">{service.description}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-50">
                      <Check className="h-3 w-3 text-success" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What's included + pricing / booking */}
      <section className="section-padding bg-surface">
        <div className="container-site">
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <AnimatedSection className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-extrabold text-primary md:text-3xl">
                What&rsquo;s Included
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.included.map((item) => (
                  <Card key={item} className="flex items-start gap-3 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                    <p className="text-sm font-medium text-ink">{item}</p>
                  </Card>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <Card className="p-6">
                <p className="text-sm text-ink-light">Starting from</p>
                <p className="mt-1 font-heading text-4xl font-extrabold text-primary">
                  {formatINR(service.pricingStartsFrom)}
                  <span className="ml-1.5 text-base font-semibold text-ink-light">
                    {service.pricingUnit}
                  </span>
                </p>
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-primary-50 p-3 text-xs leading-relaxed text-primary">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Final pricing varies by care plan, duration and staff requirements. Your free home
                  assessment confirms an exact quote.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    to="/book-consultation"
                    className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'w-full')}
                  >
                    <CalendarCheck aria-hidden="true" /> Book Free Consultation
                  </Link>
                  <CallButton size="lg" className="w-full" />
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="section-padding">
          <div className="container-site">
            <SectionHeading
              tagline="You may also need"
              title="Related Services"
              subtitle="Families often combine these services for complete care at home."
            />
            <ServiceCategories services={related} />
          </div>
        </section>
      )}
    </>
  )
}
