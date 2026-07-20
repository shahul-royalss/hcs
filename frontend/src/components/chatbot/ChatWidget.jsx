import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageSquareText, X } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import ChatWindow from './ChatWindow'

/**
 * Floating AI chat launcher (bottom-right; WhatsApp button owns bottom-left).
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

      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-card-hover transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
      >
        {!isOpen && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-secondary/40"
            style={{ animationDuration: '2.4s' }}
          />
        )}
        <span className="relative">
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquareText className="h-6 w-6" />}
        </span>
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-gold-500"
          />
        )}
      </button>
    </>
  )
}
