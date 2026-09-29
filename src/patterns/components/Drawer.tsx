import { useEffect, useRef, useState, type ReactNode } from 'react'

/*
 * Side drawer on the native <dialog>. showModal() gives focus trapping,
 * Esc-to-close and inert background for free. Closing plays the exit
 * animation first, then calls close().
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      setClosing(false)
      d.showModal()
    } else if (!open && d.open) {
      setClosing(true)
      const t = setTimeout(() => d.close(), 250)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      data-side={side}
      data-closing={closing || undefined}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      className="drawer m-0 h-dvh max-h-none w-[min(400px,90vw)] max-w-none border-border bg-surface p-0 text-fg backdrop:bg-black/40"
    >
      <style>{`
        .drawer[data-side='right'] { margin-left: auto; border-left-width: 1px; --from: 100%; }
        .drawer[data-side='left'] { margin-right: auto; border-right-width: 1px; --from: -100%; }
        .drawer[open] { animation: drawer-in var(--dur-slow) var(--ease-out-expo); }
        .drawer[data-closing] { animation: drawer-out 250ms var(--ease-in-out) forwards; }
        .drawer[open]::backdrop { animation: fade-in var(--dur-base); }
        .drawer[data-closing]::backdrop { animation: fade-out 250ms forwards; }
        @keyframes drawer-in { from { transform: translateX(var(--from)); } }
        @keyframes drawer-out { to { transform: translateX(var(--from)); } }
        @keyframes fade-in { from { opacity: 0; } }
        @keyframes fade-out { to { opacity: 0; } }
      `}</style>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-medium">{title}</h2>
          <button onClick={onClose} className="text-fg-muted hover:text-fg" aria-label="Close">
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </dialog>
  )
}

export default function DrawerDemo() {
  const [side, setSide] = useState<'left' | 'right' | null>(null)
  return (
    <div className="flex gap-3">
      {(['left', 'right'] as const).map((s) => (
        <button
          key={s}
          onClick={() => setSide(s)}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm capitalize hover:bg-surface-2"
        >
          Open {s}
        </button>
      ))}
      <Drawer open={side !== null} side={side ?? 'right'} onClose={() => setSide(null)} title="Filters">
        <div className="space-y-4 text-sm">
          {['Status', 'Owner', 'Date range', 'Tags'].map((f) => (
            <label key={f} className="block">
              <span className="mb-1.5 block text-fg-muted">{f}</span>
              <input className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent" />
            </label>
          ))}
        </div>
      </Drawer>
    </div>
  )
}
