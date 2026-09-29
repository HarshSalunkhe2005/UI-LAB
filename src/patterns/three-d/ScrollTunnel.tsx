import { useEffect, useRef, useState } from 'react'
import { img } from './_shared'

/*
 * Fly through a corridor of images. Cards are placed at increasing depth
 * along -Z, alternating left/right/up/down walls; scroll moves the camera
 * forward (translateZ on the world). Cards fade in from the fog and out as
 * they pass the camera. Scroll inside the frame (wheel, touch or keys).
 */

const N = 18
const GAP = 320

export default function ScrollTunnel() {
  const [z, setZ] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const max = N * GAP

  useEffect(() => {
    const el = ref.current!
    const onScroll = () => setZ((el.scrollTop / (el.scrollHeight - el.clientHeight)) * max)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [max])

  return (
    <div ref={ref} className="relative h-96 overflow-y-auto rounded-xl bg-black" tabIndex={0} aria-label="Image tunnel, scroll to fly forward">
      <div style={{ height: '600%' }}>
        <div className="sticky top-0 h-96 overflow-hidden" style={{ perspective: '600px' }}>
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: `translateZ(${z}px)` }}>
            {Array.from({ length: N }, (_, i) => {
              const depth = -(i + 1) * GAP
              const rel = depth + z
              const side = i % 4
              const [x, y] = [[-190, 0], [190, 0], [0, -120], [0, 120]][side]
              const opacity = rel > 150 ? 0 : Math.min(1, (rel + max * 0.35) / (max * 0.25))
              return (
                <img
                  key={i}
                  src={img(i + 200, 300, 220)}
                  alt=""
                  className="absolute top-1/2 left-1/2 -mt-[55px] -ml-[75px] h-[110px] w-[150px] rounded-md object-cover"
                  style={{ transform: `translate3d(${x}px, ${y}px, ${depth}px)`, opacity: Math.max(0, opacity) }}
                />
              )
            })}
          </div>
          <p className="absolute inset-x-0 bottom-3 text-center font-mono text-xs text-white/60">scroll ↓ to fly</p>
        </div>
      </div>
    </div>
  )
}
