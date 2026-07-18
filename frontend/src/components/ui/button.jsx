import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

/** Pill-shaped buttons per the design system. */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white shadow-sm hover:bg-primary-700 hover:shadow-md',
        secondary: 'bg-secondary text-white shadow-sm hover:bg-secondary-600 hover:shadow-md',
        accent: 'bg-accent text-white shadow-sm hover:bg-accent-600 hover:shadow-md',
        outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
        'outline-white': 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary',
        ghost: 'text-primary hover:bg-primary-50',
        whatsapp: 'bg-[#25D366] text-white shadow-sm hover:bg-[#1ebe5d] hover:shadow-md',
        link: 'text-secondary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-9 px-4 text-sm [&_svg]:h-4 [&_svg]:w-4',
        md: 'h-11 px-6 text-sm [&_svg]:h-4 [&_svg]:w-4',
        lg: 'h-12 px-8 text-base [&_svg]:h-5 [&_svg]:w-5',
        icon: 'h-11 w-11 [&_svg]:h-5 [&_svg]:w-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const Button = forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
