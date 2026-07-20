import { Card } from '@/components/ui/card'
import { cn } from '@/utils/cn'

const ICON_STYLES = {
  primary: 'bg-primary-50 text-primary',
  secondary: 'bg-secondary-50 text-secondary-700',
  gold: 'bg-gold-50 text-gold-600',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  accent: 'bg-accent-50 text-accent',
}

/**
 * Responsive grid of stat cards.
 * stats: [{ label, value, icon, trend?, color? }]
 */
export default function StatCards({ stats = [] }) {
  if (!stats.length) return null

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {stats.map(({ label, value, icon: Icon, trend, color = 'primary' }) => (
        <Card key={label} className="flex items-center gap-4 border-ivory-300 p-5">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
              ICON_STYLES[color] || ICON_STYLES.primary
            )}
            aria-hidden="true"
          >
            {Icon ? <Icon className="h-5 w-5" /> : null}
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-2xl font-bold text-ink">{value ?? '—'}</p>
            <p className="truncate text-sm text-ink-light">{label}</p>
            {trend ? <p className="mt-0.5 truncate text-xs font-medium text-success">{trend}</p> : null}
          </div>
        </Card>
      ))}
    </div>
  )
}
