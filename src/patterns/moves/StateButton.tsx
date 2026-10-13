import { useRef, useState } from 'react'

/*
 * Signature move (Rive): interaction as a state machine. The button is always in exactly one of
 * idle / hover / press / loading / success, and each state has its own drawn pose (the glyph, the fill and
 * the ring), with transitions only along defined edges. Writing the states down first is what stops
 * interactive UI from feeling like a pile of CSS :hover rules. Reduced motion: transitions are instant.
 */

type S = 'idle' | 'hover' | 'press' | 'loading' | 'success'

const LOOK: Record<S, { fill: string; label: string; scale: number }> = {
  idle: { fill: 'var(--surface-2)', label: 'Send', scale: 1 },
  hover: { fill: 'var(--accent-soft)', label: 'Send', scale: 1.04 },
  press: { fill: 'var(--accent)', label: 'Send', scale: 0.96 },
  loading: { fill: 'var(--accent)', label: 'Sending', scale: 1 },
  success: { fill: 'var(--success)', label: 'Sent', scale: 1.06 },
}

export default function StateButton() {
  const [s, setS] = useState<S>('idle')
  const timer = useRef<number>(0)
  const busy = s === 'loading' || s === 'success'

  const run = () => {
    setS('loading')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setS('success')
      timer.current = window.setTimeout(() => setS('idle'), 1400)
    }, 1100)
  }
  const look = LOOK[s]

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-14">
      <button
        disabled={busy}
        onPointerEnter={() => !busy && setS('hover')}
        onPointerLeave={() => !busy && setS('idle')}
        onPointerDown={() => !busy && setS('press')}
        onPointerUp={() => !busy && setS('hover')}
        onFocus={() => !busy && setS('hover')}
        onBlur={() => !busy && setS('idle')}
        onClick={run}
        className="relative inline-flex min-h-14 min-w-44 items-center justify-center gap-3 rounded-full border border-border px-8 text-base font-medium text-fg transition-[transform,background-color] duration-300 motion-reduce:transition-none"
        style={{ background: look.fill, transform: `scale(${look.scale})`, color: s === 'press' || s === 'loading' || s === 'success' ? 'var(--accent-fg)' : undefined }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          {s === 'loading' ? (
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" className="origin-center motion-safe:animate-spin" />
          ) : s === 'success' ? (
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M3 10h13M11 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: s === 'hover' ? 'translateX(2px)' : 'none', transition: 'transform 200ms' }} />
          )}
        </svg>
        <span aria-live="polite">{look.label}</span>
      </button>
      <p className="font-mono text-[11px] text-fg-muted">state: {s}</p>
    </div>
  )
}
