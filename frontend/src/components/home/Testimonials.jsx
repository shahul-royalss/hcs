import { ShieldCheck } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import StarRating from '@/components/common/StarRating'
import { Badge } from '@/components/ui/badge'
import { Carousel } from '@/components/ui/carousel'
import { getServiceBySlug } from '@/data/services'
import { testimonials } from '@/data/testimonials'
import { normalizeTestimonial, useContent } from '@/hooks/useContent'
import { serviceService } from '@/services/serviceService'

/**
 * S7 · "Voices" — one family at a time: a breathing portrait in an arch of
 * light, and words that read like they were spoken.
 */
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
    <section className="section-padding relative overflow-hidden bg-surface">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(80% 55% at 85% 100%, rgba(234,217,176,0.25), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="container-site relative">
        <SectionHeading
          tagline="Voices"
          title="What families say"
          subtitle="Real words from the families who trust us with the people they love most."
        />

        <AnimatedSection>
          <Carousel ariaLabel="Family testimonials" className="mx-auto max-w-4xl">
            {slides.map((testimonial) => {
              const badgeVariant = getServiceBySlug(testimonial.serviceSlug)?.color || 'primary'
              return (
                <div key={testimonial.id} className="px-2 pb-2 sm:px-14">
                  <figure className="mx-auto grid max-w-3xl gap-7 rounded-[2rem] border border-ivory-300 bg-white p-8 shadow-card md:grid-cols-[auto,1fr] md:gap-10 md:p-10">
                    <div className="mx-auto flex flex-col items-center gap-3 md:mx-0">
                      <div className="arch-mask relative h-40 w-32 bg-gold-100 md:h-48 md:w-36">
                        <img
                          src={testimonial.avatar}
                          alt={`Portrait of ${testimonial.name}`}
                          className="h-full w-full object-cover motion-safe:animate-breathe"
                          loading="lazy"
                        />
                      </div>
                      {testimonial.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          Verified Review
                        </span>
                      )}
                    </div>

                    <div className="text-center md:text-left">
                      <span className="font-accent text-6xl leading-none text-gold-400" aria-hidden="true">
                        &ldquo;
                      </span>
                      <blockquote className="-mt-4 text-balance font-accent text-lg italic leading-relaxed text-ink md:text-xl">
                        {testimonial.text}
                      </blockquote>
                      <StarRating rating={testimonial.rating} className="mt-5 justify-center md:justify-start" />
                      <figcaption className="mt-4">
                        <p className="font-heading font-bold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-ink-light">{testimonial.relation}</p>
                        <Badge variant={badgeVariant} className="mt-2.5">{testimonial.service}</Badge>
                      </figcaption>
                    </div>
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
