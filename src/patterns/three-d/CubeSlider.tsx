import { useState } from 'react'
import { img } from './_shared'

/*
 * 3D cube slider: four faces around a Y axis, the cube pulled back by half
 * its width so faces sit on its surface. Next/prev rotate 90°. Each face is
 * a full slide; only the front face is exposed to assistive tech.
 */

const SLIDES = ['North', 'East', 'South', 'West']

export default function CubeSlider() {
  const [i, setI] = useState(0)
  const size = 280
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="[perspective:1000px]" style={{ width: size, height: size * 0.75 }}>
        <div
          className="relative h-full w-full transition-transform duration-700 ease-out-expo [transform-style:preserve-3d]"
          style={{ transform: `translateZ(${-size / 2}px) rotateY(${-i * 90}deg)` }}
        >
          {SLIDES.map((s, k) => (
            <figure
              key={s}
              aria-hidden={((i % 4) + 4) % 4 !== k}
              className="absolute inset-0 overflow-hidden rounded-xl [backface-visibility:hidden]"
              style={{ transform: `rotateY(${k * 90}deg) translateZ(${size / 2}px)` }}
            >
              <img src={img(k + 400, 560, 420)} alt={`${s} view`} className="h-full w-full object-cover" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur">{s}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setI((n) => n - 1)} aria-label="Previous" className="rounded-full border border-border px-3 py-1">←</button>
        <span className="w-16 text-center font-mono text-xs text-fg-muted" aria-live="polite">{SLIDES[((i % 4) + 4) % 4]}</span>
        <button onClick={() => setI((n) => n + 1)} aria-label="Next" className="rounded-full border border-border px-3 py-1">→</button>
      </div>
    </div>
  )
}
