import { useMemo, useState } from 'react'

/*
 * An FAQ built on native <details>, so it works with no script, keyboard and screen readers included. A search box
 * filters the list and says how many answers match (a live region). "Open all" is a real button. Nothing is hidden
 * from search engines: the answers are in the DOM whether open or not.
 */

const FAQ = [
  ['How long does a project take?', 'Most sites take six to eight weeks from the first call to launch. A single landing page can be done in two.'],
  ['Do you work with existing brands?', 'Yes. We start by reading what you already have and keep whatever is working. We only redraw what is not.'],
  ['What do you need from us?', 'The words, the images and one person who can say yes. We handle the rest, and we will tell you early if something is missing.'],
  ['Will it work on phones and with a keyboard?', 'Always. Every site is tested at phone width, with a keyboard, with reduced motion switched on and with a screen reader.'],
  ['What happens after launch?', 'You get the source, a short guide for your team, and thirty days of fixes. Longer support is optional.'],
] as const

export default function FaqSection() {
  const [q, setQ] = useState('')
  const [all, setAll] = useState(false)
  const items = useMemo(() => FAQ.filter(([a, b]) => `${a} ${b}`.toLowerCase().includes(q.trim().toLowerCase())), [q])
  return (
    <section className="mx-auto max-w-2xl" aria-labelledby="faq-h">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 id="faq-h" className="text-2xl font-semibold tracking-tight">Questions, answered</h3>
        <button onClick={() => setAll((a) => !a)} className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-surface">
          {all ? 'Close all' : 'Open all'}
        </button>
      </div>
      <label className="mt-4 block">
        <span className="sr-only">Search the questions</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the questions" className="min-h-11 w-full rounded-md border border-border bg-surface px-3 text-sm" />
      </label>
      <p className="mt-2 text-xs text-fg-muted" role="status">{items.length} of {FAQ.length} shown</p>
      <div className="mt-2 divide-y divide-border border-y border-border">
        {items.map(([a, b]) => (
          <details key={a + all} open={all} className="group py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-base font-medium marker:content-none">
              {a}
              <span aria-hidden className="text-fg-muted transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
            </summary>
            <p className="pb-4 text-fg-muted">{b}</p>
          </details>
        ))}
      </div>
      {items.length === 0 && <p className="mt-4 text-sm text-fg-muted">No question matches that. Try one word, like “time” or “brand”.</p>}
    </section>
  )
}
