import { useRef } from 'react'

/*
 * Signature move (Linear): one pointer, many cards. The glow on each card's border is positioned from the
 * pointer's position relative to that card, but the pointer is tracked once on the grid, so the light seems to
 * travel across the gaps from card to card. Two CSS variables per card, set on pointermove; no React state.
 * Reduced motion: the glow still follows (it is direct manipulation, not an animation).
 */

const CARDS = [
  ['Triage', 'Inbox for work that needs a decision'],
  ['Cycles', 'Time-boxed sprints that close themselves'],
  ['Roadmaps', 'Plans that stay linked to the work'],
  ['Insights', 'Cycle time without the spreadsheet'],
  ['Agents', 'Delegate the boring half'],
  ['Integrations', 'Meets your tools where they live'],
]

export default function SpotlightGrid() {
  const grid = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent) => {
    for (const el of grid.current!.children) {
      const r = (el as HTMLElement).getBoundingClientRect()
      ;(el as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`)
      ;(el as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`)
    }
  }

  return (
    <div ref={grid} onPointerMove={onMove} className="grid gap-3 sm:grid-cols-3">
      <style>{`
        .sg-card { position: relative; border-radius: 14px; padding: 1px; background: var(--border); }
        .sg-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(220px circle at var(--mx, -999px) var(--my, -999px), var(--accent), transparent 70%); opacity: 0; transition: opacity 0.3s; }
        .sg-card::after { content: ''; position: absolute; inset: 1px; border-radius: 13px; background: radial-gradient(260px circle at var(--mx, -999px) var(--my, -999px), color-mix(in oklab, var(--accent) 12%, var(--surface)), var(--surface) 70%); }
        div:hover > .sg-card::before { opacity: 1; }
        .sg-body { position: relative; z-index: 1; padding: 20px; min-height: 120px; }
      `}</style>
      {CARDS.map(([title, body]) => (
        <div key={title} className="sg-card">
          <div className="sg-body">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
