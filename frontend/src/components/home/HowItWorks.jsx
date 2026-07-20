import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  ClipboardList,
  HeartHandshake,
  Headphones,
  Home,
  PhoneCall,
  UserCheck,
} from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'

/**
 * S4 · Interactive care journey — "what happens when you call us?" answered
 * as a golden path that grows with every step. The path lights as you walk it.
 */
const MILESTONES = [
  {
    icon: PhoneCall,
    title: 'First conversation',
    description: 'Call, WhatsApp or book online — a care advisor listens before anything else.',
  },
  {
    icon: Home,
    title: 'Home assessment',
    description: 'A free visit to understand routines, the home, and what good care looks like here.',
  },
  {
    icon: ClipboardList,
    title: 'Personal care plan',
    description: 'Schedules, staffing and transparent costs — designed and agreed together.',
  },
  {
    icon: UserCheck,
    title: 'Caregiver match',
    description: 'A verified caregiver or nurse, matched to needs and language, meets the family.',
  },
  {
    icon: HeartHandshake,
    title: 'Care begins',
    description: 'Care starts at home — usually within 24–48 hours of the assessment.',
  },
  {
    icon: Headphones,
    title: 'Ongoing reviews',
    description: 'Supervisor visits, health reports and a 24/7 helpline keep care on track.',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

/** One milestone: gold node on the path + card, alternating sides on desktop. */
function Milestone({ milestone, index }) {
  const Icon = milestone.icon
  const left = index % 2 === 0
  return (
    <li className="relative grid gap-4 pl-12 md:grid-cols-2 md:gap-0 md:pl-0">
      {/* Node on the path */}
      <motion.span
        className="absolute left-[0.4375rem] top-1.5 flex h-5 w-5 items-center justify-center md:left-1/2 md:-translate-x-1/2"
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        aria-hidden="true"
      >
        <span className="absolute h-5 w-5 rounded-full bg-gold-200" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-gold-500" />
      </motion.span>

      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-15%' }}
        className={
          left
            ? 'md:col-start-1 md:pr-14 md:text-right'
            : 'md:col-start-2 md:pl-14'
        }
      >
        <div className="inline-block max-w-md rounded-card border border-ivory-300 bg-white p-6 text-left shadow-card transition-shadow duration-300 hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="font-heading text-xs font-semibold uppercase tracking-overline text-gold-600 tabular-nums">
              Step {String(index + 1).padStart(2, '0')}
            </p>
          </div>
          <h3 className="mt-3 font-heading text-lg font-bold text-primary">{milestone.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-light">{milestone.description}</p>
        </div>
      </motion.div>
    </li>
  )
}

export default function HowItWorks() {
  const pathRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: pathRef,
    offset: ['start 0.75', 'end 0.55'],
  })
  const pathProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })

  return (
    <section className="section-padding bg-white" aria-label="How care begins">
      <div className="container-site">
        <SectionHeading
          tagline="The care journey"
          title="What happens when you call us"
          subtitle="Six clear steps from your first conversation to dependable everyday care — you can see the whole road before you walk it."
        />

        <div ref={pathRef} className="relative mx-auto max-w-5xl">
          {/* The road ahead, faint — and the golden path that grows as you scroll */}
          <div
            className="absolute inset-y-2 left-[1rem] w-0.5 -translate-x-1/2 bg-gold-500/15 md:left-1/2"
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-y-2 left-[1rem] w-0.5 origin-top -translate-x-1/2 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-400 md:left-1/2"
            style={{ scaleY: pathProgress }}
            aria-hidden="true"
          />

          <ol className="space-y-10 py-2 md:space-y-14">
            {MILESTONES.map((milestone, i) => (
              <Milestone key={milestone.title} milestone={milestone} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
