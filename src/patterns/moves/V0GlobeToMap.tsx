import { useEffect, useRef, useState } from 'react'

/*
 * Vibe-coded move ("Globe To Map Transform", v0): morph between two map projections. Every point of the
 * graticule (and a few cities) is projected twice, orthographic (a globe) and equirectangular (a flat map),
 * and drawn at the linear blend of the two. Back-hemisphere points fade out as the globe unrolls. No D3, no
 * data files. Reduced motion: no auto-rotation; the morph still runs on the button but jumps.
 */

const CITIES: [string, number, number][] = [
  ['Mumbai', 19.1, 72.9],
  ['London', 51.5, -0.1],
  ['New York', 40.7, -74],
  ['Tokyo', 35.7, 139.7],
  ['Sydney', -33.9, 151.2],
  ['São Paulo', -23.5, -46.6],
]
const RAD = Math.PI / 180

export default function V0GlobeToMap() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [flat, setFlat] = useState(false)
  const flatRef = useRef(false)
  flatRef.current = flat

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const css = getComputedStyle(cv)
    const accent = css.getPropertyValue('--accent').trim() || '#f90'
    const line = css.getPropertyValue('--fg-muted').trim() || '#999'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let t = 0
    let spin = 0
    let raf = 0
    let w = 0
    let h = 0

    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    fit()

    const project = (lat: number, lon: number) => {
      const phi = lat * RAD
      const lam = (lon - spin) * RAD
      const R = Math.min(h / 2 - 12, w / 4)
      const cx = w / 2
      const cy = h / 2
      // orthographic
      const ox = cx + R * Math.cos(phi) * Math.sin(lam)
      const oy = cy - R * Math.sin(phi)
      const visible = Math.cos(phi) * Math.cos(lam) > 0
      // equirectangular (width of the map = 2 * pi * R, clipped to the canvas)
      const mapW = Math.min(w - 24, Math.PI * 2 * R)
      const ex = cx + ((((lon + 180) % 360) - 180) / 180) * (mapW / 2)
      const ey = cy - (lat / 90) * (mapW / 4)
      return { x: ox + (ex - ox) * t, y: oy + (ey - oy) * t, a: visible ? 1 : 1 - t }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      ctx.strokeStyle = line
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath()
        let pen = false
        for (let lon = -180; lon <= 180; lon += 6) {
          const p = project(lat, lon)
          if (p.a < 0.05) { pen = false; continue }
          ctx.globalAlpha = 0.5 * p.a
          pen ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
          pen = true
        }
        ctx.stroke()
      }
      for (let lon = -180; lon < 180; lon += 15) {
        ctx.beginPath()
        let pen = false
        for (let lat = -90; lat <= 90; lat += 6) {
          const p = project(lat, lon)
          if (p.a < 0.05) { pen = false; continue }
          ctx.globalAlpha = 0.5 * p.a
          pen ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
          pen = true
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = accent
      ctx.font = '11px var(--font-mono, monospace)'
      for (const [name, lat, lon] of CITIES) {
        const p = project(lat, lon)
        if (p.a < 0.5) continue
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillText(name, p.x + 7, p.y + 4)
      }
    }

    const loop = () => {
      const goal = flatRef.current ? 1 : 0
      t = reduced ? goal : t + (goal - t) * 0.07
      if (Math.abs(goal - t) < 0.002) t = goal
      if (!reduced && t < 0.99) spin += 0.25
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative rounded-xl border border-border bg-surface">
      <canvas ref={ref} className="block h-80 w-full" role="img" aria-label={flat ? 'A flat world map with six cities marked' : 'A rotating globe with six cities marked'} />
      <button onClick={() => setFlat((f) => !f)} aria-pressed={flat} className="absolute top-3 right-3 min-h-11 rounded-md border border-border bg-bg/80 px-4 text-sm hover:text-accent">
        {flat ? 'Roll into a globe' : 'Unroll into a map'}
      </button>
    </div>
  )
}
