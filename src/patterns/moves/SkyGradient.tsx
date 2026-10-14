import { useMemo, useState } from 'react'

/*
 * Signature move (sky.dlazaro.ca, Show HN): the whole page is the sky where you are. The sun's height above the horizon
 * is computed from the time of day, the date and the latitude (the standard declination and hour-angle sums), and that
 * one number picks a vertical gradient by interpolating between a few colour stops. No image, no API. Here you choose a
 * place and scrub the day. The clock time is used as solar time, so it is indicative, not an almanac. A text line says
 * the same thing in words, so the sky is never the only carrier of information.
 */

const PLACES: [string, number][] = [['Pune', 18.5], ['Reykjavik', 64.1], ['Singapore', 1.3], ['Sydney', -33.9], ['Leeds', 53.8]]

// elevation (deg), top, middle, horizon
const STOPS: [number, string, string, string][] = [
  [-18, '#05060f', '#0a0c1c', '#12122a'],
  [-12, '#0a1030', '#1c1f4a', '#3a2c55'],
  [-6, '#1b2a5e', '#5a4a86', '#d98a6c'],
  [0, '#3d5fa8', '#e8a07a', '#ffd29a'],
  [6, '#5b8fd6', '#a9c4e8', '#ffe6c0'],
  [20, '#3f86e0', '#78b2ee', '#cfe6fa'],
  [60, '#2a78e0', '#5aa0ee', '#b6d8fa'],
]

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) => {
  const x = hex(a)
  const y = hex(b)
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`
}

function elevation(hour: number, lat: number, dayOfYear: number) {
  const rad = Math.PI / 180
  const decl = 23.44 * Math.sin(((360 / 365) * (dayOfYear - 81)) * rad)
  const H = 15 * (hour - 12)
  const e = Math.asin(Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(H * rad))
  return e / rad
}

function sky(e: number) {
  const c = Math.max(STOPS[0][0], Math.min(STOPS[STOPS.length - 1][0], e))
  let i = 0
  while (i < STOPS.length - 2 && c > STOPS[i + 1][0]) i++
  const [e0, ...a] = STOPS[i]
  const [e1, ...b] = STOPS[i + 1]
  const t = (c - e0) / (e1 - e0)
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]
}

const phase = (e: number) => (e < -18 ? 'Night' : e < -12 ? 'Astronomical twilight' : e < -6 ? 'Nautical twilight' : e < 0 ? 'Civil twilight' : e < 10 ? 'Golden hour' : 'Day')

export default function SkyGradient() {
  const [hour, setHour] = useState(18.25)
  const [pi, setPi] = useState(0)
  const doy = useMemo(() => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000), [])
  const [, lat] = PLACES[pi]
  const e = elevation(hour, lat, doy)
  const [top, mid, hor] = sky(e)
  const h = Math.floor(hour)
  const clock = `${String(h).padStart(2, '0')}:${String(Math.round((hour - h) * 60)).padStart(2, '0')}`
  const sunY = 78 - Math.max(-10, Math.min(70, e)) * 1.0
  const sunX = 10 + (hour / 24) * 80
  const dark = e < 0

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="relative h-60" style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${hor} 100%)` }} role="img" aria-label={`The sky in ${PLACES[pi][0]} at ${clock}: ${phase(e)}, the sun is ${Math.abs(e).toFixed(0)} degrees ${e >= 0 ? 'above' : 'below'} the horizon`}>
        <span aria-hidden className="absolute size-8 rounded-full" style={{ left: `${sunX}%`, top: `${sunY}%`, background: e > -4 ? '#fff4c9' : 'transparent', boxShadow: e > -4 ? '0 0 40px 12px rgba(255, 230, 160, 0.55)' : 'none', transform: 'translate(-50%, -50%)' }} />
        <p className="absolute bottom-3 left-4 text-sm font-medium" style={{ color: dark ? '#e8ecff' : '#16243d' }}>{PLACES[pi][0]} · {clock} · {phase(e)}</p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block text-sm">
          <span className="font-medium">Time of day: {clock}</span>
          <input type="range" min={0} max={24} step={0.25} value={hour} onChange={(e2) => setHour(Number(e2.target.value))} aria-valuetext={`${clock}, ${phase(e)}`} className="mt-1 block h-11 w-full" />
        </label>
        <label className="text-sm">
          <span className="block font-medium">Place</span>
          <select value={pi} onChange={(e2) => setPi(Number(e2.target.value))} className="mt-1 min-h-11 rounded-md border border-border bg-surface px-3">
            {PLACES.map(([n, l], i) => <option key={n} value={i}>{n} ({l}°)</option>)}
          </select>
        </label>
      </div>
      <p className="px-4 pb-4 text-sm text-fg-muted" role="status">The sun is {Math.abs(e).toFixed(0)}° {e >= 0 ? 'above' : 'below'} the horizon. {phase(e)}.</p>
    </div>
  )
}
