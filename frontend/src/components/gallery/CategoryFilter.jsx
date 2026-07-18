import { cn } from '@/utils/cn'

/**
 * Pill-style filter row. categories: [{ id, label }]
 * The active pill is solid primary; the rest are muted.
 */
export default function CategoryFilter({ categories = [], active, onChange, className }) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      {categories.map((category) => {
        const isActive = active === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange?.(category.id)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full px-4 py-2 font-heading text-sm font-semibold transition-colors duration-200',
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-ink-light hover:bg-primary-50 hover:text-primary'
            )}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
