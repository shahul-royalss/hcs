/** Formatting helpers used across the app. */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** 1234 -> "₹1,234" */
export function formatINR(amount) {
  if (amount === null || amount === undefined || amount === '') return '—'
  return inr.format(Number(amount))
}

/** ISO/date -> "15 Jan 2026" */
export function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** ISO/date -> "15 Jan 2026, 4:30 PM" */
export function formatDateTime(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

/** "personal_care" -> "Personal Care" */
export function titleCase(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

/** Truncate long text with an ellipsis. */
export function truncate(text, max = 120) {
  const s = String(text || '')
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}
