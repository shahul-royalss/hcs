import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import ServiceIcon from '@/components/common/ServiceIcon'
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

/** Reusable service card: icon, excerpt, feature preview, pricing and detail link. */
export default function ServiceCard({ service, className }) {
  return (
    <Card
      className={cn(
        'group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover',
        className
      )}
    >
      <div
        className={cn(
          'mb-5 flex h-14 w-14 items-center justify-center rounded-full',
          COLOR[service.color] || COLOR.primary
        )}
      >
        <ServiceIcon name={service.icon} className="h-7 w-7" aria-hidden="true" />
      </div>

      <h3 className="font-heading text-xl font-bold text-primary">{service.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-light">{service.excerpt}</p>

      <ul className="mt-4 space-y-2">
        {service.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-ink-light">
            Starting from{' '}
            <span className="font-heading text-base font-bold text-primary">
              {formatINR(service.pricingStartsFrom)}
            </span>{' '}
            {service.pricingUnit}
          </p>
          <Link
            to={`/services/${service.slug}`}
            className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-secondary transition-colors hover:text-secondary-700"
            aria-label={`Learn more about ${service.name}`}
          >
            Learn More
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </Card>
  )
}
