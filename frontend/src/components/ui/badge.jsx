import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        primary: 'bg-primary-50 text-primary-700',
        secondary: 'bg-secondary-50 text-secondary-700',
        success: 'bg-success-50 text-success',
        warning: 'bg-warning-50 text-warning',
        accent: 'bg-accent-50 text-accent',
        childcare: 'bg-childcare-50 text-childcare',
        daycare: 'bg-daycare-50 text-daycare',
        neutral: 'bg-surface text-ink-light',
        white: 'bg-white/15 text-white backdrop-blur-sm',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
)

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
