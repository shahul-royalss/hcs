import { useState } from 'react'
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, PhoneCall, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CallButton from '@/components/common/CallButton'
import { useBooking } from '@/hooks/useBooking'
import { useToast } from '@/hooks/useToast'
import { bookingService } from '@/services/bookingService'
import { paymentService } from '@/services/paymentService'
import { apiErrorMessage } from '@/services/api'
import { formatINR } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const ADVANCE_AMOUNT = 500

const OPTIONS = [
  {
    id: 'advance',
    icon: CreditCard,
    title: `Pay booking advance now (${formatINR(ADVANCE_AMOUNT)})`,
    note: 'Card / UPI / Net Banking — secure payment via Stripe. Adjusted against your first invoice.',
  },
  {
    id: 'pay_later',
    icon: Wallet,
    title: 'Pay later',
    note: 'No payment now — pay after care begins, as per your package terms.',
  },
]

/** Build the snake_case API payload from the camelCase booking context. */
function buildPayload(data, mode, advanceAmount) {
  return {
    service_type: data.serviceSlug,
    package_type: data.packageType,
    specialty: data.specialtySlug || null,
    patient_info: {
      name: data.patient.name,
      age: Number(data.patient.age),
      gender: data.patient.gender,
      medical_condition: data.patient.medicalCondition,
      special_requirements: data.patient.specialRequirements || '',
    },
    contact_info: {
      name: data.contact.name,
      relationship: data.contact.relationship,
      phone: data.contact.phone,
      email: data.contact.email || '',
      address: data.contact.address,
      pincode: data.contact.pincode,
    },
    schedule: {
      start_date: data.schedule.startDate,
      time_slot: data.schedule.timeSlot,
      duration: data.schedule.duration,
      urgency: data.schedule.urgency,
    },
    staff_preference: {
      gender: data.staffPreference.gender || '',
      language: data.staffPreference.language || '',
      experience_level: data.staffPreference.experienceLevel || '',
    },
    payment: {
      mode,
      advance_amount: advanceAmount,
    },
  }
}

/** Step 7 — optional advance payment, then final booking confirmation. */
export default function Payment() {
  const { data, updateSection, setConfirmation, prevStep } = useBooking()
  const { toast } = useToast()
  const [mode, setMode] = useState(data.payment.mode || 'pay_later')
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)

  const confirmBooking = async () => {
    setSubmitting(true)
    setFailed(false)

    let finalMode = mode
    let advanceAmount = mode === 'advance' ? ADVANCE_AMOUNT : 0

    if (finalMode === 'advance') {
      try {
        const intent = await paymentService.createIntent({
          amount: ADVANCE_AMOUNT,
          currency: 'INR',
          purpose: 'booking_advance',
        })
        const usable = intent && !intent.disabled && (intent.client_secret || intent.id)
        if (!usable) throw new Error('payment_unavailable')
      } catch {
        toast.info(
          "Online payment isn't available right now — your booking will be confirmed with pay-later."
        )
        finalMode = 'pay_later'
        advanceAmount = 0
        setMode('pay_later')
      }
    }

    updateSection('payment', { mode: finalMode, advanceAmount })

    try {
      const response = await bookingService.create(buildPayload(data, finalMode, advanceAmount))
      setConfirmation(response)
    } catch (e) {
      setFailed(true)
      toast.error(apiErrorMessage(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">Almost done — payment</h2>
        <p className="mt-1 text-sm text-ink-light">
          Advance payment is completely optional. Most families choose to pay after care begins.
        </p>
      </div>

      <div role="radiogroup" aria-label="Payment option" className="space-y-3">
        {OPTIONS.map((option) => {
          const selected = mode === option.id
          const Icon = option.icon
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setMode(option.id)}
              className={cn(
                'flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all',
                selected
                  ? 'border-secondary bg-secondary-50 shadow-card'
                  : 'border-slate-200 bg-white hover:border-secondary-200'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  selected ? 'bg-secondary text-white' : 'bg-surface text-secondary'
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-heading font-bold text-primary">
                  {option.title}
                  {selected && <CheckCircle2 className="h-4 w-4 text-secondary" aria-hidden="true" />}
                </span>
                <span className="mt-0.5 block text-sm text-ink-light">{option.note}</span>
              </span>
            </button>
          )
        })}
      </div>

      {failed && (
        <div className="rounded-xl border border-warning/30 bg-warning-50 p-4" role="alert">
          <p className="flex items-start gap-2 font-semibold text-ink">
            <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            We couldn&rsquo;t submit your booking online.
          </p>
          <p className="mt-1 text-sm text-ink-light">
            Your details are still here — please try again in a moment. You can also book instantly
            by phone; our care coordinator will take it from where you left off.
          </p>
          <CallButton className="mt-3" />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={submitting}>
          <ArrowLeft aria-hidden="true" /> Back
        </Button>
        <Button type="button" size="lg" onClick={confirmBooking} disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitting ? 'Confirming…' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  )
}
