import { ClipboardList, Headphones, PhoneCall, UserCheck } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import { Badge } from '@/components/ui/badge'

const STEPS = [
  {
    icon: PhoneCall,
    title: 'Consultation',
    subtitle: 'Free assessment',
    description:
      'Call or book online — our care coordinator visits your home for a free needs assessment.',
  },
  {
    icon: ClipboardList,
    title: 'Care Plan',
    subtitle: 'Customized plan',
    description:
      'We design a personalised care plan with clear schedules, staffing and transparent costs.',
  },
  {
    icon: UserCheck,
    title: 'Staff Assignment',
    subtitle: 'Matched caregiver',
    description:
      'A verified caregiver or nurse — matched to your needs and language — begins care at home.',
  },
  {
    icon: Headphones,
    title: 'Ongoing Support',
    subtitle: '24/7 monitoring',
    description:
      'Supervisor reviews, health reports and a 24/7 helpline keep care on track, every day.',
  },
]

/** Four-step process, numbered circles connected by a dashed line on desktop. */
export default function HowItWorks() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          tagline="How It Works"
          title="Getting Care is Simple"
          subtitle="From your first call to ongoing support — a clear, four-step journey to dependable home care."
        />

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-secondary-200 lg:block"
            aria-hidden="true"
          />

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <li key={step.title} className="relative">
                  <AnimatedSection delay={i * 0.1} className="text-center">
                    <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-heading text-2xl font-extrabold text-white shadow-card">
                      {i + 1}
                    </div>
                    <div className="mt-5 rounded-card border border-slate-100 bg-white p-6 shadow-card">
                      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-3 font-heading text-lg font-bold text-primary">
                        {step.title}
                      </h3>
                      <Badge variant="secondary" className="mt-2">
                        {step.subtitle}
                      </Badge>
                      <p className="mt-3 text-sm leading-relaxed text-ink-light">
                        {step.description}
                      </p>
                    </div>
                  </AnimatedSection>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
