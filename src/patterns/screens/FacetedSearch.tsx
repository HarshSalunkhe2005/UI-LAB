import { useMemo, useState } from 'react'

/*
 * Search with filters (facets): a text box, grouped filters in fieldsets with real checkboxes, removable chips showing
 * what is applied, a live result count, and an honest empty state with a way out. Filters combine with AND between groups
 * and OR inside a group. Every control is a native input or button; the results list is a plain list.
 */

type Item = { name: string; kind: string; level: string; mins: number }
const ITEMS: Item[] = [
  { name: 'Reading a contrast ratio', kind: 'Guide', level: 'Beginner', mins: 6 },
  { name: 'Building a combobox', kind: 'Tutorial', level: 'Advanced', mins: 25 },
  { name: 'Focus rings that people can see', kind: 'Guide', level: 'Beginner', mins: 5 },
  { name: 'Sorting and filtering tables', kind: 'Tutorial', level: 'Intermediate', mins: 18 },
  { name: 'Motion without vertigo', kind: 'Essay', level: 'Intermediate', mins: 12 },
  { name: 'A short history of the screen reader', kind: 'Essay', level: 'Beginner', mins: 9 },
  { name: 'Forms that forgive', kind: 'Tutorial', level: 'Beginner', mins: 14 },
  { name: 'Testing with a keyboard alone', kind: 'Guide', level: 'Intermediate', mins: 8 },
]
const FACETS: { key: 'kind' | 'level'; label: string; opts: string[] }[] = [
  { key: 'kind', label: 'Type', opts: ['Guide', 'Tutorial', 'Essay'] },
  { key: 'level', label: 'Level', opts: ['Beginner', 'Intermediate', 'Advanced'] },
]

export default function FacetedSearch() {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Record<string, string[]>>({ kind: [], level: [] })
  const results = useMemo(
    () => ITEMS.filter((it) => it.name.toLowerCase().includes(q.trim().toLowerCase()) && FACETS.every((f) => !sel[f.key].length || sel[f.key].includes(it[f.key]))),
    [q, sel],
  )
  const toggle = (k: string, v: string) => setSel((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }))
  const chips = FACETS.flatMap((f) => sel[f.key].map((v) => [f.key, v] as const))
  const clear = () => { setQ(''); setSel({ kind: [], level: [] }) }

  return (
    <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
      <form role="search" aria-label="Filter the library" onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <label className="block text-sm font-medium">Search
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-border bg-surface px-3 font-normal" />
        </label>
        {FACETS.map((f) => (
          <fieldset key={f.key}>
            <legend className="text-sm font-medium">{f.label}</legend>
            <div className="mt-1 space-y-1">
              {f.opts.map((o) => (
                <label key={o} className="flex min-h-9 cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={sel[f.key].includes(o)} onChange={() => toggle(f.key, o)} className="size-5" />
                  {o} <span className="text-fg-muted">({ITEMS.filter((it) => it[f.key] === o).length})</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </form>
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <p role="status" className="font-medium">{results.length} result{results.length === 1 ? '' : 's'}</p>
          {chips.map(([k, v]) => (
            <button key={k + v} onClick={() => toggle(k, v)} aria-label={`Remove filter: ${v}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 hover:bg-surface-2">
              {v} <span aria-hidden>×</span>
            </button>
          ))}
          {(q || chips.length > 0) && <button onClick={clear} className="min-h-9 px-2 text-fg-muted underline underline-offset-2 hover:text-fg">Clear all</button>}
        </div>
        {results.length === 0 ? (
          <p className="mt-6 rounded-xl border border-border p-6 text-center text-fg-muted">Nothing matches. <button onClick={clear} className="font-medium text-accent underline underline-offset-2">Clear the search and filters</button> to see everything.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border">
            {results.map((r) => (
              <li key={r.name} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                <span className="font-medium">{r.name}</span>
                <span className="text-sm text-fg-muted">{r.kind} · {r.level} · {r.mins} min</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
