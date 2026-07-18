import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Full-screen gallery viewer.
 * Props: image (current, null = closed), images (navigable list),
 * onClose(), onNavigate(nextImage). Keyboard: Escape closes, arrows navigate.
 */
export default function Lightbox({ image, images = [], onClose, onNavigate }) {
  const index = image ? images.findIndex((i) => i.id === image.id) : -1
  const canNavigate = images.length > 1 && index !== -1

  const step = useCallback(
    (delta) => {
      if (!canNavigate) return
      onNavigate?.(images[(index + delta + images.length) % images.length])
    },
    [canNavigate, images, index, onNavigate]
  )

  useEffect(() => {
    if (!image) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [image, onClose, step])

  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${image.title}`}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-primary-900/95 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            autoFocus
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>

          {canNavigate && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 md:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25 md:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <motion.figure
            key={image.id}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={image.src}
              alt={image.title}
              className="mx-auto max-h-[72vh] w-auto max-w-full rounded-card"
            />
            <figcaption className="mt-4 px-2 text-center text-white">
              <p className="font-heading text-lg font-bold">{image.title}</p>
              {image.description && (
                <p className="mx-auto mt-1 max-w-xl text-sm text-white/75">{image.description}</p>
              )}
              {canNavigate && (
                <p className="mt-2 text-xs font-medium text-white/60">
                  {index + 1} / {images.length}
                </p>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
