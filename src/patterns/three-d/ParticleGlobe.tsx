import { useEffect, useRef } from 'react'

/*
 * A sphere of points on a Fibonacci lattice (even spacing, no clumping at
 * the poles), with a cheap noise mask deciding which points are "land".
 * Projected with plain trig onto a 2D canvas; back-facing points fade.
 * Drag to spin; release keeps the momentum, then it drifts back to idle.
 */

function landMask(lat: number, lon: number) {
  const v =
    Math.sin(lat * 3.1 + 1.3) * Math.cos(lon * 2.3) +
    Math.sin(lon * 4.7 + lat * 1.9) * 0.6 +
    Math.cos(lat * 7.3 - lon * 3.1) * 0.35
  return v > 0.35
}

export function ParticleGlobe({ points = 2600, className = '' }: { points?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const color = getComputedStyle(c).color
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    const pts: [number, number, number][] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < points; i++) {
      const y = 1 - (i / (points - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      const x = Math.cos(th) * r
      const z = Math.sin(th) * r
      if (landMask(Math.asin(y), Math.atan2(z, x))) pts.push([x, y, z])
    }

    let rot = 0
    let vel = reduced ? 0 : 0.004
    let dragging = false
    let lastX = 0
    let raf = 0
    let size = 0

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      size = Math.min(c.clientWidth, c.clientHeight)
      c.width = c.clientWidth * dpr
      c.height = c.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const w = c.clientWidth
      const h = c.clientHeight
      const R = size * 0.42
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      const cos = Math.cos(rot)
      const sin = Math.sin(rot)
      const tilt = 0.35
      for (const [x, y, z] of pts) {
        const rx = x * cos - z * sin
        const rz = x * sin + z * cos
        const ry = y * Math.cos(tilt) - rz * Math.sin(tilt)
        const rz2 = y * Math.sin(tilt) + rz * Math.cos(tilt)
        const depth = (rz2 + 1) / 2
        ctx.globalAlpha = 0.08 + depth * 0.85
        const s = 0.6 + depth * 1.1
        ctx.fillRect(w / 2 + rx * R - s / 2, h / 2 - ry * R - s / 2, s, s)
      }
    }

    const loop = () => {
      if (!dragging) {
        vel += ((reduced ? 0 : 0.004) - vel) * 0.02
        rot += vel
      }
      draw()
      raf = requestAnimationFrame(loop)
    }

    const down = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      c.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      vel = dx * 0.006
      rot += vel
    }
    const up = () => {
      dragging = false
    }

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(c)
    c.addEventListener('pointerdown', down)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerup', up)
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) raf = requestAnimationFrame(loop)
    })
    io.observe(c)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      c.removeEventListener('pointerdown', down)
      c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerup', up)
    }
  }, [points])

  return <canvas ref={ref} className={`block h-full w-full cursor-grab touch-pan-y text-accent active:cursor-grabbing ${className}`} role="img" aria-label="Rotating globe made of points" />
}

export default function ParticleGlobeDemo() {
  return (
    <div className="h-80">
      <ParticleGlobe />
    </div>
  )
}
