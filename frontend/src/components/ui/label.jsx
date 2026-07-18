import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Label = forwardRef(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('mb-1.5 block text-sm font-medium text-ink', className)}
    {...props}
  >
    {children}
    {required && <span className="ml-0.5 text-accent">*</span>}
  </label>
))
Label.displayName = 'Label'

export { Label }
