import { useEffect, useMemo, useState } from 'react'
import { img, makeSpinner } from './_shared'

/*
 * Two opposing strands of a double helix, pictures on each, with "rungs"
 * between pairs. Strand B is strand A rotated 180°. Depth is faked with
 * scale + brightness + blur from each card's z, and z-index sorted by it.
 * Horizontal drag scrolls the helix along its axis.
 */

export default function DnaCarousel({ pairs = 12 }: { pairs?: number }) {
  const [t, setT] = useState(0)
  const spinner = useMemo(() => makeSpinner(setT, { idle: 0.25, sensitivity: 0.35 }), [])
  useEffect(() => {
    spinner.start()
    return () => spinner.stop()
  }, [spinner])

  const spacing = 70
  const amp = 90
  const items: { x: number; y: number; z: number; key: string; seed: number }[] = []
  for (let i = 0; i < pairs; i++) {
    const phase = (i * 32 + t) * (Math.PI / 180)
    const x = ((i * spacing + t * 2) % (pairs * spacing)) - (pairs * spacing) / 2
    for (const s of [0, 1]) {
      const p = phase + s * Math.PI
      items.push({ x, y: Math.sin(p) * amp, z: Math.cos(p), key: `${i}-${s}`, seed: i * 2 + s })
    }
  }

  return (
    <div
      {...spinner.handlers}
      className="relative h-80 cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
      role="img"
      aria-label="Double helix of images, drag to scroll"
    >
      {items
        .filter((it) => it.seed % 2 === 0)
        .map((it) => {
          const pair = items.find((o) => o.key === it.key.replace('-0', '-1'))!
          return (
            <span
              key={`rung-${it.key}`}
              aria-hidden
              className="absolute left-1/2 w-px bg-fg-muted/25"
              style={{ transform: `translateX(${it.x}px)`, top: `calc(50% + ${Math.min(it.y, pair.y)}px)`, height: Math.abs(it.y - pair.y) }}
            />
          )
        })}
      {items.map((it) => {
        const s = 0.65 + (it.z + 1) * 0.25
        return (
          <img
            key={it.key}
            src={img(it.seed, 160, 200)}
            alt=""
            draggable={false}
            className="absolute top-1/2 left-1/2 h-24 w-18 -mt-12 -ml-9 rounded-md object-cover shadow-md"
            style={{
              transform: `translate(${it.x}px, ${it.y}px) scale(${s})`,
              zIndex: Math.round((it.z + 1) * 100),
              filter: `brightness(${0.5 + (it.z + 1) * 0.28}) blur(${it.z < -0.3 ? 1.5 : 0}px)`,
            }}
          />
        )
      })}
    </div>
  )
}
