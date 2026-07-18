import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-ink placeholder:text-ink-light/70 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:bg-surface',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export { Input }
