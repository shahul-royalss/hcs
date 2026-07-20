import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useChat } from '@/hooks/useChat'
import { siteConfig } from '@/data/siteConfig'
import ChatMessage from './ChatMessage'

const QUICK_REPLIES = ['Our services', 'Pricing & packages', 'Book a caregiver', 'Emergency help']

/** Chat conversation window rendered above the floating launcher. */
export default function ChatWindow() {
  const { close, messages, sending, sendMessage } = useChat()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, sending])

  const showQuickReplies = messages.length <= 1 && !sending

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    sendMessage(text)
    setDraft('')
  }

  return (
    <motion.div
      className="fixed bottom-24 right-5 z-50 h-[480px] max-h-[70vh] w-[360px] max-w-[calc(100vw-2.5rem)] origin-bottom-right"
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 16 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card
        role="dialog"
        aria-label="Dhrishta Care Assistant chat"
        className="flex h-full flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 rounded-t-card bg-primary px-4 py-3 text-white">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Bot className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold">Dhrishta Care Assistant</p>
            <p className="truncate text-xs text-white/70">Typically replies instantly</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close chat"
            className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {sending && (
            <div className="flex items-end gap-2">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary"
              >
                <Bot className="h-4 w-4" />
              </span>
              <div
                className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-surface px-4 py-3"
                role="status"
                aria-label="Assistant is typing"
              >
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-2 w-2 animate-bounce rounded-full bg-ink-light/70"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick replies + input */}
        <div className="border-t border-ivory-300">
          {showQuickReplies && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {QUICK_REPLIES.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => sendMessage(label)}
                  className="rounded-full border border-secondary/40 px-3 py-1.5 text-xs font-medium text-secondary-700 transition-colors hover:bg-secondary-50"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your message…"
              aria-label="Chat message"
              className="h-10 flex-1"
            />
            <Button
              type="submit"
              size="icon"
              variant="secondary"
              disabled={sending || !draft.trim()}
              aria-label="Send message"
              className="h-10 w-10 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="px-3 pb-2 text-center text-[11px] text-ink-light">
            AI assistant — for emergencies call {siteConfig.phone}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
