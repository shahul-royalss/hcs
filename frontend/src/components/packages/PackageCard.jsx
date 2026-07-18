import { Link } from 'react-router-dom'
import { Check, Clock3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import ServiceIcon from '@/components/common/ServiceIcon'
import { formatINR } from '@/utils/formatters'
import { cn } from '@/utils/cn'

/** Pricing card for a care package; highlighted when featured/popular. */
export default function PackageCard({ pkg, featured = false }) {
  const highlight = featured || pkg.popular

  return (
    <Card
      className={cn(
        'relative flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover',
        highlight && 'ring-2 ring-secondary lg:scale-[1.03]'
      )}
    >
      {pkg.popular && (
        <Badge
          variant="secondary"
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-secondary text-white shadow-sm"
        >
          Most Popular
        </Badge>
      )}

      <div
        className={cn(
          'mb-5 flex h-14 w-14 items-center justify-center rounded-full',
          highlight ? 'bg-secondary text-white' : 'bg-secondary-50 text-secondary'
        )}
      >
        <ServiceIcon name={pkg.icon} className="h-7 w-7" aria-hidden="true" />
      </div>

      <h3 className="font-heading text-xl font-bold text-primary">{pkg.name}</h3>

      <p className="mt-3 font-heading text-3xl font-extrabold text-primary">
        {pkg.price != null ? (
          <>
            {formatINR(pkg.price)}
            <span className="ml-1.5 text-sm font-semibold text-ink-light">{pkg.priceUnit}</span>
          </>
        ) : (
          'Custom quote'
        )}
      </p>

      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-secondary-700">
        <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
        {pkg.duration}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-ink-light">{pkg.description}</p>

      <ul className="mt-4 space-y-2">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Link
          to="/book-consultation"
          className={cn(
            buttonVariants({ variant: highlight ? 'secondary' : 'primary', size: 'md' }),
            'w-full'
          )}
          aria-label={`Book the ${pkg.name} package`}
        >
          Book Now
        </Link>
      </div>
    </Card>
  )
}
