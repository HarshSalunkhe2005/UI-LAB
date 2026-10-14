import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { CATEGORIES, PATTERNS, type Pattern } from './registry'
import { PREVIEWS } from './previews'
import { MeshGradient } from './patterns/recipes/MeshGradient'
import { CommandPalette, type Command } from './patterns/components/CommandPalette'
import { CodeBlock, CopyButton } from './CodeBlock'
import ResourcesPage from './ResourcesPage'
import ReferencesPage from './ReferencesPage'
import PlaybookPage from './PlaybookPage'
import { CATEGORY_INFO, START_PATHS, HOW_IT_WORKS } from './categories'
import { SiteLauncher, SiteStage, SiteSources } from './SiteViews'

const SOURCES = import.meta.glob(['./patterns/**/*.tsx', '!./patterns/sites/**'], { query: '?raw', import: 'default', eager: true }) as Record<
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
    let prev = read()
    const onHash = () => {
      const next = read()
      // Full-screen site demos (#/live/...) are heavy first renders and run their own WebGL; the morph transition
      // would hang on a blocked main thread, so routes into and out of them swap instantly.
      const plain = next.startsWith('live/') || prev.startsWith('live/')
      prev = next
      if (plain || !document.startViewTransition) return setSlug(next)
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
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-2.5 py-1 text-sm text-fg-muted marker:content-none">Menu</summary>
          <div className="absolute right-0 mt-2 flex w-44 flex-col rounded-lg border border-border bg-surface p-1 shadow-lg">
            {[['#/playbook', 'Playbook'], ['#/references', 'References'], ['#/resources', 'Resources'], ['/for-claude.md', 'For Claude']].map(([h, l]) => (
              <a key={h} href={h} className="rounded-md px-3 py-2 text-sm hover:bg-surface-2">{l}</a>
            ))}
          </div>
        </details>
        <a href="#/playbook" className="hidden text-sm text-fg-muted hover:text-fg md:inline">
          Playbook
        </a>
        <a href="#/references" className="hidden text-sm text-fg-muted hover:text-fg md:inline">
          References
        </a>
        <a href="#/resources" className="hidden text-sm text-fg-muted hover:text-fg md:inline">
          Resources
        </a>
        <a
          href="/llms.txt"
          target="_blank"
          className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-fg-muted hover:text-fg"
          title="Machine-readable index for AI agents"
        >
          llms.txt
        </a>
        <a href={REPO} target="_blank" rel="noreferrer" className="hidden text-sm text-fg-muted hover:text-fg sm:inline">
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

/** Fallback thumbnail: the real demo, scaled down, mounted only when visible, inert. */
const BIG_PREVIEW = new Set(['3D', 'Motion', 'Backgrounds', 'Text'])

function LivePreview({ Component, category }: { Component: ComponentType; category: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const zoom = BIG_PREVIEW.has(category) ? 0.55 : 0.4

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setShow(e.isIntersecting), { rootMargin: '200px' })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])

  // Scroll-driven demos only come alive when something scrolls them: ping-pong
  // every scrollable box inside the thumbnail while it is on screen.
  useEffect(() => {
    if (!show || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let t = 0
    const tick = () => {
      t += 1
      ref.current?.querySelectorAll<HTMLElement>('*').forEach((el) => {
        const max = el.scrollHeight - el.clientHeight
        if (max > 20 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) {
          el.scrollTop = ((1 - Math.cos((t / 480) * Math.PI * 2)) / 2) * max
        }
      })
      raf = requestAnimationFrame(tick)
    }
    const start = setTimeout(() => (raf = requestAnimationFrame(tick)), 400)
    return () => {
      clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [show])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" inert aria-hidden>
      {show && (
        <div
          className="pointer-events-none absolute top-1/2 left-0 p-8"
          style={{ width: `${100 / zoom}%`, transform: `translateY(-50%) scale(${zoom})`, transformOrigin: '0 50%' }}
        >
          <Suspense fallback={null}><Component /></Suspense>
        </div>
      )}
    </div>
  )
}

function PatternCard({ p, i }: { p: Pattern; i: number }) {
  const Preview = PREVIEWS[p.slug]
  return (
    // Stretched-link card: the title link's ::after covers the card, so previews
    // that contain their own links never end up nested inside another <a>.
    <article className="reveal group relative" style={{ animationDelay: `${(i % 3) * 60}ms` }}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,transform] duration-300 ease-out-expo group-hover:-translate-y-1 group-hover:border-accent/50"
        style={{ viewTransitionName: `stage-${p.slug}` }}
      >
        {Preview ? <Preview /> : p.category === 'Sites' ? <img src={`/thumbs/${p.slug}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" /> : <LivePreview Component={p.Component} category={p.category} />}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-medium">
          <a href={`#/${p.slug}`} className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--ring)]">
            {p.title}
          </a>
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted transition-colors group-hover:text-accent">
          {p.category}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{p.summary}</p>
    </article>
  )
}

function Home() {
  const filled = CATEGORIES.filter((c) => PATTERNS.some((p) => p.category === c))
  const [filter, setFilter] = useState<string>('All')
  const [q, setQ] = useState('')
  const collection = useRef<HTMLElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const needle = q.trim().toLowerCase()
  const shown = PATTERNS.filter(
    (p) =>
      (filter === 'All' || p.category === filter) &&
      (!needle || `${p.title} ${p.summary} ${p.category} ${(p.tags ?? []).join(' ')}`.toLowerCase().includes(needle)),
  )
  const sites = PATTERNS.filter((p) => p.category === 'Sites')
  const toCollection = (after?: () => void) => {
    after?.()
    collection.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const info = CATEGORY_INFO[filter]
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <MeshGradient />
        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg/40 px-3 py-1 font-mono text-xs text-fg-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> every example runs live in your browser
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tight sm:text-7xl">
            See it. Try it. <span className="font-display font-normal italic text-accent">Copy it.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-fg">
            UI Lab is a collection of {PATTERNS.length} working website designs and building blocks, plus a guide to choosing
            between them. Made for designers, developers and AI assistants who want a site that looks authored, not generic.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => toCollection(() => setFilter('Sites'))}
              className="rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform active:scale-[0.97]"
            >
              See finished websites
            </button>
            <button
              onClick={() => toCollection(() => search.current?.focus({ preventScroll: true }))}
              className="rounded-md border border-border bg-bg/40 px-5 py-2.5 text-sm font-medium backdrop-blur hover:bg-surface"
            >
              Search the collection
            </button>
            <a
              href="#/playbook"
              className="rounded-md border border-border bg-bg/40 px-5 py-2.5 text-sm font-medium backdrop-blur hover:bg-surface"
            >
              Read the design guide
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6" aria-labelledby="start">
        <h2 id="start" className="font-display text-3xl italic sm:text-4xl">Where do you want to start?</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {START_PATHS.map((s) => (
            <li key={s.title} className="flex flex-col rounded-xl border border-border bg-surface/50 p-5">
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-fg-muted">{s.body}</p>
              {s.href.startsWith('#') ? (
                <button
                  onClick={() => toCollection(() => (s.title.startsWith('I want to see') ? setFilter('Sites') : search.current?.focus({ preventScroll: true })))}
                  className="mt-4 self-start text-sm font-medium text-accent hover:underline"
                >
                  {s.cta} →
                </button>
              ) : (
                <a href={s.href} target="_blank" rel="noreferrer" className="mt-4 self-start text-sm font-medium text-accent hover:underline">
                  {s.cta} ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6" aria-labelledby="featured">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured" className="font-display text-3xl italic sm:text-4xl">Finished websites</h2>
          <button onClick={() => toCollection(() => setFilter('Sites'))} className="text-sm text-accent hover:underline">All {sites.length} →</button>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">Each one is a whole site in its own style. Open it full screen and scroll.</p>
        <ul className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]" tabIndex={0} aria-label="Finished websites, scroll sideways">
          {sites.map((p) => (
            <li key={p.slug} className="relative w-64 shrink-0 snap-start sm:w-72">
              <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface">
                <img src={`/thumbs/${p.slug}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              </div>
              <a href={`#/${p.slug}`} className="mt-2 block text-sm font-medium after:absolute after:inset-0 after:content-['']">
                {p.title.replace(/^Site:\s*/, '')}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section ref={collection} id="collection" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6" aria-labelledby="coll">
        <div className="mb-6 flex items-baseline justify-between border-b border-border/60 pb-3">
          <h2 id="coll" className="font-display text-4xl italic">The collection</h2>
          <span className="font-mono text-xs text-fg-muted" aria-live="polite">{shown.length} shown</span>
        </div>
        <label className="mb-5 block">
          <span className="sr-only">Search the collection</span>
          <input
            ref={search}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by what you need: pricing, scroll, newspaper, 3D, form…"
            className="w-full max-w-xl rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm placeholder:text-fg-muted focus:border-accent"
          />
        </label>
        <div className="mb-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by category">
          {['All', ...filled].map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={filter === c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                filter === c ? 'border-fg bg-fg text-bg' : 'border-border text-fg-muted hover:text-fg'
              }`}
            >
              {c}
              <span className="ml-1.5 font-mono text-[10px] opacity-70">
                {c === 'All' ? PATTERNS.length : PATTERNS.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>
        <p className="mb-10 min-h-6 max-w-2xl text-sm text-fg-muted">
          {info ? (
            <>
              {info.plain} <span className="text-fg">Use it to: {info.for.charAt(0).toLowerCase() + info.for.slice(1)}</span>
            </>
          ) : (
            'Everything, in the order it was added. Pick a category to see what it is for.'
          )}
        </p>
        {shown.length === 0 ? (
          <div className="rounded-xl border border-border p-8 text-center">
            <p className="font-medium">Nothing matches “{q}”.</p>
            <p className="mt-1 text-sm text-fg-muted">Try a shorter word, or clear the search.</p>
            <button onClick={() => { setQ(''); setFilter('All') }} className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface">Clear search and filter</button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <PatternCard key={p.slug} p={p} i={i} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border/60" aria-labelledby="how">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 id="how" className="font-display text-3xl italic sm:text-4xl">How a pattern page works</h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((h) => (
              <li key={h.n} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border font-mono text-sm" aria-hidden>{h.n}</span>
                <div>
                  <h3 className="font-medium">{h.t}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{h.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-2xl text-sm text-fg-muted">
            New to design words? A <strong className="font-medium text-fg">pattern</strong> is one reusable piece. A <strong className="font-medium text-fg">world</strong> is a whole consistent style (colours, type, motion). The <a className="text-accent hover:underline" href="#/playbook/worlds">design guide</a> explains how to choose one, the <a className="text-accent hover:underline" href="#/playbook/glossary">glossary</a> explains the rest, and the <a className="text-accent hover:underline" href="#/playbook/accessibility">accessibility checklist</a> shows how every pattern is checked.
          </p>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-fg-muted sm:px-6">
          <span>UI Lab. Built with its own patterns.</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-4">
            <a href="#/playbook" className="hover:text-fg">Playbook</a>
            <a href="#/references" className="hover:text-fg">References</a>
            <a href="#/resources" className="hover:text-fg">Resources</a>
            <a href="/for-claude.md" className="hover:text-fg">For Claude</a>
            <a href={REPO} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
          </nav>
        </div>
      </footer>
    </>
  )
}

/* ---------- pattern page ---------- */

function Sidebar({ active }: { active: string }) {
  return (
    <nav className="space-y-6" aria-label="All patterns">
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
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  useEffect(() => setTab('preview'), [pattern.slug])

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
          {pattern.tags && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
              {pattern.tags.map((t) => (
                <li key={t} className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-fg-muted">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </header>

        <section
          className="overflow-hidden rounded-2xl border border-border bg-surface/50"
          style={{ viewTransitionName: `stage-${pattern.slug}` }}
          aria-labelledby="demo-h"
        >
          <h2 id="demo-h" className="sr-only">Live demo and source</h2>
          <div className="flex items-center gap-1 border-b border-border px-3 py-2">
            {(['preview', 'code'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 text-sm capitalize transition-colors ${
                  tab === t ? 'bg-surface-2 font-medium text-fg' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {t}
              </button>
            ))}
            <div className="flex-1" />
            {code && pattern.category !== 'Sites' && <CopyButton text={code} />}
            <a
              href={`${REPO}/${pattern.files ? 'tree' : 'blob'}/main/src/patterns/${pattern.files ? pattern.file.replace(/\/index\.tsx$/, '') : pattern.file}`}
              target="_blank"
              rel="noreferrer"
              className="ml-1 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-fg-muted hover:text-fg"
            >
              GitHub ↗
            </a>
          </div>
          {pattern.category === 'Sites' ? (
            tab === 'preview' ? <SiteLauncher pattern={pattern} /> : <SiteSources files={pattern.files ?? [pattern.file]} />
          ) : tab === 'preview' || !code ? (
            <div className="p-5 sm:p-10">
              <Suspense fallback={<p className="font-mono text-xs text-fg-muted">Loading 3D…</p>}><Component /></Suspense>
            </div>
          ) : (
            <CodeBlock code={code} />
          )}
        </section>

        {pattern.a11y && (
          <section className="rounded-xl border border-border bg-surface/50 p-4">
            <h2 className="mb-1 font-mono text-[11px] tracking-wider text-fg-muted uppercase">Accessibility</h2>
            <p className="text-sm">{pattern.a11y}</p>
          </section>
        )}

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
            <p className="mt-3 flex flex-wrap gap-3 text-sm">
              <a href={`/docs/${pattern.slug}.md`} target="_blank" className="text-accent hover:underline">
                AI doc (.md) ↗
              </a>
              <a href={`/raw/${pattern.file}`} target="_blank" className="text-accent hover:underline">
                Raw source ↗
              </a>
            </p>
            {pattern.source && (
              <p className="mt-3 text-sm">
                <a href={pattern.source.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {pattern.source.label} ↗
                </a>
              </p>
            )}
          </div>
        </section>

        <nav className="grid grid-cols-2 gap-4 border-t border-border/60 pt-8" aria-label="Previous and next pattern">
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
      { id: 'playbook', label: 'Design playbook', group: 'Go to', hint: 'process worlds inspiration verify how to design start here' },
      { id: 'references', label: 'Reference sites (teardowns)', group: 'Go to', hint: 'references teardown world class vibe coded v0 awwwards studies' },
      { id: 'playbook/prompts', label: 'Prompts to give your AI assistant', group: 'Go to', hint: 'claude chatgpt prompt copy paste ask how to ask' },
      { id: 'playbook/accessibility', label: 'Accessibility checklist', group: 'Go to', hint: 'a11y wcag keyboard contrast screen reader reduced motion' },
      { id: 'playbook/glossary', label: 'Glossary (design words in plain language)', group: 'Go to', hint: 'terms meaning what is a pattern world hero' },
      { id: 'resources', label: 'Resources directory', group: 'Go to', hint: 'links sites repos libraries inspiration' },
      ...PATTERNS.map((p) => ({ id: p.slug, label: p.title, group: p.category, hint: p.tags?.join(' ') })),
    ],
    [],
  )
  const go = useCallback((c: Command) => {
    location.hash = `/${c.id}`
  }, [])

  // Full-screen route for whole-site demos: #/live/<slug>. UI Lab's own chrome steps out of the way.
  const live = slug.startsWith('live/') ? PATTERNS.find((p) => p.slug === slug.slice(5) && p.category === 'Sites') : undefined
  if (live) return <SiteStage pattern={live} />

  return (
    <>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }} className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">Skip to content</a>
      <TopBar theme={theme} onTheme={cycleTheme} onSearch={() => setSearchOpen(true)} />
      <main id="main" tabIndex={-1} className="outline-none">{slug === 'playbook' || slug.startsWith('playbook/') ? <PlaybookPage doc={slug.split('/')[1]} /> : slug === 'resources' ? <ResourcesPage /> : slug === 'references' ? <ReferencesPage /> : pattern ? <PatternPage pattern={pattern} /> : <Home />}</main>
      <CommandPalette commands={commands} open={searchOpen} onOpenChange={setSearchOpen} onRun={go} />
    </>
  )
}
