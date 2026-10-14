import { useState } from 'react'
import { ROUTES, type Route } from './router'

/*
 * Browse by style: every design world in one place, with a picture of its proof site when there is one. Built from
 * src/router.ts, the same data that becomes /for-claude.md, so the page and the guide for AI assistants never disagree.
 */

const MODES: (Route['mode'] | 'All')[] = ['All', 'Persuade', 'Operate', 'Read', 'Experience']
const MODE_HELP: Record<Route['mode'], string> = {
  Persuade: 'The visitor decides and acts: landing pages, products, campaigns.',
  Operate: 'The visitor finishes a task: tools, dashboards, forms, status pages.',
  Read: 'The visitor understands something: articles, reports, guides.',
  Experience: 'The visitor is inside the work: portfolios, exhibitions, games.',
}

export default function StylesPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]>('All')
  const shown = ROUTES.filter((r) => mode === 'All' || r.mode === mode)
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="font-mono text-xs tracking-wider text-accent uppercase">Styles</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        Pick a style, then <span className="font-display font-normal italic text-accent">see it working</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-fg">
        A style (we call it a world) is a whole consistent look: colours, type, movement and what it refuses to do. Each card names what it suits and links to a finished site or a pattern that proves it.
        {' '}<a href="#/playbook/worlds" className="text-accent underline-offset-2 hover:underline">How to choose one</a>.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Filter by what the visitor is doing">
        {MODES.map((m) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={`min-h-11 rounded-full border px-4 text-sm ${mode === m ? 'border-fg bg-fg text-bg' : 'border-border text-fg-muted hover:text-fg'}`}>
            {m}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-6 text-sm text-fg-muted">{mode === 'All' ? 'What the visitor is doing decides how much expression a page can afford.' : MODE_HELP[mode]}</p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => {
          const site = r.proof.find((p) => p.startsWith('site-'))
          const num = r.world.match(/^[\d / ]+/)?.[0].trim()
          const name = r.world.replace(/^[\d / ]+/, '')
          return (
            <li key={r.world} className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface/40">
              <div className="aspect-[16/10] bg-surface-2">
                {site ? (
                  <img src={`/thumbs/${site}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="grid h-full place-items-center font-display text-7xl text-fg-muted/40 italic" aria-hidden>{num}</div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">World {num} · {r.mode}</p>
                <h2 className="mt-1 text-xl font-semibold">{name}</h2>
                <p className="mt-2 text-sm text-fg-muted"><span className="font-medium text-fg">Good for:</span> {r.brief}.</p>
                <p className="mt-2 text-sm text-fg-muted"><span className="font-medium text-fg">Signature:</span> {r.move}</p>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm">
                  {r.proof.map((p) => (
                    <a key={p} href={`#/${p}`} className="inline-flex min-h-8 items-center font-medium text-accent hover:underline">
                      {p.startsWith('site-') ? 'See the site' : 'See the pattern'}
                      <span className="sr-only">: {p}</span>
                      <span aria-hidden className="ml-1">→</span>
                    </a>
                  ))}
                </div>
                <a href={`#/playbook/${r.card.replace('.md', '')}`} className="mt-2 inline-flex min-h-8 items-center text-sm text-fg-muted hover:text-fg hover:underline">Read the style card</a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
