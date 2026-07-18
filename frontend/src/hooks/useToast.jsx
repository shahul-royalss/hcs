import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'border-success/30 bg-success-50 text-success',
  error: 'border-accent/30 bg-red-50 text-accent',
  info: 'border-primary/30 bg-primary-50 text-primary',
}

/** Lightweight toast system: const { toast } = useToast(); toast.success('Saved') */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      setToasts((prev) => [...prev, { id, type, message }])
      setTimeout(() => dismiss(id), 5000)
    },
    [dismiss]
  )

  const toast = useMemo(
    () => ({
      success: (msg) => push('success', msg),
      error: (msg) => push('error', msg),
      info: (msg) => push('info', msg),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      >
        {toasts.map(({ id, type, message }) => {
          const Icon = ICONS[type] || Info
          return (
            <div
              key={id}
              className={cn(
                'pointer-events-auto flex items-start gap-2 rounded-xl border bg-white p-3 shadow-card-hover animate-fade-in-up',
                STYLES[type]
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm font-medium text-ink">{message}</p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                aria-label="Dismiss notification"
                className="rounded p-0.5 text-ink-light hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
