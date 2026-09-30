import { useState } from 'react'

/*
 * Pixel page transition: a grid of squares covers the screen in a random
 * order (each cell gets a random delay), the content swaps underneath at
 * full cover, then the cells clear in a new random order. Pure CSS
 * transitions on transform: scale. Reduced motion: instant swap.
 */

const COLS = 12
const ROWS = 7
const PAGES = [
  { t: 'Index', bg: 'linear-gradient(135deg,#1e1b4b,#4338ca)' },
  { t: 'Work', bg: 'linear-gradient(135deg,#431407,#ea580c)' },
  { t: 'About', bg: 'linear-gradient(135deg,#052e16,#16a34a)' },
]
const rnd = () => Array.from({ length: COLS * ROWS }, () => Math.random() * 400)

export default function PixelTransition() {
  const [page, setPage] = useState(0)
  const [cover, setCover] = useState(false)
  const [delays, setDelays] = useState(rnd)

  const go = (n: number) => {
    if (cover || n === page) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setPage(n)
    setDelays(rnd())
    setCover(true)
    setTimeout(() => {
      setPage(n)
      setDelays(rnd())
      setCover(false)
    }, 750)
  }

  return (
    <div className="relative h-80 overflow-hidden rounded-xl text-white" style={{ background: PAGES[page].bg }}>
      <nav className="absolute top-4 left-4 z-10 flex gap-2" aria-label="Pages">
        {PAGES.map((p, i) => (
          <button key={p.t} onClick={() => go(i)} aria-current={i === page ? 'page' : undefined} className={`rounded-full px-3 py-1 text-xs ${i === page ? 'bg-white text-black' : 'bg-white/15'}`}>
            {p.t}
          </button>
        ))}
      </nav>
      <h3 className="absolute bottom-6 left-6 font-display text-6xl italic">{PAGES[page].t}</h3>
      <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)` }} aria-hidden>
        {delays.map((d, i) => (
          <span
            key={i}
            className="bg-neutral-950"
            style={{ transform: `scale(${cover ? 1.02 : 0})`, transition: 'transform .25s ease', transitionDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
