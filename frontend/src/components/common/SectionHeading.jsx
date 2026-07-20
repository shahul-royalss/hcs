import { cn } from '@/utils/cn'

/**
 * Consistent scene heading: tracked-caps overline with a gold hairline,
 * display title in navy ink, optional lead subtitle.
 */
export default function SectionHeading({ tagline, title, subtitle, align = 'center', className }) {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl md:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {tagline && (
        <p className={cn('tagline mb-3 flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="h-px w-8 bg-gold-400" aria-hidden="true" />
          {tagline}
          {align === 'center' && <span className="h-px w-8 bg-gold-400" aria-hidden="true" />}
        </p>
      )}
      <h2 className="text-balance font-heading text-d2-fluid font-bold text-primary">
        {title}
      </h2>
      {subtitle && <p className="mt-4 leading-relaxed text-ink-light md:text-lg">{subtitle}</p>}
    </div>
  )
}
