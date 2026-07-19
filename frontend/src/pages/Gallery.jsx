import { useMemo, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/common/SectionHeading'
import AnimatedSection from '@/components/common/AnimatedSection'
import CategoryFilter from '@/components/gallery/CategoryFilter'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import Lightbox from '@/components/gallery/Lightbox'
import { Button } from '@/components/ui/button'
import { galleryCategories, galleryImages } from '@/data/gallery'
import { normalizeGalleryImage, useContent } from '@/hooks/useContent'
import { serviceService } from '@/services/serviceService'

const PAGE_SIZE = 9

export default function Gallery() {
  const [category, setCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selected, setSelected] = useState(null)

  // Admin-managed gallery when the backend is reachable; bundled images otherwise.
  const { items: images } = useContent(
    () => serviceService.listGallery(),
    galleryImages,
    normalizeGalleryImage
  )

  const filtered = useMemo(
    () =>
      category === 'all' ? images : images.filter((image) => image.category === category),
    [category, images]
  )
  const visible = filtered.slice(0, visibleCount)

  const handleCategoryChange = (id) => {
    setCategory(id)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <>
      <Seo
        title="Gallery"
        description="A look inside Dhrishta Healthcare — our facilities, daily activities, care programs, events, team and day care environment."
      />
      <PageHeader
        title="Gallery"
        subtitle="Moments of care, connection and community — a glimpse into everyday life at Dhrishta."
        crumbs={[{ label: 'Gallery' }]}
      />

      <section className="section-padding">
        <div className="container-site">
          <SectionHeading
            tagline="Moments of care"
            title="Life at Dhrishta"
            subtitle="Browse by category, or click any photo to view it full screen."
          />

          <AnimatedSection>
            <CategoryFilter
              categories={galleryCategories}
              active={category}
              onChange={handleCategoryChange}
              className="mb-10"
            />
          </AnimatedSection>

          <AnimatedSection>
            <GalleryGrid images={visible} onSelect={setSelected} />
          </AnimatedSection>

          {visibleCount < filtered.length && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                aria-label="Load more gallery photos"
              >
                <ImagePlus aria-hidden="true" /> Load More Photos
              </Button>
              <p className="mt-3 text-sm text-ink-light">
                Showing {visible.length} of {filtered.length} photos
              </p>
            </div>
          )}
        </div>
      </section>

      <Lightbox
        image={selected}
        images={filtered}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </>
  )
}
