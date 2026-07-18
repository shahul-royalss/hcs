import { Link } from 'react-router-dom'
import { CalendarCheck, Home, MessageCircleQuestion, Stethoscope } from 'lucide-react'
import Seo from '@/components/common/Seo'
import CallButton from '@/components/common/CallButton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils/cn'

const LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/services', label: 'Services', icon: Stethoscope },
  { to: '/contact', label: 'Contact', icon: MessageCircleQuestion },
  { to: '/book-consultation', label: 'Book Consultation', icon: CalendarCheck },
]

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you were looking for doesn't exist." />
      <section className="section-padding">
        <div className="container-site flex min-h-[55vh] flex-col items-center justify-center text-center">
          <p className="font-heading text-7xl font-extrabold text-primary-100 md:text-9xl" aria-hidden="true">
            404
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold text-primary md:text-3xl">
            This page took a sick day
          </h1>
          <p className="mt-3 max-w-md text-ink-light">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has moved. Here&rsquo;s where
            you probably want to go:
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(buttonVariants({ variant: 'outline', size: 'md' }))}
              >
                <Icon aria-hidden="true" /> {label}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <CallButton />
          </div>
        </div>
      </section>
    </>
  )
}
