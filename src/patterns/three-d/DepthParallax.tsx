import { useRef } from 'react'

/*
 * Layered depth on hover: several layers translate by different amounts
 * against the pointer (far layers move less), plus a slight whole-card tilt.
 * Pointer offset goes to CSS vars on the container; each layer multiplies
 * it by its own depth, so there is no React re-render per frame.
 */

const LAYERS = [
  { d: 0.2, el: <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-violet-900 to-fuchsia-800" /> },
  { d: 0.5, el: <div className="absolute top-8 right-10 h-16 w-16 rounded-full bg-amber-200 shadow-[0_0_60px_20px_rgba(253,230,138,.35)]" /> },
  { d: 0.9, el: <svg viewBox="0 0 400 200" className="absolute inset-x-[-10%] bottom-0 w-[120%] fill-violet-950/80" preserveAspectRatio="none"><path d="M0 200 L0 120 L80 60 L150 110 L230 40 L320 100 L400 70 L400 200Z" /></svg> },
  { d: 1.5, el: <svg viewBox="0 0 400 200" className="absolute inset-x-[-10%] bottom-[-10px] w-[120%] fill-black/80" preserveAspectRatio="none"><path d="M0 200 L0 150 L60 120 L120 150 L200 110 L280 160 L340 130 L400 150 L400 200Z" /></svg> },
  { d: 2.2, el: <p className="absolute bottom-6 left-6 font-display text-4xl text-white italic">Nightfall</p> },
]

export default function DepthParallax() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="grid place-items-center [perspective:1000px]">
      <div
        ref={ref}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5))
          e.currentTarget.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5))
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty('--px', '0')
          e.currentTarget.style.setProperty('--py', '0')
        }}
        role="img"
        aria-label="Layered mountain scene at night with moon"
        className="relative h-72 w-full max-w-md overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 ease-out motion-reduce:!transform-none"
        style={{ transform: 'rotateY(calc(var(--px, 0) * 10deg)) rotateX(calc(var(--py, 0) * -10deg))' }}
      >
        {LAYERS.map((l, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-transform duration-300 ease-out motion-reduce:!transform-none"
            style={{ transform: `translate(calc(var(--px, 0) * ${-l.d * 24}px), calc(var(--py, 0) * ${-l.d * 16}px)) scale(1.08)` }}
          >
            {l.el}
          </div>
        ))}
      </div>
    </div>
  )
}
