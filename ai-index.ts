/*
 * Generates machine-readable files for AI agents from src/meta.ts:
 *   /llms.txt                 index: what this is, how to use it, every pattern
 *   /llms-full.txt            everything inlined: metadata + full source of every pattern
 *   /patterns.json            structured metadata (slug, tags, file, urls…)
 *   /docs/<slug>.md           one markdown doc per pattern: metadata + source
 *   /raw/<path>.tsx           raw source file, plain text
 * Served in dev by middleware, emitted as static files on build.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { CATEGORIES, META } from './src/meta'

const SITE = 'https://ui-lab-gzfw.onrender.com'
const REPO = 'https://github.com/HarshSalunkhe2005/UI-LAB'

function read(rel: string) {
  return readFileSync(resolve(__dirname, rel), 'utf-8')
}

function doc(m: (typeof META)[number]) {
  const src = read(`src/patterns/${m.file}`)
  return [
    `# ${m.title}`,
    '',
    `> ${m.summary}`,
    '',
    `- **Category:** ${m.category}`,
    `- **Slug:** ${m.slug}`,
    m.tags?.length ? `- **Tags:** ${m.tags.join(', ')}` : '',
    `- **Dependencies:** ${m.deps?.length ? m.deps.join(', ') : 'none beyond React + Tailwind (tokens from src/tokens/tokens.css)'}`,
    `- **Live demo:** ${SITE}/#/${m.slug}`,
    `- **Raw source:** ${SITE}/raw/${m.file}`,
    `- **GitHub:** ${REPO}/blob/main/src/patterns/${m.file}`,
    m.source ? `- **Reference:** [${m.source.label}](${m.source.url})` : '',
    '',
    '## When to use',
    '',
    ...m.when.map((w) => `- ${w}`),
    '',
    m.a11y ? `## Accessibility\n\n${m.a11y}\n` : '',
    '## Source',
    '',
    `\`src/patterns/${m.file}\``,
    '',
    '```tsx',
    src.trimEnd(),
    '```',
    '',
  ]
    .filter((l) => l !== '')
    .join('\n')
    .replace(/\n(#+ )/g, '\n\n$1')
}

function llms() {
  const lines = [
    '# UI Lab',
    '',
    '> A reference library of UI patterns for AI coding agents and humans building frontends.',
    '> Every pattern is a single self-contained React + Tailwind file with a live demo.',
    '',
    'How to use:',
    '- Pick a pattern below, fetch its /docs/<slug>.md (metadata + full source) or /raw/<file>.',
    '- Copy src/tokens/tokens.css into the target project first; patterns style themselves with its CSS variables',
    `  (raw: ${SITE}/raw/tokens/tokens.css). Tailwind utilities like bg-surface / text-fg-muted map to those tokens`,
    `  via the @theme block in ${SITE}/raw/index.css.`,
    '- Every motion pattern respects prefers-reduced-motion. Keep that when adapting.',
    `- Machine-readable index: ${SITE}/patterns.json. Everything in one file: ${SITE}/llms-full.txt`,
    '',
  ]
  for (const cat of CATEGORIES) {
    const items = META.filter((m) => m.category === cat)
    if (!items.length) continue
    lines.push(`## ${cat}`, '')
    for (const m of items) {
      lines.push(`- [${m.title}](${SITE}/docs/${m.slug}.md): ${m.summary}${m.tags?.length ? ` [${m.tags.join(', ')}]` : ''}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function files(): Record<string, string> {
  const out: Record<string, string> = {
    'llms.txt': llms(),
    'patterns.json': JSON.stringify(
      {
        name: 'UI Lab',
        site: SITE,
        repo: REPO,
        tokens: `${SITE}/raw/tokens/tokens.css`,
        categories: CATEGORIES,
        patterns: META.map((m) => ({
          ...m,
          demo: `${SITE}/#/${m.slug}`,
          doc: `${SITE}/docs/${m.slug}.md`,
          raw: `${SITE}/raw/${m.file}`,
        })),
      },
      null,
      2,
    ),
    'raw/tokens/tokens.css': read('src/tokens/tokens.css'),
    'raw/index.css': read('src/index.css'),
  }
  for (const m of META) {
    out[`docs/${m.slug}.md`] = doc(m)
    out[`raw/${m.file}`] = read(`src/patterns/${m.file}`)
  }
  out['llms-full.txt'] = [llms(), '', '---', '', ...META.map(doc)].join('\n\n')
  return out
}

const TYPES: Record<string, string> = {
  txt: 'text/plain; charset=utf-8',
  md: 'text/markdown; charset=utf-8',
  json: 'application/json; charset=utf-8',
  tsx: 'text/plain; charset=utf-8',
  css: 'text/plain; charset=utf-8',
}

export function aiIndex(): Plugin {
  return {
    name: 'ui-lab-ai-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\//, '')
        if (!/^(llms(-full)?\.txt|patterns\.json|docs\/|raw\/)/.test(path)) return next()
        const body = files()[path]
        if (body === undefined) return next()
        res.setHeader('Content-Type', TYPES[path.split('.').pop()!] ?? 'text/plain')
        res.end(body)
      })
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files())) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}
