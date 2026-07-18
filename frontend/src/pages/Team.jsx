import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, CalendarCheck, ShieldCheck } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/common/SectionHeading'
import AnimatedSection from '@/components/common/AnimatedSection'
import CategoryFilter from '@/components/gallery/CategoryFilter'
import TeamGrid from '@/components/team/TeamGrid'
import { buttonVariants } from '@/components/ui/button'
import { team, teamCategories } from '@/data/team'

const FILTERS = [{ id: 'all', label: 'All' }, ...teamCategories]

export default function Team() {
  const [category, setCategory] = useState('all')
  const filtered = category === 'all' ? team : team.filter((member) => member.category === category)

  return (
    <>
      <Seo
        title="Our Team"
        description="Meet the Dhrishta Healthcare team — doctors, nurses, caregivers, physiotherapists and support staff, all background-verified, trained and insured."
      />
      <PageHeader
        title="Our Team"
        subtitle="The doctors, nurses, caregivers and coordinators behind every Dhrishta care plan."
        crumbs={[{ label: 'Team' }]}
      />

      {/* Team grid with category filter */}
      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="The people behind the promise"
            title="Meet Our Care Professionals"
            subtitle="Filter by role to find the specialists who will be caring for your family."
          />
          <AnimatedSection>
            <CategoryFilter
              categories={FILTERS}
              active={category}
              onChange={setCategory}
              className="mb-10"
            />
          </AnimatedSection>
          <TeamGrid members={filtered} />
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-secondary-50">
        <div className="container-site">
          <AnimatedSection className="flex flex-col items-center gap-5 py-10 text-center md:flex-row md:text-left">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-secondary shadow-card">
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-extrabold text-primary">
                Care you can trust
              </h2>
              <p className="mt-1 text-ink-light">
                Every member of our team is background-verified, trained and insured — so your family
                is always in safe, capable hands.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-700 to-secondary-700 text-white">
        <div className="container-site text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              Want to join our team?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              We&rsquo;re always looking for compassionate nurses, caregivers and therapists. And if
              you&rsquo;re seeking care for a loved one, our team is ready to help.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/careers" className={buttonVariants({ variant: 'accent', size: 'lg' })}>
                <Briefcase aria-hidden="true" /> View Open Roles
              </Link>
              <Link
                to="/book-consultation"
                className={buttonVariants({ variant: 'outline-white', size: 'lg' })}
              >
                <CalendarCheck aria-hidden="true" /> Book a Consultation
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
