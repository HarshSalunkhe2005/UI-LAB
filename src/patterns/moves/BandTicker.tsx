import { useEffect, useRef } from 'react'

/*
 * Signature move (Boc.Studio, Awwwards SOTD): one flat accent band running across a rich image. It carries the logo
 * and a line of small facts (a place, coordinates, what the studio does) on repeat, drifts slowly, and speeds up and
 * turns round with your scrolling. Scroll the panel to feel it. One element moves, by transform only; the band is
 * decorative, so the same facts must also exist as normal text elsewhere. Reduced motion: the band stands still.
 */

const ITEM = 'Boc.Studio  ·  Creative brand studio  ·  41.40° N, 2.15° E  ·  Barcelona  ·  '

export default function BandTicker() {
  const box = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = box.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let x = 0
    let dir = -1
    let boost = 0
    let last = el.scrollTop
    let raf = 0
    const tick = () => {
      const v = el.scrollTop - last
      last = el.scrollTop
      if (Math.abs(v) > 0.5) {
        dir = v > 0 ? -1 : 1
        boost = Math.min(30, boost + Math.abs(v) * 0.5)
      }
      boost *= 0.92
      const w = first.current?.offsetWidth || 600
      x += dir * (0.6 + boost)
      if (x <= -w) x += w
      if (x > 0) x -= w
      if (track.current) track.current.style.transform = `translateX(${x}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div ref={box} tabIndex={0} role="region" aria-label="Scroll to speed up the band" className="relative overflow-y-auto" style={{ height: 320 }}>
        <div style={{ height: 760 }}>
          <div className="sticky top-0 grid place-items-center overflow-hidden" style={{ height: 320, background: 'radial-gradient(circle at 25% 30%, #9fd39a 0, transparent 38%), radial-gradient(circle at 70% 70%, #5f9b6a 0, transparent 40%), linear-gradient(160deg, #aeb7bf, #7e8993)' }}>
            <div className="absolute inset-x-0 overflow-hidden bg-[#ff4a1c] py-3 text-white" aria-hidden>
              <div ref={track} className="flex w-max whitespace-pre text-sm font-medium will-change-transform">
                <span ref={first}>{ITEM.repeat(4)}</span>
                <span>{ITEM.repeat(4)}</span>
                <span>{ITEM.repeat(4)}</span>
              </div>
            </div>
            <p className="sr-only">Boc.Studio, a creative brand studio in Barcelona.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
