import { useState } from 'react'

/*
 * A fluid type scale: every size is a clamp() between a size at a narrow screen and a size at a wide one, so type grows
 * smoothly with the viewport and needs no breakpoints. Pick the base size and the ratio between steps and see the whole
 * scale, with the CSS to copy. The preview is capped at readable sizes: body never goes below 16px.
 */

const RATIOS: [string, number][] = [['Minor third', 1.2], ['Major third', 1.25], ['Perfect fourth', 1.333], ['Golden', 1.618]]
const STEPS = [-1, 0, 1, 2, 3, 4]
const NAMES: Record<number, string> = { [-1]: 'small', 0: 'body', 1: 'lead', 2: 'h3', 3: 'h2', 4: 'h1' }

export default function FluidType() {
  const [base, setBase] = useState(17)
  const [ri, setRi] = useState(1)
  const r = RATIOS[ri][1]
  const lo = (n: number) => Math.max(n < 0 ? 14 : 16, base * Math.pow(Math.min(r, 1.25), n))
  const hi = (n: number) => base * 1.12 * Math.pow(r, n)
  const clampFor = (n: number) => {
    const a = lo(n)
    const b = hi(n)
    const slope = (b - a) / (1280 - 360)
    const inter = a - slope * 360
    return `clamp(${(a / 16).toFixed(3)}rem, ${(inter / 16).toFixed(3)}rem + ${(slope * 100).toFixed(3)}vw, ${(b / 16).toFixed(3)}rem)`
  }
  const css = STEPS.map((n) => `--step-${n}: ${clampFor(n)};`).join('\n')

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-end gap-6">
        <label className="text-sm">
          <span className="block font-medium">Base size: {base}px</span>
          <input type="range" min={16} max={20} value={base} onChange={(e) => setBase(Number(e.target.value))} className="mt-1 h-11 w-48" />
        </label>
        <label className="text-sm">
          <span className="block font-medium">Ratio</span>
          <select value={ri} onChange={(e) => setRi(Number(e.target.value))} className="mt-1 min-h-11 rounded-md border border-border bg-surface px-3">
            {RATIOS.map(([n, v], i) => <option key={n} value={i}>{n} ({v})</option>)}
          </select>
        </label>
      </div>
      <div className="mt-5 divide-y divide-border rounded-xl border border-border">
        {[...STEPS].reverse().map((n) => (
          <div key={n} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <span style={{ fontSize: clampFor(n), lineHeight: 1.15 }} className="font-semibold tracking-tight">Reading well</span>
            <code className="shrink-0 text-xs text-fg-muted">{NAMES[n]} · {lo(n).toFixed(0)}–{hi(n).toFixed(0)}px</code>
          </div>
        ))}
      </div>
      <pre tabIndex={0} aria-label="CSS custom properties for this scale" className="mt-4 overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-xs leading-5">{`:root {\n${css}\n}`}</pre>
    </div>
  )
}
