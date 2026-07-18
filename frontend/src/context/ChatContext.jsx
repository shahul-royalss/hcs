import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { chatService } from '@/services/chatService'
import { apiErrorMessage } from '@/services/api'
import { generateSessionId } from '@/utils/helpers'
import { siteConfig } from '@/data/siteConfig'

export const ChatContext = createContext(null)

const WELCOME = {
  role: 'assistant',
  content: `Hi! 👋 I'm the Dhrishta care assistant. I can help you understand our services, check availability or guide you through booking. How can I help your family today?`,
}

/** Floating AI chat widget state (architecture doc — Key Feature 1). */
export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [sending, setSending] = useState(false)
  const sessionIdRef = useRef(generateSessionId())
  const autoOpenedRef = useRef(false)

  // Auto-open once after 10 seconds (spec), unless the user already opened it.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!autoOpenedRef.current) {
        autoOpenedRef.current = true
        setIsOpen(true)
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  const open = useCallback(() => {
    autoOpenedRef.current = true
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => {
    autoOpenedRef.current = true
    setIsOpen((v) => !v)
  }, [])

  const sendMessage = useCallback(async (text) => {
    const content = text.trim()
    if (!content) return
    setMessages((prev) => [...prev, { role: 'user', content }])
    setSending(true)
    try {
      const data = await chatService.send(sessionIdRef.current, content)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `${apiErrorMessage(error, 'I could not reach our assistant right now.')} You can always call us at ${siteConfig.phone} or message us on WhatsApp.`,
        },
      ])
    } finally {
      setSending(false)
    }
  }, [])

  const value = useMemo(
    () => ({ isOpen, open, close, toggle, messages, sending, sendMessage }),
    [isOpen, open, close, toggle, messages, sending, sendMessage]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
