import { useRef } from 'react'
import { img } from '../three-d/_shared'

/*
 * Layered image tilt: the image plus two semi-transparent copies move and
 * rotate by different amounts with the pointer, so the picture seems to
 * separate into depth layers. A title floats above at the largest depth.
 * Transforms are written to style directly.
 */

const DEPTHS = [1, 1.6, 2.4]

export default function ImageTilt() {
  const layers = useRef<(HTMLElement | null)[]>([])
  const move = (x: number, y: number) =>
    layers.current.forEach((el, i) => {
      if (!el) return
      const d = i < DEPTHS.length ? DEPTHS[i] : 3.2
      el.style.transform = `translate(${x * d * 10}px, ${y * d * 10}px) rotateX(${-y * d * 3}deg) rotateY(${x * d * 3}deg)`
    })
  return (
    <div className="grid place-items-center py-6 [perspective:900px]">
      <div
        className="relative h-80 w-64 motion-reduce:pointer-events-none"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          move((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5)
        }}
        onPointerLeave={() => move(0, 0)}
      >
        {DEPTHS.map((_, i) => (
          <img
            key={i}
            ref={(el) => { layers.current[i] = el }}
            src={img(1200, 400, 500)}
            alt={i === 0 ? 'Mountain lake at dusk' : ''}
            aria-hidden={i > 0}
            className="absolute inset-0 h-full w-full rounded-2xl object-cover transition-transform duration-300 ease-out"
            style={{ opacity: i === 0 ? 1 : 0.28, mixBlendMode: i ? 'screen' : undefined }}
          />
        ))}
        <p
          ref={(el) => { layers.current[3] = el }}
          className="absolute bottom-6 left-6 font-display text-4xl text-white italic drop-shadow-lg transition-transform duration-300 ease-out"
        >
          Stillwater
        </p>
      </div>
    </div>
  )
}
