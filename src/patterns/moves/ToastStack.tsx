import { useRef, useState } from 'react'

/*
 * Signature move (Emil Kowalski / Sonner): toasts that stack like cards. New toasts push older ones back
 * (smaller, lower, dimmer); hovering or focusing the stack fans it out so every toast can be read and
 * dismissed. Positions are computed from index, so adding and removing animates for free with CSS transitions.
 * The region is a polite live region. Reduced motion: transitions are removed.
 */

type T = { id: number; text: string }
const LINES = ['Saved to drafts', 'Link copied', 'Invite sent to 3 people', 'Deployment ready', 'Payment received']

export default function ToastStack() {
  const [toasts, setToasts] = useState<T[]>([])
  const [fanned, setFanned] = useState(false)
  const n = useRef(0)

  const add = () => setToasts((t) => [...t.slice(-4), { id: ++n.current, text: LINES[n.current % LINES.length] }])
  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-surface">
      <button onClick={add} className="absolute top-4 left-4 min-h-11 rounded-md bg-fg px-4 text-sm font-medium text-bg">Show toast</button>
      <ul
        role="status"
        aria-live="polite"
        className="absolute right-4 bottom-4 h-16 w-72"
        onPointerEnter={() => setFanned(true)}
        onPointerLeave={() => setFanned(false)}
        onFocus={() => setFanned(true)}
        onBlur={() => setFanned(false)}
      >
        {toasts.map((t, i) => {
          const depth = toasts.length - 1 - i // 0 = newest
          const y = fanned ? -depth * 72 : -depth * 10
          const scale = fanned ? 1 : 1 - depth * 0.05
          return (
            <li
              key={t.id}
              className="absolute inset-x-0 bottom-0 flex min-h-14 items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 px-4 text-sm shadow-lg transition-all duration-300 motion-reduce:transition-none"
              style={{ transform: `translateY(${y}px) scale(${scale})`, opacity: fanned ? 1 : Math.max(0, 1 - depth * 0.28), zIndex: i, transformOrigin: 'bottom center' }}
            >
              {t.text}
              <button onClick={() => remove(t.id)} aria-label={`Dismiss: ${t.text}`} className="grid size-9 place-items-center rounded-md text-fg-muted hover:bg-bg hover:text-fg">×</button>
            </li>
          )
        })}
      </ul>
      {toasts.length === 0 && <p className="absolute right-4 bottom-6 font-mono text-[11px] text-fg-muted">Press the button a few times</p>}
    </div>
  )
}
