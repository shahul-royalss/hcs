import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

/** Header language dropdown — English / हिंदी / తెలుగు. */
export default function LanguageSelector({ compact = false }) {
  const { lang, languages, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const current = languages.find((l) => l.code === lang) ?? languages[0]

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={cn(
          'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-ivory-300 font-semibold text-ink transition-colors hover:border-secondary hover:text-secondary',
          compact ? 'h-9 px-2.5 text-xs' : 'h-10 px-3 text-sm'
        )}
      >
        <Globe className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        {current.short}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-ivory-300 bg-white py-1 shadow-card-hover"
        >
          {languages.map(({ code, label }) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                onClick={() => {
                  setLang(code)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-surface',
                  code === lang ? 'font-semibold text-primary' : 'text-ink'
                )}
              >
                {label}
                {code === lang && <Check className="h-4 w-4 text-secondary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
