import { Bot } from 'lucide-react'

/** Single chat bubble: user (right, primary) or assistant (left, surface). */
export default function ChatMessage({ message }) {
  const isUser = message?.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-white">
          {message?.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary"
      >
        <Bot className="h-4 w-4" />
      </span>
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-surface px-4 py-2.5 text-sm text-ink">
        {message?.content}
      </div>
    </div>
  )
}
