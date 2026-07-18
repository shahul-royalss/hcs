import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import { siteConfig } from '@/data/siteConfig'

const LAST_UPDATED = '1 July 2026'

function TermsSection({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl font-bold text-primary">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink md:text-base">{children}</div>
    </section>
  )
}

export default function TermsConditions() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Service, booking, cancellation, refund and payment terms for Dhrishta Healthcare Services."
      />
      <PageHeader
        title="Terms & Conditions"
        subtitle="The terms that apply when you book and use Dhrishta home healthcare services."
        crumbs={[{ label: 'Terms & Conditions' }]}
      />

      <section className="section-padding">
        <div className="container-site max-w-3xl">
          <p className="text-sm text-ink-light">Last updated: {LAST_UPDATED}</p>

          <p className="mt-6 leading-relaxed text-ink md:text-base">
            These terms govern the services provided by Dhrishta Healthcare Services
            (&ldquo;Dhrishta&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) to you and the patient you
            book care for. By making a booking — online, by phone or on WhatsApp — you accept these
            terms.
          </p>

          <TermsSection title="Service Terms">
            <p>
              Every engagement begins with an assessment. Our care plans are prepared after a free
              home assessment by our coordinator, and the services delivered follow that agreed care
              plan. Care plans can be revised as the patient&rsquo;s needs change.
            </p>
            <p>
              <strong>Staff assignment &amp; replacement.</strong> We assign caregivers and nurses
              based on the care plan and your stated preferences. If you are not comfortable with an
              assigned staff member, tell us within the first 3 days and we will replace them free
              of charge. If an assigned staff member is unavailable (leave, illness), we provide a
              suitable replacement so care is not interrupted.
            </p>
          </TermsSection>

          <TermsSection title="Booking Terms">
            <p>
              Bookings can be made through our website, by phone or on WhatsApp. An advance payment
              at the time of booking is optional — you may choose &ldquo;pay later&rdquo; and settle
              after the service begins, as per your package terms.
            </p>
            <p>
              After you book, our coordinator calls you to confirm details, schedules the free
              assessment, and then confirms the start of care. A booking is considered confirmed
              only after this confirmation call.
            </p>
          </TermsSection>

          <TermsSection title="Cancellation Policy">
            <p>
              You can cancel or reschedule up to 12 hours before a scheduled visit at no charge.
              Cancellations within 12 hours may incur a one-visit charge. Long-term packages can be
              paused or discontinued with 3 days&rsquo; notice.
            </p>
          </TermsSection>

          <TermsSection title="Refund Policy">
            <p>
              Unused prepaid amounts are refunded to the original payment method within 5–7 working
              days after deducting charges for services already delivered. Booking advances are
              adjusted against your first invoice; if care does not commence for reasons
              attributable to us, the advance is refunded in full.
            </p>
          </TermsSection>

          <TermsSection title="Payments & Invoicing">
            <p>
              We accept UPI, debit/credit cards, net banking and cash. A detailed invoice is
              generated for every billing cycle and shared by email/WhatsApp. Charges follow the
              rate card or package agreed at booking; any change is communicated before it applies.
              Online advance payments are processed securely by our payment provider — we do not
              store your card details.
            </p>
          </TermsSection>

          <TermsSection title="Liability & Scope of Service">
            <p>
              Dhrishta provides home-based care support — nursing procedures under physician
              guidance, caregiving, companionship and related services. We are not a hospital, and
              our services are not a replacement for hospital treatment, intensive care or emergency
              medicine. In a medical emergency, call 108 and follow your doctor&rsquo;s advice; our
              team will support and coordinate but cannot substitute for emergency services.
            </p>
            <p>
              Our staff follow the treating physician&rsquo;s prescriptions and the agreed care
              plan. Dhrishta&rsquo;s liability for any claim is limited to the fees paid for the
              service period in which the claim arose, except where the law provides otherwise.
            </p>
          </TermsSection>

          <TermsSection title="Governing Law">
            <p>
              These terms are governed by the laws of India. Any dispute is subject to the exclusive
              jurisdiction of the courts at Chittoor, Andhra Pradesh.
            </p>
          </TermsSection>

          <TermsSection title="Questions">
            <p>
              Questions about these terms? Write to{' '}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-secondary underline">
                {siteConfig.email}
              </a>{' '}
              or call {siteConfig.phoneDisplay}.
            </p>
          </TermsSection>
        </div>
      </section>
    </>
  )
}
