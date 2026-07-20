import { Link } from 'react-router-dom'
import { ArrowRight, CalendarCheck, CheckCircle2 } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/common/SectionHeading'
import AnimatedSection from '@/components/common/AnimatedSection'
import CallButton from '@/components/common/CallButton'
import ServiceCategories from '@/components/services/ServiceCategories'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'

/** Guarantees that come with every service (per architecture doc §3). */
const SERVICE_PROMISES = [
  { title: 'Detailed description', text: 'Every service page explains exactly what the care covers.' },
  { title: 'Free assessment', text: 'A no-cost home assessment before any care begins.' },
  { title: 'Verified staff', text: 'Background-checked, trained and insured professionals.' },
  { title: 'Transparent pricing', text: 'Clear starting prices — your final quote follows the care plan.' },
  { title: 'Booking support', text: 'Guided booking over phone, WhatsApp or online.' },
]

export default function Services() {
  return (
    <>
      <Seo
        title="Our Services"
        description="Explore Dhrishta Healthcare's home care services in Chittoor — personal care, home nursing, elder care, patient care, child care and day care."
      />
      <PageHeader
        title="Our Services"
        subtitle="Professional, compassionate healthcare delivered at home — for every age and every need."
        crumbs={[{ label: 'Services' }]}
      />

      {/* All six core services */}
      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="What we offer"
            title="Care for Every Need"
            subtitle="Personal care, home nursing, caregiving, patient care takers, child care with medicine reminders, and day care — with 24/7 care and support, experienced staff, nurses and physiotherapists available at all times, and comprehensive health protection."
          />
          <ServiceCategories />
        </div>
      </section>

      {/* Specialties band */}
      <section className="bg-surface">
        <div className="container-site">
          <AnimatedSection className="flex flex-col items-center justify-between gap-6 py-10 text-center md:flex-row md:text-left">
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-primary">
                Looking for specialized care?
              </h2>
              <p className="mt-1 text-ink-light">
                Post-surgery recovery, dementia care, stroke rehabilitation, palliative support and
                more.
              </p>
            </div>
            <Link
              to="/specialties"
              className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'shrink-0')}
            >
              Explore Specialties <ArrowRight aria-hidden="true" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Every service includes */}
      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="Our promise"
            title="Every Service Includes"
            subtitle="Whichever service you choose, these essentials are always part of the package."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SERVICE_PROMISES.map((promise, i) => (
              <AnimatedSection key={promise.title} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <Card className="h-full p-5">
                  <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
                  <h3 className="mt-3 font-heading text-base font-bold text-primary">
                    {promise.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-light">{promise.text}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-700 to-secondary-700 text-white">
        <div className="container-site text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              Not sure which service fits?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Book a free consultation and our care coordinator will assess your needs and recommend
              the right plan — no obligation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/book-consultation"
                className={buttonVariants({ variant: 'gold', size: 'lg' })}
              >
                <CalendarCheck aria-hidden="true" /> Book Free Consultation
              </Link>
              <CallButton size="lg" className="bg-white text-primary hover:bg-slate-100" />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
