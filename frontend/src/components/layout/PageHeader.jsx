import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Page hero with title + breadcrumb (used on all inner pages).
 * crumbs: [{ label, to? }] — last crumb is the current page.
 */
export default function PageHeader({ title, subtitle, crumbs = [] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-700 to-secondary-700 text-white">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/5" aria-hidden="true" />
      <div className="container-site relative py-14 md:py-20">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/80">
            <li>
              <Link to="/" className="inline-flex items-center gap-1 hover:text-white">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
            </li>
            {crumbs.map((crumb, i) => (
              <li key={i} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-white">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-3xl font-heading text-3xl font-extrabold text-white md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-white/85 md:text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
