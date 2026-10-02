/*
 * Generates machine-readable files for AI agents from src/meta.ts:
 *   /llms.txt                 index: what this is, how to use it, every pattern
 *   /llms-full.txt            everything inlined: metadata + full source of every pattern
 *   /patterns.json            structured metadata (slug, tags, file, urls…)
 *   /docs/<slug>.md           one markdown doc per pattern: metadata + source
 *   /raw/<path>.tsx           raw source file, plain text
 *   /resources.md             curated external galleries, studios, repos, libraries, tools
 * Served in dev by middleware, emitted as static files on build.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { CATEGORIES, META } from './src/meta'
import { RESOURCE_KINDS, RESOURCES } from './src/resources'

const SITE = 'https://ui-lab-gzfw.onrender.com'
const REPO = 'https://github.com/HarshSalunkhe2005/UI-LAB'

function read(rel: string) {
  return readFileSync(resolve(__dirname, rel), 'utf-8')
}

const SHARED = 'three-d/_shared.ts'

const playbookNames = () => readdirSync(resolve(__dirname, 'playbook')).filter((f) => f.endsWith('.md')).sort()

/** First `# heading` of a markdown file, used as the link text in llms.txt. */
const mdTitle = (src: string, fallback: string) => src.match(/^#\s+(.+)$/m)?.[1] ?? fallback


function doc(m: (typeof META)[number]) {
  const files = m.files ?? [m.file]
  const src = files.length > 1 ? files.map((f) => `// ===== src/patterns/${f} =====\n${read(`src/patterns/${f}`)}`).join('\n\n') : read(`src/patterns/${m.file}`)
  const usesShared = /from '\.\/_shared'/.test(src)
  const usesSiteShared = src.includes("'../_shared'")
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
    m.files && m.files.length > 1 ? `- **Raw files:** ${m.files.map((f) => `${SITE}/raw/${f}`).join(', ')}` : '',
    m.source ? `- **Reference:** [${m.source.label}](${m.source.url})` : '',
    '',
    '## When to use',
    '',
    ...m.when.map((w) => `- ${w}`),
    '',
    m.a11y ? `## Accessibility\n\n${m.a11y}\n` : '',
    '## Source',
    '',
    files.length > 1 ? `Files: ${files.map((f) => `\`src/patterns/${f}\``).join(', ')}` : `\`src/patterns/${m.file}\``,
    '',
    '```tsx',
    src.trimEnd(),
    '```',
    usesShared ? `
## Helper it imports: \`src/patterns/${SHARED}\`

\`\`\`ts
${read(`src/patterns/${SHARED}`).trimEnd()}
\`\`\`` : '',
    usesSiteShared ? `
## Helper it imports: \`src/patterns/sites/_shared.ts\`

\`\`\`ts
${read('src/patterns/sites/_shared.ts').trimEnd()}
\`\`\`` : '',
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
    `- Outside references (galleries, studios, open-source demo repos, libraries, tools): ${SITE}/resources.md`,
    '',
    '## START HERE: the design procedure',
    '',
    'Patterns are parts; the playbook is the judgement. Read start-here first, every time you build a UI.',
    '',
    ...playbookNames().map((f) => `- [${mdTitle(read(`playbook/${f}`), f)}](${SITE}/playbook/${f})`),
    `- [Site stack detector](${SITE}/tools/site-stack.mjs): \`node site-stack.mjs <url>\` lists the libraries a reference site uses`,
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

function resourcesMd() {
  const out = ['# UI Lab: external resources', '', '> Curated references for building frontends: where to look, what to study, what to install.', '']
  for (const k of RESOURCE_KINDS) {
    const items = RESOURCES.filter((r) => r.kind === k)
    if (!items.length) continue
    out.push(`## ${k}`, '')
    for (const r of items) out.push(`- [${r.name}](${r.url}): ${r.note}${r.tags?.length ? ` [${r.tags.join(', ')}]` : ''}`)
    out.push('')
  }
  return out.join('\n')
}

function files(): Record<string, string> {
  const out: Record<string, string> = {
    'llms.txt': llms(),
    'resources.md': resourcesMd(),
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
    'tools/site-stack.mjs': read('tools/site-stack.mjs'),
    'raw/tokens/tokens.css': read('src/tokens/tokens.css'),
    'raw/index.css': read('src/index.css'),
    [`raw/${SHARED}`]: read(`src/patterns/${SHARED}`),
  }
  for (const f of playbookNames()) out[`playbook/${f}`] = read(`playbook/${f}`)
  for (const m of META) {
    out[`docs/${m.slug}.md`] = doc(m)
    for (const f of m.files ?? [m.file]) out[`raw/${f}`] = read(`src/patterns/${f}`)
  }
  out['llms-full.txt'] = [llms(), '', '---', '', ...playbookNames().map((f) => read(`playbook/${f}`)), ...META.map(doc)].join('\n\n')
  return out
}

const TYPES: Record<string, string> = {
  ts:'text/plain; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  mjs: 'text/plain; charset=utf-8',
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
        // Vite's own module requests (e.g. /playbook/x.md?raw) carry a query: let Vite answer those.
        if ((req.url ?? '').includes('?')) return next()
        const path = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\//, '')
        if (!/^(llms(-full)?\.txt|patterns\.json|resources\.md|docs\/|raw\/|playbook\/|tools\/)/.test(path)) return next()
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
