import { ZoomIn } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { galleryCategories } from '@/data/gallery'

const CATEGORY_LABEL = Object.fromEntries(galleryCategories.map((c) => [c.id, c.label]))

/** Clickable gallery thumbnail with hover overlay (title, category, zoom hint). */
export default function ImageCard({ image, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(image)}
      aria-label={`View ${image.title}`}
      className="group relative block w-full overflow-hidden rounded-card shadow-card transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
    >
      <img
        src={image.src}
        alt={image.title}
        loading="lazy"
        className="w-full transition-transform duration-500 group-hover:scale-105"
      />
      <span
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary-900/85 via-primary-900/25 to-transparent p-4 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Badge variant="white" className="mb-2 self-start">
          {CATEGORY_LABEL[image.category] || image.category}
        </Badge>
        <span className="font-heading font-semibold text-white">{image.title}</span>
      </span>
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-primary opacity-0 shadow-card transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <ZoomIn className="h-4 w-4" />
      </span>
    </button>
  )
}
