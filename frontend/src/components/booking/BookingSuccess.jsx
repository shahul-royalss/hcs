import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Copy, Home, MessageCircle, Phone } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useBooking } from '@/hooks/useBooking'
import { useToast } from '@/hooks/useToast'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { siteConfig } from '@/data/siteConfig'
import { telLink } from '@/utils/helpers'
import { cn } from '@/utils/cn'

const NEXT_STEPS = [
  'Our care coordinator calls you within 2 hours to confirm details.',
  'We schedule a free home assessment at a time that suits you.',
  'The best-matched caregiver or nurse is assigned to your family.',
  'Care begins on your preferred start date — with regular updates to you.',
]

/** Final confirmation screen shown once the booking is created (§11). */
export default function BookingSuccess() {
  const { confirmation, reset } = useBooking()
  const { toast } = useToast()
  const { openChat } = useWhatsApp()

  const bookingId =
    confirmation?.booking_id || confirmation?.bookingId || confirmation?.id || ''

  const copyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(bookingId)
      toast.success('Booking ID copied')
    } catch {
      toast.info(`Your booking ID is ${bookingId}`)
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-card-hover"
      >
        <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
      </motion.div>

      <h2 className="mt-5 font-heading text-2xl font-extrabold text-primary md:text-3xl">
        Booking Received!
      </h2>
      <p className="mt-2 max-w-md text-ink-light">
        Thank you for trusting Dhrishta. A confirmation email, SMS and WhatsApp message are on
        their way to you.
      </p>

      {bookingId && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-ivory-300 bg-surface px-4 py-3">
          <span className="text-sm text-ink-light">Booking ID</span>
          <code className="font-mono text-base font-bold text-primary">{bookingId}</code>
          <button
            type="button"
            onClick={copyBookingId}
            aria-label="Copy booking ID"
            className="rounded-full p-1.5 text-secondary transition-colors hover:bg-secondary-50"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="mt-8 w-full max-w-md text-left">
        <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-primary">
          What happens next
        </h3>
        <ol className="space-y-3">
          {NEXT_STEPS.map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-50 font-heading text-xs font-bold text-secondary">
                {i + 1}
              </span>
              {text}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 w-full max-w-md rounded-xl bg-primary-50 p-4 text-left">
        <p className="text-sm text-ink-light">Your contact person</p>
        <p className="font-heading font-bold text-primary">Care Coordinator, Dhrishta Healthcare</p>
        <a
          href={telLink(siteConfig.phone)}
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> {siteConfig.phoneDisplay}
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" onClick={reset} className={cn(buttonVariants({ variant: 'outline', size: 'md' }))}>
          <Home aria-hidden="true" /> Back to Home
        </Link>
        <Button
          variant="whatsapp"
          onClick={() =>
            openChat(
              `Hello Dhrishta! I just submitted a booking${bookingId ? ` (ID: ${bookingId})` : ''}. I would like to discuss the next steps.`
            )
          }
        >
          <MessageCircle aria-hidden="true" /> WhatsApp us
        </Button>
      </div>
    </div>
  )
}
