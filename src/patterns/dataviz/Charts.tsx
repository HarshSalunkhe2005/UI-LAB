import { useState } from 'react'

/*
 * Three hand-drawn SVG charts with no library:
 *  - Area/line chart with a hover crosshair + tooltip (keyboard: arrow keys)
 *  - GitHub-style contribution heatmap (53×7 grid, quantised colour scale)
 *  - Radar chart for comparing a few metrics
 * Each chart has role="img" + a text summary; the line chart also exposes
 * the focused value via aria-live.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SERIES = [42, 48, 45, 60, 58, 72, 70, 85, 80, 96, 104, 118]

function LineChart() {
  const [i, setI] = useState<number | null>(null)
  const W = 560, H = 200, P = 24
  const max = Math.max(...SERIES) * 1.1
  const x = (k: number) => P + (k / (SERIES.length - 1)) * (W - P * 2)
  const y = (v: number) => H - P - (v / max) * (H - P * 2)
  const line = SERIES.map((v, k) => `${k ? 'L' : 'M'}${x(k)},${y(v)}`).join(' ')
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Monthly revenue rising from ${SERIES[0]}k in January to ${SERIES.at(-1)}k in December`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setI((v) => Math.min((v ?? -1) + 1, SERIES.length - 1))
          if (e.key === 'ArrowLeft') setI((v) => Math.max((v ?? 1) - 1, 0))
        }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const px = ((e.clientX - r.left) / r.width) * W
          setI(Math.round(((px - P) / (W - P * 2)) * (SERIES.length - 1)))
        }}
        onPointerLeave={() => setI(null)}
      >
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity=".35" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={P} x2={W - P} y1={P + g * (H - P * 2)} y2={P + g * (H - P * 2)} className="stroke-border" strokeDasharray="3 4" />)}
        <path d={`${line} L${x(SERIES.length - 1)},${H - P} L${x(0)},${H - P} Z`} fill="url(#area)" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
        {MONTHS.map((m, k) => k % 2 === 0 && <text key={m} x={x(k)} y={H - 4} textAnchor="middle" className="fill-fg-muted text-[10px]">{m}</text>)}
        {i !== null && i >= 0 && i < SERIES.length && (
          <g>
            <line x1={x(i)} x2={x(i)} y1={P} y2={H - P} className="stroke-fg-muted" strokeDasharray="2 3" />
            <circle cx={x(i)} cy={y(SERIES[i])} r="5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2.5" />
          </g>
        )}
      </svg>
      <p aria-live="polite" className="absolute top-0 right-0 rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs" hidden={i === null}>
        {i !== null && SERIES[i] !== undefined ? `${MONTHS[i]}: ₹${SERIES[i]}k` : ''}
      </p>
    </div>
  )
}

function Heatmap() {
  const days = Array.from({ length: 53 * 7 }, (_, k) => {
    const v = Math.sin(k * 0.37) + Math.sin(k * 0.11) + ((k * 7919) % 13) / 13
    return Math.max(0, Math.min(4, Math.floor(v * 1.4 + 1)))
  })
  const shade = ['var(--surface-2)', 'color-mix(in oklab, var(--success) 30%, var(--surface-2))', 'color-mix(in oklab, var(--success) 55%, var(--surface-2))', 'color-mix(in oklab, var(--success) 80%, var(--surface-2))', 'var(--success)']
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 690 96" className="min-w-[560px]" role="img" aria-label={`Contribution heatmap: ${days.filter(Boolean).length} active days in the last year`}>
        {days.map((v, k) => <rect key={k} x={Math.floor(k / 7) * 13} y={(k % 7) * 13} width="10" height="10" rx="2" fill={shade[v]} />)}
      </svg>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-fg-muted">Less {shade.map((s, k) => <span key={k} className="h-2.5 w-2.5 rounded-sm" style={{ background: s }} />)} More</div>
    </div>
  )
}

function Radar() {
  const axes = ['Speed', 'Design', 'A11y', 'Size', 'DX', 'Docs']
  const a = [0.9, 0.8, 0.95, 0.7, 0.85, 0.75]
  const b = [0.6, 0.9, 0.5, 0.9, 0.6, 0.55]
  const R = 80, C = 100
  const pt = (k: number, r: number) => {
    const ang = (k / axes.length) * Math.PI * 2 - Math.PI / 2
    return [C + Math.cos(ang) * R * r, C + Math.sin(ang) * R * r]
  }
  const poly = (vals: number[]) => vals.map((v, k) => pt(k, v).join(',')).join(' ')
  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-64" role="img" aria-label={`Radar comparing UI Lab (blue) and a typical library (pink) across ${axes.join(', ')}`}>
      {[0.25, 0.5, 0.75, 1].map((r) => <polygon key={r} points={poly(axes.map(() => r))} fill="none" className="stroke-border" />)}
      {axes.map((ax, k) => {
        const [x, y] = pt(k, 1.18)
        const [lx, ly] = pt(k, 1)
        return <g key={ax}><line x1={C} y1={C} x2={lx} y2={ly} className="stroke-border" /><text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-fg-muted text-[9px]">{ax}</text></g>
      })}
      <polygon points={poly(b)} fill="#ec4899" fillOpacity=".2" stroke="#ec4899" strokeWidth="1.5" />
      <polygon points={poly(a)} fill="var(--accent)" fillOpacity=".25" stroke="var(--accent)" strokeWidth="1.5" />
    </svg>
  )
}

export default function Charts() {
  return (
    <div className="space-y-8">
      <div><p className="mb-2 text-sm font-medium">Area chart (hover / arrow keys)</p><LineChart /></div>
      <div><p className="mb-2 text-sm font-medium">Contribution heatmap</p><Heatmap /></div>
      <div><p className="mb-2 text-sm font-medium">Radar</p><Radar /></div>
    </div>
  )
}
