import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Link2, SearchX } from 'lucide-react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/layout/PageHeader'
import AnimatedSection from '@/components/common/AnimatedSection'
import CallButton from '@/components/common/CallButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { blogPosts } from '@/data/blog'
import { formatDate, truncate } from '@/utils/formatters'
import { cn } from '@/utils/cn'

export default function BlogPost() {
  const { slug } = useParams()
  const { toast } = useToast()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <>
        <Seo title="Article not found" />
        <section className="section-padding">
          <div className="container-site flex flex-col items-center py-16 text-center">
            <SearchX className="h-14 w-14 text-ink-light" aria-hidden="true" />
            <h1 className="mt-4 font-heading text-2xl font-bold text-primary">
              We couldn&rsquo;t find that article
            </h1>
            <p className="mt-2 max-w-md text-ink-light">
              It may have been moved or the link is out of date — but there&rsquo;s plenty more to
              read on our blog.
            </p>
            <Link to="/blog" className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'mt-6')}>
              <ArrowLeft aria-hidden="true" /> Back to Blog
            </Link>
          </div>
        </section>
      </>
    )
  }

  const morePosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    } catch {
      toast.info('Copy the address from your browser bar to share this article.')
    }
  }

  return (
    <>
      <Seo title={post.title} description={post.excerpt} />
      <PageHeader
        title={post.title}
        crumbs={[{ label: 'Blog', to: '/blog' }, { label: truncate(post.title, 40) }]}
      />

      <section className="section-padding">
        <div className="container-site">
          <AnimatedSection>
            <article className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-light">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-light">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  {post.readTime}
                </span>
              </div>

              <div className="mt-6 aspect-video w-full overflow-hidden rounded-card bg-surface shadow-card">
                <img src={post.image} alt="" className="h-full w-full object-cover" />
              </div>

              <div className="mt-8 space-y-5">
                {post.content.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-ink md:text-lg md:leading-loose">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ivory-300 pt-6">
                <p className="text-sm text-ink-light">Found this helpful? Share it with your family.</p>
                <button
                  type="button"
                  onClick={copyLink}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <Link2 aria-hidden="true" /> Copy link
                </button>
              </div>
            </article>
          </AnimatedSection>

          {morePosts.length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="mx-auto mt-16 max-w-5xl">
                <h2 className="mb-6 text-center font-heading text-2xl font-bold text-primary">
                  More articles
                </h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  {morePosts.map((p) => (
                    <Card key={p.id} className="group overflow-hidden transition-shadow hover:shadow-card-hover">
                      <div className="aspect-video w-full overflow-hidden bg-surface">
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary">{p.category}</Badge>
                        <h3 className="mt-2 font-heading text-sm font-bold leading-snug text-primary">
                          <Link to={`/blog/${p.slug}`} className="hover:text-secondary">
                            {p.title}
                          </Link>
                        </h3>
                        <Link
                          to={`/blog/${p.slug}`}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                        >
                          Read Article <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.1}>
            <div className="mx-auto mt-16 max-w-3xl rounded-card bg-gradient-to-br from-primary to-secondary-700 p-8 text-center text-white">
              <h2 className="font-heading text-2xl font-bold text-white">
                Need this kind of care at home?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-white/85">
                From a few hours a day to round-the-clock support — start with a free, no-obligation
                assessment.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/book-consultation"
                  className={cn(buttonVariants({ variant: 'gold', size: 'md' }))}
                >
                  Book a Free Consultation
                </Link>
                <CallButton className="bg-white text-primary hover:bg-slate-100" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
