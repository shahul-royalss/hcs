import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'

/**
 * Accordion list. items: [{ id, title, content }]
 * <Accordion items={items} /> — single item open at a time.
 */
export function Accordion({ items, className, defaultOpenId = null }) {
  const [openId, setOpenId] = useState(defaultOpenId)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-card"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-heading font-semibold text-primary">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-secondary transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-5 pb-4 text-sm leading-relaxed text-ink-light">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
