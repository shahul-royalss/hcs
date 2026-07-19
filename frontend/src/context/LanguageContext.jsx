import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { translations } from '@/data/translations'

export const LanguageContext = createContext(null)

const STORAGE_KEY = 'dhrishta_lang'

/** English/Hindi UI language state (architecture doc — Key Feature 8). */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'hi' ? 'hi' : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'hi' : 'en')), [])

  /** Translate a key; falls back to English, then to the key itself. */
  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, toggle, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
