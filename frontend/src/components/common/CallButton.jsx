import { Phone } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'
import { cn } from '@/utils/cn'

/** Click-to-call button; renders as an accessible anchor. */
export default function CallButton({ className, size = 'md', label }) {
  return (
    <a
      href={telLink(siteConfig.phone)}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 font-heading font-semibold text-primary-900 shadow-sm transition-all hover:bg-gold-400 hover:shadow-md',
        size === 'lg' ? 'h-12 px-8 text-base' : 'h-11 px-6 text-sm',
        className
      )}
    >
      <Phone className="h-4 w-4" />
      {label || `Call ${siteConfig.phoneDisplay}`}
    </a>
  )
}
