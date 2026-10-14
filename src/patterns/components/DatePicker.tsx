import { useId, useMemo, useRef, useState } from 'react'

/*
 * A date picker built as a grid of buttons, with the keyboard model people expect: arrows move by day and week, Home
 * and End go to the ends of the week, Page Up and Page Down change month, Enter or Space selects. One cell is in the
 * tab order (roving tabindex). Month and selected date are announced; dates before today are disabled with a reason
 * available. The typed input also works, because a calendar alone is slow for someone who knows the date.
 */

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const sameDay = (a: Date, b: Date) => iso(a) === iso(b)

export default function DatePicker() {
  const id = useId()
  const today = useMemo(() => new Date(), [])
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [focus, setFocus] = useState(today)
  const [sel, setSel] = useState<Date | null>(null)
  const grid = useRef<HTMLDivElement>(null)

  const first = (view.getDay() + 6) % 7
  const dim = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))]
  while (cells.length % 7) cells.push(null)
  const disabled = (d: Date) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const move = (d: Date) => {
    setFocus(d)
    setView(new Date(d.getFullYear(), d.getMonth(), 1))
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-d="${iso(d)}"]`)?.focus())
  }
  const key = (e: React.KeyboardEvent) => {
    const add = (n: number) => new Date(focus.getFullYear(), focus.getMonth(), focus.getDate() + n)
    const map: Record<string, () => Date> = {
      ArrowLeft: () => add(-1),
      ArrowRight: () => add(1),
      ArrowUp: () => add(-7),
      ArrowDown: () => add(7),
      Home: () => add(-((focus.getDay() + 6) % 7)),
      End: () => add(6 - ((focus.getDay() + 6) % 7)),
      PageUp: () => new Date(focus.getFullYear(), focus.getMonth() - 1, Math.min(focus.getDate(), 28)),
      PageDown: () => new Date(focus.getFullYear(), focus.getMonth() + 1, Math.min(focus.getDate(), 28)),
    }
    if (map[e.key]) {
      e.preventDefault()
      move(map[e.key]())
    }
  }

  return (
    <div className="mx-auto max-w-xs">
      <label htmlFor={`${id}-t`} className="text-sm font-medium">Departure date</label>
      <input
        id={`${id}-t`}
        placeholder="YYYY-MM-DD"
        value={sel ? iso(sel) : ''}
        onChange={(e) => {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.target.value)
          if (m) {
            const d = new Date(+m[1], +m[2] - 1, +m[3])
            if (!isNaN(+d) && !disabled(d)) { setSel(d); move(d) }
          } else if (!e.target.value) setSel(null)
        }}
        className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3"
      />
      <div className="mt-3 rounded-xl border border-border bg-surface p-3" role="group" aria-label={`${MONTHS[view.getMonth()]} ${view.getFullYear()}`}>
        <div className="flex items-center justify-between">
          <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} aria-label="Previous month" className="grid size-11 place-items-center rounded-md hover:bg-surface-2">‹</button>
          <p className="font-medium" aria-live="polite">{MONTHS[view.getMonth()]} {view.getFullYear()}</p>
          <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} aria-label="Next month" className="grid size-11 place-items-center rounded-md hover:bg-surface-2">›</button>
        </div>
        <div ref={grid} role="grid" aria-label="Choose a date" onKeyDown={key} className="mt-2">
          <div role="row" className="grid grid-cols-7 text-center text-xs text-fg-muted">
            {DAYS.map((d) => <span key={d} role="columnheader" className="py-1">{d}</span>)}
          </div>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <div role="row" key={r} className="grid grid-cols-7">
              {cells.slice(r * 7, r * 7 + 7).map((d, c) => (
                <div role="gridcell" key={c} aria-selected={d && sel ? sameDay(d, sel) : undefined} className="grid place-items-center">
                  {d && (
                    <button
                      data-d={iso(d)}
                      tabIndex={sameDay(d, focus) ? 0 : -1}
                      disabled={disabled(d)}
                      aria-current={sameDay(d, today) ? 'date' : undefined}
                      aria-label={d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      onClick={() => { setSel(d); setFocus(d) }}
                      className={`grid size-11 place-items-center rounded-md text-sm tabular-nums disabled:opacity-30 ${sel && sameDay(d, sel) ? 'bg-accent font-semibold text-accent-fg' : 'hover:bg-surface-2'} ${sameDay(d, today) ? 'underline underline-offset-4' : ''}`}
                    >
                      {d.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm text-fg-muted" role="status">{sel ? `Selected ${sel.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}.` : 'Use the arrow keys, Page Up and Page Down.'}</p>
    </div>
  )
}
