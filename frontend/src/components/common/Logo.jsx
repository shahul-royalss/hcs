import { useTheme } from '@/hooks/useTheme'
import { siteConfig } from '@/data/siteConfig'

/**
 * Brand logo that follows the active theme.
 * variant="auto" (default) swaps with dark mode; variant="dark" always uses the
 * light-on-dark artwork (for permanently dark surfaces like the footer).
 */
export default function Logo({ className = 'h-10 w-auto', variant = 'auto', alt = siteConfig.name }) {
  const { isDark } = useTheme()
  const useDarkArt = variant === 'dark' || isDark
  return (
    <img
      src={useDarkArt ? '/images/logo-dark.svg' : '/images/logo.svg'}
      alt={alt}
      className={className}
    />
  )
}
