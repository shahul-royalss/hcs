import { motion } from 'framer-motion'
import SectionHeading from '@/components/common/SectionHeading'
import { useScene } from '@/hooks/useCinema'
import { gsap } from '@/lib/cinema'
import { cn } from '@/utils/cn'

/**
 * S2 · "One family, five chapters" — the story every visitor recognises,
 * told as five figures of morning light. Light temperature arcs
 * warm → cool → warm; chapter III is the night of the film.
 * Placeholder art: /images/story/ — swap for graded photography (same names).
 */
const CHAPTERS = [
  {
    numeral: 'I',
    overline: 'Chapter I',
    title: 'A house full of mornings.',
    text: 'Breakfast chaos, laughter, a full table — the years when the house takes care of itself.',
    image: '/images/story/chapter-1.svg',
    alt: 'A sunlit family breakfast, the table full',
  },
  {
    numeral: 'II',
    overline: 'Chapter II',
    title: 'Time moves quietly.',
    text: 'The same table, fewer chairs. Parents a little greyer, the shadows a little longer.',
    image: '/images/story/chapter-2.svg',
    alt: 'The same table with fewer chairs, in soft neutral light',
  },
  {
    numeral: 'III',
    overline: 'Chapter III',
    title: 'Life pulls everyone away.',
    text: 'Careers, cities, time zones. The people who love most are suddenly far away.',
    image: '/images/story/chapter-3.svg',
    alt: 'An empty chair at dusk, a phone glowing with missed calls',
    night: true,
  },
  {
    numeral: 'IV',
    overline: 'Chapter IV',
    title: 'Help knocks gently.',
    text: 'A caregiver at the door in morning backlight — professional, gentle, on your side.',
    image: '/images/story/chapter-4.svg',
    alt: 'A caregiver silhouetted in a doorway of morning light',
  },
  {
    numeral: 'V',
    overline: 'Chapter V',
    title: 'Mornings return.',
    text: 'Garden walks, teacups for two. The mornings come back — with someone to share them.',
    image: '/images/story/chapter-5.svg',
    alt: 'A garden walk arm in arm, teacups waiting for two',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

function Chapter({ chapter, index }) {
  const flipped = index % 2 === 1
  return (
    <motion.figure
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-15%' }}
      className={cn(
        'grid items-center gap-6 overflow-hidden rounded-[2rem] md:grid-cols-5 md:gap-0',
        chapter.night
          ? 'bg-primary-900 text-white shadow-card-hover'
          : 'border border-ivory-300 bg-white shadow-card'
      )}
    >
      <div
        data-story-media
        className={cn(
          'relative h-full min-h-56 overflow-hidden md:col-span-3 md:min-h-72',
          flipped && 'md:order-2'
        )}
      >
        {/* GSAP owns this image: curtain-down clip reveal + scrubbed parallax */}
        <img
          data-story-img
          src={chapter.image}
          alt={chapter.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
      </div>

      <figcaption className={cn('relative px-7 py-8 md:col-span-2 md:px-10 md:py-12', flipped && 'md:order-1')}>
        <span
          className={cn(
            'pointer-events-none absolute -top-3 right-6 font-heading text-[6rem] font-extrabold leading-none tabular-nums md:text-[7.5rem]',
            chapter.night ? 'text-gold-300/15' : 'text-gold-500/15'
          )}
          aria-hidden="true"
        >
          {chapter.numeral}
        </span>
        <p className={cn('tagline', chapter.night && 'text-gold-300')}>{chapter.overline}</p>
        <h3
          className={cn(
            'mt-3 font-heading text-d2-fluid font-bold',
            chapter.night ? 'text-white' : 'text-primary'
          )}
        >
          {chapter.title}
        </h3>
        <p className={cn('mt-4 leading-relaxed', chapter.night ? 'text-white/75' : 'text-ink-light')}>
          {chapter.text}
        </p>
      </figcaption>
    </motion.figure>
  )
}

/** The story film, rendered as five stacked figures with a gold progress rail. */
export default function StorySection() {
  const scope = useScene(({ reduced }) => {
    if (reduced) return
    gsap.utils.toArray('[data-story-media]').forEach((media) => {
      const img = media.querySelector('[data-story-img]')
      // Curtain-down reveal — no hard cuts, ever (blueprint §S2)
      gsap.fromTo(
        media,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: media, start: 'top 80%', once: true },
        }
      )
      // Interior parallax: the image travels within its mask as you scroll
      gsap.fromTo(
        img,
        { yPercent: -7, scale: 1.12 },
        {
          yPercent: 7,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      )
    })
  })

  return (
    <section ref={scope} className="section-padding relative overflow-hidden bg-surface" aria-label="One family, five chapters">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(90% 50% at 80% 0%, rgba(234,217,176,0.28), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="container-site relative">
        <SectionHeading
          tagline="One family, five chapters"
          title="Every family reaches this moment"
          subtitle="A story most of us recognise — and the gentle knock that changes how it ends."
        />

        <div className="mx-auto max-w-5xl space-y-8 md:space-y-12">
          {CHAPTERS.map((chapter, i) => (
            <Chapter key={chapter.numeral} chapter={chapter} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
