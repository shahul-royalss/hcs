import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Quote } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import ServiceIcon from '@/components/common/ServiceIcon'
import { buttonVariants } from '@/components/ui/button'
import { specialties } from '@/data/specialties'
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

/** Specialties — six special-care programs in alternating two-column blocks. */
export default function Specialties() {
  return (
    <>
      <Seo
        title="Specialties — Special Care Services"
        description="Specialised home care in Chittoor: post-surgery care, bedridden patient care, dementia care, stroke recovery, palliative care and Alzheimer's support — with proven care plans."
      />
      <PageHeader
        title="Specialties — Special Care Services"
        subtitle="Complex conditions need more than helping hands. They need trained specialists and proven care plans."
        crumbs={[{ label: 'Specialties' }]}
      />

      {/* Sticky sub-navigation chips */}
      <nav
        aria-label="Jump to a specialty"
        className="sticky top-16 z-30 border-b border-slate-100 bg-white/95 backdrop-blur md:top-[72px]"
      >
        <div className="container-site flex gap-2 overflow-x-auto py-3">
          {specialties.map((specialty) => (
            <a
              key={specialty.slug}
              href={`#${specialty.slug}`}
              className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-ink-light transition-colors hover:border-secondary hover:text-secondary"
            >
              {specialty.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Intro */}
      <section className="bg-white pt-12 md:pt-16">
        <div className="container-site">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="tagline text-lg">Special Care</p>
            <h2 className="mt-2 text-balance font-heading text-3xl font-extrabold text-primary md:text-4xl">
              Specialised Programs for Complex Needs
            </h2>
            <p className="mt-4 leading-relaxed text-ink-light md:text-lg">
              Some conditions ask more of a caregiver — clinical skill, specific training and
              endless patience. Our six specialty programs pair experienced staff with structured
              care plans, so families never face post-surgery recovery, dementia, stroke or
              palliative journeys alone.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Specialty blocks */}
      {specialties.map((specialty, i) => {
        const isEven = i % 2 === 0
        return (
          <section
            key={specialty.slug}
            id={specialty.slug}
            className={cn(
              'section-padding scroll-mt-32 md:scroll-mt-36',
              isEven ? 'bg-white' : 'bg-surface'
            )}
          >
            <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <AnimatedSection className={isEven ? undefined : 'lg:order-2'}>
                <img
                  src={specialty.image}
                  alt={`${specialty.name} at home with a Dhrishta care professional`}
                  className="w-full rounded-card shadow-card"
                  loading="lazy"
                />
              </AnimatedSection>

              <AnimatedSection delay={0.1} className={isEven ? undefined : 'lg:order-1'}>
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${COLOR_STYLES[specialty.color] || COLOR_STYLES.primary}`}
                  >
                    <ServiceIcon name={specialty.icon} className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h2 className="font-heading text-2xl font-extrabold text-primary md:text-3xl">
                    {specialty.name}
                  </h2>
                </div>

                <p className="mt-4 leading-relaxed text-ink-light">{specialty.overview}</p>

                <h3 className="mt-6 font-heading text-lg font-bold text-primary">Our Approach</h3>
                <p className="mt-2 leading-relaxed text-ink-light">{specialty.approach}</p>

                <h3 className="mt-6 font-heading text-lg font-bold text-primary">
                  Care Plan Includes
                </h3>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {specialty.carePlan.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-ink-light">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <figure className="mt-6 rounded-card border-l-4 border-secondary bg-secondary-50 p-5">
                  <figcaption className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wide text-secondary-700">
                    <Quote className="h-4 w-4" aria-hidden="true" />
                    Success Story
                  </figcaption>
                  <blockquote className="mt-2 text-sm italic leading-relaxed text-ink">
                    {specialty.successStory}
                  </blockquote>
                </figure>

                <Link
                  to="/book-consultation"
                  className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'mt-7')}
                  aria-label={`Book a free consultation for ${specialty.name}`}
                >
                  Book Free Consultation
                  <ArrowRight aria-hidden="true" />
                </Link>
              </AnimatedSection>
            </div>
          </section>
        )
      })}
    </>
  )
}
