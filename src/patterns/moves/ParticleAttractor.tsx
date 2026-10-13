import { useEffect, useRef } from 'react'

/*
 * Signature move (Active Theory): a field of particles with depth that leans toward the cursor and settles
 * back. Each particle has a home, a depth (z) that scales its size, alpha and parallax, and a spring.
 * 2D canvas, no libraries. Reduced motion: one still frame.
 */

export default function ParticleAttractor() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const css = getComputedStyle(canvas)
    const accent = css.getPropertyValue('--accent').trim() || '#f90'
    const fg = css.getPropertyValue('--fg').trim() || '#eee'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const N = 700
    type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; z: number }
    let ps: P[] = []
    let w = 0
    let h = 0
    const mouse = { x: -9999, y: -9999, active: false }
    let raf = 0

    const seed = () => {
      ps = Array.from({ length: N }, () => {
        const hx = Math.random() * w
        const hy = Math.random() * h
        return { hx, hy, x: hx, y: hy, vx: 0, vy: 0, z: Math.random() }
      })
    }
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    fit()

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        const par = (p.z - 0.5) * 18
        const tx = p.hx + (mouse.active ? ((mouse.x - w / 2) / w) * par * -1 : 0)
        const ty = p.hy + (mouse.active ? ((mouse.y - h / 2) / h) * par * -1 : 0)
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const d = Math.hypot(dx, dy)
        let ax = (tx - p.x) * 0.04
        let ay = (ty - p.y) * 0.04
        if (mouse.active && d < 170) {
          const pull = (1 - d / 170) * (0.6 + p.z)
          ax += (dx / (d || 1)) * pull * 1.4
          ay += (dy / (d || 1)) * pull * 1.4
        }
        p.vx = (p.vx + ax) * 0.86
        p.vy = (p.vy + ay) * 0.86
        p.x += p.vx
        p.y += p.vy
        ctx.globalAlpha = 0.25 + p.z * 0.7
        ctx.fillStyle = p.z > 0.8 ? accent : fg
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.6 + p.z * 1.9, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    if (reduced) draw()
    else raf = requestAnimationFrame(loop)

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = true
    }
    const leave = () => {
      mouse.active = false
      mouse.x = mouse.y = -9999
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-surface">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
      <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] text-fg-muted">Move the pointer through the field</p>
    </div>
  )
}
