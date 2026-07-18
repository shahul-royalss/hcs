import { Clock, ShieldCheck, Wallet } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import BookingForm from '@/components/booking/BookingForm'

const REASSURANCES = [
  { icon: ShieldCheck, title: 'Verified staff', text: 'Background-checked, trained professionals' },
  { icon: Clock, title: 'Response in 2 hours', text: 'A coordinator calls you back the same day' },
  { icon: Wallet, title: 'Pay after service', text: 'Advance payment is completely optional' },
]

export default function BookConsultation() {
  return (
    <>
      <Seo
        title="Book a Consultation"
        description="Book a free home-care consultation with Dhrishta Healthcare — no obligation. Tell us what you need and we'll match the right caregiver."
      />
      <PageHeader
        title="Book a Consultation"
        subtitle="Free assessment • No obligation"
        crumbs={[{ label: 'Book a Consultation' }]}
      />

      <section className="section-padding bg-surface/50">
        <div className="container-site">
          <AnimatedSection>
            <div className="mx-auto mb-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              {REASSURANCES.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-card"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-primary">{title}</p>
                    <p className="mt-0.5 text-xs text-ink-light">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <BookingForm />
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
