import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-light/70 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:bg-surface',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Textarea }
