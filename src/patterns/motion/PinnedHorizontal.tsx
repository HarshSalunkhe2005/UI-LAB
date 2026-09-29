import { useEffect, useRef, useState } from 'react'

/*
 * Vertical scroll drives a horizontal track. A tall outer section gives the
 * scroll distance; an inner sticky frame pins to the viewport while the
 * track translates by (progress × overflow width). No library needed.
 * Progress is computed from the section's rect against the nearest
 * scroll container, so it works inside a page or a scrolling panel.
 * Reduced motion: becomes a normal horizontally scrollable row.
 */

const PANELS = ['Discover', 'Collect', 'Align', 'Reconstruct', 'Share'].map((t, i) => ({ t, hue: 220 + i * 28 }))

export default function PinnedHorizontal() {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(0)
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (reduced) return
    const scroller = outer.current!.parentElement!
    const update = () => {
      const o = outer.current!
      const t = track.current!
      const frame = scroller.getBoundingClientRect()
      const r = o.getBoundingClientRect()
      const total = r.height - frame.height
      const p = Math.min(Math.max((frame.top - r.top) / total, 0), 1)
      setX(-p * (t.scrollWidth - t.clientWidth))
    }
    scroller.addEventListener('scroll', update, { passive: true })
    update()
    return () => scroller.removeEventListener('scroll', update)
  }, [reduced])

  const panels = PANELS.map((p, i) => (
    <div
      key={p.t}
      className="flex h-56 w-72 shrink-0 flex-col justify-between rounded-2xl p-6 text-white"
      style={{ background: `linear-gradient(150deg, hsl(${p.hue} 70% 55%), hsl(${p.hue + 30} 60% 22%))` }}
    >
      <span className="font-mono text-xs opacity-80">0{i + 1} / 0{PANELS.length}</span>
      <span className="font-display text-4xl italic">{p.t}</span>
    </div>
  ))

  if (reduced) return <div className="flex gap-4 overflow-x-auto pb-2">{panels}</div>

  return (
    <div className="h-80 overflow-y-auto rounded-xl border border-border" tabIndex={0} aria-label="Scroll down to move sideways">
      <div ref={outer} style={{ height: '320%' }} className="relative">
        <div className="sticky top-0 flex h-80 flex-col justify-center gap-4 overflow-hidden px-6">
          <p className="font-mono text-xs text-fg-muted">scroll ↓ inside this box</p>
          <div ref={track} className="flex gap-4" style={{ transform: `translateX(${x}px)` }}>
            {panels}
          </div>
        </div>
      </div>
    </div>
  )
}
