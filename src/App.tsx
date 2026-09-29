import { useEffect, useState } from 'react'
import { CATEGORIES, PATTERNS, type Pattern } from './registry'

const SOURCES = import.meta.glob('./patterns/**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

type Theme = 'system' | 'light' | 'dark'

function useHashSlug() {
  const read = () => location.hash.replace(/^#\/?/, '')
  const [slug, setSlug] = useState(read)
  useEffect(() => {
    const onHash = () => setSlug(read())
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])
  return slug
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('ui-lab-theme') as Theme) || 'system'
    } catch {
      return 'system'
    }
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
    try {
      if (theme === 'system') localStorage.removeItem('ui-lab-theme')
      else localStorage.setItem('ui-lab-theme', theme)
    } catch {}
  }, [theme])
  const next = () => setTheme((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'))
  return [theme, next] as const
}

function Sidebar({ active }: { active: string }) {
  return (
    <nav className="space-y-6">
      {CATEGORIES.map((cat) => {
        const items = PATTERNS.filter((p) => p.category === cat)
        return (
          <div key={cat}>
            <h2 className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">{cat}</h2>
            {items.length === 0 ? (
              <p className="px-2 text-sm text-fg-muted/60">Coming soon</p>
            ) : (
              <ul>
                {items.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={`#/${p.slug}`}
                      className={`block rounded-sm px-2 py-1.5 text-sm transition-colors ${
                        p.slug === active ? 'bg-accent-soft font-medium text-accent' : 'hover:bg-surface-2'
                      }`}
                    >
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}

function PatternPage({ pattern }: { pattern: Pattern }) {
  const code = SOURCES[`./patterns/${pattern.file}`]
  const { Component } = pattern
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium text-accent">{pattern.category}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{pattern.title}</h1>
        <p className="text-lg text-fg-muted">{pattern.summary}</p>
      </header>

      <section className="rounded-xl border border-border bg-surface-2/50 p-6 sm:p-10">
        <Component />
      </section>

      <section className="grid gap-6 sm:grid-cols-2 [&>*]:min-w-0">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">When to use</h2>
          <ul className="list-disc space-y-1 pl-5">
            {pattern.when.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">File</h2>
          <code className="break-all font-mono text-sm">src/patterns/{pattern.file}</code>
          {pattern.source && (
            <p className="mt-3 text-sm">
              <a href={pattern.source.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {pattern.source.label} ↗
              </a>
            </p>
          )}
        </div>
      </section>

      {code && (
        <details className="group rounded-lg border border-border bg-surface">
          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium">Source</summary>
          <pre className="max-h-[32rem] overflow-auto border-t border-border p-4 font-mono text-xs leading-relaxed">
            <code>{code}</code>
          </pre>
        </details>
      )}
    </article>
  )
}

export default function App() {
  const slug = useHashSlug()
  const [theme, cycleTheme] = useTheme()
  const pattern = PATTERNS.find((p) => p.slug === slug) ?? PATTERNS[0]

  useEffect(() => {
    document.getElementById('main')?.scrollTo({ top: 0 })
  }, [pattern.slug])

  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <aside className="shrink-0 border-b border-border bg-surface md:w-64 md:overflow-y-auto md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-4 py-4">
          <a href="#/" className="text-lg font-semibold tracking-tight">
            UI&nbsp;Lab
          </a>
          <button
            onClick={cycleTheme}
            className="rounded-sm border border-border px-2 py-1 font-mono text-xs text-fg-muted hover:text-fg"
            title="Cycle theme"
          >
            {theme}
          </button>
        </div>
        <div className="hidden px-2 pb-6 md:block">
          <Sidebar active={pattern.slug} />
        </div>
        <select
          className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-md border border-border bg-surface px-3 py-2 text-sm md:hidden"
          value={pattern.slug}
          onChange={(e) => (location.hash = `/${e.target.value}`)}
        >
          {PATTERNS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.category} · {p.title}
            </option>
          ))}
        </select>
      </aside>
      <main id="main" className="min-w-0 flex-1 overflow-y-auto px-4 py-10 sm:px-10">
        <PatternPage pattern={pattern} />
      </main>
    </div>
  )
}
