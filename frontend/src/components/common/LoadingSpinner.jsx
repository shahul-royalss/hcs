import { cn } from '@/utils/cn'

export default function LoadingSpinner({ className, fullPage = false, label = 'Loading…' }) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status" aria-label={label}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-secondary" />
      <span className="text-sm text-ink-light">{label}</span>
    </div>
  )

  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{spinner}</div>
  }
  return spinner
}
