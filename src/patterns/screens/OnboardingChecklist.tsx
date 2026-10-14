import { useState } from 'react'

/*
 * A first-run checklist that respects people. Real checkboxes (so state is announced), a progress line written in words
 * and drawn as a bar, a way to dismiss the whole thing without finishing it, and the next unfinished step surfaced as the
 * suggested one. Progress is the count of ticked items, not an animation, and nothing is locked: any step can be done in
 * any order.
 */

const STEPS = [
  ['Add your name and photo', 'Takes a minute. People trust a name.'],
  ['Create your first project', 'Start from a template or a blank page.'],
  ['Invite a teammate', 'Work is easier when someone can review it.'],
  ['Connect your calendar', 'Optional. Shows deadlines next to your work.'],
] as const

export default function OnboardingChecklist() {
  const [done, setDone] = useState<boolean[]>([true, false, false, false])
  const [hidden, setHidden] = useState(false)
  const n = done.filter(Boolean).length
  const next = done.findIndex((d) => !d)

  if (hidden)
    return (
      <p className="mx-auto max-w-md rounded-xl border border-border p-4 text-sm text-fg-muted">
        Checklist hidden. <button onClick={() => setHidden(false)} className="font-medium text-accent underline underline-offset-2">Show it again</button>
      </p>
    )

  return (
    <section aria-labelledby="ob-h" className="mx-auto max-w-md rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="ob-h" className="text-lg font-semibold">Getting started</h3>
          <p className="text-sm text-fg-muted" role="status">{n === STEPS.length ? 'All done. Nice work.' : `${n} of ${STEPS.length} done`}</p>
        </div>
        <button onClick={() => setHidden(true)} className="min-h-11 shrink-0 px-2 text-sm text-fg-muted underline underline-offset-2 hover:text-fg">Hide</button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded bg-border" role="progressbar" aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={n} aria-label="Setup progress">
        <div className="h-full origin-left bg-accent transition-transform duration-500 motion-reduce:transition-none" style={{ transform: `scaleX(${n / STEPS.length})` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {STEPS.map(([t, d], i) => (
          <li key={t}>
            <label className={`flex cursor-pointer items-start gap-3 rounded-lg p-2 ${i === next ? 'bg-accent-soft' : 'hover:bg-surface-2'}`}>
              <input type="checkbox" checked={done[i]} onChange={() => setDone(done.map((v, j) => (j === i ? !v : v)))} className="mt-1 size-5" />
              <span>
                <span className={`block font-medium ${done[i] ? 'line-through' : ''}`}>{t}{i === next && <span className="ml-2 text-xs font-semibold text-accent">Suggested next</span>}</span>
                <span className="block text-sm text-fg-muted">{d}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
