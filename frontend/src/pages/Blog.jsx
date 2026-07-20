import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { blogPosts, blogCategories } from '@/data/blog'
import { formatDate } from '@/utils/formatters'
import { cn } from '@/utils/cn'

export default function Blog() {
  const [category, setCategory] = useState('All')

  const posts = useMemo(
    () => blogPosts.filter((p) => category === 'All' || p.category === category),
    [category]
  )

  return (
    <>
      <Seo
        title="Blog & Health Guides"
        description="Healthcare tips, elder-care articles and patient-care guides from the Dhrishta Healthcare team in Chittoor."
      />
      <PageHeader
        title="Blog & Health Guides"
        subtitle="Practical, family-friendly guidance from our care team — no jargon, just help."
        crumbs={[{ label: 'Blog' }]}
      />

      <section className="section-padding">
        <div className="container-site">
          <AnimatedSection>
            <div
              role="tablist"
              aria-label="Blog categories"
              className="mb-10 flex flex-wrap justify-center gap-2"
            >
              {blogCategories.map((c) => {
                const active = category === c
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(c)}
                    className={cn(
                      'rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all',
                      active
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-ivory-300 bg-white text-ink hover:border-primary-200'
                    )}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </AnimatedSection>

          {posts.length === 0 ? (
            <p className="py-10 text-center text-ink-light">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} delay={Math.min(i * 0.05, 0.2)}>
                  <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
                    <div className="aspect-video w-full overflow-hidden bg-surface">
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-ink-light">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(post.date)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-ink-light">
                          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                          {post.readTime}
                        </span>
                      </div>
                      <h2 className="mt-3 font-heading text-lg font-bold leading-snug text-primary">
                        <Link to={`/blog/${post.slug}`} className="hover:text-secondary">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-2 flex-1 text-sm text-ink-light">{post.excerpt}</p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                      >
                        Read Article <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
