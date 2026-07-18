import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useBooking } from '@/hooks/useBooking'
import { rules } from '@/utils/validation'

/** Step 2 — details about the person receiving care. */
export default function PatientDetails() {
  const { data, updateSection, nextStep, prevStep } = useBooking()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: data.patient })

  const onSubmit = (values) => {
    updateSection('patient', values)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">Who needs care?</h2>
        <p className="mt-1 text-sm text-ink-light">
          A few details about the patient help us match the right caregiver.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="patient-name" required>
            Patient name
          </Label>
          <Input
            id="patient-name"
            placeholder="Full name of the patient"
            aria-invalid={errors.name ? 'true' : undefined}
            {...register('name', rules.name)}
          />
          {errors.name && <p className="mt-1 text-xs text-accent">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="patient-age" required>
            Age
          </Label>
          <Input
            id="patient-age"
            type="number"
            min={0}
            max={120}
            placeholder="e.g. 72"
            aria-invalid={errors.age ? 'true' : undefined}
            {...register('age', rules.age)}
          />
          {errors.age && <p className="mt-1 text-xs text-accent">{errors.age.message}</p>}
        </div>

        <div>
          <Label htmlFor="patient-gender" required>
            Gender
          </Label>
          <Select
            id="patient-gender"
            aria-invalid={errors.gender ? 'true' : undefined}
            {...register('gender', rules.required('Gender'))}
          >
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </Select>
          {errors.gender && <p className="mt-1 text-xs text-accent">{errors.gender.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="patient-condition" required>
          Medical condition
        </Label>
        <Textarea
          id="patient-condition"
          placeholder="Current diagnosis, mobility level, ongoing treatment…"
          aria-invalid={errors.medicalCondition ? 'true' : undefined}
          {...register('medicalCondition', rules.required('Medical condition'))}
        />
        {errors.medicalCondition && (
          <p className="mt-1 text-xs text-accent">{errors.medicalCondition.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="patient-requirements">Special requirements (optional)</Label>
        <Textarea
          id="patient-requirements"
          placeholder="Diet, allergies, equipment at home, habits we should know about…"
          {...register('specialRequirements')}
        />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
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
