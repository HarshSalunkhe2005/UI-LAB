import { useId, useMemo, useRef, useState } from 'react'

/*
 * An accessible autocomplete (the ARIA 1.2 combobox pattern). Focus stays in the input; the highlighted option is
 * exposed with aria-activedescendant. Arrow keys move, Enter picks, Esc closes (and clears on a second press), Home and
 * End jump. The result count is announced in a status region. Options are real list items with role=option.
 */

const CITIES = ['Aberdeen', 'Bath', 'Belfast', 'Birmingham', 'Bristol', 'Cambridge', 'Cardiff', 'Edinburgh', 'Exeter', 'Glasgow', 'Leeds', 'Liverpool', 'London', 'Manchester', 'Newcastle', 'Norwich', 'Oxford', 'Sheffield', 'York']

export default function Combobox() {
  const id = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const opts = useMemo(() => (q ? CITIES.filter((c) => c.toLowerCase().startsWith(q.toLowerCase())) : CITIES).slice(0, 8), [q])
  const pick = (c: string) => {
    setPicked(c)
    setQ(c)
    setOpen(false)
    input.current?.focus()
  }
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      else setI((n) => Math.min(opts.length - 1, n + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setI((n) => Math.max(0, n - 1))
    } else if (e.key === 'Home' && open) {
      e.preventDefault()
      setI(0)
    } else if (e.key === 'End' && open) {
      e.preventDefault()
      setI(opts.length - 1)
    } else if (e.key === 'Enter' && open && opts[i]) {
      e.preventDefault()
      pick(opts[i])
    } else if (e.key === 'Escape') {
      if (open) setOpen(false)
      else setQ('')
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <label htmlFor={`${id}-in`} className="text-sm font-medium">Where are you travelling to?</label>
      <div className="relative mt-1">
        <input
          ref={input}
          id={`${id}-in`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && opts[i] ? `${id}-o${i}` : undefined}
          autoComplete="off"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setI(0); setPicked('') }}
          onKeyDown={key}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="min-h-12 w-full rounded-md border border-border bg-surface px-3"
        />
        {open && opts.length > 0 && (
          <ul id={`${id}-list`} role="listbox" aria-label="Cities" className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-lg">
            {opts.map((c, n) => (
              <li
                key={c}
                id={`${id}-o${n}`}
                role="option"
                aria-selected={n === i}
                onMouseDown={(e) => { e.preventDefault(); pick(c) }}
                onMouseEnter={() => setI(n)}
                className={`flex min-h-11 cursor-pointer items-center rounded px-3 ${n === i ? 'bg-accent-soft text-accent' : ''}`}
              >
                <span><b className="font-semibold">{c.slice(0, q.length)}</b>{c.slice(q.length)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-2 text-sm text-fg-muted" role="status">
        {picked ? `Selected: ${picked}.` : open ? `${opts.length} suggestion${opts.length === 1 ? '' : 's'}. Use the arrow keys.` : q && opts.length === 0 ? 'No matching cities.' : ' '}
      </p>
      {open && opts.length === 0 && q && <p className="mt-1 text-sm text-fg-muted">Nothing starts with “{q}”.</p>}
    </div>
  )
}
