import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, IndianRupee, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/hooks/useBooking'
import { getServiceBySlug } from '@/data/services'
import { getSpecialtyBySlug } from '@/data/specialties'
import { packages } from '@/data/packages'
import { formatINR, formatDate } from '@/utils/formatters'

function SummarySection({ title, step, onEdit, rows }) {
  return (
    <section className="rounded-xl border border-slate-100 bg-surface/60 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-primary">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-secondary hover:bg-secondary-50"
          aria-label={`Edit ${title}`}
        >
          <Pencil className="h-3 w-3" aria-hidden="true" /> Edit
        </button>
      </div>
      <dl className="space-y-1.5">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-2">
              <dt className="w-40 shrink-0 text-ink-light">{label}</dt>
              <dd className="font-medium text-ink">{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  )
}

/** Step 6 — review everything, see the estimated cost, accept the terms. */
export default function ReviewConfirm() {
  const { data, updateData, nextStep, prevStep, goToStep } = useBooking()

  const service = getServiceBySlug(data.serviceSlug)
  const pkg = packages.find((p) => p.type === data.packageType)
  const specialty = getSpecialtyBySlug(data.specialtySlug)

  const estimatedCost = pkg?.price
    ? `${formatINR(pkg.price)} ${pkg.priceUnit}`
    : 'Final quote after assessment'

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">Review your booking</h2>
        <p className="mt-1 text-sm text-ink-light">
          Check everything below — you can edit any section before confirming.
        </p>
      </div>

      <div className="space-y-4">
        <SummarySection
          title="Service & Package"
          step={1}
          onEdit={goToStep}
          rows={[
            ['Service', service?.name],
            ['Package', pkg?.name],
            ['Specialty', specialty?.name || 'None'],
          ]}
        />
        <SummarySection
          title="Patient"
          step={2}
          onEdit={goToStep}
          rows={[
            ['Name', data.patient.name],
            ['Age', data.patient.age ? `${data.patient.age} years` : ''],
            ['Gender', data.patient.gender],
            ['Medical condition', data.patient.medicalCondition],
            ['Special requirements', data.patient.specialRequirements],
          ]}
        />
        <SummarySection
          title="Contact"
          step={3}
          onEdit={goToStep}
          rows={[
            ['Name', data.contact.name],
            ['Relationship', data.contact.relationship],
            ['Phone', data.contact.phone],
            ['Email', data.contact.email],
            ['Address', data.contact.address],
            ['Pincode', data.contact.pincode],
          ]}
        />
        <SummarySection
          title="Schedule"
          step={4}
          onEdit={goToStep}
          rows={[
            ['Start date', formatDate(data.schedule.startDate)],
            ['Time slot', data.schedule.timeSlot],
            ['Duration', data.schedule.duration],
            ['Urgency', data.schedule.urgency === 'urgent' ? 'Urgent' : 'Normal'],
          ]}
        />
        <SummarySection
          title="Preferences"
          step={5}
          onEdit={goToStep}
          rows={[
            ['Caregiver gender', data.staffPreference.gender || 'No preference'],
            ['Language', data.staffPreference.language || 'No preference'],
            ['Experience', data.staffPreference.experienceLevel || 'No preference'],
          ]}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <IndianRupee className="h-4 w-4 text-primary" aria-hidden="true" />
          Estimated cost
        </span>
        <span className="font-heading text-lg font-bold text-primary">{estimatedCost}</span>
      </div>

      <div>
        <label htmlFor="booking-terms" className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input
            id="booking-terms"
            type="checkbox"
            checked={data.termsAccepted}
            onChange={(e) => updateData({ termsAccepted: e.target.checked })}
            aria-invalid={data.termsAccepted ? undefined : 'true'}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#2d8b8b]"
          />
          <span>
            I agree to the{' '}
            <Link to="/terms-conditions" target="_blank" className="font-semibold text-secondary underline">
              Terms &amp; Conditions
            </Link>{' '}
            including the cancellation and refund policy.
          </span>
        </label>
        {!data.termsAccepted && (
          <p className="ml-7 mt-1 text-xs text-accent">Please accept the terms to continue</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <Button type="button" variant="ghost" onClick={prevStep}>
          <ArrowLeft aria-hidden="true" /> Back
        </Button>
        <Button
          type="button"
          disabled={!data.termsAccepted}
          onClick={() => {
            updateData({ termsAccepted: true })
            nextStep()
          }}
        >
          Continue to Payment <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
