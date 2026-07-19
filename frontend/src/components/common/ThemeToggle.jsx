import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

/** 🌙/☀️ dark-mode toggle shown beside the language selector. */
export default function ThemeToggle({ compact = false }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 text-ink transition-colors hover:border-secondary hover:text-secondary',
        compact ? 'h-9 w-9' : 'h-10 w-10'
      )}
    >
      {isDark ? (
        <Sun className={compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
      ) : (
        <Moon className={compact ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
      )}
    </button>
  )
}
