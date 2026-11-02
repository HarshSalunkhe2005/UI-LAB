// Builds the distributable skill from repo sources. Nothing in release/ is hand-copied.
//
//   skill/ui-lab/        every authored file (SKILL.md, README, references, templates, patterns, scripts, examples)
//   patterns/*.html      their header comments generate patterns/INDEX.md
//
// Output: release/stage/<variant>/ui-lab/ (inspectable) and release/ui-lab-pro.zip, release/ui-lab-lite.zip.
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
  'scripts/', 'examples/', 'LICENSE-PRO.md',
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
  const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)
  const lines = [
    '# Patterns',
    '',
    `${headers.length} canonical patterns: self-contained HTML, CSS and a little vanilla JavaScript. Pick by "use when", open the file, take the structure and the accessibility behaviour, then replace the tokens (the \`:root\` block at the top) with your direction's tokens. Each file starts with a header comment with accessibility notes and how to adapt it. They use neutral system fonts and a plain palette on purpose: they are starting points, not finished design.`,
    '',
  ]
  for (const c of cats) {
    lines.push(`## ${c}`, '')
    for (const h of headers.filter((x) => x.category === c)) lines.push(`- \`patterns/${h.pattern}.html\`: ${cut(h.when, 130)}`)
    lines.push('')
  }
  return lines.join('\n')
}

function applyMarkers(text, variant) {
  // {{lite}}...{{/lite}} is text only the lite package keeps; its pro counterpart sits in a {{pro}} span beside it
  if (variant === 'pro') return text.replace(/\{\{lite\}\}[\s\S]*?\{\{\/lite\}\}/g, '').replace(/\{\{\/?pro\}\}/g, '').replace(/[ \t]*\{\{pro-line\}\}/g, '')
  return text
    .split('\n')
    .filter((l) => !l.includes('{{pro-line}}'))
    .join('\n')
    .replace(/[ \t]*\{\{pro\}\}[\s\S]*?\{\{\/pro\}\}/g, '')
    .replace(/\{\{\/?lite\}\}/g, '')
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

  const summary = []
  let liteFiles = []
  for (const [variant, zipName] of [['pro', `${NAME}-pro.zip`], ['lite', `${NAME}-lite.zip`]]) {
    const stage = join(OUT, 'stage', variant)
    const keep = headers.filter((h) => variant === 'pro' || h.tier === 'lite')
    const files = []
    for (const [path, rawText] of set) {
      if (excluded(path, variant)) continue
      if (/\/patterns\/[^/]+\.html$/.test(path) && !keep.some((h) => h.path === path)) continue
      let text = path.endsWith('.md') ? applyMarkers(rawText, variant) : rawText
      const data = Buffer.from(text.replace(/\r\n/g, '\n'), 'utf8')
      files.push({ name: path, data })
    }
    if (keep.length) files.push({ name: `${NAME}/patterns/INDEX.md`, data: Buffer.from(patternsIndexFile(keep, variant) + '\n', 'utf8') })
    for (const f of files) {
      const dest = join(stage, ...f.name.split('/'))
      mkdirSync(dirname(dest), { recursive: true })
      writeFileSync(dest, f.data)
    }
    if (variant === 'lite') liteFiles = files
    const zip = writeZip(files)
    writeFileSync(join(OUT, zipName), zip)
    const bytes = files.reduce((n, f) => n + f.data.length, 0)
    summary.push(`${zipName}: ${files.length} files (${keep.length} patterns), ${(bytes / 1024).toFixed(0)} KB unpacked, ${(zip.length / 1024).toFixed(0)} KB zipped`)
  }
  // the plugin (see .claude-plugin) ships the LITE build from skills/ui-lab, a tracked path; the Pro build is written only to release/ (gitignored)
  rmSync(join(ROOT, 'skills', NAME), { recursive: true, force: true })
  for (const f of liteFiles) {
    const dest = join(ROOT, 'skills', ...f.name.split('/'))
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, f.data)
  }
  console.log(`Built.\n  ${summary.join('\n  ')}\n  stage dirs: release/stage/{pro,lite}/${NAME}/`)
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('tools/build-skill.mjs')) {
  main().catch((e) => { console.error(`build-skill failed: ${e.message}`); process.exit(1) })
}
