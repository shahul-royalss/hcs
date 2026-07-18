import { Check } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { cn } from '@/utils/cn'

/** Horizontal progress indicator for the multi-step booking form (§11). */
export default function StepIndicator() {
  const { step, steps } = useBooking()
  const current = steps.find((s) => s.id === step)

  return (
    <div className="mb-8">
      {/* Mobile: compact summary */}
      <p className="text-center text-sm font-semibold text-primary md:hidden">
        Step {step} of {steps.length} — {current?.title}
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface md:hidden">
        <div
          className="h-full rounded-full bg-secondary transition-all duration-300"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop: numbered circles with connectors */}
      <ol className="hidden items-start md:flex" aria-label="Booking progress">
        {steps.map((s, i) => {
          const isCompleted = s.id < step
          const isCurrent = s.id === step
          return (
            <li
              key={s.id}
              className={cn('flex items-start', i < steps.length - 1 && 'flex-1')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full font-heading text-sm font-bold transition-colors',
                    isCompleted && 'bg-success text-white',
                    isCurrent && 'bg-primary text-white ring-4 ring-primary-100',
                    !isCompleted && !isCurrent && 'bg-surface text-ink-light'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" aria-hidden="true" /> : s.id}
                </span>
                <span
                  className={cn(
                    'mt-1.5 text-xs font-medium',
                    isCurrent ? 'text-primary' : 'text-ink-light'
                  )}
                >
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mx-2 mt-[1.05rem] h-0.5 flex-1 rounded-full',
                    s.id < step ? 'bg-success' : 'bg-slate-200'
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
