import { useRef, useState } from 'react'

/*
 * Signature move (teenage engineering): tactile hardware on a screen. A knob you turn by dragging (up/down or
 * around it), by mouse wheel, or with the arrow keys; it has 12 detents, a lit indicator and a numeric
 * readout in a mono face. Exposed as a slider for assistive tech (role=slider, aria-valuenow). Reduced
 * motion: no easing on the indicator, it snaps.
 */

const MIN = 0
const MAX = 11
const SWEEP = 270 // degrees

export default function RotaryKnob() {
  const [v, setV] = useState(4)
  const drag = useRef<{ y: number; v: number } | null>(null)
  const angle = -SWEEP / 2 + (v / (MAX - MIN)) * SWEEP
  const clamp = (n: number) => Math.max(MIN, Math.min(MAX, Math.round(n)))

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-surface py-10">
      <div className="relative grid place-items-center">
        {Array.from({ length: MAX + 1 }, (_, i) => {
          const a = -SWEEP / 2 + (i / MAX) * SWEEP
          return (
            <span
              key={i}
              aria-hidden
              className="absolute h-2 w-0.5 origin-bottom rounded-full"
              style={{ transform: `rotate(${a}deg) translateY(-84px)`, background: i <= v ? 'var(--accent)' : 'var(--border)' }}
            />
          )
        })}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Volume"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={v}
          onPointerDown={(e) => {
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            drag.current = { y: e.clientY, v }
          }}
          onPointerMove={(e) => {
            if (drag.current) setV(clamp(drag.current.v + (drag.current.y - e.clientY) / 14))
          }}
          onPointerUp={() => (drag.current = null)}
          onWheel={(e) => setV((x) => clamp(x - Math.sign(e.deltaY)))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); setV((x) => clamp(x + 1)) }
            if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); setV((x) => clamp(x - 1)) }
            if (e.key === 'Home') setV(MIN)
            if (e.key === 'End') setV(MAX)
          }}
          className="relative size-32 cursor-ns-resize touch-none rounded-full border border-border shadow-md outline-offset-4"
          style={{ background: 'radial-gradient(circle at 35% 30%, var(--surface-2), var(--bg))' }}
        >
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 h-1/2 w-1 origin-top -translate-x-1/2 motion-reduce:transition-none"
            style={{ transform: `translateX(-50%) rotate(${angle + 180}deg)`, transition: 'transform 120ms var(--ease-out-expo)' }}
          >
            <span className="mt-9 block h-6 w-1 rounded-full bg-accent" />
          </span>
        </div>
      </div>
      <p className="font-mono text-3xl tabular-nums" aria-live="polite">{String(v).padStart(2, '0')}</p>
      <p className="font-mono text-[11px] text-fg-muted">Drag up and down, scroll, or use the arrow keys</p>
    </div>
  )
}
