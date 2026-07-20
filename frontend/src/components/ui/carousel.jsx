import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Simple, dependency-free carousel with autoplay, arrows and dots.
 * <Carousel autoPlayMs={6000}>{slides}</Carousel>
 */
export function Carousel({ children, className, autoPlayMs = 6000, ariaLabel = 'carousel' }) {
  const slides = Children.toArray(children)
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const go = useCallback(
    (next) => setIndex((i) => (next + slides.length) % slides.length),
    [slides.length]
  )

  useEffect(() => {
    if (!autoPlayMs || slides.length <= 1) return undefined
    timerRef.current = setInterval(() => go(index + 1), autoPlayMs)
    return () => clearInterval(timerRef.current)
  }, [index, autoPlayMs, slides.length, go])

  if (slides.length === 0) return null

  return (
    <div className={cn('relative', className)} role="region" aria-label={ariaLabel}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full shrink-0" aria-hidden={i !== index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow-card transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow-card transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="mt-5 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-gold-500' : 'w-2 bg-slate-300 hover:bg-gold-300'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
