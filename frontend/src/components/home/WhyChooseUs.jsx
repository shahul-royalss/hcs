import {
  Activity,
  Award,
  Clock,
  Home,
  ShieldCheck,
  Siren,
  Stethoscope,
} from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'

const FEATURES = [
  {
    icon: Award,
    title: 'Experienced Staff',
    description: 'Over a decade of home-care experience across elder, patient and child care.',
  },
  {
    icon: Stethoscope,
    title: 'Certified Nurses',
    description: 'GNM and B.Sc qualified nurses handle clinical procedures safely at home.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Caregivers',
    description: 'Every caregiver is background-checked, reference-verified and trained.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'A round-the-clock helpline for care questions and urgent needs.',
  },
  {
    icon: Home,
    title: 'Safe Environment',
    description: 'Strict hygiene, infection-control and fall-prevention protocols in every home.',
  },
  {
    icon: Siren,
    title: 'Emergency Assistance',
    description: 'A rapid-response team ready for medical emergencies, day or night.',
  },
  {
    icon: Activity,
    title: 'Health Monitoring',
    description: 'Regular vitals tracking with transparent daily reports to your family.',
  },
]

/** Seven reasons families choose Dhrishta, with a supporting illustration. */
export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionHeading
          tagline="Why Choose Us"
          title="Care You Can Count On"
          subtitle="We combine professional skill with genuine warmth — and back it up with systems that keep your loved ones safe."
        />

        <div className="grid items-center gap-10 lg:grid-cols-5 lg:gap-14">
          <AnimatedSection className="hidden lg:col-span-2 lg:block">
            <img
              src="/images/why-us.svg"
              alt="A caregiver assisting a smiling senior at home"
              className="w-full rounded-card shadow-card"
              loading="lazy"
            />
          </AnimatedSection>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              const isLast = i === FEATURES.length - 1
              return (
                <AnimatedSection
                  key={feature.title}
                  delay={i * 0.05}
                  className={isLast ? 'sm:col-span-2' : undefined}
                >
                  <div className="flex h-full items-start gap-4 rounded-card border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-primary">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
