import { useEffect, useRef } from 'react'

/*
 * Signature move (Lusion-style playful 3D studio): objects that fall, pile up and get shoved around by the
 * cursor. Verlet circles with gravity, wall and circle-circle constraints; click to drop another one.
 * 2D canvas, no physics library. Reduced motion: the pile is solved once and drawn still.
 */

type Ball = { x: number; y: number; px: number; py: number; r: number; hue: number }

export default function PhysicsBalls() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const accent = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#f90'
    let w = 0
    let h = 0
    const balls: Ball[] = []
    const mouse = { x: -999, y: -999, on: false }
    let raf = 0

    const add = (x: number, y: number) => {
      if (balls.length > 90) balls.shift()
      const r = 14 + Math.random() * 20
      balls.push({ x, y, px: x - (Math.random() - 0.5) * 4, py: y, r, hue: Math.random() })
    }
    const fit = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    fit()
    for (let i = 0; i < 28; i++) add(w * 0.2 + Math.random() * w * 0.6, -Math.random() * 400)

    const simulate = (dt: number) => {
      for (const b of balls) {
        const vx = (b.x - b.px) * 0.995
        const vy = (b.y - b.py) * 0.995
        b.px = b.x
        b.py = b.y
        b.x += vx
        b.y += vy + 1400 * dt * dt
        if (mouse.on) {
          const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy)
          if (d < b.r + 46 && d > 0) {
            const f = (b.r + 46 - d) * 0.12
            b.x += (dx / d) * f
            b.y += (dy / d) * f
          }
        }
      }
      for (let it = 0; it < 3; it++) {
        for (const b of balls) {
          b.x = Math.max(b.r, Math.min(w - b.r, b.x))
          if (b.y > h - b.r) b.y = h - b.r
        }
        for (let i = 0; i < balls.length; i++)
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i], b = balls[j]
            const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r
            if (d < min && d > 0) {
              const push = (min - d) / 2
              a.x -= (dx / d) * push
              a.y -= (dy / d) * push
              b.x += (dx / d) * push
              b.y += (dy / d) * push
            }
          }
      }
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const b of balls) {
        const g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.4, 1, b.x, b.y, b.r)
        g.addColorStop(0, b.hue > 0.7 ? '#fff' : accent)
        g.addColorStop(1, b.hue > 0.7 ? '#9aa' : `hsl(${20 + b.hue * 30} 80% 38%)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    if (reduced) {
      for (let i = 0; i < 240; i++) simulate(1 / 60)
      draw()
    } else {
      const loop = () => {
        simulate(1 / 60)
        draw()
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.on = true
    }
    const leave = () => (mouse.on = false)
    const click = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      add(e.clientX - r.left, e.clientY - r.top)
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('pointerdown', click)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('pointerdown', click)
    }
  }, [])

  return (
    <div className="relative h-96 overflow-hidden rounded-xl border border-border bg-surface">
      <canvas ref={ref} className="absolute inset-0 h-full w-full touch-none" aria-hidden />
      <p className="pointer-events-none absolute top-3 left-4 font-mono text-[11px] text-fg-muted">Push them with the pointer. Click to drop one.</p>
    </div>
  )
}
