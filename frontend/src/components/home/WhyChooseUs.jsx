import {
  Activity,
  Award,
  Clock,
  HeartPulse,
  Home,
  ShieldCheck,
  Siren,
  Stethoscope,
} from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import { cn } from '@/utils/cn'

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
    title: '24/7 Care and Support',
    description: 'Round-the-clock care and a helpline that always answers, day or night.',
  },
  {
    icon: Stethoscope,
    title: 'Nurses & Physiotherapists at All Times',
    description: 'Qualified nurses and physiotherapists available whenever your care plan needs them.',
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
  {
    icon: HeartPulse,
    title: 'Comprehensive Health Protection',
    description: 'End-to-end care that looks after the whole person — body, comfort and peace of mind.',
  },
]

/**
 * S5 · "Floating islands" — assurances drifting at slightly different depths
 * in soft fog. Staggered offsets + slow idle float give the field gentle life.
 */
export default function WhyChooseUs() {
  return (
    <section className="section-padding relative overflow-hidden bg-surface">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90% 60% at 15% 10%, rgba(167,211,206,0.25), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="container-site relative">
        <SectionHeading
          tagline="Why Dhrishta"
          title="Care you can count on"
          subtitle="We combine professional skill with genuine warmth — and back it up with systems that keep your loved ones safe."
        />

        <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-14">
          <AnimatedSection className="hidden lg:sticky lg:top-28 lg:col-span-2 lg:block">
            <div className="relative overflow-hidden rounded-[2rem] shadow-card ring-1 ring-ivory-300">
              <img
                src="/images/why-us.svg"
                alt="A caregiver assisting a smiling senior at home"
                className="w-full motion-safe:animate-breathe"
                loading="lazy"
              />
              <div className="light-shaft absolute -top-10 left-[10%] h-[120%] w-40" aria-hidden="true" />
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              const isLast = i === FEATURES.length - 1
              return (
                <AnimatedSection
                  key={feature.title}
                  delay={i * 0.05}
                  className={cn(
                    isLast && 'sm:col-span-2',
                    // Islands drift at different depths — alternate columns offset on desktop
                    !isLast && i % 2 === 1 && 'sm:translate-y-4'
                  )}
                >
                  <div
                    className="glass flex h-full items-start gap-4 rounded-card p-5 transition-transform duration-300 ease-out hover:-translate-y-1 motion-safe:animate-float-slow"
                    style={{ animationDelay: `${(i % 3) * 1.8}s`, animationDuration: `${6.5 + (i % 3)}s` }}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
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
