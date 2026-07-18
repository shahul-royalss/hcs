import { SERVICE_AREA_PINCODES } from './constants'

/** Scroll window to top (used on route change). */
export function scrollToTop(behavior = 'auto') {
  window.scrollTo({ top: 0, left: 0, behavior })
}

/** Whether a pincode is inside the current service area. */
export function isPincodeServed(pincode) {
  return SERVICE_AREA_PINCODES.includes(String(pincode).trim())
}

/** Build a wa.me chat link with optional prefilled text. */
export function whatsappLink(number, text = '') {
  const digits = String(number).replace(/[^\d]/g, '')
  const query = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${digits}${query}`
}

/** Build a tel: link from a display phone number. */
export function telLink(number) {
  return `tel:${String(number).replace(/[^\d+]/g, '')}`
}

/** Simple unique id for client-side session tracking. */
export function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/** Clamp a number between min and max. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
