import { useCallback } from 'react'
import { siteConfig } from '@/data/siteConfig'
import { whatsappLink } from '@/utils/helpers'

/** Helpers for opening WhatsApp chats with prefilled messages. */
export function useWhatsApp() {
  const openChat = useCallback((text = 'Hello Dhrishta! I would like to know more about your home healthcare services.') => {
    window.open(whatsappLink(siteConfig.whatsapp, text), '_blank', 'noopener,noreferrer')
  }, [])

  const link = useCallback(
    (text = '') => whatsappLink(siteConfig.whatsapp, text),
    []
  )

  return { openChat, link, number: siteConfig.whatsapp }
}
