import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import ServiceIcon from '@/components/common/ServiceIcon'
import { useBooking } from '@/hooks/useBooking'
import { services } from '@/data/services'
import { specialties } from '@/data/specialties'
import { packages } from '@/data/packages'
import { formatINR } from '@/utils/formatters'
import { cn } from '@/utils/cn'

/** Step 1 — choose service type, package and (optionally) a specialty. */
export default function ServiceSelection() {
  const { data, updateData, nextStep } = useBooking()
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!data.serviceSlug) {
      setError('Please select a service to continue')
      return
    }
    if (!data.packageType) {
      setError('Please select a package to continue')
      return
    }
    setError('')
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">What care do you need?</h2>
        <p className="mt-1 text-sm text-ink-light">
          Choose a service and a package — you can fine-tune everything during the free assessment.
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-ink">
          Service type <span className="text-accent">*</span>
        </legend>
        <div role="radiogroup" aria-label="Service type" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {services.map((service) => {
            const selected = data.serviceSlug === service.slug
            return (
              <button
                key={service.slug}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  updateData({ serviceSlug: service.slug })
                  setError('')
                }}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                  selected
                    ? 'border-secondary bg-secondary-50 shadow-card'
                    : 'border-ivory-300 bg-white hover:border-secondary-200 hover:shadow-card'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    selected ? 'bg-secondary text-white' : 'bg-surface text-secondary'
                  )}
                >
                  <ServiceIcon name={service.icon} className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-ink">{service.shortName}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-ink">
          Package <span className="text-accent">*</span>
        </legend>
        <div role="radiogroup" aria-label="Package" className="flex flex-wrap gap-2">
          {packages.map((pkg) => {
            const selected = data.packageType === pkg.type
            return (
              <button
                key={pkg.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  updateData({ packageType: pkg.type })
                  setError('')
                }}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all',
                  selected
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-ivory-300 bg-white text-ink hover:border-primary-200'
                )}
              >
                {pkg.name}
                <span className={cn('ml-1.5 text-xs font-normal', selected ? 'text-white/80' : 'text-ink-light')}>
                  {pkg.price ? `${formatINR(pkg.price)} ${pkg.priceUnit}` : pkg.priceUnit}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="max-w-sm">
        <Label htmlFor="booking-specialty">Choose specialty (if needed)</Label>
        <Select
          id="booking-specialty"
          value={data.specialtySlug}
          onChange={(e) => updateData({ specialtySlug: e.target.value })}
        >
          <option value="">No specialty — general care</option>
          {specialties.map((sp) => (
            <option key={sp.slug} value={sp.slug}>
              {sp.name}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <p className="rounded-xl bg-accent-50 px-4 py-3 text-sm font-medium text-accent" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end border-t border-ivory-300 pt-5">
        <Button type="button" onClick={handleContinue}>
          Continue <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
