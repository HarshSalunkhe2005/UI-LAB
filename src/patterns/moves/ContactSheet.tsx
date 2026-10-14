import { useRef } from 'react'

/*
 * Signature move (Office Commun, One Page Love): a studio index set like a contact sheet. Each project is a label line
 * ("Name · what it is") above a single horizontal strip of tiles of different widths, in the manner of a film strip.
 * Strips scroll sideways with touch, trackpad, arrow keys or the buttons, and snap to a tile. Nothing is boxed in
 * cards; the labels and the strips carry the whole page. Tiles here are drawn blocks standing in for screens.
 */

const ROWS = [
  ['Figure', 'AI shopping assistant', '#e6dccf'],
  ['Public', 'Contemporary art auction platform', '#d3dbe0'],
  ['Workspaces', 'Media for modern creators', '#dcd3e3'],
  ['Premune', 'Threat intelligence before the breach', '#1d1a3a'],
] as const
const WIDTHS = [150, 96, 210, 120, 180, 100, 160]

function Strip({ name, what, tone }: { name: string; what: string; tone: string }) {
  const el = useRef<HTMLUListElement>(null)
  const by = (d: number) => el.current?.scrollBy({ left: d * 260, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  const dark = tone === '#1d1a3a'
  return (
    <section aria-label={`${name}: ${what}`} className="group">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm"><b className="font-semibold">{name}</b> <span className="text-fg-muted">· {what}</span></h3>
        <span className="flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <button onClick={() => by(-1)} aria-label={`${name}: scroll back`} className="grid size-9 place-items-center rounded-md border border-border text-sm">‹</button>
          <button onClick={() => by(1)} aria-label={`${name}: scroll forward`} className="grid size-9 place-items-center rounded-md border border-border text-sm">›</button>
        </span>
      </div>
      <ul ref={el} tabIndex={0} aria-label={`${name} screens, scroll sideways`} className="mt-2 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {WIDTHS.map((w, i) => (
          <li key={i} className="h-28 shrink-0 snap-start rounded-sm" style={{ width: w, background: i % 3 === 0 || dark ? tone : `color-mix(in srgb, ${tone} 70%, #fff)` }}>
            {i % 3 === 0 && <span aria-hidden className={`m-2 block h-1.5 w-8 rounded ${dark ? 'bg-white/40' : 'bg-black/20'}`} />}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ContactSheet() {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-bg p-5">
      <p className="max-w-md text-sm text-fg-muted">Independent design studio working across research, identity and production. Between projects we build our own tools.</p>
      {ROWS.map(([n, w, t]) => <Strip key={n} name={n} what={w} tone={t} />)}
    </div>
  )
}
