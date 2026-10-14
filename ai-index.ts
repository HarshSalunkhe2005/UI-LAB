/*
 * Generates machine-readable files for AI agents from src/meta.ts:
 *   /llms.txt                 index: what this is, how to use it, every pattern
 *   /llms-full.txt            everything inlined: metadata + full source of every pattern
 *   /patterns.json            structured metadata (slug, tags, file, urls…)
 *   /docs/<slug>.md           one markdown doc per pattern: metadata + source
 *   /raw/<path>.tsx           raw source file, plain text
 *   /resources.md             curated external galleries, studios, repos, libraries, tools
 *   /references.md|.json      teardowns of world-class sites, vibe-coded UIs and recent award winners, each linked to the pattern that rebuilds it
 * Served in dev by middleware, emitted as static files on build.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { CATEGORIES, META } from './src/meta'
import { RESOURCE_KINDS, RESOURCES } from './src/resources'
import { EVERYDAY, REFUSE_UNTIL_CLEAR, ROUTES, TOOLBOX } from './src/router'
import { COMMUNITY, RECENT, REFERENCES, REF_NOTES, VIBE, WORLD, type Ref } from './src/references'

const SITE = 'https://ui-lab-weld.vercel.app'
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
    `- **Claude: read ${SITE}/for-claude.md first.** It is the brief-to-build router (worlds, proof sites, techniques, refusals).`,
    `- Outside references (galleries, studios, open-source demo repos, libraries, tools): ${SITE}/resources.md`,
    `- ${REFERENCES.length} reference teardowns (${WORLD.length} world-class, ${VIBE.length} vibe-coded, ${RECENT.length} recent award winners, ${COMMUNITY.length} community picks) with the pattern that rebuilds each: ${SITE}/references.md (JSON: ${SITE}/references.json)`,
    '',
    '## START HERE: the design procedure',
    '',
    'Patterns are parts; the playbook is the judgement. Read start-here first, every time you build a UI.',
    '',
    ...playbookNames().map((f) => `- [${mdTitle(read(`playbook/${f}`), f)}](${SITE}/playbook/${f})`),
    `- [Site stack detector](${SITE}/tools/site-stack.mjs): \`node site-stack.mjs <url>\` lists the libraries a reference site uses`,
    `- [Accessibility sweep](${SITE}/tools/axe-crawl.js): paste into a browser console to run axe-core over every pattern and site`,
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

function refBlock(r: Ref) {
  const moves = (r.moves ?? []).map((s) => `[${s}](${SITE}/docs/${s}.md)`).join(', ')
  return [
    `### [${r.name}](${r.url})`,
    '',
    `- **Idea:** ${r.idea}`,
    `- **Technique:** ${r.technique}`,
    `- **Look:** ${r.look}`,
    `- **Take:** ${r.take}`,
    `- **Leave:** ${r.leave}`,
    `- **Mode / evidence:** ${r.mode} / ${r.evidence}`,
    r.tool ? `- **Built with:** ${r.tool}${r.author ? ` by ${r.author}` : ''}; counts shown by v0: ${r.counts?.join(' and ')} (larger is most likely forks)` : '',
    moves ? `- **Rebuilt as:** ${moves}` : '',
    `- **Tags:** ${r.tags.join(', ')}`,
    '',
  ].filter((l) => l !== '')
}

function referencesMd() {
  const out = [
    '# UI Lab: reference sites',
    '',
    `> ${WORLD.length} world-class websites, ${VIBE.length} vibe-coded UIs and ${RECENT.length} recent award winners and ${COMMUNITY.length} community picks, taken apart with the method in /playbook/inspiration.md. Measured ${REF_NOTES.measuredOn} at 1440x900.`,
    '> "inspected" = rendered and measured; "partial" = a canvas or WebGL2 experience we could only partly see; "listing" = read from the vendor page.',
    '> Techniques are re-implemented in our own code (category "Signature moves"); nothing is copied. Read /playbook/reference-sites.md for what the studied sites have in common.',
    '',
    `## World-class (${WORLD.length})`,
    '',
    ...WORLD.flatMap((r) => [...refBlock(r), '']),
    `## Vibe-coded (${VIBE.length})`,
    '',
    REF_NOTES.vibeMethod,
    '',
    ...VIBE.flatMap((r) => [...refBlock(r), '']),
    `## Recent award winners (${RECENT.length})`,
    '',
    ...RECENT.flatMap((r) => [...refBlock(r), '']),
    `## Community picks (${COMMUNITY.length}): chosen by communities (Hacker News Show HN, One Page Love)`,
    '',
    ...COMMUNITY.flatMap((r) => [...refBlock(r), '']),
    '## Left out',
    '',
    ...REF_NOTES.excluded.map((e) => `- [${e.name}](${e.url}): ${e.why}`),
    '',
  ]
  return out.join('\n')
}

function forClaude() {
  const known = new Set(META.map((m) => m.slug))
  const check = (slug: string) => {
    if (!known.has(slug)) throw new Error(`router.ts references unknown pattern "${slug}"`)
    return `[${slug}](${SITE}/docs/${slug}.md)`
  }
  const lines = [
    '# For Claude: how to use UI Lab',
    '',
    '> You are about to build or change a UI. This page is the shortest route from a brief to a good result. Read it fully, then follow the links.',
    '',
    '## The loop (do not skip steps)',
    '',
    '1. **Brief in five lines**: who and where, mode, the one memorable moment, real content, constraints. If you cannot write them, ask the user one sharp question.',
    '2. **Pick a world** from the router below. If nothing fits, invent one and write its card.',
    '3. **Look at the proof** for that world (a whole site or a pattern). Open it, read its source, run it.',
    '4. **Take apart three outside references**, 5 lines each: idea, technique, palette and type, take, leave. Never copy code, text or assets.',
    '5. **Direction card** (name, metaphor, palette roles, type pair, motion language, signature moment, three refusals), then the swap test.',
    '6. **Vertical slice** of the signature moment first, then build outward.',
    '7. **Verify once, in batch**: fresh load, console clean, every section at 1440 and 375, reduced motion, keyboard. Fix everything, confirm once, stop.',
    '8. **Hand off honestly**: the URL, what you rendered, what you could not test, what is placeholder.',
    '',
    `For the common kinds of site (business, app, portfolio, publication, report, shop, event, status page, dashboard), the usual section order is in ${SITE}/playbook/site-types.md.`,
    '',
    `Full procedure: ${SITE}/playbook/00-start-here.md. Bug catalogue to read before verifying: ${SITE}/playbook/verify.md.`,
    '',
    '## Router: what the brief smells like, what to build from',
    '',
    '| Brief | Mode | World | Proof | The move |',
    '|---|---|---|---|---|',
    ...ROUTES.map((r) => `| ${r.brief} | ${r.mode} | [${r.world}](${SITE}/playbook/${r.card}) | ${r.proof.map(check).join(', ')} | ${r.move} |`),
    '',
    '## Toolbox: techniques that rebuild studied sites',
    '',
    ...TOOLBOX.map((t) => `- ${t.want}: ${check(t.slug)}`),
    '',
    `The full set is the "Signature moves" category in ${SITE}/llms.txt; the teardown of each studied site is in ${SITE}/references.md.`,
    '',
    '## Everyday parts (already built to the accessibility baseline)',
    '',
    ...EVERYDAY.map((t) => `- ${t.want}: ${check(t.slug)}`),
    '',
    '## Send the brief back when',
    '',
    ...REFUSE_UNTIL_CLEAR.map((x) => `- ${x}`),
    '',
    '## Always on',
    '',
    '- Fonts self-hosted (Fontsource). No system font as the display voice. Draw icons; no emoji as icons.',
    '- Contrast 4.5:1 for body text, 44px touch targets, `100svh`, no horizontal scroll at 375px, `prefers-reduced-motion` honoured, keyboard reachable with visible focus.',
    '- Animate transform, opacity, clip-path; not layout properties.',
    '- Refuse unless the brief earns them: identical icon-heading-text card grids, hero-metric rows as filler, eyebrow labels, gradient text, decorative glass, identical fade-up on every block.',
    "- Do not reuse a studied site's code, copy or assets.",
    '',
    '## Machine-readable',
    '',
    `- ${SITE}/llms.txt (index), ${SITE}/patterns.json, ${SITE}/llms-full.txt (everything), ${SITE}/references.json`,
    `- Each pattern: ${SITE}/docs/<slug>.md. Each whole site includes every file in its folder.`,
    '',
  ]
  return lines.join('\n')
}

/** Build-time sanity checks: a broken entry should fail the build, not ship a dead card. */
function validate() {
  const problems: string[] = []
  const seen = new Set<string>()
  for (const m of META) {
    if (seen.has(m.slug)) problems.push(`duplicate slug "${m.slug}"`)
    seen.add(m.slug)
    for (const f of m.files ?? [m.file]) if (!existsSync(resolve(__dirname, 'src/patterns', f))) problems.push(`${m.slug}: missing file src/patterns/${f}`)
    if (m.category === 'Sites' && !existsSync(resolve(__dirname, `public/thumbs/${m.slug}.jpg`))) problems.push(`${m.slug}: missing thumbnail public/thumbs/${m.slug}.jpg`)
    if (m.file.startsWith('sites/') && !/^sites\/[^/]+\/index\.tsx$/.test(m.file)) problems.push(`${m.slug}: a site entry file must be sites/<name>/index.tsx`)
    if (!m.when?.length) problems.push(`${m.slug}: needs at least one "when" line`)
    if (!m.a11y) problems.push(`${m.slug}: needs an a11y note`)
  }
  // Pattern slugs written in backticks in the playbook must exist, so the guidance cannot point at a renamed pattern.
  for (const f of playbookNames()) {
    for (const t of read(`playbook/${f}`).matchAll(/`((?:site|move|niche|css)-[a-z0-9-]+)`/g)) if (!seen.has(t[1])) problems.push(`playbook/${f} mentions unknown pattern ${t[1]}`)
  }
  if (problems.length) throw new Error(`Pattern metadata problems:\n - ${problems.join('\n - ')}`)
}

function files(): Record<string, string> {
  validate()
  const out: Record<string, string> = {
    'llms.txt': llms(),
    'for-claude.md': forClaude(),
    'resources.md': resourcesMd(),
    'references.md': referencesMd(),
    'references.json': JSON.stringify({ name: 'UI Lab reference sites', site: SITE, measuredOn: REF_NOTES.measuredOn, notes: REF_NOTES, references: REFERENCES.map((r) => ({ ...r, patterns: (r.moves ?? []).map((s) => `${SITE}/docs/${s}.md`) })) }, null, 2),
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
    'tools/axe-crawl.js': read('tools/axe-crawl.js'),
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
        if (!/^(llms(-full)?\.txt|for-claude\.md|patterns\.json|resources\.md|references\.(md|json)|docs\/|raw\/|playbook\/|tools\/)/.test(path)) return next()
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
