import { useEffect, useState } from 'react'

/**
 * API-first content with built-in fallback.
 *
 * Public pages call useContent(fetcher, fallbackData, normalize) — content
 * managed in the admin portal (gallery, reviews) appears on the site as soon
 * as the backend is reachable; without it the bundled data renders, so the
 * site never breaks or flashes empty.
 *
 * @param fetcher    async () => raw API list
 * @param fallback   bundled data used until (or instead of) the API result
 * @param normalize  maps one API record to the bundled-data shape
 */
export function useContent(fetcher, fallback, normalize = (x) => x) {
  const [items, setItems] = useState(fallback)
  const [source, setSource] = useState('local')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetcher()
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setItems(data.map(normalize))
          setSource('api')
        }
      } catch {
        // Backend unreachable — keep bundled content.
      }
    }
    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { items, source }
}

/** API gallery document → bundled gallery-image shape. */
export function normalizeGalleryImage(doc) {
  return {
    id: doc.id || doc._id,
    category: String(doc.category || '').replace(/_/g, '-'),
    title: doc.title || '',
    description: doc.description || '',
    src: doc.image_url || doc.src,
  }
}

/** API testimonial document → bundled testimonial shape. */
export function normalizeTestimonial(doc) {
  return {
    id: doc.id || doc._id,
    name: doc.customer_name || doc.name || 'A Dhrishta family',
    relation: doc.relation || 'Verified customer',
    service: doc.service_used || doc.service || '',
    serviceSlug: doc.serviceSlug || '',
    rating: doc.rating ?? 5,
    avatar: doc.photo_url || doc.avatar || '/images/avatars/avatar-1.svg',
    verified: doc.is_verified ?? doc.verified ?? false,
    featured: doc.is_featured ?? doc.featured ?? false,
    text: doc.review || doc.text || '',
  }
}
