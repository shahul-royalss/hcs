import { useForm } from 'react-hook-form'
import { AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useBooking } from '@/hooks/useBooking'
import { rules } from '@/utils/validation'
import { TIME_SLOTS, URGENCY_LEVELS } from '@/utils/constants'
import { cn } from '@/utils/cn'

const DURATIONS = ['4 hours', '8 hours', '12 hours', '24 hours', 'Ongoing']

/** Today's date in the local timezone as YYYY-MM-DD (for the date input min). */
function todayLocalISO() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

/** Step 4 — when should care start and how urgent is it? */
export default function Schedule() {
  const { data, updateSection, nextStep, prevStep } = useBooking()
  const minDate = todayLocalISO()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: data.schedule })

  const urgency = watch('urgency')

  const onSubmit = (values) => {
    updateSection('schedule', values)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">When should care start?</h2>
        <p className="mt-1 text-sm text-ink-light">
          Pick your preferred schedule — we&rsquo;ll confirm caregiver availability on the call.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="schedule-date" required>
            Preferred start date
          </Label>
          <Input
            id="schedule-date"
            type="date"
            min={minDate}
            aria-invalid={errors.startDate ? 'true' : undefined}
            {...register('startDate', {
              required: 'Start date is required',
              validate: (v) => v >= minDate || 'Start date cannot be in the past',
            })}
          />
          {errors.startDate && <p className="mt-1 text-xs text-accent">{errors.startDate.message}</p>}
        </div>

        <div>
          <Label htmlFor="schedule-slot" required>
            Time slot
          </Label>
          <Select
            id="schedule-slot"
            aria-invalid={errors.timeSlot ? 'true' : undefined}
            {...register('timeSlot', rules.required('Time slot'))}
          >
            <option value="">Select a time slot</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Select>
          {errors.timeSlot && <p className="mt-1 text-xs text-accent">{errors.timeSlot.message}</p>}
        </div>

        <div>
          <Label htmlFor="schedule-duration" required>
            Duration per day
          </Label>
          <Select
            id="schedule-duration"
            aria-invalid={errors.duration ? 'true' : undefined}
            {...register('duration', rules.required('Duration'))}
          >
            <option value="">Select duration</option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          {errors.duration && <p className="mt-1 text-xs text-accent">{errors.duration.message}</p>}
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-ink">Urgency level</legend>
        <input type="hidden" {...register('urgency')} />
        <div role="radiogroup" aria-label="Urgency level" className="flex flex-wrap gap-2">
          {URGENCY_LEVELS.map((level) => {
            const selected = urgency === level.value
            return (
              <button
                key={level.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setValue('urgency', level.value)}
                className={cn(
                  'rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all',
                  selected && level.value === 'urgent' && 'border-accent bg-accent text-white',
                  selected && level.value !== 'urgent' && 'border-primary bg-primary text-white',
                  !selected && 'border-ivory-300 bg-white text-ink hover:border-primary-200'
                )}
              >
                {level.label}
              </button>
            )
          })}
        </div>
        {urgency === 'urgent' && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-accent-50 px-4 py-3 text-sm font-medium text-accent">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Urgent requests are prioritised — we&rsquo;ll call you within 30 minutes.
          </p>
        )}
      </fieldset>

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
