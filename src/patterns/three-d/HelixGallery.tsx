import { useEffect, useMemo, useRef, useState } from 'react'
import { img, makeSpinner } from './_shared'

/*
 * Spiral of pictures: images wound onto a helix that turns and climbs.
 * Each image sits at angle a = i·step around a vertical axis and height
 * y = i·rise, so rotating the whole helix also "screws" it. The far side
 * dims and blurs so the spiral reads as depth. Drag to spin, keys to step.
 */

export function HelixGallery({ count = 44, radius = 220, rise = 11, step = 22 }: { count?: number; radius?: number; rise?: number; step?: number }) {
  const [angle, setAngle] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const spinner = useMemo(() => makeSpinner(setAngle, { idle: 0.15, sensitivity: 0.25 }), [])
  useEffect(() => {
    spinner.start()
    return () => spinner.stop()
  }, [spinner])

  const height = count * rise
  return (
    <div
      ref={ref}
      {...spinner.handlers}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Helix image gallery. Drag or use arrow keys to spin."
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') spinner.nudge(-step)
        if (e.key === 'ArrowLeft') spinner.nudge(step)
      }}
      className="relative h-[28rem] cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
      style={{ perspective: '1200px' }}
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateY(${-height / 2}px) rotateX(-14deg) rotateY(${angle}deg)`,
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const a = i * step
          const facing = Math.cos(((a + angle) * Math.PI) / 180)
          return (
            <img
              key={i}
              src={img(i, 240, 320)}
              alt=""
              draggable={false}
              className="absolute h-22 w-16 max-w-none -mt-11 -ml-8 rounded-lg object-cover shadow-lg"
              style={{
                transform: `rotateY(${a}deg) translateZ(${radius}px) translateY(${i * rise}px)`,
                filter: `brightness(${0.45 + Math.max(0, facing) * 0.6}) blur(${facing < 0 ? 2 : 0}px)`,
                backfaceVisibility: 'visible',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function HelixGalleryDemo() {
  return <HelixGallery />
}
