import { MessageCircle } from 'lucide-react'
import { useWhatsApp } from '@/hooks/useWhatsApp'

/** Floating WhatsApp button (bottom-left; chat widget owns bottom-right). */
export default function FloatingWhatsApp() {
  const { openChat } = useWhatsApp()

  return (
    <button
      type="button"
      onClick={() => openChat()}
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover transition-transform hover:scale-110 animate-pulse-soft"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
        <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-success" />
      </span>
    </button>
  )
}
