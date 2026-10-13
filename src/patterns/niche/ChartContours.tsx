import { useMemo, useState } from 'react'

/*
 * Niche world: Nautical Chart. Contour lines drawn from a depth field with marching squares: a smooth
 * pseudo-random seabed, isobaths every few metres, soundings printed at grid points, and a tide slider that
 * raises the water line so the shallows turn to land. The chart is generated, but it is real geometry: move the
 * slider and the filled shallows change. A text readout gives the water level and the shallowest sounding.
 */

const N = 48
const W = 480
const H = 320

function field(): number[] {
  const f: number[] = []
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const u = x / N, v = y / N
      const d = 12 + 9 * Math.sin(u * 5.1 + 0.6) * Math.cos(v * 4.3) + 6 * Math.sin(u * 11 + v * 7) * 0.6 + 14 * Math.max(0, 1 - Math.hypot(u - 0.3, v - 0.35) * 3.2) * -1 + 10 * Math.exp(-Math.hypot(u - 0.75, v - 0.7) * 5) * -1
      f.push(d)
    }
  return f
}

function contour(f: number[], level: number): string {
  const sx = W / (N - 1), sy = H / (N - 1)
  const v = (x: number, y: number) => f[y * N + x]
  const lerp = (a: number, b: number) => (level - a) / (b - a)
  let d = ''
  for (let y = 0; y < N - 1; y++)
    for (let x = 0; x < N - 1; x++) {
      const tl = v(x, y), tr = v(x + 1, y), br = v(x + 1, y + 1), bl = v(x, y + 1)
      const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0)
      if (idx === 0 || idx === 15) continue
      const pts = {
        t: [x + lerp(tl, tr), y], r: [x + 1, y + lerp(tr, br)], b: [x + lerp(bl, br), y + 1], l: [x, y + lerp(tl, bl)],
      } as Record<string, number[]>
      const segs: [string, string][] = {
        1: [['l', 'b']], 2: [['b', 'r']], 3: [['l', 'r']], 4: [['t', 'r']], 5: [['l', 't'], ['b', 'r']], 6: [['t', 'b']], 7: [['l', 't']],
        8: [['l', 't']], 9: [['t', 'b']], 10: [['l', 'b'], ['t', 'r']], 11: [['t', 'r']], 12: [['l', 'r']], 13: [['b', 'r']], 14: [['l', 'b']],
      }[idx] as [string, string][]
      for (const [a, b] of segs) d += `M${(pts[a][0] * sx).toFixed(1)} ${(pts[a][1] * sy).toFixed(1)}L${(pts[b][0] * sx).toFixed(1)} ${(pts[b][1] * sy).toFixed(1)}`
    }
  return d
}

export default function ChartContours() {
  const f = useMemo(field, [])
  const levels = [4, 8, 12, 16, 20, 24]
  const paths = useMemo(() => levels.map((l) => [l, contour(f, l)] as const), [f])
  const [tide, setTide] = useState(8)
  const soundings = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const gx = 4 + ((i * 7) % 40), gy = 4 + ((i * 11) % 40)
    return { x: (gx / (N - 1)) * W, y: (gy / (N - 1)) * H, d: Math.max(0, f[gy * N + gx]).toFixed(1) }
  }), [f])
  const shallowest = Math.min(...f)

  return (
    <div className="rounded-xl border border-[#9fb3b3] bg-[#e7f0ec] p-4 text-[#17313a]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded bg-[#d4e6e2]" role="img" aria-label={`Nautical chart with depth contours. Water level ${tide} metres; shallowest sounding ${shallowest.toFixed(1)} metres.`}>
        <rect width={W} height={H} fill="#d4e6e2" />
        {paths.map(([l, d]) => (
          <path key={l} d={d} fill="none" stroke={l <= tide ? '#b88a3b' : '#4b7d8c'} strokeWidth={l === tide ? 2.2 : 0.9} opacity={l <= tide ? 0.95 : 0.8} />
        ))}
        {soundings.map((s, i) => (
          <text key={i} x={s.x} y={s.y} fontSize="8" fill="#17313a" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)' }}>{s.d}</text>
        ))}
        <g stroke="#17313a" strokeWidth="1" fill="none"><rect x="3" y="3" width={W - 6} height={H - 6} /></g>
      </svg>
      <label className="mt-3 flex items-center gap-4 text-sm">
        Water level
        <input type="range" min={4} max={24} step={4} value={tide} onChange={(e) => setTide(Number(e.target.value))} className="h-8 flex-1 accent-[#b88a3b]" aria-valuetext={`${tide} metres`} />
        <span className="w-14 text-right font-mono tabular-nums">{tide} m</span>
      </label>
    </div>
  )
}
