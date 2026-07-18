import { Link } from 'react-router-dom'
import { Phone, Siren } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'
import { cn } from '@/utils/cn'

/** Accent-red emergency band with hotline call CTA. */
export default function EmergencyBanner() {
  return (
    <section
      aria-label="Emergency care hotline"
      className="relative overflow-hidden bg-gradient-to-r from-accent to-accent-600 text-white"
    >
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" aria-hidden="true" />
      <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/5" aria-hidden="true" />

      <div className="container-site relative py-12 md:py-16">
        <AnimatedSection>
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left">
              <span className="flex h-16 w-16 shrink-0 animate-pulse-soft items-center justify-center rounded-full bg-white/15 ring-2 ring-white/40">
                <Siren className="h-8 w-8" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-white md:text-3xl">
                  Need Immediate Care?
                </h2>
                <p className="mt-1 max-w-xl text-white/85">
                  Our emergency response team is available 24/7. One call and help is on the way.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={telLink(siteConfig.phone)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 font-heading text-base font-bold text-accent shadow-lg transition-all hover:bg-red-50 hover:shadow-xl"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {siteConfig.phoneDisplay}
              </a>
              <Link
                to="/emergency"
                className={cn(
                  buttonVariants({ variant: 'outline-white', size: 'lg' }),
                  'hover:text-accent'
                )}
              >
                Emergency Request
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
