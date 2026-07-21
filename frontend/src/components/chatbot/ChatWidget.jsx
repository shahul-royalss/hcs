import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import ChatWindow from './ChatWindow'

/**
 * The care orb — a dimensional heart-and-pulse launcher for the AI care
 * assistant. Built as layered SVG gradients (sphere shading, glossy
 * highlight, gold rim light, embossed heart) so it reads as a 3D object
 * without any WebGL cost. Idle: gentle float + soft glow breathing.
 */
function CareOrb() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="orb-body" cx="0.32" cy="0.26" r="0.95">
          <stop offset="0" stopColor="#4FA49D" />
          <stop offset="0.45" stopColor="#1F6F6B" />
          <stop offset="1" stopColor="#0E3B44" />
        </radialGradient>
        <radialGradient id="orb-gloss" cx="0.35" cy="0.22" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orb-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#EAD9B0" stopOpacity="0" />
          <stop offset="1" stopColor="#EAD9B0" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="orb-heart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E9F3F1" />
        </linearGradient>
        <filter id="orb-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      {/* sphere */}
      <circle cx="32" cy="32" r="28" fill="url(#orb-body)" />
      <circle cx="32" cy="32" r="28" fill="url(#orb-rim)" />
      <ellipse cx="24.5" cy="19" rx="13" ry="9" fill="url(#orb-gloss)" filter="url(#orb-soft)" />

      {/* embossed heart + pulse (the Dhrishta mark) */}
      <g transform="translate(15.5, 18)">
        <path
          d="M16.5 26.5 C10 21.5 3.5 16.5 3.5 10.5 C3.5 6 6.8 3.4 10 3.4 c2.6 0 5 1.5 6.5 4.2 C18 4.9 20.4 3.4 23 3.4 c3.2 0 6.5 2.6 6.5 7.1 0 6-6.5 11-13 16z"
          fill="#0A1B2E"
          opacity="0.28"
          transform="translate(0.6, 1.1)"
          filter="url(#orb-soft)"
        />
        <path
          d="M16.5 26.5 C10 21.5 3.5 16.5 3.5 10.5 C3.5 6 6.8 3.4 10 3.4 c2.6 0 5 1.5 6.5 4.2 C18 4.9 20.4 3.4 23 3.4 c3.2 0 6.5 2.6 6.5 7.1 0 6-6.5 11-13 16z"
          fill="url(#orb-heart)"
        />
        <path
          d="M7 13.5 h5.2 l2.2-4.4 3.4 8.4 2.2-4 h6.5"
          fill="none"
          stroke="#1F6F6B"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

/**
 * Floating AI care-assistant launcher (bottom-right).
 * Architecture doc — Key Feature 1: AI Chatbot.
 */
export default function ChatWidget() {
  const { isOpen, toggle, messages } = useChat()
  const [seenCount, setSeenCount] = useState(0)

  // Mark messages as read whenever the window is open.
  useEffect(() => {
    if (isOpen) setSeenCount(messages.length)
  }, [isOpen, messages.length])

  const hasUnread = !isOpen && messages.length > seenCount

  return (
    <>
      <AnimatePresence>{isOpen && <ChatWindow key="chat-window" />}</AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Close care assistant' : 'Open care assistant'}
        whileHover={{ scale: 1.1, rotate: isOpen ? 0 : -4 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="fixed bottom-5 right-5 z-50 h-16 w-16 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 motion-safe:animate-float-slow"
        style={{ filter: 'drop-shadow(0 12px 20px rgba(10, 27, 46, 0.35))' }}
      >
        {/* breathing halo of light behind the orb */}
        {!isOpen && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-6px] rounded-full bg-secondary-300/40 blur-md motion-safe:animate-pulse-soft"
            style={{ animationDuration: '3.2s' }}
          />
        )}

        <span className="relative block h-full w-full">
          {isOpen ? (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-primary-900 text-white ring-1 ring-white/20">
              <X className="h-6 w-6" />
            </span>
          ) : (
            <CareOrb />
          )}
        </span>

        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-gold-500"
          />
        )}
      </motion.button>
    </>
  )
}
