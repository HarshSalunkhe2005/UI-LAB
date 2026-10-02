import { Suspense, useEffect, useState } from 'react'
import type { Pattern } from './registry'
import { CodeBlock, CopyButton } from './CodeBlock'

/* Whole-site patterns (category "Sites") are full pages: they scroll the window, pin sections and run their own
   WebGL. They cannot live inside the small preview frame, so the pattern page shows a launcher and the demo runs
   full screen at #/live/<slug> with UI Lab's chrome out of the way. */

export function SiteLauncher({ pattern }: { pattern: Pattern }) {
  return (
    <div className="relative">
      <a href={`#/live/${pattern.slug}`} className="group block" aria-label={`Launch ${pattern.title} full screen`}>
        <div className="aspect-[16/9] overflow-hidden bg-surface-2">
          <img src={`/thumbs/${pattern.slug}.jpg`} alt={`${pattern.title}, home screen`} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]" />
        </div>
        <div className="absolute inset-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 sm:p-8">
          <p className="max-w-md text-sm text-white/85">A complete page. Scroll it, move the pointer, press keys. It opens full screen; press Esc to come back.</p>
          <span className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform group-hover:scale-105">Launch full screen ↗</span>
        </div>
      </a>
    </div>
  )
}

const RAW = import.meta.glob('./patterns/sites/**/*.{tsx,ts,css}', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

/** All files of a multi-file pattern as tabs. Source is loaded on demand so it stays out of the main bundle. */
export function SiteSources({ files }: { files: string[] }) {
  const [active, setActive] = useState(files[0])
  const [code, setCode] = useState<string | null>(null)
  useEffect(() => setActive(files[0]), [files])
  useEffect(() => {
    let live = true
    setCode(null)
    RAW[`./patterns/${active}`]?.().then((c) => live && setCode(c))
    return () => {
      live = false
    }
  }, [active])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2" role="tablist" aria-label="Source files">
        {files.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={f === active}
            onClick={() => setActive(f)}
            className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${f === active ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:text-fg'}`}
          >
            {f.split('/').slice(2).join('/') || f}
          </button>
        ))}
        <div className="flex-1" />
        {code && <CopyButton text={code} />}
      </div>
      {code === null ? <p className="p-6 font-mono text-xs text-fg-muted">Loading source…</p> : <CodeBlock code={code} />}
    </div>
  )
}

/** Full-screen host: lazy-loads the site, hides UI Lab chrome, Esc or the pill returns to the pattern page. */
export function SiteStage({ pattern }: { pattern: Pattern }) {
  const { Component } = pattern
  const back = `#/${pattern.slug}`
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[role="dialog"]')) location.hash = back
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [back])

  return (
    <>
      <Suspense fallback={<div className="grid min-h-dvh place-items-center bg-bg font-mono text-xs text-fg-muted">Loading {pattern.title}…</div>}>
        <Component />
      </Suspense>
      <a
        href={back}
        className="fixed bottom-4 left-4 z-[1000] flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3.5 py-2 font-mono text-[11px] text-white shadow-lg backdrop-blur-md hover:bg-black/85"
      >
        <span aria-hidden>←</span> UI Lab
        <kbd className="rounded border border-white/25 px-1 text-[10px] text-white/70">Esc</kbd>
      </a>
    </>
  )
}
