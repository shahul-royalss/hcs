import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import { galleryImages } from '@/data/gallery'
import { cn } from '@/utils/cn'

/* A hand-picked spread across categories — care, in the plural. */
const MOMENT_IDS = ['g4', 'g10', 'g1', 'g7', 'g13', 'g16', 'g5', 'g11']

/**
 * S8 · "A wall of moments" — a drifting strip of photographs: hands, shared
 * meals, walks, festivals. Swipe/scroll sideways; tap through to the gallery.
 */
export default function MomentsStrip() {
  const moments = MOMENT_IDS.map((id) => galleryImages.find((img) => img.id === id)).filter(Boolean)

  return (
    <section className="section-padding overflow-hidden bg-white" aria-label="A wall of moments">
      <div className="container-site">
        <SectionHeading
          tagline="A wall of moments"
          title="Care, in the plural"
          subtitle="Everyday scenes from the homes and families we walk beside."
        />
      </div>

      <AnimatedSection>
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2+1rem))] pb-6 pt-2">
          {moments.map((moment, i) => (
            <li
              key={moment.id}
              className={cn(
                'w-60 shrink-0 snap-center sm:w-64',
                i % 3 === 1 && 'sm:translate-y-4 sm:rotate-1',
                i % 3 === 2 && 'sm:-translate-y-2 sm:-rotate-1'
              )}
            >
              <Link
                to="/gallery"
                className="group block overflow-hidden rounded-card border border-ivory-300 bg-white shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
                aria-label={`${moment.title} — open gallery`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={moment.src}
                    alt={moment.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <p className="px-4 py-3 font-heading text-sm font-semibold text-primary">
                  {moment.title}
                </p>
              </Link>
            </li>
          ))}
          {/* End tile → full gallery */}
          <li className="w-60 shrink-0 snap-center sm:w-64">
            <Link
              to="/gallery"
              className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-gold-400/60 bg-gold-50 text-center transition-colors hover:bg-gold-100"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold-600 shadow-card">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-sm font-bold text-primary">View the gallery</span>
            </Link>
          </li>
        </ul>
      </AnimatedSection>
    </section>
  )
}
