import { useMemo, useState } from 'react'

/*
 * An accessible data table: real <table> with scoped headers, sortable columns as buttons inside the header cells
 * (aria-sort on the th), a filter that reports the row count in a live region, and numbers right-aligned in tabular
 * figures. Status is a word plus a shape, never colour alone. Wide tables scroll inside a focusable region on phones.
 */

type Row = { name: string; role: string; city: string; salary: number; status: 'Active' | 'Away' | 'Left' }
const ROWS: Row[] = [
  { name: 'Amara Osei', role: 'Designer', city: 'Leeds', salary: 52000, status: 'Active' },
  { name: 'Ben Hollis', role: 'Engineer', city: 'Bristol', salary: 68000, status: 'Active' },
  { name: 'Chioma Eze', role: 'Engineer', city: 'London', salary: 72000, status: 'Away' },
  { name: 'Dev Patel', role: 'Producer', city: 'Leeds', salary: 49000, status: 'Active' },
  { name: 'Elin Berg', role: 'Designer', city: 'Glasgow', salary: 55000, status: 'Left' },
  { name: 'Farid Noor', role: 'Support', city: 'Bristol', salary: 38000, status: 'Active' },
]
type Key = keyof Row
const COLS: { key: Key; label: string; num?: boolean }[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'city', label: 'City' },
  { key: 'salary', label: 'Salary', num: true },
  { key: 'status', label: 'Status' },
]
const MARK = { Active: '●', Away: '◐', Left: '○' }

export default function DataTable() {
  const [sort, setSort] = useState<{ key: Key; dir: 'asc' | 'desc' } | null>(null)
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const f = ROWS.filter((r) => Object.values(r).join(' ').toLowerCase().includes(q.trim().toLowerCase()))
    if (!sort) return f
    return [...f].sort((a, b) => {
      const x = a[sort.key]
      const y = b[sort.key]
      const c = typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y))
      return sort.dir === 'asc' ? c : -c
    })
  }, [q, sort])

  const toggle = (key: Key) => setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }))

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label className="block">
          <span className="sr-only">Filter people</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter people" className="min-h-11 w-64 max-w-full rounded-md border border-border bg-surface px-3 text-sm" />
        </label>
        <p className="text-sm text-fg-muted" role="status">{rows.length} of {ROWS.length} people</p>
      </div>
      <div tabIndex={0} role="region" aria-label="People table, scrolls sideways on small screens" className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <caption className="sr-only">People, with role, city, salary and status. Column headers are sort buttons.</caption>
          <thead className="bg-surface-2 text-left">
            <tr>
              {COLS.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`p-0 font-medium ${c.num ? 'text-right' : ''}`}>
                  <button onClick={() => toggle(c.key)} className={`flex min-h-11 w-full items-center gap-1.5 px-3 hover:bg-surface ${c.num ? 'justify-end' : ''}`}>
                    {c.label}
                    <span aria-hidden className="text-fg-muted">{sort?.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.name} className="hover:bg-surface-2/60">
                <th scope="row" className="px-3 py-3 text-left font-medium">{r.name}</th>
                <td className="px-3 py-3">{r.role}</td>
                <td className="px-3 py-3">{r.city}</td>
                <td className="px-3 py-3 text-right tabular-nums">£{r.salary.toLocaleString('en-GB')}</td>
                <td className="px-3 py-3"><span aria-hidden>{MARK[r.status]} </span>{r.status}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-8 text-center text-fg-muted">No one matches “{q}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
