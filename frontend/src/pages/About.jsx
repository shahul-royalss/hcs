import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Eye,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Home,
  ShieldCheck,
  Stethoscope,
  Target,
  Trophy,
  Umbrella,
  Users,
} from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import CallButton from '@/components/common/CallButton'
import { buttonVariants } from '@/components/ui/button'
import { team } from '@/data/team'
import { cn } from '@/utils/cn'

/* Our Specialties — exactly as on the Dhrishta brochure */
const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: 'Safe, Hygienic and Clean Environment',
    description: 'Strict hygiene and cleanliness standards in every home and care setting we serve.',
  },
  {
    icon: HeartHandshake,
    title: 'Care with Love and Compassion',
    description: 'We care for every patient the way we would care for our own parents and children.',
  },
  {
    icon: Award,
    title: 'Reliable and Trustworthy Services',
    description: 'Dependable, verified professionals your family can trust — on time, every time.',
  },
  {
    icon: Home,
    title: 'Homely Care Like Home',
    description: 'Warm, familiar, family-style care that makes every patient feel truly at home.',
  },
]

const WHY_US = [
  {
    icon: BadgeCheck,
    title: 'Quality Assurance',
    description:
      'Every care plan is reviewed by our medical director and audited through scheduled supervisor visits. Daily care logs and weekly health reports keep the quality of care measurable and accountable to your family.',
  },
  {
    icon: GraduationCap,
    title: 'Certifications',
    description:
      'Our nurses hold GNM or B.Sc Nursing qualifications and our caregivers complete certified home-health-aide training. Regular refresher programs in first aid, BLS and infection control keep skills current.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Protocols',
    description:
      'Strict hygiene standards, fall-prevention checks and defined emergency escalation paths are followed in every home we serve. Each patient has a documented safety plan from day one.',
  },
  {
    icon: Umbrella,
    title: 'Insurance Coverage',
    description:
      'Our staff are insured while on duty, and we help families prepare the care documentation needed for health-insurance and reimbursement claims — one less thing to worry about.',
  },
]

const CREDENTIALS = [
  {
    icon: FileCheck2,
    title: 'Clinical Establishment Registration',
    description: 'Registered home-care operations under the Andhra Pradesh clinical establishments framework.',
  },
  {
    icon: Stethoscope,
    title: 'Nursing Council Registered Staff',
    description: 'Our nursing team members are registered with state nursing councils (GNM / B.Sc RN).',
  },
  {
    icon: HeartPulse,
    title: 'First-Aid & BLS Certified Team',
    description: 'Care staff complete certified first-aid and Basic Life Support training with periodic renewals.',
  },
  {
    icon: ShieldCheck,
    title: 'Background-Verified Staff',
    description: 'Police verification and reference checks are completed for every caregiver before their first assignment.',
  },
  {
    icon: BadgeCheck,
    title: 'Documented Quality Processes',
    description: 'ISO-style, documented care procedures — from onboarding assessments to incident reporting and reviews.',
  },
  {
    icon: Trophy,
    title: 'Awards & Recognition',
    description: 'Recognised by families and local community organisations in Chittoor for dependable elder and patient care.',
  },
]

/** About page — story, mission, values, credentials and team preview. */
export default function About() {
  const leadership = team.filter((member) => member.roleCategory === 'leadership')
  const medicalCount = team.filter((member) => member.roleCategory === 'medical').length
  const supportCount = team.filter((member) => member.roleCategory === 'support').length

  return (
    <>
      <Seo
        title="About Us"
        description="Learn about Dhrishta Health Care Services — 10+ years of trusted home healthcare in Chittoor, 50+ professionals, 500+ families served. Our story, mission, values and credentials."
      />
      <PageHeader
        title="About Dhrishta Health Care Services"
        subtitle="A decade of compassionate, professional healthcare — delivered in the homes of Chittoor's families."
        crumbs={[{ label: 'About' }]}
      />

      {/* Company story */}
      <section className="section-padding bg-white">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <img
              src="/images/about-story.svg"
              alt="The Dhrishta care team through the years, from a small nursing group to a full team"
              className="w-full rounded-card shadow-card"
              loading="lazy"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <SectionHeading
              align="left"
              tagline="Our Journey"
              title="From a Small Nursing Team to Chittoor's Trusted Care Partner"
              className="mb-6"
            />
            <ul className="mb-6 space-y-3 rounded-card border border-secondary-200 bg-secondary-50 p-5">
              <li className="flex items-start gap-3 leading-relaxed text-ink">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                We believe that the health, safety and happiness of your family members is our
                responsibility and we serve with love and trust.
              </li>
              <li className="flex items-start gap-3 leading-relaxed text-ink">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                For elders at home, people who are sick, and those who need special care — we
                provide the best services through experienced doctors and nurses.
              </li>
            </ul>
            <div className="space-y-4 leading-relaxed text-ink-light">
              <p>
                Dhrishta Health Care Services began in Chittoor more than ten years ago with a
                simple belief: families should never have to choose between quality medical care
                and the comfort of home. What started as a small team of dedicated nurses making
                home visits has grown into one of the region&rsquo;s most trusted home-healthcare
                providers.
              </p>
              <p>
                Today, our family of 50+ healthcare professionals — doctors, nurses, caregivers
                and physiotherapists — serves more than 500 families across Chittoor and the
                surrounding areas. From newborn care to elderly companionship, from post-surgical
                recovery to palliative support, we bring hospital-grade care to the place patients
                heal best: home.
              </p>
              <p>
                Through every stage of our growth, one thing has never changed — we treat every
                patient like our own family. That promise lives in our tagline:{' '}
                <span className="tagline text-base">Your Family... Our Care and Responsibility.</span>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission, vision & core values */}
      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            tagline="What Drives Us"
            title="Our Mission, Vision & Values"
            subtitle="The principles that guide every visit, every care plan and every decision we make."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <AnimatedSection className="h-full">
              <div className="h-full rounded-card border border-slate-100 bg-white p-8 shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-primary">Our Mission</h3>
                <p className="mt-2 leading-relaxed text-ink-light">
                  To make professional, compassionate healthcare accessible in every home —
                  delivered with dignity, transparency and genuine human warmth.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="h-full">
              <div className="h-full rounded-card border border-slate-100 bg-white p-8 shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                  <Eye className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-primary">Our Vision</h3>
                <p className="mt-2 leading-relaxed text-ink-light">
                  To be Andhra Pradesh&rsquo;s most trusted home-healthcare partner — where every
                  family finds care they can rely on without leaving home.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_VALUES.map((value, i) => {
              const Icon = value.icon
              return (
                <AnimatedSection key={value.title} delay={i * 0.08} className="h-full">
                  <div className="h-full rounded-card border border-slate-100 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold text-primary">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-light">{value.description}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why us (detailed) */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <SectionHeading
            tagline="Why Us"
            title="The Standards Behind Our Care"
            subtitle="Trust is earned through systems, not promises. Here is what stands behind every Dhrishta caregiver."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {WHY_US.map((reason, i) => {
              const Icon = reason.icon
              return (
                <AnimatedSection key={reason.title} delay={i * 0.08} className="h-full">
                  <div className="flex h-full items-start gap-5 rounded-card border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-primary">{reason.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-light">{reason.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="section-padding bg-surface">
        <div className="container-site">
          <SectionHeading
            tagline="Our Team"
            title="The People Behind the Care"
            subtitle="Led by experienced clinicians and coordinators — supported by a wider family of verified care professionals."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {leadership.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.08} className="h-full">
                <div className="flex h-full items-start gap-5 rounded-card border border-slate-100 bg-white p-6 shadow-card">
                  <img
                    src={member.photo}
                    alt={`Portrait of ${member.name}, ${member.designation}`}
                    className="h-20 w-20 shrink-0 rounded-full border-2 border-secondary-100 bg-surface"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-heading text-lg font-bold text-primary">{member.name}</h3>
                    <p className="text-sm font-semibold text-secondary">{member.designation}</p>
                    <p className="mt-0.5 text-xs text-ink-light">
                      {member.qualifications} &middot; {member.experience}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-light">{member.bio}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.15}>
            <div className="mt-6 flex flex-col items-center gap-4 rounded-card border border-slate-100 bg-white p-6 text-center shadow-card sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                  <Users className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-ink-light">
                  Our core roster includes{' '}
                  <strong className="text-primary">{medicalCount} senior medical professionals</strong>{' '}
                  and <strong className="text-primary">{supportCount} dedicated support staff</strong>{' '}
                  — part of a wider team of 50+ verified nurses and caregivers serving Chittoor.
                </p>
              </div>
              <Link
                to="/team"
                className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'shrink-0')}
              >
                Meet the Full Team
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Licenses & certifications */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <SectionHeading
            tagline="Credentials"
            title="Licenses & Certifications"
            subtitle="The registrations, training and verification standards that stand behind our name."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CREDENTIALS.map((credential, i) => {
              const Icon = credential.icon
              return (
                <AnimatedSection key={credential.title} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-card border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-50 text-success">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-heading font-bold text-primary">{credential.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-light">
                      {credential.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gradient-to-r from-primary via-primary-700 to-secondary-700 text-white">
        <div className="container-site py-14 md:py-16">
          <AnimatedSection>
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">
                  Your Family&rsquo;s Health is Our Responsibility
                </h2>
                <p className="mt-2 max-w-xl text-white/85">
                  Book a free consultation and our care coordinator will visit your home to build
                  the right plan for your loved one.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/book-consultation"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-white text-primary shadow-lg hover:bg-primary-50 hover:text-primary'
                  )}
                >
                  Book Free Consultation
                  <ArrowRight aria-hidden="true" />
                </Link>
                <CallButton size="lg" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
