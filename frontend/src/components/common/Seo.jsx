import { useEffect } from 'react'
import { siteConfig } from '@/data/siteConfig'

/** Sets document title + meta description per page (lightweight SEO helper). */
export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.tagline}`
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])

  return null
}
