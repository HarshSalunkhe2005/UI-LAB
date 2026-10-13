/*
 * A generated harbour: a smooth depth field, a semi-diurnal tide model and the geometry for contours.
 * All of it is computed, nothing is a map tile. Depth is metres below chart datum.
 */

export const N = 48
export const W = 560
export const H = 360

export function seabed(): number[] {
  const f: number[] = []
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const u = x / (N - 1)
      const v = y / (N - 1)
      // an open sea in the south-east, a drying headland in the north-west, two shoals, a dredged channel
      let d = 13 + 8 * Math.sin(u * 5.1 + 0.6) * Math.cos(v * 4.3) + 3.6 * Math.sin(u * 11 + v * 7)
      d -= 17 * Math.max(0, 1 - Math.hypot(u - 0.26, v - 0.3) * 3.1)
      d -= 11 * Math.exp(-Math.hypot(u - 0.78, v - 0.72) * 6)
      d -= 7 * Math.exp(-Math.hypot(u - 0.55, v - 0.45) * 7)
      const ch = Math.abs(v - (0.42 + 0.26 * u)) // channel runs from the harbour mouth to the open sea
      d += 6 * Math.exp(-ch * ch * 90)
      // a sill (the bar) across the channel mouth: the reason the tide matters
      const w = Math.exp(-((u - 0.62) ** 2) / 0.003) * Math.exp(-ch * ch * 40)
      d = d * (1 - w) + 3.2 * w
      f.push(d)
    }
  return f
}

/** Tide height in metres above chart datum at hour h (0 to 24). */
export function tideAt(h: number): number {
  return 2.55 + 1.95 * Math.cos(((h - 3.4) / 12.42) * Math.PI * 2)
}

export function extremes(): { t: number; h: number; kind: 'High' | 'Low' }[] {
  const out: { t: number; h: number; kind: 'High' | 'Low' }[] = []
  for (let t = 0.25; t < 24; t += 0.05) {
    const a = tideAt(t - 0.05)
    const b = tideAt(t)
    const c = tideAt(t + 0.05)
    if (b > a && b >= c) out.push({ t, h: b, kind: 'High' })
    if (b < a && b <= c) out.push({ t, h: b, kind: 'Low' })
  }
  return out
}

export const hhmm = (t: number) => {
  const m = Math.round(t * 60)
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/** Bilinear sample of the field at grid coordinates. */
export function sample(f: number[], gx: number, gy: number): number {
  const x = Math.min(N - 1.001, Math.max(0, gx))
  const y = Math.min(N - 1.001, Math.max(0, gy))
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0
  const a = f[y0 * N + x0]
  const b = f[y0 * N + x0 + 1]
  const c = f[(y0 + 1) * N + x0]
  const d = f[(y0 + 1) * N + x0 + 1]
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy
}

/** Marching squares: one SVG path for the contour at `level`. */
export function contour(f: number[], level: number): string {
  const sx = W / (N - 1)
  const sy = H / (N - 1)
  const v = (x: number, y: number) => f[y * N + x]
  const lerp = (a: number, b: number) => (level - a) / (b - a)
  let d = ''
  for (let y = 0; y < N - 1; y++)
    for (let x = 0; x < N - 1; x++) {
      const tl = v(x, y)
      const tr = v(x + 1, y)
      const br = v(x + 1, y + 1)
      const bl = v(x, y + 1)
      const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0)
      if (idx === 0 || idx === 15) continue
      const p: Record<string, number[]> = {
        t: [x + lerp(tl, tr), y],
        r: [x + 1, y + lerp(tr, br)],
        b: [x + lerp(bl, br), y + 1],
        l: [x, y + lerp(tl, bl)],
      }
      const segs = (
        {
          1: [['l', 'b']], 2: [['b', 'r']], 3: [['l', 'r']], 4: [['t', 'r']], 5: [['l', 't'], ['b', 'r']], 6: [['t', 'b']], 7: [['l', 't']],
          8: [['l', 't']], 9: [['t', 'b']], 10: [['l', 'b'], ['t', 'r']], 11: [['t', 'r']], 12: [['l', 'r']], 13: [['b', 'r']], 14: [['l', 'b']],
        } as Record<number, [string, string][]>
      )[idx]
      for (const [a, b] of segs) d += `M${(p[a][0] * sx).toFixed(1)} ${(p[a][1] * sy).toFixed(1)}L${(p[b][0] * sx).toFixed(1)} ${(p[b][1] * sy).toFixed(1)}`
    }
  return d
}
