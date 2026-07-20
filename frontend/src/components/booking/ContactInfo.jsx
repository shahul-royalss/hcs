import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useBooking } from '@/hooks/useBooking'
import { rules } from '@/utils/validation'
import { isPincodeServed } from '@/utils/helpers'

const RELATIONSHIPS = ['Son', 'Daughter', 'Spouse', 'Parent', 'Relative', 'Friend', 'Self', 'Other']

/** Step 3 — contact details of the person booking the care. */
export default function ContactInfo() {
  const { data, updateSection, nextStep, prevStep } = useBooking()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: data.contact })

  const pincode = watch('pincode')
  const pincodeComplete = /^\d{6}$/.test(pincode || '')
  const served = pincodeComplete ? isPincodeServed(pincode) : null

  const onSubmit = (values) => {
    updateSection('contact', values)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">How do we reach you?</h2>
        <p className="mt-1 text-sm text-ink-light">
          We&rsquo;ll use these details for the confirmation call and the home assessment visit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="booker-name" required>
            Your name
          </Label>
          <Input
            id="booker-name"
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : undefined}
            {...register('name', rules.name)}
          />
          {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="booker-relationship" required>
            Relationship to patient
          </Label>
          <Select
            id="booker-relationship"
            aria-invalid={errors.relationship ? 'true' : undefined}
            {...register('relationship', rules.required('Relationship'))}
          >
            <option value="">Select relationship</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          {errors.relationship && (
            <p className="mt-1 text-xs text-accent">{errors.relationship.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="booker-phone" required>
            Phone number
          </Label>
          <Input
            id="booker-phone"
            type="tel"
            placeholder="10-digit mobile number"
            autoComplete="tel"
            aria-invalid={errors.phone ? 'true' : undefined}
            {...register('phone', rules.phone)}
          />
          {errors.phone && <p className="mt-1 text-xs text-accent">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="booker-email">Email (optional)</Label>
          <Input
            id="booker-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : undefined}
            {...register('email', rules.emailOptional)}
          />
          {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="booker-address" required>
          Address
        </Label>
        <Textarea
          id="booker-address"
          placeholder="House/flat, street, landmark, area…"
          autoComplete="street-address"
          aria-invalid={errors.address ? 'true' : undefined}
          {...register('address', rules.required('Address'))}
        />
        {errors.address && <p className="mt-1 text-xs text-accent">{errors.address.message}</p>}
      </div>

      <div className="max-w-xs">
        <Label htmlFor="booker-pincode" required>
          Pincode
        </Label>
        <Input
          id="booker-pincode"
          inputMode="numeric"
          maxLength={6}
          placeholder="e.g. 517127"
          aria-invalid={errors.pincode ? 'true' : undefined}
          {...register('pincode', rules.pincode)}
        />
        {errors.pincode && <p className="mt-1 text-xs text-accent">{errors.pincode.message}</p>}
      </div>

      <div aria-live="polite">
        {served === true && (
          <p className="flex items-start gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Good news — this pincode is inside our service area.
          </p>
        )}
        {served === false && (
          <p className="flex items-start gap-2 rounded-xl bg-warning-50 px-4 py-3 text-sm text-ink">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            This pincode looks outside our usual service area. You can still continue — we&rsquo;ll
            confirm coverage on the phone call.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-ivory-300 pt-5">
        <Button type="button" variant="ghost" onClick={prevStep}>
          <ArrowLeft aria-hidden="true" /> Back
        </Button>
        <Button type="submit">
          Continue <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
