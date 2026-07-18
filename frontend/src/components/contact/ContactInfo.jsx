import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'

/** One stacked row inside the contact-info column. */
function InfoCard({ icon: Icon, title, children }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-secondary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-primary">{title}</h3>
          <div className="mt-1 text-sm text-ink-light">{children}</div>
        </div>
      </CardContent>
    </Card>
  )
}

/** Contact information column (architecture doc §10). */
export default function ContactInfo() {
  const { openChat } = useWhatsApp()

  return (
    <div className="space-y-4">
      <InfoCard icon={Phone} title="Phone">
        <a href={telLink(siteConfig.phone)} className="font-semibold text-ink hover:text-secondary">
          {siteConfig.phoneDisplay}
        </a>
        <p>Available 24/7 for care and emergencies</p>
      </InfoCard>

      <InfoCard icon={MessageCircle} title="WhatsApp">
        <button
          type="button"
          onClick={() => openChat()}
          className="font-semibold text-[#1ebe5d] underline-offset-2 hover:underline"
        >
          Click to chat with us
        </button>
        <p>Quick replies during office hours</p>
      </InfoCard>

      <InfoCard icon={Mail} title="Email">
        <a href={`mailto:${siteConfig.email}`} className="font-semibold text-ink hover:text-secondary">
          {siteConfig.email}
        </a>
        <p>We reply within one business day</p>
      </InfoCard>

      <InfoCard icon={MapPin} title="Address">
        <p className="text-ink">{siteConfig.address}</p>
        <a
          href={siteConfig.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 font-semibold text-secondary hover:underline"
        >
          Get Directions <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </InfoCard>

      <InfoCard icon={Clock} title="Business hours">
        <p className="text-ink">{siteConfig.hours.support}</p>
        <p>{siteConfig.hours.office}</p>
      </InfoCard>
    </div>
  )
}
