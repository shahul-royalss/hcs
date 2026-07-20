import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Native select styled to match the design system (accessible by default).
 * Usage: <Select {...register('field')}><option .../></Select>
 */
const Select = forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full appearance-none rounded-xl border border-ivory-300 bg-white px-4 pr-10 text-sm text-ink transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:bg-surface',
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
  </div>
))
Select.displayName = 'Select'

export { Select }
