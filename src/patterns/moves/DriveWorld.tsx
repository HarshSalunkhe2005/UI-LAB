import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (Bruno Simon): navigation as play. A top-down car you drive with the arrow keys or WASD
 * (or by holding the pointer down: it steers toward the pointer). Crates can be pushed around; driving
 * onto a zone "opens" that section. 2D canvas, no libraries. Logical world is 1000 x 560, scaled to fit.
 */

const W = 1000
const H = 560
type Crate = { x: number; y: number; vx: number; vy: number }
const ZONES = [
  { label: 'Work', x: 200, y: 160 },
  { label: 'About', x: 780, y: 170 },
  { label: 'Contact', x: 500, y: 440 },
]

export default function DriveWorld() {
  const cv = useRef<HTMLCanvasElement>(null)
  const [zone, setZone] = useState<string | null>(null)

  useEffect(() => {
    const canvas = cv.current!
    const ctx = canvas.getContext('2d')!
    const css = getComputedStyle(canvas)
    const color = (v: string, fb: string) => css.getPropertyValue(v).trim() || fb
    const fg = color('--fg', '#eee'), accent = color('--accent', '#f90'), border = color('--border', '#444'), surface = color('--surface', '#111')

    const keys = new Set<string>()
    const car = { x: 500, y: 300, a: -Math.PI / 2, v: 0 }
    const crates: Crate[] = Array.from({ length: 9 }, (_, i) => ({ x: 120 + ((i * 97) % 760), y: 90 + ((i * 163) % 380), vx: 0, vy: 0 }))
    let pointer: { x: number; y: number } | null = null
    let current: string | null = null
    let last = performance.now()
    let raf = 0

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round((w * H * dpr) / W)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    fit()

    const toWorld = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }
    }
    const down = (e: PointerEvent) => {
      pointer = toWorld(e)
      canvas.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (pointer) pointer = toWorld(e)
    }
    const up = () => (pointer = null)
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      let steer = (keys.has('arrowright') || keys.has('d') ? 1 : 0) - (keys.has('arrowleft') || keys.has('a') ? 1 : 0)
      let gas = (keys.has('arrowup') || keys.has('w') ? 1 : 0) - (keys.has('arrowdown') || keys.has('s') ? 0.6 : 0)
      if (pointer) {
        const want = Math.atan2(pointer.y - car.y, pointer.x - car.x)
        let diff = want - car.a
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        steer = Math.max(-1, Math.min(1, diff * 2))
        gas = Math.hypot(pointer.x - car.x, pointer.y - car.y) > 30 ? 1 : 0
      }
      car.v += gas * 520 * dt
      car.v *= Math.pow(0.35, dt)
      car.a += steer * 2.8 * dt * Math.min(1, Math.abs(car.v) / 120) * Math.sign(car.v || 1)
      car.x += Math.cos(car.a) * car.v * dt
      car.y += Math.sin(car.a) * car.v * dt
      if (car.x < 20 || car.x > W - 20) { car.x = Math.max(20, Math.min(W - 20, car.x)); car.v *= -0.3 }
      if (car.y < 20 || car.y > H - 20) { car.y = Math.max(20, Math.min(H - 20, car.y)); car.v *= -0.3 }

      for (const c of crates) {
        const dx = c.x - car.x, dy = c.y - car.y, d = Math.hypot(dx, dy)
        if (d < 34 && d > 0) {
          const push = (34 - d) * 9
          c.vx += (dx / d) * push + Math.cos(car.a) * car.v * 0.4
          c.vy += (dy / d) * push + Math.sin(car.a) * car.v * 0.4
        }
        c.x += c.vx * dt
        c.y += c.vy * dt
        c.vx *= Math.pow(0.05, dt)
        c.vy *= Math.pow(0.05, dt)
        c.x = Math.max(14, Math.min(W - 14, c.x))
        c.y = Math.max(14, Math.min(H - 14, c.y))
      }

      const inside = ZONES.find((z) => Math.hypot(z.x - car.x, z.y - car.y) < 70)?.label ?? null
      if (inside !== current) {
        current = inside
        setZone(inside)
      }

      const s = canvas.width / W
      ctx.setTransform(s, 0, 0, s, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = surface
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = border
      for (let x = 20; x < W; x += 40) for (let y = 20; y < H; y += 40) ctx.fillRect(x, y, 2, 2)
      ctx.textAlign = 'center'
      ctx.font = '600 20px system-ui, sans-serif'
      for (const z of ZONES) {
        const on = z.label === current
        ctx.beginPath()
        ctx.arc(z.x, z.y, 70, 0, Math.PI * 2)
        ctx.fillStyle = on ? accent : 'transparent'
        ctx.globalAlpha = on ? 0.22 : 1
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.strokeStyle = on ? accent : border
        ctx.lineWidth = 2
        ctx.setLineDash([6, 8])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = on ? accent : fg
        ctx.fillText(z.label, z.x, z.y + 7)
      }
      ctx.fillStyle = fg
      ctx.globalAlpha = 0.55
      for (const c of crates) ctx.fillRect(c.x - 13, c.y - 13, 26, 26)
      ctx.globalAlpha = 1
      ctx.save()
      ctx.translate(car.x, car.y)
      ctx.rotate(car.a)
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.roundRect(-20, -11, 40, 22, 6)
      ctx.fill()
      ctx.fillStyle = surface
      ctx.fillRect(4, -8, 9, 16)
      ctx.restore()
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const kd = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault()
      keys.add(k)
    }
    const ku = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
    const wrap = canvas.parentElement!
    wrap.addEventListener('keydown', kd)
    wrap.addEventListener('keyup', ku)
    wrap.addEventListener('blur', () => keys.clear())
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrap.removeEventListener('keydown', kd)
      wrap.removeEventListener('keyup', ku)
    }
  }, [])

  return (
    <div
      tabIndex={0}
      role="application"
      aria-label="Drive the car with the arrow keys or WASD, or hold the pointer down to steer toward it. Drive onto a circle to open a section."
      className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border outline-offset-4"
    >
      <canvas ref={cv} className="block w-full touch-none" style={{ aspectRatio: `${W} / ${H}` }} />
      <p className="pointer-events-none absolute top-3 left-3 rounded-md bg-bg/70 px-2 py-1 font-mono text-[11px] text-fg-muted" aria-live="polite">
        {zone ? `Entered: ${zone}` : 'Arrow keys / WASD, or hold the pointer'}
      </p>
    </div>
  )
}
