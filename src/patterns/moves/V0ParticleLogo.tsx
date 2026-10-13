import { useEffect, useRef } from 'react'

/*
 * Vibe-coded move (v0 icon particles, v0): a logo made of particles that scatter from the pointer and re-form.
 * The shape (a triangle here; swap in any path) is drawn once offscreen and sampled on a grid; each lit sample is
 * a particle with a home position and a spring. 2D canvas, no GLSL or three.js. Reduced motion: the logo is
 * drawn once, still. The canvas has a text alternative.
 */

export default function V0ParticleLogo() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const fg = getComputedStyle(cv).getPropertyValue('--fg').trim() || '#fff'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number }
    let ps: P[] = []
    let w = 0, h = 0, raf = 0
    const mouse = { x: -999, y: -999 }

    const build = () => {
      const off = document.createElement('canvas')
      off.width = w; off.height = h
      const o = off.getContext('2d')!
      const s = Math.min(w, h) * 0.55
      o.fillStyle = '#000'
      o.beginPath()
      o.moveTo(w / 2, h / 2 - s / 2)
      o.lineTo(w / 2 + s * 0.58, h / 2 + s / 2)
      o.lineTo(w / 2 - s * 0.58, h / 2 + s / 2)
      o.closePath(); o.fill()
      const data = o.getImageData(0, 0, w, h).data
      ps = []
      for (let y = 3; y < h; y += 5) for (let x = 3; x < w; x += 5) if (data[((y | 0) * w + (x | 0)) * 4 + 3] > 128) ps.push({ hx: x, hy: y, x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0 })
    }
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = cv.clientWidth; h = cv.clientHeight
      cv.width = w * dpr; cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      if (reduced) for (const p of ps) { p.x = p.hx; p.y = p.hy }
    }
    const ro = new ResizeObserver(fit); ro.observe(cv); fit()

    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = fg
      for (const p of ps) {
        if (!reduced) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy)
          let ax = (p.hx - p.x) * 0.045, ay = (p.hy - p.y) * 0.045
          if (d < 80 && d > 0) { const f = (1 - d / 80) * 5; ax += (dx / d) * f; ay += (dy / d) * f }
          p.vx = (p.vx + ax) * 0.86; p.vy = (p.vy + ay) * 0.86
          p.x += p.vx; p.y += p.vy
        }
        ctx.fillRect(p.x, p.y, 2.2, 2.2)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const leave = () => { mouse.x = mouse.y = -999 }
    cv.addEventListener('pointermove', move); cv.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerleave', leave) }
  }, [])

  return (
    <div className="rounded-xl border border-border bg-bg">
      <canvas ref={ref} className="block h-80 w-full text-fg" role="img" aria-label="A triangle logo made of particles that scatter from the pointer" />
    </div>
  )
}
