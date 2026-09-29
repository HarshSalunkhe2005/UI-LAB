import { useEffect, useMemo, useState } from 'react'
import { img, makeSpinner } from './_shared'

/*
 * An endless ribbon of cards bent into a wave in depth. Each card's x is
 * its index offset by scroll; its z and tilt follow a sine of that x, so
 * cards ride up over the crest and sink into fog beyond it. Fog = opacity
 * and blur from z. Drag or wheel to travel.
 */

export default function WaveGallery({ count = 14 }: { count?: number }) {
  const [pos, setPos] = useState(0)
  const spinner = useMemo(() => makeSpinner(setPos, { idle: -0.6, sensitivity: 1 }), [])
  useEffect(() => {
    spinner.start()
    return () => spinner.stop()
  }, [spinner])

  const gap = 170
  const span = count * gap
  return (
    <div
      {...spinner.handlers}
      onWheel={(e) => spinner.nudge(-e.deltaY * 0.5)}
      className="relative h-80 cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
      style={{ perspective: '900px' }}
      role="img"
      aria-label="Wave of project cards, drag to travel"
    >
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {Array.from({ length: count }, (_, i) => {
          const x = ((((i * gap + pos) % span) + span) % span) - span / 2
          const k = (x / span) * Math.PI * 2
          const z = Math.cos(k) * 160 - 120
          const tilt = -Math.sin(k) * 35
          const fog = Math.min(1, Math.max(0, (z + 280) / 320))
          return (
            <figure
              key={i}
              className="absolute top-1/2 left-1/2 -mt-28 -ml-20 w-40 overflow-hidden rounded-xl bg-surface shadow-lg"
              style={{ transform: `translateX(${x}px) translateZ(${z}px) rotateY(${tilt}deg)`, opacity: 0.2 + fog * 0.8, filter: `blur(${(1 - fog) * 3}px)` }}
            >
              <img src={img(i + 40, 240, 300)} alt="" draggable={false} className="h-48 w-full object-cover" />
              <figcaption className="px-3 py-2 font-mono text-[11px] text-fg-muted">Project {String(i + 1).padStart(2, '0')}</figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
