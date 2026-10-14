import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (Gil Huybrecht, Awwwards SOTD): a portfolio index you can lay out two ways. The same tiles sit in
 * a tidy grid or are scattered across the page like prints on a table; a toggle moves them between the two. Only
 * transforms change, so the switch is cheap. Tiles are a plain list in both modes. Reduced motion: they jump.
 */

const WORKS = [
  ['Studio OADO', '#c8553d'],
  ['The Lookback', '#2f5d62'],
  ['Partners in Creation', '#e0b25b'],
  ['Recent Projects', '#6d597a'],
  ['Form Follows Feeling', '#3d5a80'],
  ['Index 2026', '#8d8741'],
] as const

// Fixed scatter positions as fractions of the free space, plus a small tilt, so the scatter is deterministic.
const SCATTER = [
  [0.02, 0.05, -4],
  [0.42, 0.0, 3],
  [0.78, 0.12, -2],
  [0.12, 0.58, 5],
  [0.5, 0.52, -3],
  [0.84, 0.62, 2],
] as const

export default function ScatterGrid() {
  const area = useRef<HTMLUListElement>(null)
  const [w, setW] = useState(600)
  const [mode, setMode] = useState<'grid' | 'scatter'>('scatter')

  useEffect(() => {
    const el = area.current!
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cols = w < 420 ? 2 : 3
  const gap = 12
  const cw = Math.min(190, (w - gap * (cols - 1)) / cols)
  const ch = cw * 0.68
  const rows = Math.ceil(WORKS.length / cols)
  const H = Math.max(rows * (ch + gap) - gap, ch * 2.7)

  return (
    <div className="rounded-xl border border-border bg-[#0b0b0b] p-4 text-white">
      <div className="mb-3 flex justify-end gap-1 text-xs" role="group" aria-label="Layout">
        {(['grid', 'scatter'] as const).map((m) => (
          <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)} className={`min-h-11 rounded-md px-4 capitalize ${mode === m ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}>
            {m}
          </button>
        ))}
      </div>
      <ul ref={area} aria-label="Selected work" className="relative" style={{ height: H }}>
        {WORKS.map(([name, color], i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          const [fx, fy, rot] = SCATTER[i]
          const x = mode === 'grid' ? c * (cw + gap) : fx * Math.max(0, w - cw)
          const y = mode === 'grid' ? r * (ch + gap) : fy * Math.max(0, H - ch)
          return (
            <li
              key={name}
              className="absolute top-0 left-0 flex flex-col justify-between rounded-sm p-2 text-[11px] font-medium text-white/95 transition-transform duration-700 ease-out-expo motion-reduce:transition-none"
              style={{ width: cw, height: ch, background: color, transform: `translate(${x}px, ${y}px) rotate(${mode === 'grid' ? 0 : rot}deg)` }}
            >
              <span className="font-mono text-[10px]">{String(i + 1).padStart(2, '0')}</span>
              {name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
