import { useState } from 'react'

/*
 * Depth coverflow. Each card's transform is a pure function of its offset
 * from the active index: further cards turn more edge-on, sink back and
 * blur, so the sides compress into slivers. Plain CSS 3D, no canvas.
 * Buttons + arrow keys; the active card is announced.
 */

const ITEMS = ['Ember', 'Tide', 'Moss', 'Dusk', 'Frost', 'Clay', 'Bloom'].map((t, i) => ({ t, hue: i * 50 + 10 }))

export default function Coverflow() {
  const [active, setActive] = useState(3)
  const go = (d: number) => setActive((a) => Math.min(Math.max(a + d, 0), ITEMS.length - 1))

  return (
    <div
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Coverflow. Use arrow keys to browse."
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      className="outline-none"
    >
      <div className="relative h-72" style={{ perspective: '900px' }}>
        {ITEMS.map((it, i) => {
          const o = i - active
          const abs = Math.abs(o)
          return (
            <button
              key={it.t}
              onClick={() => setActive(i)}
              tabIndex={-1}
              aria-hidden={o !== 0}
              className="absolute top-1/2 left-1/2 h-56 w-44 -mt-28 -ml-22 rounded-xl border border-white/15 p-4 text-left text-white shadow-lg transition-all duration-500 ease-out-expo"
              style={{
                zIndex: 100 - abs,
                transform: `translateX(${o === 0 ? 0 : Math.sign(o) * (110 + abs * 42)}px) translateZ(${-abs * 110}px) rotateY(${o === 0 ? 0 : -Math.sign(o) * Math.min(55 + abs * 8, 78)}deg)`,
                filter: `blur(${Math.max(0, abs - 1) * 1.5}px) brightness(${1 - abs * 0.12})`,
                background: `linear-gradient(160deg, hsl(${it.hue} 75% 58%), hsl(${it.hue + 30} 65% 22%))`,
              }}
            >
              <span className="font-display text-3xl italic">{it.t}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} className="rounded-full border border-border px-3 py-1 text-sm" aria-label="Previous">
          ←
        </button>
        <span className="w-20 text-center font-mono text-xs text-fg-muted" aria-live="polite">
          {ITEMS[active].t}
        </span>
        <button onClick={() => go(1)} className="rounded-full border border-border px-3 py-1 text-sm" aria-label="Next">
          →
        </button>
      </div>
    </div>
  )
}
