import { useEffect, useRef } from 'react'

/*
 * Signature move (Vercel): a quiet black grid with light that travels along its lines. Beams are short
 * gradient segments that move along random grid rows and columns and fade out; a single canvas draws the
 * grid once and the beams every frame. Reduced motion: the grid only, no beams.
 */

export default function GridBeams() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const css = getComputedStyle(cv)
    const accent = css.getPropertyValue('--accent').trim() || '#f90'
    const line = css.getPropertyValue('--border').trim() || '#333'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const CELL = 48
    let w = 0
    let h = 0
    let raf = 0
    type Beam = { horizontal: boolean; line: number; pos: number; speed: number; len: number }
    const beams: Beam[] = []

    const grid = () => {
      ctx.strokeStyle = line
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.6
      ctx.beginPath()
      for (let x = 0; x <= w; x += CELL) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h) }
      for (let y = 0; y <= h; y += CELL) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5) }
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    const spawn = () => {
      const horizontal = Math.random() > 0.5
      beams.push({
        horizontal,
        line: Math.floor(Math.random() * ((horizontal ? h : w) / CELL)) * CELL + 0.5,
        pos: -80,
        speed: 140 + Math.random() * 260,
        len: 60 + Math.random() * 90,
      })
    }
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      grid()
    }
    const ro = new ResizeObserver(fit)
    ro.observe(cv)
    fit()

    let last = performance.now()
    let acc = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      acc += dt
      if (acc > 0.35 && beams.length < 10) {
        acc = 0
        spawn()
      }
      ctx.clearRect(0, 0, w, h)
      grid()
      for (let i = beams.length - 1; i >= 0; i--) {
        const b = beams[i]
        b.pos += b.speed * dt
        const max = b.horizontal ? w : h
        if (b.pos - b.len > max) { beams.splice(i, 1); continue }
        const x0 = b.horizontal ? b.pos - b.len : b.line
        const y0 = b.horizontal ? b.line : b.pos - b.len
        const x1 = b.horizontal ? b.pos : b.line
        const y1 = b.horizontal ? b.line : b.pos
        const g = ctx.createLinearGradient(x0, y0, x1, y1)
        g.addColorStop(0, 'transparent')
        g.addColorStop(1, accent)
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }
      raf = requestAnimationFrame(loop)
    }
    if (!reduced) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-bg">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle,var(--bg)_0%,transparent_55%)] px-6 text-center">
        <h2 className="text-4xl font-semibold tracking-tight">Develop. Preview. Ship.</h2>
      </div>
    </div>
  )
}
