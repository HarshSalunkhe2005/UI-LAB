import { useEffect, useRef } from 'react'

/*
 * Warp starfield: stars in 3D space moving toward the camera, projected by
 * x/z, drawn as streaks whose length grows with speed. Hover to engage
 * warp (speed eases up). Canvas 2D; pauses off-screen; slow drift only
 * under reduced motion.
 */

export function Starfield({ count = 500, className = '' }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars = Array.from({ length: count }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }))
    let speed = 0.004
    let target = 0.004
    let raf = 0
    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const tick = () => {
      speed += (target - speed) * 0.05
      ctx.fillStyle = 'rgba(0,0,0,.35)'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#fff'
      for (const s of stars) {
        const pz = s.z
        s.z -= reduced ? 0.0005 : speed
        if (s.z <= 0.01) {
          s.x = Math.random() * 2 - 1
          s.y = Math.random() * 2 - 1
          s.z = 1
          continue
        }
        const k = Math.min(w, h) * 0.5
        const x = w / 2 + (s.x / s.z) * k
        const y = h / 2 + (s.y / s.z) * k
        const px = w / 2 + (s.x / pz) * k
        const py = h / 2 + (s.y / pz) * k
        ctx.globalAlpha = Math.min(1, (1 - s.z) * 1.5)
        ctx.lineWidth = (1 - s.z) * 2
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
      raf = requestAnimationFrame(tick)
    }
    const on = () => (target = 0.035)
    const off = () => (target = 0.004)
    c.addEventListener('pointerenter', on)
    c.addEventListener('pointerleave', off)
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) raf = requestAnimationFrame(tick)
    })
    io.observe(c)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      c.removeEventListener('pointerenter', on)
      c.removeEventListener('pointerleave', off)
    }
  }, [count])
  return <canvas ref={ref} className={`block h-full w-full bg-black ${className}`} aria-hidden />
}

export default function StarfieldDemo() {
  return (
    <div className="relative h-80 overflow-hidden rounded-xl">
      <Starfield />
      <p className="pointer-events-none absolute inset-0 grid place-items-center font-display text-5xl text-white italic">hover to warp</p>
    </div>
  )
}
