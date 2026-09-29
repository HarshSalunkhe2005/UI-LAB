import { useRef } from 'react'
import { img } from '../three-d/_shared'

/*
 * Cursor image trail: every N pixels of pointer travel, drop the next image
 * from a pool at the pointer, then scale/fade it out. A fixed pool of DOM
 * nodes is recycled (no mounting per move). Decorative; off under reduced
 * motion.
 */

const POOL = 10
const DIST = 80

export default function ImageTrail() {
  const nodes = useRef<(HTMLImageElement | null)[]>([])
  const last = useRef({ x: 0, y: 0, i: 0 })

  return (
    <div
      className="relative grid h-80 place-items-center overflow-hidden rounded-xl border border-border bg-bg"
      onPointerMove={(e) => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const r = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        if (Math.hypot(x - last.current.x, y - last.current.y) < DIST) return
        last.current.x = x
        last.current.y = y
        const el = nodes.current[last.current.i++ % POOL]
        if (!el) return
        el.getAnimations().forEach((a) => a.cancel())
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.zIndex = String(last.current.i)
        el.animate(
          [
            { opacity: 1, transform: 'translate(-50%,-50%) scale(.6) rotate(-6deg)' },
            { opacity: 1, transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', offset: 0.25 },
            { opacity: 0, transform: 'translate(-50%,-40%) scale(.85)' },
          ],
          { duration: 1100, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
        )
      }}
    >
      {Array.from({ length: POOL }, (_, i) => (
        <img key={i} ref={(el) => { nodes.current[i] = el }} src={img(i + 600, 200, 260)} alt="" aria-hidden className="pointer-events-none absolute h-32 w-24 rounded-md object-cover opacity-0 shadow-lg" />
      ))}
      <p className="relative font-display text-5xl italic">Move around</p>
    </div>
  )
}
