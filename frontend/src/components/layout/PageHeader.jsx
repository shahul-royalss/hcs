import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Page hero with title + breadcrumb (used on all inner pages) — a band of
 * morning light: ivory field, gold shaft, navy ink.
 * crumbs: [{ label, to? }] — last crumb is the current page.
 */
export default function PageHeader({ title, subtitle, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden border-b border-ivory-300 bg-surface">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(110% 90% at 18% 0%, rgba(234,217,176,0.4), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="light-shaft absolute -top-24 right-[12%] h-[160%] w-64" aria-hidden="true" />

      <div className="container-site relative py-14 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-light">
            <li>
              <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-secondary-600">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
            </li>
            {crumbs.map((crumb, i) => (
              <li key={i} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-secondary-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-primary-700">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-3xl text-balance font-heading text-d1-fluid font-bold text-primary">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl leading-relaxed text-ink-light md:text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
