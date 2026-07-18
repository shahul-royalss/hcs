import AnimatedSection from '@/components/common/AnimatedSection'
import ServiceCard from '@/components/services/ServiceCard'
import { services as allServices } from '@/data/services'
import { cn } from '@/utils/cn'

/** Responsive grid of ServiceCard — defaults to all six core services. */
export default function ServiceCategories({ services = allServices, className }) {
  if (!services.length) return null

  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {services.map((service, i) => (
        <AnimatedSection key={service.slug} delay={Math.min(i * 0.06, 0.3)} className="h-full">
          <ServiceCard service={service} />
        </AnimatedSection>
      ))}
    </div>
  )
}
