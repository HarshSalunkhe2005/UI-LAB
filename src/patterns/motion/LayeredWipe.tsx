import { useState } from 'react'

/*
 * Layered wipe page transition: three coloured panels sweep across with a
 * stagger (clip-path inset from one side), the page swaps while covered,
 * then they exit the other side. Classic studio-site transition.
 */

const PAGES = ['Home', 'Projects', 'Studio', 'Contact']
const LAYERS = ['#f97316', '#ec4899', '#18181b']

export default function LayeredWipe() {
  const [page, setPage] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'in' | 'out'>('idle')

  const go = (n: number) => {
    if (phase !== 'idle' || n === page) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setPage(n)
    setPhase('in')
    setTimeout(() => {
      setPage(n)
      setPhase('out')
      setTimeout(() => setPhase('idle'), 900)
    }, 800)
  }

  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-bg">
      <nav className="absolute top-4 right-4 z-10 flex gap-3 text-sm" aria-label="Pages">
        {PAGES.map((p, i) => (
          <button key={p} onClick={() => go(i)} aria-current={i === page ? 'page' : undefined} className={i === page ? 'text-fg underline underline-offset-4' : 'text-fg-muted hover:text-fg'}>
            {p}
          </button>
        ))}
      </nav>
      <div className="absolute inset-0 grid place-items-center">
        <h3 className="text-6xl font-semibold tracking-tight">{PAGES[page]}</h3>
      </div>
      {LAYERS.map((c, i) => (
        <span
          key={c}
          aria-hidden
          className="absolute inset-0"
          style={{
            background: c,
            clipPath: phase === 'in' ? 'inset(0 0 0 0)' : phase === 'out' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
            transition: phase === 'idle' ? 'none' : `clip-path .6s cubic-bezier(.76,0,.24,1) ${phase === 'in' ? i * 90 : (LAYERS.length - 1 - i) * 90}ms`,
          }}
        />
      ))}
    </div>
  )
}
