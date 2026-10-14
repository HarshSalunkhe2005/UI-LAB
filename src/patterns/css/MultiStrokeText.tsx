import { useMemo, useState } from 'react'

/*
 * Multi-stroke text: a headline with two or three concentric outlines in different colours, made with text-shadow rings.
 * Each ring is a set of shadows at evenly spaced angles around the glyph, and the rings are stacked from the inside out.
 * It is pure CSS output (copy the generated rule). Keep the text large and short; at small sizes the strokes fill in the
 * counters and the word becomes a blob. The text itself stays real text, so it is read and selectable as normal.
 */

const ring = (r: number, c: string, steps = 24) =>
  Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2
    return `${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 ${c}`
  }).join(', ')

export default function MultiStrokeText() {
  const [w1, setW1] = useState(3)
  const [w2, setW2] = useState(7)
  const [c1, setC1] = useState('#ffffff')
  const [c2, setC2] = useState('#d63a2a')
  const shadow = useMemo(() => [ring(w1, c1), ring(w1 + w2, c2)].join(', '), [w1, w2, c1, c2])
  return (
    <div className="mx-auto max-w-xl">
      <div className="grid min-h-44 place-items-center overflow-hidden rounded-xl bg-[#241f3a] p-6">
        <p className="text-center text-6xl font-black tracking-tight sm:text-7xl" style={{ color: '#241f3a', textShadow: shadow, letterSpacing: '0.02em' }}>STROKE</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <label className="block">First ring: {w1}px
          <input type="range" min={1} max={8} value={w1} onChange={(e) => setW1(Number(e.target.value))} className="mt-1 block h-11 w-full" />
        </label>
        <label className="block">Second ring: {w2}px
          <input type="range" min={2} max={14} value={w2} onChange={(e) => setW2(Number(e.target.value))} className="mt-1 block h-11 w-full" />
        </label>
        <label className="flex items-center gap-3">First colour <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-11 w-14 rounded border border-border bg-transparent" /></label>
        <label className="flex items-center gap-3">Second colour <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-11 w-14 rounded border border-border bg-transparent" /></label>
      </div>
    </div>
  )
}
