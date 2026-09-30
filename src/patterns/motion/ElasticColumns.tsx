import { useEffect, useRef } from 'react'
import { img } from '../three-d/_shared'

/*
 * Elastic grid scroll: each column follows scroll with its own lag (lerp
 * factor), so fast scrolling stretches the grid and it settles back softly.
 * Middle column also moves the opposite way for parallax. rAF loop writes
 * transforms directly; stops when settled. Reduced motion: plain grid.
 */

const LAGS = [0.08, 0.14, 0.2]

export default function ElasticColumns() {
  const box = useRef<HTMLDivElement>(null)
  const cols = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = box.current!
    const cur = LAGS.map(() => 0)
    let raf = 0
    const tick = () => {
      const target = el.scrollTop
      let moving = false
      LAGS.forEach((lag, i) => {
        cur[i] += (target - cur[i]) * lag
        if (Math.abs(target - cur[i]) > 0.3) moving = true
        const offset = (target - cur[i]) * (i === 1 ? -0.6 : 1)
        cols.current[i]!.style.transform = `translateY(${-offset}px)`
      })
      raf = moving ? requestAnimationFrame(tick) : 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={box} className="h-96 overflow-y-auto rounded-xl border border-border" tabIndex={0} aria-label="Elastic grid, scroll fast inside">
      <div className="grid grid-cols-3 gap-3 p-4">
        {LAGS.map((_, c) => (
          <div key={c} ref={(el) => { cols.current[c] = el }} className="space-y-3 will-change-transform">
            {Array.from({ length: 8 }, (_, i) => (
              <img key={i} src={img(c * 20 + i + 1400, 300, i % 2 ? 360 : 280)} alt="" className="w-full rounded-lg object-cover" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
