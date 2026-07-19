import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, translations } from '@/data/translations'

export const LanguageContext = createContext(null)

const STORAGE_KEY = 'dhrishta_lang'
const CODES = LANGUAGES.map((l) => l.code)

/** English/Hindi/Telugu UI language state (architecture doc — Key Feature 8). */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return CODES.includes(stored) ? stored : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((code) => {
    if (CODES.includes(code)) setLangState(code)
  }, [])

  /** Cycle to the next language (used as a fallback interaction). */
  const toggle = useCallback(() => {
    setLangState((current) => CODES[(CODES.indexOf(current) + 1) % CODES.length])
  }, [])

  /** Translate a key; falls back to English, then to the key itself. */
  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  )

  const value = useMemo(
    () => ({ lang, languages: LANGUAGES, setLang, toggle, t }),
    [lang, setLang, toggle, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
