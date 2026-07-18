import { Link } from 'react-router-dom'
import { CalendarCheck, Info } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/common/SectionHeading'
import AnimatedSection from '@/components/common/AnimatedSection'
import CallButton from '@/components/common/CallButton'
import PackageCard from '@/components/packages/PackageCard'
import PackageComparison from '@/components/packages/PackageComparison'
import { Accordion } from '@/components/ui/accordion'
import { buttonVariants } from '@/components/ui/button'
import { packages } from '@/data/packages'

const PACKAGE_FAQS = [
  {
    id: 'switch',
    title: 'Can I switch or upgrade my package later?',
    content:
      'Yes. You can move between hourly, daily, weekly and monthly plans at any time with a short notice — your care coordinator adjusts the schedule and staff assignment, and billing is simply pro-rated from the switch date.',
  },
  {
    id: 'commitment',
    title: 'Is there a minimum commitment?',
    content:
      'Hourly Care has a 4-hour minimum per visit; the other packages have no lock-in beyond their billing cycle. You can pause or stop at the end of any cycle, and we only ask for 24 hours notice so we can inform the assigned caregiver.',
  },
  {
    id: 'final-price',
    title: 'How is the final price decided?',
    content:
      'Listed prices are indicative starting points. After your free home assessment we prepare a care plan covering the patient’s condition, hours needed and staff type (caregiver vs certified nurse) — the final quote is based on that plan, with no hidden charges.',
  },
]

export default function Packages() {
  return (
    <>
      <Seo
        title="Service Packages"
        description="Flexible home healthcare packages from Dhrishta — hourly, daily, weekly, monthly and fully custom care plans with transparent pricing."
      />
      <PageHeader
        title="Service Packages"
        subtitle="Flexible plans that grow with your family's needs — from a few hours of help to complete monthly home healthcare."
        crumbs={[{ label: 'Packages' }]}
      />

      {/* Package cards */}
      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="Plans for every family"
            title="Choose the Care Plan That Fits"
            subtitle="Every package is delivered by verified staff and starts with a free care assessment. Not sure which one? Start with a consultation and we'll recommend the right fit."
          />
          <div className="grid gap-6 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <AnimatedSection key={pkg.id} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                <PackageCard pkg={pkg} featured={pkg.popular} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            tagline="Side by side"
            title="Compare Packages"
            subtitle="See exactly what each plan includes before you decide."
          />
          <AnimatedSection>
            <PackageComparison />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-card border border-primary-100 bg-primary-50 p-4 text-sm leading-relaxed text-primary">
              <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              All packages include free assessment &amp; verified staff. Prices are indicative — you
              receive a final quote after the care assessment.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Common questions */}
      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="Good to know"
            title="Package Questions"
            subtitle="Quick answers to what families ask us most about plans and pricing."
          />
          <AnimatedSection>
            <Accordion items={PACKAGE_FAQS} defaultOpenId="switch" className="mx-auto max-w-3xl" />
          </AnimatedSection>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-700 to-secondary-700 text-white">
        <div className="container-site text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              Start with a free care assessment
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Tell us about your loved one and we&rsquo;ll recommend the right package — with a
              transparent, no-obligation quote.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/book-consultation"
                className={buttonVariants({ variant: 'accent', size: 'lg' })}
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
