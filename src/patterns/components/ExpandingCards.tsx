import { useState } from 'react'

/*
 * A rail of tall slivers; the active one grows into a full card via
 * flex-grow. The caption is laid out at the final width (min-width), so text
 * never rewraps mid-animation, it is just clipped until there is room.
 * Works on hover, focus and click, so keyboard and touch both get it.
 */

const ITEMS = [
  { title: 'Northern Lights', place: 'Tromsø', hue: 160 },
  { title: 'Salt Flats', place: 'Uyuni', hue: 200 },
  { title: 'Red Dunes', place: 'Sossusvlei', hue: 20 },
  { title: 'Cherry Blossom', place: 'Kyoto', hue: 330 },
  { title: 'Glacier Lagoon', place: 'Jökulsárlón', hue: 190 },
]

export default function ExpandingCards() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex h-80 gap-2" role="list">
      {ITEMS.map((it, i) => {
        const on = i === active
        return (
          <button
            key={it.title}
            role="listitem"
            aria-expanded={on}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className="relative min-w-12 overflow-hidden rounded-xl text-left text-white transition-[flex-grow] duration-500 ease-out-expo"
            style={{
              flexGrow: on ? 6 : 1,
              flexBasis: 0,
              background: `linear-gradient(160deg, hsl(${it.hue} 70% 55%), hsl(${it.hue + 30} 60% 20%))`,
            }}
          >
            <div
              className="absolute bottom-0 left-0 min-w-56 p-5 transition-opacity duration-300"
              style={{ opacity: on ? 1 : 0, transitionDelay: on ? '200ms' : '0ms' }}
            >
              <p className="font-mono text-[11px] tracking-wider uppercase opacity-80">{it.place}</p>
              <p className="font-display text-3xl italic">{it.title}</p>
            </div>
            <span
              className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-xs opacity-80 transition-opacity"
              style={{ opacity: on ? 0 : 0.8 }}
              aria-hidden
            >
              0{i + 1}
            </span>
          </button>
        )
      })}
    </div>
  )
}
