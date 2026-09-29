import { useState } from 'react'

/*
 * Multi-step progress: numbered steps joined by a filling rail, completed
 * steps get a check. The list is an <ol> with aria-current="step" on the
 * current item, so the position is announced. Back/Next drive it.
 */

const STEPS = ['Account', 'Profile', 'Team', 'Billing', 'Done']

export default function Stepper() {
  const [cur, setCur] = useState(1)
  return (
    <div className="space-y-6">
      <ol className="flex items-center">
        {STEPS.map((s, i) => {
          const state = i < cur ? 'done' : i === cur ? 'current' : 'todo'
          return (
            <li key={s} aria-current={state === 'current' ? 'step' : undefined} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-medium transition-colors duration-300 ${
                    state === 'done' ? 'border-accent bg-accent text-accent-fg' : state === 'current' ? 'border-accent text-accent ring-4 ring-accent/15' : 'border-border text-fg-muted'
                  }`}
                >
                  {state === 'done' ? '✓' : i + 1}
                </span>
                <span className={`text-xs ${state === 'todo' ? 'text-fg-muted' : ''}`}>{s}</span>
                <span className="sr-only">{state === 'done' ? '(completed)' : state === 'current' ? '(current)' : ''}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden>
                  <div className="h-full bg-accent transition-transform duration-500 ease-out-expo" style={{ transform: `scaleX(${i < cur ? 1 : 0})`, transformOrigin: 'left' }} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
      <div className="flex justify-between">
        <button disabled={cur === 0} onClick={() => setCur((c) => c - 1)} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">Back</button>
        <button disabled={cur === STEPS.length - 1} onClick={() => setCur((c) => c + 1)} className="rounded-lg bg-fg px-4 py-2 text-sm text-bg disabled:opacity-40">Next</button>
      </div>
    </div>
  )
}
