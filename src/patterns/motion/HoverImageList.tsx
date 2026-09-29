import { useRef, useState } from 'react'
import { img } from '../three-d/_shared'

/*
 * Big editorial list where hovering a row reveals its image floating near
 * the cursor (eased follow), rows dimming except the active one. Keyboard
 * focus shows the image too, pinned to the row's right edge.
 */

const ROWS = [
  ['Kyoto Residence', 'Architecture', '2026'],
  ['Saltwater', 'Brand identity', '2025'],
  ['Nocturne', 'Campaign', '2025'],
  ['Field Notes', 'Editorial', '2024'],
  ['Monolith', 'Product', '2024'],
]

export default function HoverImageList() {
  const [active, setActive] = useState<number | null>(null)
  const pic = useRef<HTMLDivElement>(null)
  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        if (pic.current) pic.current.style.transform = `translate(${e.clientX - r.left + 24}px, ${e.clientY - r.top - 80}px)`
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="divide-y divide-border border-y border-border">
        {ROWS.map(([t, k, y], i) => (
          <li key={t}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              onPointerEnter={() => setActive(i)}
              onFocus={(e) => {
                setActive(i)
                const r = e.currentTarget.getBoundingClientRect()
                const pr = e.currentTarget.closest('.relative')!.getBoundingClientRect()
                if (pic.current) pic.current.style.transform = `translate(${r.right - pr.left - 200}px, ${r.top - pr.top - 60}px)`
              }}
              className={`flex items-baseline justify-between gap-4 py-4 transition-opacity duration-300 ${active !== null && active !== i ? 'opacity-30' : ''}`}
            >
              <span className="text-2xl font-medium tracking-tight sm:text-3xl">{t}</span>
              <span className="font-mono text-xs text-fg-muted">{k} · {y}</span>
            </a>
          </li>
        ))}
      </ul>
      <div ref={pic} aria-hidden className="pointer-events-none absolute top-0 left-0 h-44 w-36 transition-transform duration-500 ease-out-expo">
        {ROWS.map((_, i) => (
          <img key={i} src={img(i + 800, 280, 360)} alt="" className="absolute inset-0 h-full w-full rounded-lg object-cover shadow-lg transition-all duration-300" style={{ opacity: active === i ? 1 : 0, transform: active === i ? 'scale(1)' : 'scale(.9)' }} />
        ))}
      </div>
    </div>
  )
}
