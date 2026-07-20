import { cn } from '@/utils/cn'

function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-xl bg-ivory-200', className)} {...props} />
}

export { Skeleton }
