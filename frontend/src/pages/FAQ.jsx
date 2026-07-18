import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, MessagesSquare } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import CallButton from '@/components/common/CallButton'
import { Accordion } from '@/components/ui/accordion'
import { Button, buttonVariants } from '@/components/ui/button'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { faqs, faqCategories } from '@/data/faqs'
import { cn } from '@/utils/cn'

export default function FAQ() {
  const [category, setCategory] = useState('all')
  const { openChat } = useWhatsApp()

  const items = useMemo(
    () =>
      faqs
        .filter((f) => category === 'all' || f.category === category)
        .map((f) => ({ id: f.id, title: f.q, content: f.a })),
    [category]
  )

  const pills = [{ id: 'all', label: 'All' }, ...faqCategories]

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Answers about Dhrishta home healthcare — services, booking, payments and our cancellation policy."
      />
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Everything families usually ask us — about services, booking, payments and policies."
        crumbs={[{ label: 'FAQ' }]}
      />

      <section className="section-padding">
        <div className="container-site max-w-4xl">
          <AnimatedSection>
            <div
              role="tablist"
              aria-label="FAQ categories"
              className="mb-8 flex flex-wrap justify-center gap-2"
            >
              {pills.map((pill) => {
                const active = category === pill.id
                return (
                  <button
                    key={pill.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(pill.id)}
                    className={cn(
                      'rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all',
                      active
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-slate-200 bg-white text-ink hover:border-primary-200'
                    )}
                  >
                    {pill.label}
                  </button>
                )
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion items={items} />
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mt-12 rounded-card bg-gradient-to-br from-primary to-secondary-700 p-8 text-center text-white">
              <MessagesSquare className="mx-auto h-10 w-10 text-white/80" aria-hidden="true" />
              <h2 className="mt-3 font-heading text-2xl font-bold text-white">Still have questions?</h2>
              <p className="mx-auto mt-2 max-w-md text-white/85">
                Talk to a real person — no bots, no waiting. We&rsquo;re happy to explain anything in
                Telugu, English or Hindi.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <CallButton />
                <Button variant="whatsapp" onClick={() => openChat('Hello Dhrishta! I have a question about your services.')}>
                  <MessageCircle aria-hidden="true" /> WhatsApp us
                </Button>
                <Link
                  to="/contact"
                  className={cn(buttonVariants({ variant: 'outline-white', size: 'md' }))}
                >
                  Contact page
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
