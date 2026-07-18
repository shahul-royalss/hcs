import { cn } from '@/utils/cn'

/** Consistent section heading: small tagline + title + optional subtitle. */
export default function SectionHeading({ tagline, title, subtitle, align = 'center', className }) {
  return (
    <div
      className={cn(
        'mb-10 max-w-2xl md:mb-12',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {tagline && <p className="tagline mb-2 text-lg">{tagline}</p>}
      <h2 className="text-balance font-heading text-3xl font-extrabold text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-ink-light md:text-lg">{subtitle}</p>}
    </div>
  )
}
