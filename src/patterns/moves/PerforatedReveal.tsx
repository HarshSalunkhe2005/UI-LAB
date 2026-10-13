import { useEffect, useRef } from 'react'

/*
 * Signature move (Neutomni, Awwwards SOTD): a poster-sized wordmark with a dashed "cut along line" through it.
 * Scrolling tears the sheet along the line: the top half slides up, the bottom half slides down, and the content
 * that was underneath is revealed. Two clipped copies of one hero, moved with transforms only.
 * Reduced motion: the tear is a single jump at the halfway point, no travelling.
 */

const H = 340

function Hero() {
  return (
    <div className="absolute inset-x-0 bg-[#cf1830] text-white" style={{ height: H }} aria-hidden>
      <p className="px-3 pt-3 font-display text-[clamp(64px,14vw,150px)] leading-[0.9] tracking-tight uppercase">Slit open</p>
      <p className="absolute right-4 bottom-4 font-mono text-[11px] tracking-widest uppercase">scroll to tear</p>
    </div>
  )
}

export default function PerforatedReveal() {
  const box = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const apply = () => {
      raf = 0
      const max = el.scrollHeight - el.clientHeight
      let p = max > 0 ? Math.min(1, el.scrollTop / (max * 0.7)) : 0
      if (reduced) p = p > 0.5 ? 1 : 0
      if (top.current) top.current.style.transform = `translateY(${-p * 100}%)`
      if (bot.current) bot.current.style.transform = `translateY(${p * 100}%)`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    el.addEventListener('scroll', on, { passive: true })
    apply()
    return () => {
      el.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div ref={box} tabIndex={0} role="region" aria-label="Scroll to tear the sheet open" className="relative overflow-y-auto" style={{ height: H }}>
        <div style={{ height: H * 3 }}>
          <div className="sticky top-0 overflow-hidden" style={{ height: H }}>
            <div className="absolute inset-0 grid place-content-center bg-[#f4efe6] px-8 text-center text-[#17120f]">
              <p className="font-display text-3xl italic sm:text-4xl">What was underneath</p>
              <p className="mx-auto mt-2 max-w-sm text-sm">The content sits still. Only the cover moves, so nothing has to reflow while it opens.</p>
            </div>
            <div ref={top} className="absolute inset-x-0 top-0 overflow-hidden will-change-transform" style={{ height: H * 0.55 }}>
              <Hero />
            </div>
            <div ref={bot} className="absolute inset-x-0 bottom-0 overflow-hidden will-change-transform" style={{ height: H * 0.45 }}>
              <div className="absolute inset-x-0 bottom-0" style={{ height: H }}>
                <Hero />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-white/80" style={{ top: H * 0.55 }} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
