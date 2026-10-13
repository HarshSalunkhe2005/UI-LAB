import { useState } from 'react'

/*
 * Vibe-coded move ("DynamicFrameLayout", v0): frames that trade space. The pointed-at frame grows (flex-grow)
 * in its row and its row grows in the grid, so the whole layout reflows around your attention. Layout is plain
 * flexbox with transitioned flex-grow; focus does the same as hover so keyboard users get it too. Reduced
 * motion: the layout still changes, but instantly.
 */

const ROWS = [
  ['Field', 'Signal', 'Drift'],
  ['Relay', 'Lattice', 'Ember'],
]
const HUES = [24, 200, 280, 150, 330, 60]

export default function V0FrameGrid() {
  const [hot, setHot] = useState<[number, number] | null>(null)
  return (
    <div className="flex h-80 flex-col gap-2 rounded-xl border border-border bg-surface p-2" onPointerLeave={() => setHot(null)}>
      {ROWS.map((row, r) => (
        <div key={r} className="flex min-h-0 gap-2 transition-[flex-grow] duration-500 motion-reduce:transition-none" style={{ flexGrow: hot?.[0] === r ? 2.4 : 1, flexBasis: 0 }}>
          {row.map((name, c) => {
            const on = hot?.[0] === r && hot?.[1] === c
            return (
              <button
                key={name}
                onPointerEnter={() => setHot([r, c])}
                onFocus={() => setHot([r, c])}
                onBlur={() => setHot(null)}
                className="grid min-w-0 place-items-center rounded-lg text-sm font-medium text-black/80 transition-[flex-grow] duration-500 motion-reduce:transition-none"
                style={{ flexGrow: on ? 3 : 1, flexBasis: 0, background: `hsl(${HUES[r * 3 + c]} 70% 62%)` }}
              >
                {name}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
