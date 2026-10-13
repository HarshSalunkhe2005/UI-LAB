import { useRef, useState } from 'react'

/*
 * Signature move (PostHog): commit to one metaphor. The homepage is a desktop: icons along the edges open
 * windows, windows drag by their title bar, the last one clicked comes to the front. Windows are real
 * sections with real content; the title bar has a close button and the icons are buttons, so it is fully
 * keyboard operable (Enter/Space opens, Escape closes the focused window). Reduced motion: no open animation.
 */

const APPS = [
  { id: 'home', icon: '⌂', label: 'Home', body: 'Your product’s context layer. Ask anything about what users do.' },
  { id: 'pricing', icon: '$', label: 'Pricing', body: 'Free to start. Pay only for what you send, with a hard cap you set.' },
  { id: 'docs', icon: '¶', label: 'Docs', body: 'Guides, references and a changelog written by the people who built it.' },
  { id: 'about', icon: '☺', label: 'About us', body: 'A remote team that ships in public and answers its own support tickets.' },
]

export default function DesktopHome() {
  const [open, setOpen] = useState<string[]>(['home'])
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>({ home: { x: 90, y: 24 } })
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null)

  const front = (id: string) => setOpen((o) => [...o.filter((x) => x !== id), id])
  const launch = (id: string) => {
    setPos((p) => (p[id] ? p : { ...p, [id]: { x: 70 + open.length * 36, y: 40 + open.length * 30 } }))
    front(id)
  }

  return (
    <div
      className="relative h-[26rem] overflow-hidden rounded-xl border border-border"
      style={{ background: 'linear-gradient(180deg, color-mix(in oklab, var(--success) 22%, var(--bg)), color-mix(in oklab, var(--success) 8%, var(--bg)))' }}
      onPointerMove={(e) => {
        if (!drag.current) return
        const r = e.currentTarget.getBoundingClientRect()
        const { id, dx, dy } = drag.current
        setPos((p) => ({ ...p, [id]: { x: Math.max(0, Math.min(r.width - 120, e.clientX - r.left - dx)), y: Math.max(0, Math.min(r.height - 40, e.clientY - r.top - dy)) } }))
      }}
      onPointerUp={() => (drag.current = null)}
    >
      <nav aria-label="Desktop icons" className="absolute top-3 left-3 flex flex-col gap-1">
        {APPS.map((a) => (
          <button key={a.id} onClick={() => launch(a.id)} className="grid min-h-14 w-16 place-items-center rounded-md text-xs text-fg hover:bg-bg/50">
            <span className="text-2xl leading-none" aria-hidden>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </nav>
      {open.map((id, z) => {
        const a = APPS.find((x) => x.id === id)!
        const p = pos[id] ?? { x: 90, y: 30 }
        return (
          <section
            key={id}
            aria-label={a.label}
            onPointerDown={() => front(id)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen((o) => o.filter((x) => x !== id))}
            className="absolute w-72 overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
            style={{ left: p.x, top: p.y, zIndex: z + 1 }}
          >
            <div
              className="flex cursor-grab touch-none items-center justify-between border-b border-border bg-surface-2 px-3 py-1.5 select-none active:cursor-grabbing"
              onPointerDown={(e) => {
                const r = e.currentTarget.parentElement!.getBoundingClientRect()
                drag.current = { id, dx: e.clientX - r.left, dy: e.clientY - r.top }
              }}
            >
              <span className="text-sm font-medium">{a.label}</span>
              <button aria-label={`Close ${a.label}`} onPointerDown={(e) => e.stopPropagation()} onClick={() => setOpen((o) => o.filter((x) => x !== id))} className="grid size-7 place-items-center rounded text-fg-muted hover:bg-bg hover:text-fg">×</button>
            </div>
            <p className="p-4 text-sm text-fg-muted">{a.body}</p>
          </section>
        )
      })}
    </div>
  )
}
