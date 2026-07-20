import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import ServiceIcon from '@/components/common/ServiceIcon'
import { buttonVariants } from '@/components/ui/button'
import { services } from '@/data/services'
import { cn } from '@/utils/cn'

/* Tailwind needs full class strings — map data `color` → explicit classes. */
const COLOR_STYLES = {
  primary: 'bg-primary-50 text-primary-700',
  secondary: 'bg-secondary-50 text-secondary-600',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  childcare: 'bg-childcare-50 text-childcare',
  daycare: 'bg-daycare-50 text-daycare',
}

/**
 * A glass card that leans toward the pointer (≤ 4.5°) and springs back —
 * the vitrine object reacting physically to your hand. Mouse only.
 */
function TiltCard({ children }) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 150, damping: 20, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [4.5, -4.5]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-4.5, 4.5]), spring)

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.article
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="glass group flex h-full flex-col rounded-card p-7"
    >
      {children}
    </motion.article>
  )
}

/**
 * S3 · "Objects of care" — each service presented as a precious object in
 * a lit vitrine: glass panels over a warm field, never a pricing grid.
 */
export default function ServicesOverview() {
  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(80% 60% at 50% 110%, rgba(167,211,206,0.22), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="light-shaft absolute -top-24 right-[8%] h-[70%] w-72 opacity-60" aria-hidden="true" />

      <div className="container-site relative">
        <SectionHeading
          tagline="Objects of care"
          title="Care for every need"
          subtitle="From daily personal assistance to skilled nursing — the full range of home healthcare, brought gently to your doorstep."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.slug} delay={i * 0.08} className="h-full">
              <TiltCard>
                <span
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-white/70 transition-shadow duration-300 group-hover:shadow-glow',
                    COLOR_STYLES[service.color] || COLOR_STYLES.primary
                  )}
                >
                  <ServiceIcon name={service.icon} className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-primary">
                  {service.shortName}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-light">
                  {service.excerpt}
                </p>
                <Link
                  to={`/services/${service.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-secondary-600 underline-offset-4 transition-colors hover:text-secondary-700 hover:underline"
                  aria-label={`Learn more about ${service.name}`}
                >
                  Explore
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12 text-center">
          <Link to="/services" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            See all services
            <ArrowRight aria-hidden="true" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
