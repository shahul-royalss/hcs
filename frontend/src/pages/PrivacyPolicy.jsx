import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import { siteConfig } from '@/data/siteConfig'

const LAST_UPDATED = '1 July 2026'

function PolicySection({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl font-bold text-primary">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink md:text-base">{children}</div>
    </section>
  )
}

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Dhrishta Healthcare Services collects, uses and protects your personal and health information."
      />
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use and protect your family's information."
        crumbs={[{ label: 'Privacy Policy' }]}
      />

      <section className="section-padding">
        <div className="container-site max-w-3xl">
          <p className="text-sm text-ink-light">Last updated: {LAST_UPDATED}</p>

          <p className="mt-6 leading-relaxed text-ink md:text-base">
            Dhrishta Healthcare Services (&ldquo;Dhrishta&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
            provides home healthcare services in and around Chittoor, Andhra Pradesh. Because our
            work involves the health of your family members, we treat the information you share with
            us with the same seriousness as the care itself. This policy explains what we collect,
            why, and the choices you have. We design our practices to align with India&rsquo;s
            Digital Personal Data Protection Act, 2023 (DPDP Act).
          </p>

          <PolicySection title="Information We Collect">
            <p>
              <strong>Contact information</strong> — your name, phone number, email address and home
            address, collected when you submit an enquiry, request a callback or make a booking.
            </p>
            <p>
              <strong>Patient health information</strong> — the patient&rsquo;s name, age, gender,
              medical condition and special requirements that you provide during booking. We collect
              only what is needed to plan safe, appropriate care and to brief the assigned caregiver
              or nurse.
            </p>
            <p>
              <strong>Service records</strong> — booking history, schedules, care notes and payment
              records generated while we serve you.
            </p>
          </PolicySection>

          <PolicySection title="How We Use It">
            <p>We use your information to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>respond to enquiries and confirm bookings;</li>
              <li>create and manage a personalised care plan for the patient;</li>
              <li>match, brief and supervise the caregivers and nurses assigned to you;</li>
              <li>send service confirmations and updates by phone, SMS, email or WhatsApp;</li>
              <li>generate invoices and process payments; and</li>
              <li>improve our services and meet legal or regulatory obligations.</li>
            </ul>
            <p>We do not use your data for third-party advertising.</p>
          </PolicySection>

          <PolicySection title="Health-Data Confidentiality">
            <p>
              Patient health information is shared strictly on a need-to-know basis: with the care
              team assigned to the patient, their supervising coordinator, and — where you ask us to
              — the treating physician. All staff sign confidentiality undertakings, and access to
              patient records is restricted and logged.
            </p>
          </PolicySection>

          <PolicySection title="Cookies & Analytics">
            <p>
              Our website uses only essential cookies needed for it to function (for example,
              keeping an admin session signed in). If we introduce analytics, they will be
              privacy-respecting and aggregate — we do not track individual visitors across other
              websites.
            </p>
          </PolicySection>

          <PolicySection title="Data Sharing">
            <p>
              We never sell your personal or health information. We share it only with: (a) the care
              team serving your family, (b) service providers who help us operate (such as payment
              and messaging providers) under contractual confidentiality, and (c) authorities where
              disclosure is required by law or to protect a patient&rsquo;s vital interests.
            </p>
          </PolicySection>

          <PolicySection title="Retention">
            <p>
              We keep booking and care records for as long as needed to provide services, meet
              healthcare record-keeping norms, resolve disputes and comply with tax and legal
              requirements. When information is no longer needed, we delete or anonymise it
              securely.
            </p>
          </PolicySection>

          <PolicySection title="Your Rights">
            <p>Subject to applicable law, you can:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>ask what personal data we hold about you and request a copy;</li>
              <li>request correction of inaccurate or incomplete data;</li>
              <li>request deletion of data we no longer need to retain;</li>
              <li>withdraw consent for optional communications at any time; and</li>
              <li>raise a grievance about how your data is handled.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Contact for Privacy Requests">
            <p>
              For any privacy question, request or grievance, write to us at{' '}
              <a href={`mailto:${siteConfig.email}?subject=Privacy%20request`} className="font-semibold text-secondary underline">
                {siteConfig.email}
              </a>{' '}
              or call {siteConfig.phoneDisplay}. We aim to acknowledge privacy requests within 72
              hours and resolve them within 30 days.
            </p>
          </PolicySection>
        </div>
      </section>
    </>
  )
}
