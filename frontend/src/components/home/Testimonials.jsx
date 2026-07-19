import { Quote, ShieldCheck } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import StarRating from '@/components/common/StarRating'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { getServiceBySlug } from '@/data/services'
import { testimonials } from '@/data/testimonials'
import { normalizeTestimonial, useContent } from '@/hooks/useContent'
import { serviceService } from '@/services/serviceService'

/** Testimonial carousel — one centered card per slide. */
export default function Testimonials() {
  // Featured admin-approved reviews when the backend is reachable; bundled otherwise.
  const { items } = useContent(
    () => serviceService.listTestimonials(),
    testimonials,
    normalizeTestimonial
  )
  const featured = items.filter((t) => t.featured)
  const slides = featured.length > 0 ? featured : items.slice(0, 5)

  return (
    <section className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          tagline="Testimonials"
          title="What Families Say"
          subtitle="Real words from the families who trust us with the people they love most."
        />

        <AnimatedSection>
          <Carousel ariaLabel="Family testimonials" className="mx-auto max-w-4xl">
            {slides.map((testimonial) => {
              const badgeVariant = getServiceBySlug(testimonial.serviceSlug)?.color || 'primary'
              return (
                <div key={testimonial.id} className="px-2 pb-2 sm:px-14">
                  <figure className="mx-auto max-w-2xl rounded-card border border-slate-100 bg-white p-8 text-center shadow-card md:p-10">
                    <Quote className="mx-auto h-8 w-8 text-secondary-200" aria-hidden="true" />
                    <blockquote className="mt-4 text-balance leading-relaxed text-ink md:text-lg">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                    <StarRating rating={testimonial.rating} className="mt-5 justify-center" />
                    <figcaption className="mt-5 flex flex-col items-center gap-2">
                      <img
                        src={testimonial.avatar}
                        alt={`Portrait of ${testimonial.name}`}
                        className="h-14 w-14 rounded-full border-2 border-secondary-100 bg-surface"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-heading font-bold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-ink-light">{testimonial.relation}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Badge variant={badgeVariant}>{testimonial.service}</Badge>
                        {testimonial.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Verified Review
                          </span>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                </div>
              )
            })}
          </Carousel>
        </AnimatedSection>
      </div>
    </section>
  )
}
