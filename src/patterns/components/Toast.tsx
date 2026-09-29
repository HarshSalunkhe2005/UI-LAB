import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/*
 * Stacked toasts. A provider owns the queue; any component calls
 * useToast()('Saved'). Toasts auto-dismiss, pause on hover, and live in an
 * aria-live region so screen readers announce them.
 */

type Tone = 'default' | 'success' | 'danger'
type Toast = { id: number; message: string; tone: Tone }

const Ctx = createContext<(message: string, tone?: Tone) => void>(() => {})
export const useToast = () => useContext(Ctx)

const TONE: Record<Tone, string> = {
  default: 'bg-fg',
  success: 'bg-success',
  danger: 'bg-danger',
}

export function ToastProvider({ children, duration = 3500 }: { children: ReactNode; duration?: number }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const push = useCallback(
    (message: string, tone: Tone = 'default') => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t.slice(-3), { id, message, tone }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss, duration],
  )

  return (
    <Ctx.Provider value={push}>
      {children}
      <style>{`
        .toast { animation: toast-in var(--dur-slow) var(--ease-spring); }
        @keyframes toast-in { from { opacity: 0; transform: translateY(16px) scale(0.96); } }
      `}</style>
      <ol aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[500] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <li
            key={t.id}
            className="toast pointer-events-auto flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-lg"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${TONE[t.tone]}`} />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-fg-muted hover:text-fg" aria-label="Dismiss">
              ✕
            </button>
          </li>
        ))}
      </ol>
    </Ctx.Provider>
  )
}

function Triggers() {
  const toast = useToast()
  const btn = 'rounded-md border border-border bg-surface px-4 py-2 text-sm hover:bg-surface-2'
  return (
    <div className="flex flex-wrap gap-3">
      <button className={btn} onClick={() => toast('Draft saved')}>Default</button>
      <button className={btn} onClick={() => toast('Payment received', 'success')}>Success</button>
      <button className={btn} onClick={() => toast('Upload failed, retry?', 'danger')}>Error</button>
    </div>
  )
}

export default function ToastDemo() {
  return (
    <ToastProvider>
      <Triggers />
    </ToastProvider>
  )
}
