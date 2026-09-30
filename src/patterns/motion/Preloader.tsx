import { useEffect, useState } from 'react'

/*
 * Studio preloader: a big counter ticks 0 → 100 (eased, with random
 * pauses so it feels like real loading), a thin bar fills, then the loader
 * splits open (top/bottom curtains) to reveal the page. Exposes progress
 * with role="progressbar"; skipped entirely under reduced motion.
 */

export default function Preloader() {
  const [n, setN] = useState(0)
  const [done, setDone] = useState(false)
  const [run, setRun] = useState(0)

  useEffect(() => {
    setN(0)
    setDone(false)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(100)
      setDone(true)
      return
    }
    let v = 0
    let t = 0
    const step = () => {
      v = Math.min(100, v + Math.random() * 12)
      setN(Math.floor(v))
      if (v >= 100) t = window.setTimeout(() => setDone(true), 400)
      else t = window.setTimeout(step, 60 + (Math.random() < 0.15 ? 350 : Math.random() * 90))
    }
    t = window.setTimeout(step, 300)
    return () => clearTimeout(t)
  }, [run])

  return (
    <div className="relative h-80 overflow-hidden rounded-xl bg-bg">
      <div className="grid h-full place-items-center">
        <div className="text-center">
          <p className="font-display text-5xl italic">Welcome in.</p>
          <button onClick={() => setRun((r) => r + 1)} className="mt-4 text-sm text-fg-muted hover:text-fg">↻ Replay loader</button>
        </div>
      </div>
      {(['top', 'bottom'] as const).map((side) => (
        <div
          key={side}
          aria-hidden={done}
          className="absolute inset-x-0 h-1/2 bg-neutral-950 text-white transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)]"
          style={{ [side]: 0, transform: done ? `translateY(${side === 'top' ? '-100%' : '100%'})` : 'none' }}
        >
          {side === 'bottom' && (
            <div className="absolute inset-x-6 top-0 flex items-end justify-between">
              <span className="-mt-16 font-mono text-8xl font-light tabular-nums" role="progressbar" aria-valuenow={n} aria-valuemin={0} aria-valuemax={100} aria-label="Loading">
                {String(n).padStart(3, '0')}
              </span>
              <span className="mb-2 font-mono text-xs text-neutral-500">loading assets</span>
            </div>
          )}
          {side === 'top' && <div className="absolute bottom-0 left-0 h-px bg-white transition-[width] duration-150" style={{ width: `${n}%` }} />}
        </div>
      ))}
    </div>
  )
}
