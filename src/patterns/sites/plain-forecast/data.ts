/* A deterministic fake forecast: the same place and day always give the same numbers. Nothing here is real weather. */

export const PLACES = ['Margate', 'Aberdeen', 'Penzance', 'Leeds'] as const
export type Place = (typeof PLACES)[number]

const BASE: Record<Place, { t: number; wet: number; wind: number }> = {
  Margate: { t: 14, wet: 0.35, wind: 16 },
  Aberdeen: { t: 10, wet: 0.5, wind: 22 },
  Penzance: { t: 13, wet: 0.55, wind: 24 },
  Leeds: { t: 12, wet: 0.45, wind: 12 },
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export type Hour = { h: number; t: number; feels: number; rain: number; wind: number; dir: string; cond: string }
export type Day = { label: string; hours: Hour[]; lo: number; hi: number; rainMax: number; windAvg: number; cond: string }

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const NAMES = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']

export function day(place: Place, offset: number): Day {
  const b = BASE[place]
  const r = rng(place.length * 977 + offset * 131 + place.charCodeAt(0))
  const mood = r() // a front passes through on some days
  const hours: Hour[] = []
  const front = 6 + Math.floor(r() * 12)
  const dayBias = (r() - 0.5) * 5
  for (let h = 0; h < 24; h++) {
    const t = b.t + dayBias + 4.5 * Math.sin(((h - 9) / 24) * Math.PI * 2) + (r() - 0.5) * 0.8
    const near = Math.max(0, 1 - Math.abs(h - front) / 5)
    const rain = Math.min(1, Math.max(0, near * (0.4 + mood * 0.6) * b.wet * 2 + (r() - 0.5) * 0.08))
    const wind = Math.max(3, b.wind * (0.7 + near * 0.6 + r() * 0.2))
    const cond = rain > 0.55 ? 'Rain' : rain > 0.25 ? 'Showers' : t > b.t + dayBias + 2 ? 'Sunny' : 'Cloudy'
    hours.push({ h, t: Math.round(t * 10) / 10, feels: Math.round((t - wind / 12) * 10) / 10, rain: Math.round(rain * 100) / 100, wind: Math.round(wind), dir: DIRS[(offset * 3 + Math.floor(h / 6) + place.length) % 8], cond })
  }
  const lo = Math.min(...hours.map((x) => x.t))
  const hi = Math.max(...hours.map((x) => x.t))
  const rainMax = Math.max(...hours.map((x) => x.rain))
  return {
    label: offset === 0 ? 'Today' : NAMES[(offset + 2) % 7],
    hours,
    lo,
    hi,
    rainMax,
    windAvg: Math.round(hours.reduce((a, x) => a + x.wind, 0) / 24),
    cond: rainMax > 0.55 ? 'Rain' : rainMax > 0.25 ? 'Showers' : hi > b.t + 2 ? 'Sunny' : 'Cloudy',
  }
}

export const toF = (c: number) => Math.round((c * 9) / 5 + 32)
export const shade = (p: number) => (p > 0.75 ? '█' : p > 0.5 ? '▓' : p > 0.25 ? '▒' : p > 0.08 ? '░' : '·')

/** A character chart of temperature across 24 hours. Returns lines of text. */
export function tempChart(hours: Hour[], nowHour: number | null, unit: 'C' | 'F'): string[] {
  const rows = 9
  const temps = hours.map((h) => h.t)
  const lo = Math.floor(Math.min(...temps))
  const hi = Math.ceil(Math.max(...temps))
  const span = Math.max(1, hi - lo)
  const grid = Array.from({ length: rows }, () => Array(48).fill(' '))
  hours.forEach((h, i) => {
    const row = rows - 1 - Math.round(((h.t - lo) / span) * (rows - 1))
    grid[row][i * 2] = '*'
  })
  const lines = grid.map((cells, i) => {
    const v = hi - (span * i) / (rows - 1)
    const label = String(Math.round(unit === 'C' ? v : toF(v))).padStart(3)
    return `${label} |${cells.join('')}`
  })
  lines.push('    +' + '-'.repeat(48))
  let axis = '     '
  for (let h = 0; h < 24; h += 3) axis += String(h).padStart(2, '0') + '    '
  lines.push(axis)
  if (nowHour !== null) lines.push(' '.repeat(5 + nowHour * 2) + '^ now')
  return lines
}
