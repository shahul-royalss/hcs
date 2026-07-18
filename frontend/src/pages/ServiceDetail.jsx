import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import ServiceDetailContent from '@/components/services/ServiceDetail'
import { buttonVariants } from '@/components/ui/button'
import { getServiceBySlug } from '@/data/services'
import { cn } from '@/utils/cn'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) {
    return (
      <>
        <Seo
          title="Service Not Found"
          description="The service you are looking for could not be found. Browse all Dhrishta Healthcare home care services."
        />
        <section className="section-padding">
          <div className="container-site flex flex-col items-center py-16 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
              <SearchX className="h-10 w-10 text-secondary" aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-heading text-3xl font-extrabold text-primary">
              Service not found
            </h1>
            <p className="mt-3 max-w-md text-ink-light">
              We couldn&rsquo;t find the service you&rsquo;re looking for. It may have been moved or
              renamed — all our current services are listed below.
            </p>
            <Link
              to="/services"
              className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'mt-8')}
            >
              <ArrowLeft aria-hidden="true" /> Browse All Services
            </Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title={service.name} description={service.excerpt} />
      <PageHeader
        title={service.name}
        subtitle={service.excerpt}
        crumbs={[{ label: 'Services', to: '/services' }, { label: service.shortName }]}
      />
      <ServiceDetailContent service={service} />
    </>
  )
}
