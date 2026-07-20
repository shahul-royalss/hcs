import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareHeart, ShieldCheck, TrendingUp } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/common/SectionHeading'
import AnimatedSection from '@/components/common/AnimatedSection'
import StarRating from '@/components/common/StarRating'
import CategoryFilter from '@/components/gallery/CategoryFilter'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { successStories, testimonials } from '@/data/testimonials'
import { services } from '@/data/services'
import { normalizeTestimonial, useContent } from '@/hooks/useContent'
import { serviceService } from '@/services/serviceService'

/** slug -> theme color; matches Badge variant names (primary/secondary/success/warning/childcare/daycare). */
const SLUG_COLOR = Object.fromEntries(services.map((s) => [s.slug, s.color]))

export default function Stories() {
  const [serviceFilter, setServiceFilter] = useState('all')

  // Admin-approved reviews when the backend is reachable; bundled reviews otherwise.
  const { items: reviews } = useContent(
    () => serviceService.listTestimonials(),
    testimonials,
    normalizeTestimonial
  )

  const serviceFilters = [
    { id: 'all', label: 'All' },
    ...[...new Set(reviews.map((t) => t.service).filter(Boolean))].map((service) => ({
      id: service,
      label: service,
    })),
  ]

  const filteredReviews =
    serviceFilter === 'all' ? reviews : reviews.filter((t) => t.service === serviceFilter)

  return (
    <>
      <Seo
        title="Stories & Testimonials"
        description="Real recovery journeys and verified reviews from families who trust Dhrishta Healthcare for home care in Chittoor."
      />
      <PageHeader
        title="Stories & Testimonials"
        subtitle="Real journeys, real families — the impact of compassionate care at home."
        crumbs={[{ label: 'Stories' }]}
      />

      {/* Success stories */}
      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="Recovery journeys"
            title="Success Stories"
            subtitle="Before-and-after moments that show what consistent, professional home care makes possible."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story, i) => (
              <AnimatedSection key={story.id} delay={Math.min(i * 0.08, 0.3)} className="h-full">
                <Card className="flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
                  <Badge
                    variant={SLUG_COLOR[story.serviceSlug] || 'secondary'}
                    className="self-start"
                  >
                    {story.service}
                  </Badge>
                  <h3 className="mt-4 font-heading text-xl font-bold text-primary">{story.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-light">
                    {story.summary}
                  </p>
                  <p className="mt-5 flex items-center gap-2 rounded-xl bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-700">
                    <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {story.impact}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Family reviews */}
      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            tagline="In their words"
            title="Family Reviews"
            subtitle="Written testimonials from the families we serve — filter by the service they used."
          />
          <AnimatedSection>
            <CategoryFilter
              categories={serviceFilters}
              active={serviceFilter}
              onChange={setServiceFilter}
              className="mb-10"
            />
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review, i) => (
              <AnimatedSection key={review.id} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <Card className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <StarRating rating={review.rating} />
                    {review.verified && (
                      <Badge variant="success">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-ivory-300 pt-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-full bg-surface object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-heading text-sm font-bold text-primary">
                        {review.name}
                      </p>
                      <p className="truncate text-xs text-ink-light">{review.relation}</p>
                    </div>
                    <Badge
                      variant={SLUG_COLOR[review.serviceSlug] || 'secondary'}
                      className="shrink-0"
                    >
                      {review.service}
                    </Badge>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Share your story CTA */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-700 to-secondary-700 text-white">
        <div className="container-site text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              Share your story
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Has Dhrishta cared for someone you love? Your experience helps other families choose
              with confidence — we&rsquo;d be honoured to hear it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className={buttonVariants({ variant: 'gold', size: 'lg' })}>
                <MessageSquareHeart aria-hidden="true" /> Share Your Story
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
