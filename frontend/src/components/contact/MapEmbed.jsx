import { siteConfig } from '@/data/siteConfig'

/** Responsive Google Maps embed of the Dhrishta office location. */
export default function MapEmbed() {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-card border border-ivory-300 shadow-card">
      <iframe
        src={siteConfig.mapsEmbedUrl}
        title="Dhrishta Healthcare location map"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  )
}
