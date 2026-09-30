import { useMemo, useState } from 'react'
import { RESOURCE_KINDS, RESOURCES } from './resources'

/* Directory of external references, filterable by kind and searchable. Same data as /resources.md. */

export default function ResourcesPage() {
  const [kind, setKind] = useState<string>('All')
  const [q, setQ] = useState('')
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return RESOURCES.filter((r) => (kind === 'All' || r.kind === kind) && words.every((w) => `${r.name} ${r.note} ${r.tags?.join(' ')}`.toLowerCase().includes(w)))
  }, [kind, q])

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl space-y-4">
        <p className="font-mono text-xs tracking-wider text-accent uppercase">Directory</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Where the good stuff <span className="font-display font-normal text-accent italic">lives</span>.
        </h1>
        <p className="text-lg text-fg-muted">
          Galleries, award-level studios, open-source demo repos, libraries and tools. {RESOURCES.length} hand-picked links. Also at{' '}
          <a href="/resources.md" target="_blank" className="font-mono text-sm text-accent hover:underline">/resources.md</a> for AI agents.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by kind">
          {['All', ...RESOURCE_KINDS].map((k) => (
            <button
              key={k}
              role="radio"
              aria-checked={kind === k}
              onClick={() => setKind(k)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${kind === k ? 'border-fg bg-fg text-bg' : 'border-border text-fg-muted hover:text-fg'}`}
            >
              {k}
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{k === 'All' ? RESOURCES.length : RESOURCES.filter((r) => r.kind === k).length}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:w-72">
          <span className="sr-only">Search resources</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: webgl, scroll, a11y…" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent" />
        </label>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {shown.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noreferrer" className="group flex h-full flex-col rounded-xl border border-border bg-surface/50 p-4 transition-colors hover:border-accent/50">
              <span className="flex items-start justify-between gap-3">
                <span className="font-medium">{r.name}</span>
                <span className="text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>↗</span>
              </span>
              <span className="mt-1 flex-1 text-sm text-fg-muted">{r.note}</span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-fg-muted">{r.kind}</span>
                {r.tags?.map((t) => (
                  <span key={t} className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-fg-muted">{t}</span>
                ))}
              </span>
            </a>
          </li>
        ))}
        {!shown.length && <li className="text-sm text-fg-muted">Nothing matches.</li>}
      </ul>
    </div>
  )
}
