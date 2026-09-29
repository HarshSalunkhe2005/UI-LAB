import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { CATEGORIES, PATTERNS, type Pattern } from './registry'
import { PREVIEWS } from './previews'
import { MeshGradient } from './patterns/recipes/MeshGradient'
import { CommandPalette, type Command } from './patterns/components/CommandPalette'
import { useCountUp } from './patterns/motion/CountUp'

const SOURCES = import.meta.glob('./patterns/**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
const REPO = 'https://github.com/HarshSalunkhe2005/UI-LAB'

type Theme = 'dark' | 'light' | 'system'

/* ---------- routing: hash + view transitions ---------- */

function useHashSlug() {
  const read = () => location.hash.replace(/^#\/?/, '')
  const [slug, setSlug] = useState(read)
  useEffect(() => {
    const onHash = () => {
      const next = read()
      if (!document.startViewTransition) return setSlug(next)
      document.startViewTransition(() => flushSync(() => setSlug(next)))
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])
  return slug
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('ui-lab-theme') as Theme) || 'dark'
    } catch {
      return 'dark'
    }
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
    try {
      localStorage.setItem('ui-lab-theme', theme)
    } catch {}
  }, [theme])
  const next = () => setTheme((t) => (t === 'dark' ? 'light' : t === 'light' ? 'system' : 'dark'))
  return [theme, next] as const
}

/* ---------- shell ---------- */

function TopBar({ theme, onTheme, onSearch }: { theme: Theme; onTheme: () => void; onSearch: () => void }) {
  return (
    <header className="sticky top-0 z-[100] border-b border-border/60 bg-bg/70 backdrop-blur-xl" style={{ viewTransitionName: 'topbar' }}>
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <a href="#/" className="flex items-baseline gap-1 text-lg font-semibold tracking-tight">
          UI <span className="font-display text-2xl font-normal italic text-accent">Lab</span>
        </a>
        <div className="flex-1" />
        <button
          onClick={onSearch}
          className="hidden items-center gap-6 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg sm:flex"
        >
          Search patterns
          <kbd className="rounded-sm border border-border px-1.5 font-mono text-[11px]">Ctrl K</kbd>
        </button>
        <button onClick={onSearch} className="rounded-md p-2 text-fg-muted hover:text-fg sm:hidden" aria-label="Search">
          ⌕
        </button>
        <a href={REPO} target="_blank" rel="noreferrer" className="text-sm text-fg-muted hover:text-fg">
          GitHub
        </a>
        <button
          onClick={onTheme}
          className="w-16 rounded-md border border-border py-1 font-mono text-[11px] text-fg-muted hover:text-fg"
          title="Cycle theme"
        >
          {theme}
        </button>
      </div>
    </header>
  )
}

/* ---------- home ---------- */

function Stat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [ref, n] = useCountUp(value, 1400)
  return (
    <div ref={ref as React.Ref<HTMLDivElement>}>
      <div className="font-display text-4xl tabular-nums sm:text-5xl">
        {Math.round(n)}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-fg-muted">{label}</div>
    </div>
  )
}

function PatternCard({ p, i }: { p: Pattern; i: number }) {
  const Preview = PREVIEWS[p.slug]
  return (
    <a href={`#/${p.slug}`} className="reveal group block" style={{ animationDelay: `${(i % 3) * 60}ms` }}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,transform] duration-300 ease-out-expo group-hover:-translate-y-1 group-hover:border-accent/50"
        style={{ viewTransitionName: `stage-${p.slug}` }}
      >
        {Preview && <Preview />}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-medium">{p.title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted transition-colors group-hover:text-accent">
          {p.category}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{p.summary}</p>
    </a>
  )
}

function Home() {
  const filled = CATEGORIES.filter((c) => PATTERNS.some((p) => p.category === c))
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <MeshGradient />
        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 px-3 py-1 font-mono text-xs text-fg-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> every pattern is a live demo
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl">
            Patterns worth <span className="font-display font-normal italic text-accent">stealing</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-fg-muted">
            A running library of the tokens, components and motion I reach for when starting a frontend. Open one, see it
            work, copy the source.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`#/${PATTERNS[0].slug}`}
              className="rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform active:scale-[0.97]"
            >
              Start browsing
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border bg-bg/40 px-5 py-2.5 text-sm font-medium backdrop-blur hover:bg-surface"
            >
              View source
            </a>
          </div>
          <div className="mt-20 grid max-w-2xl grid-cols-3 gap-8">
            <Stat value={PATTERNS.length} label="patterns" />
            <Stat value={filled.length} label="categories" />
            <Stat value={100} suffix="%" label="copy-pasteable" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-baseline justify-between border-b border-border/60 pb-3">
          <h2 className="font-display text-4xl italic">The collection</h2>
          <span className="font-mono text-xs text-fg-muted">{String(PATTERNS.length).padStart(2, '0')} live</span>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PATTERNS.map((p, i) => (
            <PatternCard key={p.slug} p={p} i={i} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-fg-muted sm:px-6">
          <span>UI Lab. Built with its own patterns.</span>
          <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-fg">
            github.com/HarshSalunkhe2005/UI-LAB
          </a>
        </div>
      </footer>
    </>
  )
}

/* ---------- pattern page ---------- */

function Sidebar({ active }: { active: string }) {
  return (
    <nav className="space-y-6">
      {CATEGORIES.map((cat) => {
        const items = PATTERNS.filter((p) => p.category === cat)
        return (
          <div key={cat}>
            <h2 className="mb-1.5 px-2 font-mono text-[11px] uppercase tracking-wider text-fg-muted">{cat}</h2>
            {items.length === 0 ? (
              <p className="px-2 text-sm text-fg-muted/50">Soon</p>
            ) : (
              <ul>
                {items.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={`#/${p.slug}`}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        p.slug === active ? 'bg-accent-soft font-medium text-accent' : 'text-fg-muted hover:bg-surface hover:text-fg'
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
  const idx = PATTERNS.indexOf(pattern)
  const prev = PATTERNS[idx - 1]
  const next = PATTERNS[idx + 1]

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 md:block">
        <Sidebar active={pattern.slug} />
      </aside>

      <article className="min-w-0 flex-1 space-y-10 py-10 sm:py-14">
        <header className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">{pattern.category}</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{pattern.title}</h1>
          <p className="max-w-2xl text-lg text-fg-muted">{pattern.summary}</p>
        </header>

        <section
          className="rounded-2xl border border-border bg-surface/50 p-5 sm:p-10"
          style={{ viewTransitionName: `stage-${pattern.slug}` }}
        >
          <Component />
        </section>

        <section className="grid gap-8 sm:grid-cols-2 [&>*]:min-w-0">
          <div>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-fg-muted">When to use</h2>
            <ul className="space-y-2">
              {pattern.when.map((w) => (
                <li key={w} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-fg-muted">File</h2>
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
          <details className="rounded-xl border border-border bg-surface">
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium">Source</summary>
            <pre className="max-h-[32rem] overflow-auto border-t border-border p-4 font-mono text-xs leading-relaxed">
              <code>{code}</code>
            </pre>
          </details>
        )}

        <nav className="grid grid-cols-2 gap-4 border-t border-border/60 pt-8">
          {prev ? (
            <a href={`#/${prev.slug}`} className="group rounded-xl border border-border p-4 hover:border-accent/50">
              <span className="font-mono text-[11px] text-fg-muted">← Previous</span>
              <div className="mt-1 font-medium">{prev.title}</div>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={`#/${next.slug}`} className="group rounded-xl border border-border p-4 text-right hover:border-accent/50">
              <span className="font-mono text-[11px] text-fg-muted">Next →</span>
              <div className="mt-1 font-medium">{next.title}</div>
            </a>
          )}
        </nav>
      </article>
    </div>
  )
}

/* ---------- app ---------- */

export default function App() {
  const slug = useHashSlug()
  const [theme, cycleTheme] = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const pattern = PATTERNS.find((p) => p.slug === slug)

  useEffect(() => {
    scrollTo({ top: 0 })
  }, [slug])

  const commands = useMemo<Command[]>(
    () => [
      { id: '', label: 'Home', group: 'Go to' },
      ...PATTERNS.map((p) => ({ id: p.slug, label: p.title, group: p.category })),
    ],
    [],
  )
  const go = useCallback((c: Command) => {
    location.hash = `/${c.id}`
  }, [])

  return (
    <>
      <TopBar theme={theme} onTheme={cycleTheme} onSearch={() => setSearchOpen(true)} />
      <main>{pattern ? <PatternPage pattern={pattern} /> : <Home />}</main>
      <CommandPalette commands={commands} open={searchOpen} onOpenChange={setSearchOpen} onRun={go} />
    </>
  )
}
