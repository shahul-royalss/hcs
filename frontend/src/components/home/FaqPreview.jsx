import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import { faqs } from '@/data/faqs'
import { cn } from '@/utils/cn'

/* The five questions families actually ask first. */
const PREVIEW_IDS = ['f1', 'f3', 'f6', 'f7', 'f8']

/* "Paper" spring — one soft overshoot, no wobble. */
const paper = { type: 'spring', stiffness: 170, damping: 21 }

function FaqItem({ faq, index, open, onToggle }) {
  const panelId = `faq-preview-panel-${faq.id}`
  return (
    <li className="border-b border-ivory-300">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:text-secondary-600 md:gap-6"
      >
        <span className="font-heading text-sm font-semibold text-gold-600 tabular-nums" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 font-heading text-base font-bold text-primary md:text-lg">{faq.q}</span>
        <Plus
          className={cn(
            'h-5 w-5 shrink-0 text-secondary-600 transition-transform duration-300 ease-out',
            open && 'rotate-45'
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            style={{ transformOrigin: 'top', overflow: 'hidden' }}
            initial={{ height: 0, opacity: 0, rotateX: -24 }}
            animate={{ height: 'auto', opacity: 1, rotateX: 0, transition: paper }}
            exit={{ height: 0, opacity: 0, rotateX: -16, transition: { duration: 0.28, ease: [0.55, 0, 0.8, 0.4] } }}
          >
            <p className="pb-6 pl-10 pr-8 leading-relaxed text-ink-light md:pl-12">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/**
 * S9 · "Unfolding" — honest questions that open like letters, never an
 * accordion snap. A scene of stillness before the finale.
 */
export default function FaqPreview() {
  const [openId, setOpenId] = useState(PREVIEW_IDS[0])
  const preview = PREVIEW_IDS.map((id) => faqs.find((f) => f.id === id)).filter(Boolean)

  return (
    <section className="section-padding bg-surface" aria-label="Frequently asked questions">
      <div className="container-site">
        <SectionHeading
          tagline="Honest answers"
          title="Questions families ask us"
          subtitle="The things you're wondering about — costs, safety, timing — answered plainly."
        />

        <AnimatedSection className="mx-auto max-w-3xl">
          <ul className="border-t border-ivory-300">
            {preview.map((faq, i) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                index={i}
                open={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="group inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-secondary-600 underline-offset-4 hover:underline"
            >
              All questions, answered
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
