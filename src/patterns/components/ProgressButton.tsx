import { useState } from 'react'

/*
 * A button that becomes its own progress bar: on click the fill sweeps
 * across it as work progresses, then it morphs into a success check.
 * Uses role="progressbar" semantics on the fill while busy, aria-live for
 * the final state, and disables re-clicks mid-flight.
 */

type S = 'idle' | 'busy' | 'done'

export default function ProgressButton() {
  const [s, setS] = useState<S>('idle')
  const [p, setP] = useState(0)

  const run = () => {
    setS('busy')
    setP(0)
    let v = 0
    const id = setInterval(() => {
      v = Math.min(100, v + 4 + Math.random() * 10)
      setP(v)
      if (v >= 100) {
        clearInterval(id)
        setS('done')
        setTimeout(() => setS('idle'), 1800)
      }
    }, 120)
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <button
        onClick={run}
        disabled={s !== 'idle'}
        aria-busy={s === 'busy'}
        className={`relative h-12 overflow-hidden rounded-full font-medium text-white transition-all duration-500 ease-out-expo ${
          s === 'done' ? 'w-12 bg-success' : 'w-52 bg-accent'
        }`}
      >
        {s === 'busy' && (
          <span
            role="progressbar"
            aria-valuenow={Math.round(p)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Uploading"
            className="absolute inset-y-0 left-0 bg-white/25 transition-[width] duration-150"
            style={{ width: `${p}%` }}
          />
        )}
        <span className="relative">{s === 'idle' ? 'Upload files' : s === 'busy' ? `${Math.round(p)}%` : '✓'}</span>
      </button>
      <p aria-live="polite" className="h-4 text-sm text-fg-muted">{s === 'done' ? 'Upload complete' : ''}</p>
    </div>
  )
}
