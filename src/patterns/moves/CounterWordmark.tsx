import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Signature move (Edolus, Awwwards SOTD): a preloader that is part of the brand. A small percentage counts up in the
 * dark; when it reaches 100 the wordmark rises into place letter by letter and the counter steps aside. Letters move
 * with transform only. The wordmark is real text in the DOM from the start (visually hidden until revealed) so it is
 * announced and indexed. Reduced motion: the wordmark simply appears.
 */

const WORD = 'EDOLUS'.split('')

export default function CounterWordmark() {
  const [n, setN] = useState(0)
  const [run, setRun] = useState(0)
  const raf = useRef(0)
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  const play = useCallback(() => setRun((r) => r + 1), [])

  useEffect(() => {
    if (reduced) {
      setN(100)
      return
    }
    setN(0)
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2200)
      setN(Math.round((1 - Math.pow(1 - p, 2.4)) * 100))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [run, reduced])

  const done = n >= 100
  return (
    <div className="relative grid h-72 place-items-center overflow-hidden rounded-xl border border-border bg-black text-white">
      <h3 className="flex text-5xl font-light tracking-[0.2em] sm:text-6xl" aria-label="Edolus">
        {WORD.map((ch, i) => (
          <span key={i} className="overflow-hidden pr-[0.12em]" aria-hidden>
            <span
              className="inline-block transition-transform duration-700 ease-out-expo motion-reduce:transition-none"
              style={{ transform: done ? 'none' : 'translateY(110%)', transitionDelay: done ? `${i * 70}ms` : '0ms' }}
            >
              {ch}
            </span>
          </span>
        ))}
      </h3>
      <p
        className="absolute bottom-10 font-mono text-xs tracking-widest transition-opacity duration-500 motion-reduce:transition-none"
        style={{ opacity: done ? 0.35 : 1 }}
        role="status"
        aria-live="off"
      >
        {String(n).padStart(3, '0')}%
      </p>
      <button onClick={play} className="absolute top-3 right-3 min-h-11 rounded-md border border-white/25 px-3 text-xs text-white/80 hover:text-white">
        Replay
      </button>
    </div>
  )
}
