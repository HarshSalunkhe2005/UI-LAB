// Builds the distributable skill from repo sources. Nothing in release/ is hand-copied.
//
//   skill/ui-lab/        every authored file (SKILL.md, README, references, templates, patterns, scripts, examples)
//   src/meta*.ts         read to generate the "ideas" half of references/patterns-index.md
//   patterns/*.html      their header comments generate patterns/INDEX.md and the packaged half of patterns-index.md
//
// Output: release/stage/<variant>/ui-lab/ (inspectable) and release/ui-lab.zip, release/ui-lab-lite.zip.
// "pro" is everything; "lite" drops the parts marked {{pro}}...{{/pro}} / {{pro-line}}, the paths in LITE_EXCLUDE,
// and patterns whose header says "tier: pro".
// Run: node tools/build-skill.mjs   (npm run skill also validates)
import { registerHooks } from 'node:module'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { writeZip } from './zip.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'skill', 'ui-lab')
const OUT = join(ROOT, 'release')
const NAME = 'ui-lab'

const LITE_EXCLUDE = [
  'references/teardowns.md', 'references/briefs.md', 'references/site-types.md', 'references/glossary.md',
  'references/patterns-index.md', 'scripts/', 'examples/',
]

// ---------------------------------------------------------------------------------------------------------------------

registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx) } catch (e) {
      if (spec.startsWith('.') && !/\.\w+$/.test(spec)) return next(`${spec}.ts`, ctx)
      throw e
    }
  },
})

function walk(dir, base = dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p, base))
    else out.push(relative(base, p).split(sep).join('/'))
  }
  return out.sort()
}

/** Reads the "<!-- key: value -->" header block at the top of a pattern file. */
export function parsePatternHeader(path, text) {
  const m = text.match(/<!--\s*\n([\s\S]*?)-->/)
  if (!m) throw new Error(`${path}: no header comment`)
  const h = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z0-9]+):\s*(.*)$/)
    if (kv) h[kv[1]] = kv[2].trim()
  }
  for (const k of ['pattern', 'title', 'category', 'tier', 'when', 'a11y', 'adapt']) if (!h[k]) throw new Error(`${path}: header is missing "${k}"`)
  if (!['lite', 'pro'].includes(h.tier)) throw new Error(`${path}: tier must be lite or pro`)
  const slug = path.replace(/^.*\//, '').replace(/\.html$/, '')
  if (h.pattern !== slug) throw new Error(`${path}: header pattern "${h.pattern}" does not match the file name`)
  return h
}

function patternsIndexFile(headers, variant) {
  const cats = [...new Set(headers.map((h) => h.category))]
  const lines = [
    '# Patterns',
    '',
    `${headers.length} canonical patterns as self-contained HTML, CSS and a little vanilla JavaScript. Open one, take the structure and the accessibility behaviour, then replace the tokens (the \`:root\` block at the top of each file) with your direction's tokens. They are starting points, not finished design: each uses neutral system fonts and a plain palette on purpose.`,
    '',
    'Each file begins with a header comment: when to use it, accessibility notes, how to adapt it. Every pattern has a visible focus state, 44 px targets at 375 and handles reduced motion where it moves.',
    '',
  ]
  for (const c of cats) {
    lines.push(`## ${c}`, '', '| Pattern | Use when | Accessibility |', '|---|---|---|')
    for (const h of headers.filter((x) => x.category === c)) lines.push(`| \`patterns/${h.pattern}.html\`<br>${h.title} | ${h.when} | ${h.a11y} |`)
    lines.push('')
  }
  return lines.join('\n')
}

async function patternsIndexReference(headers) {
  const { META, CATEGORIES } = await import(pathToFileURL(join(ROOT, 'src', 'meta.ts')).href)
  const one = (s, n) => {
    const t = String(s).replace(/\s+/g, ' ').trim()
    return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t
  }
  const lines = [
    '# Pattern index',
    '',
    '## Packaged patterns (open these)',
    '',
    `${headers.length} patterns ship in \`patterns/\`. Each path below exists in this package; \`patterns/INDEX.md\` has the same list with accessibility notes.`,
    '',
  ]
  for (const h of headers) lines.push(`- \`patterns/${h.pattern}.html\`: ${h.title} (${h.category}). ${one(h.when, 170)}`)
  lines.push(
    '',
    '## Ideas from the wider library (names only, not bundled)',
    '',
    `${META.length} further patterns exist in the full UI Lab library, listed by category so you know what kinds of component, section, effect and whole-page direction exist. Their source is not in this package: use the entry as an idea and rebuild it, in the direction you chose.`,
    '',
  )
  for (const cat of CATEGORIES) {
    const items = META.filter((m) => m.category === cat)
    if (!items.length) continue
    lines.push(`### ${cat} (${items.length})`, '')
    for (const m of items) lines.push(`- **${one(m.title, 60)}**: ${one(m.summary, 150)} [${(m.tags || []).slice(0, 5).join(', ')}]`)
    lines.push('')
  }
  return { text: lines.join('\n'), count: META.length }
}

function applyMarkers(text, variant) {
  if (variant === 'pro') return text.replace(/\{\{\/?pro\}\}/g, '').replace(/[ \t]*\{\{pro-line\}\}/g, '')
  return text
    .split('\n')
    .filter((l) => !l.includes('{{pro-line}}'))
    .join('\n')
    .replace(/[ \t]*\{\{pro\}\}[\s\S]*?\{\{\/pro\}\}/g, '')
}

const excluded = (path, variant) => variant === 'lite' && LITE_EXCLUDE.some((x) => (x.endsWith('/') ? path.startsWith(`${NAME}/${x}`) : path === `${NAME}/${x}`))

async function main() {
  if (!existsSync(join(SRC, 'SKILL.md'))) throw new Error(`Missing ${SRC}/SKILL.md`)
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })

  const set = new Map()
  // sources may carry CRLF (Windows checkouts); normalise so header parsing and the zip are identical everywhere
  for (const rel of walk(SRC)) set.set(`${NAME}/${rel}`, readFileSync(join(SRC, rel), 'utf8').replace(/\r\n/g, '\n'))

  // patterns: validate headers once
  const headers = [...set.keys()].filter((p) => /\/patterns\/[^/]+\.html$/.test(p)).map((p) => ({ ...parsePatternHeader(p, set.get(p)), path: p }))
  const idx = await patternsIndexReference(headers)
  set.set(`${NAME}/references/patterns-index.md`, idx.text)

  const summary = []
  for (const [variant, zipName] of [['pro', `${NAME}.zip`], ['lite', `${NAME}-lite.zip`]]) {
    const stage = join(OUT, 'stage', variant)
    const keep = headers.filter((h) => variant === 'pro' || h.tier === 'lite')
    const files = []
    for (const [path, rawText] of set) {
      if (excluded(path, variant)) continue
      if (/\/patterns\/[^/]+\.html$/.test(path) && !keep.some((h) => h.path === path)) continue
      let text = path.endsWith('.md') ? applyMarkers(rawText, variant) : rawText
      if (path === `${NAME}/references/patterns-index.md`) text = idx.text.replace(/^- `patterns\/([^`]+)\.html`.*$/gm, (line, slug) => (keep.some((h) => h.pattern === slug) ? line : '')).replace(/\n{3,}/g, '\n\n')
      const data = Buffer.from(text.replace(/\r\n/g, '\n'), 'utf8')
      files.push({ name: path, data })
    }
    if (keep.length) files.push({ name: `${NAME}/patterns/INDEX.md`, data: Buffer.from(patternsIndexFile(keep, variant) + '\n', 'utf8') })
    for (const f of files) {
      const dest = join(stage, ...f.name.split('/'))
      mkdirSync(dirname(dest), { recursive: true })
      writeFileSync(dest, f.data)
    }
    const zip = writeZip(files)
    writeFileSync(join(OUT, zipName), zip)
    const bytes = files.reduce((n, f) => n + f.data.length, 0)
    summary.push(`${zipName}: ${files.length} files (${keep.length} patterns), ${(bytes / 1024).toFixed(0)} KB unpacked, ${(zip.length / 1024).toFixed(0)} KB zipped`)
  }
  console.log(`Built.\n  ${summary.join('\n  ')}\n  stage dirs: release/stage/{pro,lite}/${NAME}/`)
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('tools/build-skill.mjs')) {
  main().catch((e) => { console.error(`build-skill failed: ${e.message}`); process.exit(1) })
}
