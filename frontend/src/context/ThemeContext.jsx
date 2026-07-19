import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const ThemeContext = createContext(null)

const STORAGE_KEY = 'dhrishta_theme'
const THEME_COLORS = { light: '#1a3a6b', dark: '#0a1424' }

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Dark/light theme state. First visit follows the system preference; an
 * explicit toggle is persisted in localStorage. The `dark` class on <html>
 * drives all styling (see the dark-theme block in index.css) — a pre-hydration
 * script in index.html applies it before React mounts to avoid a flash.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return systemPrefersDark() ? 'dark' : 'light'
  })

  // Apply the class + browser hints whenever the theme changes.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  // Until the user chooses explicitly, follow live system-theme changes.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) setThemeState(e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    // Briefly enable color transitions so the switch feels smooth, not jarring.
    const root = document.documentElement
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 400)
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
