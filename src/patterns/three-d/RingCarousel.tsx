import { useEffect, useRef, useState } from 'react'

/*
 * Cards seated around a real 3D cylinder (CSS 3D, no canvas). Drag to spin,
 * release to coast with momentum and settle on the nearest card. The back
 * side stays visible through the gaps, mirrored, which is what sells the
 * depth. Arrow keys step one card; reduced motion snaps without coasting.
 */

const CARDS = Array.from({ length: 10 }, (_, i) => ({ id: i, hue: (i * 36 + 200) % 360 }))

export default function RingCarousel() {
  const n = CARDS.length
  const step = 360 / n
  const width = 150
  const radius = Math.round(width / 2 / Math.tan(Math.PI / n)) + 30
  const [angle, setAngle] = useState(0)
  const drag = useRef<{ x: number; a: number; v: number; t: number } | null>(null)
  const raf = useRef(0)
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  const settle = (a: number, v: number) => {
    cancelAnimationFrame(raf.current)
    if (reduced) return setAngle(Math.round(a / step) * step)
    let cur = a
    let vel = v
    const tick = () => {
      vel *= 0.94
      cur += vel
      if (Math.abs(vel) < 0.3) {
        const target = Math.round(cur / step) * step
        cur += (target - cur) * 0.15
        if (Math.abs(target - cur) < 0.05) return setAngle(target)
      }
      setAngle(cur)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const active = ((Math.round(-angle / step) % n) + n) % n

  return (
    <div
      className="relative h-80 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      style={{ perspective: '1100px' }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Ring carousel, card ${active + 1} of ${n}. Use arrow keys to rotate.`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') settle(angle - step, 0)
        if (e.key === 'ArrowLeft') settle(angle + step, 0)
      }}
      onPointerDown={(e) => {
        cancelAnimationFrame(raf.current)
        e.currentTarget.setPointerCapture(e.pointerId)
        drag.current = { x: e.clientX, a: angle, v: 0, t: performance.now() }
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d) return
        const next = d.a + (e.clientX - d.x) * 0.3
        const now = performance.now()
        d.v = ((next - angle) / Math.max(1, now - d.t)) * 16
        d.t = now
        setAngle(next)
      }}
      onPointerUp={() => {
        const d = drag.current
        drag.current = null
        if (d) settle(angle, d.v)
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 h-0 w-0"
        style={{ transformStyle: 'preserve-3d', transform: `translateZ(${-radius}px) rotateX(-8deg) rotateY(${angle}deg)` }}
      >
        {CARDS.map((c, i) => (
          <div
            key={c.id}
            className="absolute flex h-52 flex-col justify-end rounded-xl border border-white/20 p-4 text-white shadow-lg"
            style={{
              width,
              left: -width / 2,
              top: -104,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              background: `linear-gradient(160deg, hsl(${c.hue} 80% 60%), hsl(${c.hue + 40} 70% 25%))`,
            }}
            aria-hidden={i !== active}
          >
            <span className="font-mono text-[11px] opacity-80">No. {String(i + 1).padStart(2, '0')}</span>
            <span className="font-display text-2xl italic">Frame {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
