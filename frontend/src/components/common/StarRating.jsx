import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Displays a 1–5 star rating. */
export default function StarRating({ rating = 5, className, size = 'h-4 w-4' }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(size, i <= rating ? 'fill-warning text-warning' : 'fill-slate-200 text-slate-200')}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}
