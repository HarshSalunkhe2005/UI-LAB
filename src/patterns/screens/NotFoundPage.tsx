import { useState } from 'react'

/*
 * A 404 that helps. It says plainly what happened, gives the likely ways forward (home, search, the most visited
 * pages) and keeps the site's chrome. The page title should read "Page not found", and the server should return a 404
 * status so search engines do not index it. No joke is required; being useful is the joke.
 */

const POPULAR = ['Pricing', 'Documentation', 'Contact us', 'Status page']

export default function NotFoundPage() {
  const [q, setQ] = useState('')
  const [sent, setSent] = useState('')
  return (
    <div className="mx-auto max-w-lg py-6 text-center">
      <p className="font-mono text-sm text-fg-muted">Error 404</p>
      <h3 className="mt-2 text-4xl font-semibold tracking-tight">We cannot find that page</h3>
      <p className="mt-3 text-fg-muted">The link may be old, or the address may have a typo. Here are some ways back.</p>
      <form
        role="search"
        className="mt-6 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); setSent(q.trim()) }}
      >
        <label className="flex-1 text-left">
          <span className="sr-only">Search this site</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this site" className="min-h-12 w-full rounded-md border border-border bg-surface px-3" />
        </label>
        <button className="min-h-12 rounded-md bg-fg px-5 text-sm font-medium text-bg">Search</button>
      </form>
      {sent && <p className="mt-3 text-sm text-fg-muted" role="status">Searching for “{sent}” would go here.</p>}
      <p className="mt-8 text-sm font-medium">Popular pages</p>
      <ul className="mt-2 flex flex-wrap justify-center gap-2">
        {POPULAR.map((p) => (
          <li key={p}>
            <a href="#nf" onClick={(e) => e.preventDefault()} className="grid min-h-11 place-items-center rounded-md border border-border px-4 text-sm hover:bg-surface">{p}</a>
          </li>
        ))}
      </ul>
      <p className="mt-8"><a href="#nf" onClick={(e) => e.preventDefault()} className="text-sm font-medium text-accent underline underline-offset-2">Go to the home page</a></p>
    </div>
  )
}
