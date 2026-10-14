#!/usr/bin/env node
/*
 * Scaffold a whole-site pattern.
 *
 *   node tools/new-site.mjs <name> "<Title>" [world number]
 *   node tools/new-site.mjs bakery "Crumb & Co. (neighbourhood bakery)" 8
 *
 * Creates src/patterns/sites/<name>/{index.tsx,styles.css} with the conventions already in place (root class site-<name>,
 * useSiteScroll, skip-free semantic skeleton, scoped-CSS-ready stylesheet) and appends a registry entry to
 * src/meta-sites.ts. The entry's text is marked TODO on purpose: the build refuses to ship a "TODO" summary, so a
 * half-written site cannot be published by accident. Add public/thumbs/site-<name>.jpg when the site is finished.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [name, title = 'New site', world = ''] = process.argv.slice(2)
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: node tools/new-site.mjs <kebab-name> "<Title>" [world number]')
  process.exit(1)
}
const dir = resolve(root, 'src/patterns/sites', name)
if (existsSync(dir)) {
  console.error(`src/patterns/sites/${name} already exists`)
  process.exit(1)
}
mkdirSync(dir, { recursive: true })
const Comp = name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase()) + 'Site'

writeFileSync(
  resolve(dir, 'index.tsx'),
  `import { useRef } from 'react'
import './styles.css'
import { useSiteScroll } from '../_shared'

/*
 * ${title.toUpperCase()}${world ? ` (world ${world})` : ''}
 * TODO: one paragraph. The world, the signature moment, what you refused, and what is real versus placeholder.
 */

export default function ${Comp}() {
  const root = useRef<HTMLDivElement>(null)
  useSiteScroll(root, { smooth: false })

  return (
    <div className="site-${name}" ref={root}>
      <header className="top">
        <a href="#top" className="logo">${title}</a>
        <nav aria-label="Sections">
          <a href="#one">One</a>
        </nav>
      </header>
      <main id="top">
        <section id="one" aria-labelledby="h1">
          <h1 id="h1">${title}</h1>
        </section>
      </main>
      <footer className="foot">TODO: say plainly that this is a demonstration.</footer>
    </div>
  )
}
`,
)

writeFileSync(
  resolve(dir, 'styles.css'),
  `/* Write this as an ordinary stylesheet (:root, html, body, * are fine), then scope it:
   python tools/scope-css.py src/patterns/sites/${name}/styles.css site-${name} <keyframe-prefix> */
:root {
  --paper: #fbfaf6;
  --ink: #17140f;
  --accent: #c8371b;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--paper); color: var(--ink); font-family: system-ui, sans-serif; line-height: 1.5; min-height: 100svh; }
a { color: inherit; }
button, input { font: inherit; color: inherit; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
[id] { scroll-margin-top: 72px; }
.top { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; }
.foot { padding: 24px; font-size: 14px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
`,
)

const metaPath = resolve(root, 'src/meta-sites.ts')
let meta = readFileSync(metaPath, 'utf8').replace(/\s+$/, '')
if (!meta.endsWith(']')) throw new Error('Unexpected end of src/meta-sites.ts')
meta =
  meta.slice(0, -1).replace(/\s+$/, '') +
  `
  {
    slug: 'site-${name}',
    title: 'Site: ${title.replace(/'/g, "\\'")}',
    category: 'Sites',
    summary: 'TODO: two sentences. What the site is, and the one thing it proves.',
    when: ['TODO: who should reach for this', 'TODO: what to take from it'],
    file: 'sites/${name}/index.tsx',
    files: ['sites/${name}/index.tsx', 'sites/${name}/styles.css'],
    tags: ['site', 'full page'],
    a11y: 'TODO: keyboard, screen reader and reduced-motion behaviour, specifically.',
    deps: ['sites/_shared.ts'],
  },
]
`
writeFileSync(metaPath, meta)

console.log(`Created src/patterns/sites/${name}/ and a TODO entry in src/meta-sites.ts.
Next:
  1. Build the site, then: python tools/scope-css.py src/patterns/sites/${name}/styles.css site-${name} ${name.slice(0, 6)}
  2. Fill in the registry entry (the build fails while any text still says TODO).
  3. Verify at #/live/site-${name}, then save a thumbnail to public/thumbs/site-${name}.jpg.`)
