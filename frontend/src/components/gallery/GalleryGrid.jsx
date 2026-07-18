import ImageCard from '@/components/gallery/ImageCard'
import { cn } from '@/utils/cn'

/** Masonry-style grid (CSS columns) of gallery images. */
export default function GalleryGrid({ images = [], onSelect, className }) {
  if (!images.length) {
    return <p className="py-10 text-center text-ink-light">No photos in this category yet.</p>
  }

  return (
    <div className={cn('columns-1 gap-4 sm:columns-2 lg:columns-3', className)}>
      {images.map((image) => (
        <div key={image.id} className="mb-4 break-inside-avoid">
          <ImageCard image={image} onSelect={onSelect} />
        </div>
      ))}
    </div>
  )
}
