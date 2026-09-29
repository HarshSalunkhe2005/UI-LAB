import { useEffect, useRef } from 'react'

/*
 * A faint dot grid that bends toward the pointer like a rubber sheet under a
 * weight. Each dot is displaced by a Gaussian falloff of its distance to the
 * (eased) pointer; dots near the well grow brighter. Canvas 2D, no shader.
 * Idles when the pointer is away; static grid under reduced motion.
 */

export function DotGridWarp({ gap = 22, strength = 38, radius = 120, className = '' }: { gap?: number; strength?: number; radius?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const color = getComputedStyle(c).color
    const target = { x: -9999, y: -9999 }
    const cur = { x: -9999, y: -9999 }
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
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      const r2 = 2 * radius * radius
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = cur.x - x
          const dy = cur.y - y
          const f = Math.exp(-(dx * dx + dy * dy) / r2)
          const d = Math.hypot(dx, dy) || 1
          const px = x + (dx / d) * strength * f
          const py = y + (dy / d) * strength * f
          ctx.globalAlpha = 0.18 + f * 0.8
          ctx.beginPath()
          ctx.arc(px, py, 1 + f * 1.6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const loop = () => {
      cur.x += (target.x - cur.x) * 0.12
      cur.y += (target.y - cur.y) * 0.12
      draw()
      if (Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.5) raf = requestAnimationFrame(loop)
      else raf = 0
    }

    const move = (e: PointerEvent) => {
      if (reduced) return
      const r = c.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      if (cur.x < -1000) {
        cur.x = target.x
        cur.y = target.y
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const leave = () => {
      target.x = target.y = -9999
      cur.x = cur.y = -9999
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(c)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerleave', leave)
    }
  }, [gap, strength, radius])

  return <canvas ref={ref} className={`block h-full w-full text-fg ${className}`} aria-hidden />
}

export default function DotGridWarpDemo() {
  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-bg">
      <DotGridWarp />
      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-mono text-xs text-fg-muted">move the pointer over the grid</p>
    </div>
  )
}
