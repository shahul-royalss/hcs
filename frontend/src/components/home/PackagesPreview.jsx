import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import ServiceIcon from '@/components/common/ServiceIcon'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { packages } from '@/data/packages'
import { formatINR } from '@/utils/formatters'
import { cn } from '@/utils/cn'

/** Preview of the five care packages with pricing and top features. */
export default function PackagesPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionHeading
          tagline="Service Packages"
          title="Flexible Plans for Every Family"
          subtitle="Hourly to monthly — pick the level of support that fits your loved one's needs and your budget."
        />

        <div className="grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
          {packages.map((pkg, i) => (
            <AnimatedSection key={pkg.id} delay={i * 0.06} className="h-full">
              <article
                className={cn(
                  'relative flex h-full flex-col rounded-card border bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
                  pkg.popular ? 'border-secondary ring-1 ring-secondary' : 'border-slate-100'
                )}
              >
                {pkg.popular && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-secondary text-white"
                  >
                    Most Popular
                  </Badge>
                )}

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <ServiceIcon name={pkg.icon} className="h-5 w-5" aria-hidden="true" />
                </span>

                <h3 className="mt-4 font-heading text-lg font-bold text-primary">{pkg.name}</h3>
                <p className="mt-1 text-xs font-medium text-ink-light">{pkg.duration}</p>

                <p className="mt-3">
                  {pkg.price !== null ? (
                    <>
                      <span className="font-heading text-2xl font-extrabold text-primary">
                        {formatINR(pkg.price)}
                      </span>{' '}
                      <span className="text-xs text-ink-light">{pkg.priceUnit}</span>
                    </>
                  ) : (
                    <span className="font-heading text-2xl font-extrabold text-secondary">
                      Get quote
                    </span>
                  )}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {pkg.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-ink-light">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/packages"
                  className={cn(
                    buttonVariants({ variant: pkg.popular ? 'secondary' : 'outline', size: 'sm' }),
                    'mt-5 w-full'
                  )}
                  aria-label={`View ${pkg.name} package details`}
                >
                  View Package
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-10 text-center">
          <Link to="/packages" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>
            Compare all packages
            <ArrowRight aria-hidden="true" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
