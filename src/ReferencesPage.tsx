import { useMemo, useState } from 'react'
import { REFERENCES, REF_NOTES, type Ref, type RefEvidence, type RefGroup } from './references'
import { PATTERNS } from './registry'

/* The 30 + 20 reference teardowns. Same data as /references.md and /references.json. */

const EVIDENCE: Record<RefEvidence, { label: string; hint: string }> = {
  inspected: { label: 'inspected', hint: 'Rendered in a browser and measured' },
  partial: { label: 'partial', hint: 'A canvas or WebGL2 experience: only the shell could be measured' },
  listing: { label: 'listing', hint: 'Read from the public listing; the live preview was not opened' },
}

const GROUPS: (RefGroup | 'All')[] = ['All', 'World-class', 'Vibe-coded', 'Recent winners']

function Card({ r }: { r: Ref }) {
  const [open, setOpen] = useState(false)
  const moves = (r.moves ?? []).map((s) => PATTERNS.find((p) => p.slug === s)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  return (
    <li className="flex flex-col rounded-xl border border-border bg-surface/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <a href={r.url} target="_blank" rel="noreferrer" className="font-medium hover:text-accent">
          {r.name} <span aria-hidden className="text-fg-muted">↗</span>
        </a>
        <span title={EVIDENCE[r.evidence].hint} className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-fg-muted">
          {EVIDENCE[r.evidence].label}
        </span>
      </div>
      <p className="mt-2 text-sm">{r.idea}</p>
      <p className="mt-2 font-mono text-[11px] text-fg-muted">
        {r.mode}
        {r.counts ? ` · ${r.counts[0]} forks? · ${r.counts[1]} likes` : ''}
        {r.author ? ` · by ${r.author}` : ''}
      </p>
      {open && (
        <dl className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
          {[
            ['Technique', r.technique],
            ['Look', r.look],
            ['Take', r.take],
            ['Leave', r.leave],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[10px] tracking-wider text-accent uppercase">{k}</dt>
              <dd className="text-fg-muted">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="min-h-9 rounded-md border border-border px-3 text-xs text-fg-muted hover:text-fg"
        >
          {open ? 'Hide teardown' : 'Teardown'}
        </button>
        {moves.map((m) => (
          <a key={m.slug} href={`#/${m.slug}`} className="min-h-9 rounded-md bg-accent-soft px-3 py-2 text-xs font-medium text-accent hover:underline">
            Rebuilt: {m.title}
          </a>
        ))}
      </div>
    </li>
  )
}

export default function ReferencesPage() {
  const [group, setGroup] = useState<RefGroup | 'All'>('All')
  const [q, setQ] = useState('')
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return REFERENCES.filter(
      (r) => (group === 'All' || r.group === group) && words.every((w) => `${r.name} ${r.idea} ${r.technique} ${r.look} ${r.tags.join(' ')} ${r.mode}`.toLowerCase().includes(w)),
    )
  }, [group, q])

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-3xl space-y-4">
        <p className="font-mono text-xs tracking-wider text-accent uppercase">Reference sites</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Fifty sites, <span className="font-display font-normal text-accent italic">taken apart</span>.
        </h1>
        <p className="text-lg text-fg-muted">
          Thirty world-class websites and twenty vibe-coded UIs, each with its signature moment, how it is built, what we measured, what we take and what we leave.
          Every technique we took is rebuilt in our own code as a pattern. Also at{' '}
          <a href="/references.md" target="_blank" className="font-mono text-sm text-accent hover:underline">/references.md</a> and{' '}
          <a href="/references.json" target="_blank" className="font-mono text-sm text-accent hover:underline">/references.json</a> for AI agents.
        </p>
        <p className="text-sm text-fg-muted">
          Measured on {REF_NOTES.measuredOn} at 1440x900. “Inspected” means rendered and measured; “partial” means a WebGL canvas we could only partly see; “listing” means read from the vendor’s page.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by group">
          {GROUPS.map((g) => (
            <button
              key={g}
              role="radio"
              aria-checked={group === g}
              onClick={() => setGroup(g)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${group === g ? 'border-fg bg-fg text-bg' : 'border-border text-fg-muted hover:text-fg'}`}
            >
              {g}
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{g === 'All' ? REFERENCES.length : REFERENCES.filter((r) => r.group === g).length}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:w-72">
          <span className="sr-only">Search references</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: webgl, dark, serif, scroll…" className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent" />
        </label>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {shown.map((r) => (
          <Card key={r.id} r={r} />
        ))}
      </ul>
      {shown.length === 0 && <p className="py-12 text-center text-fg-muted">Nothing matches that search.</p>}

      <section className="mt-14 grid gap-6 border-t border-border pt-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">How the vibe-coded twenty were chosen</h2>
          <p className="mt-2 text-sm text-fg-muted">{REF_NOTES.vibeMethod}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Left out, and why</h2>
          <ul className="mt-2 space-y-2 text-sm text-fg-muted">
            {REF_NOTES.excluded.map((e) => (
              <li key={e.name}>
                <a href={e.url} target="_blank" rel="noreferrer" className="text-fg hover:text-accent">{e.name}</a>: {e.why}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
