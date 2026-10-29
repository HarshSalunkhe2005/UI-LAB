// Builds the distributable skill from repo sources. Nothing in release/ is hand-copied.
//
//   skill/ui-lab/        hand-authored files (SKILL.md, README, templates, scripts, examples, anti-slop)
//   playbook/*.md        copied into references/ with the explicit rewrites below (the playbook stays untouched)
//   src/meta*.ts         read to generate references/patterns-index.md
//
// Output: release/stage/<variant>/ui-lab/ (inspectable) and release/ui-lab.zip, release/ui-lab-lite.zip.
// "pro" is everything; "lite" drops the parts marked {{pro}}...{{/pro}} / {{pro-line}} and the paths in LITE_EXCLUDE.
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

// playbook file -> reference file. Content is copied, then REWRITES are applied.
const PLAYBOOK_REFS = {
  'worlds.md': 'worlds.md',
  'niche-worlds.md': 'niche-worlds.md',
  'verify.md': 'verify.md',
  'accessibility.md': 'accessibility.md',
  'briefs.md': 'briefs.md',
  'site-types.md': 'site-types.md',
  'glossary.md': 'glossary.md',
}

// Explicit rewrites that remove repo-local references from the copied playbook text.
// Each rule must match at least once, so a playbook edit that makes a rule stale fails the build instead of shipping a dead reference.
const REWRITES = [
  { file: 'verify.md', find: /^## Automated accessibility sweep[\s\S]*?(?=^## )/m, to: '## Automated accessibility sweep\n\nIf an axe-core integration is available in the project, run it on every page and fix serious and critical violations. Otherwise check by hand: landmarks, one h1, labels, focus order, contrast.\n\n' },
  { file: 'accessibility.md', find: /`playbook\/verify\.md` lists/, to: '`verify.md` lists' },
  { file: 'worlds.md', find: /\(`npm i @fontsource\/<name>` or `@fontsource-variable\/<name>`\)/, to: '(self-host the font files, for example from the Fontsource project, rather than linking a font CDN)' },
  { file: 'worlds.md', find: / `src\/router\.ts` maps briefs to both sets\./, to: '' },
  { file: 'verify.md', find: / \(`tools\/scope-css\.py`\)/, to: '' },
  { file: 'niche-worlds.md', find: /Open it at `#\/<slug>` or `#\/live\/<slug>` before you commit\./g, to: 'Look it up in `patterns-index.md` and borrow its idea before you commit.' },
]
// Lines still matching a leak pattern after REWRITES make the validator fail; fix by adding a rule here, not by editing the package by hand.

const LITE_EXCLUDE = [
  'references/niche-worlds.md', 'references/briefs.md', 'references/site-types.md', 'references/glossary.md',
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

async function patternsIndex() {
  const { META, CATEGORIES } = await import(pathToFileURL(join(ROOT, 'src', 'meta.ts')).href)
  const one = (s, n) => {
    const t = String(s).replace(/\s+/g, ' ').trim()
    return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t
  }
  const lines = [
    '# Pattern index',
    '',
    `${META.length} patterns of working UI, by category. Use this list to know what kinds of component, section, effect and whole-page direction exist, and borrow the idea.`,
    'Each line: name, then what it is, then tags. This package indexes patterns; it does not bundle their source code.',
    '',
  ]
  for (const cat of CATEGORIES) {
    const items = META.filter((m) => m.category === cat)
    if (!items.length) continue
    lines.push(`## ${cat} (${items.length})`, '')
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

function excluded(path, variant) {
  return variant === 'lite' && LITE_EXCLUDE.some((x) => (x.endsWith('/') ? path.startsWith(`${NAME}/${x}`) : path === `${NAME}/${x}`))
}

async function main() {
  if (!existsSync(join(SRC, 'SKILL.md'))) throw new Error(`Missing ${SRC}/SKILL.md`)
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })

  // 1. gather the pro file set in memory: [{ path: 'ui-lab/...', text }]
  const set = new Map()
  for (const rel of walk(SRC)) set.set(`${NAME}/${rel}`, readFileSync(join(SRC, rel), 'utf8'))

  for (const [from, to] of Object.entries(PLAYBOOK_REFS)) {
    const p = join(ROOT, 'playbook', from)
    if (!existsSync(p)) throw new Error(`playbook/${from} not found`)
    set.set(`${NAME}/references/${to}`, readFileSync(p, 'utf8'))
  }
  for (const r of REWRITES) {
    const key = `${NAME}/references/${PLAYBOOK_REFS[r.file]}`
    const before = set.get(key)
    const after = before.replace(r.find, r.to)
    if (after === before) throw new Error(`Rewrite rule for ${r.file} matched nothing (playbook changed?): ${r.find}`)
    set.set(key, after)
  }
  const idx = await patternsIndex()
  set.set(`${NAME}/references/patterns-index.md`, idx.text)

  // 2. emit each variant
  const summary = []
  for (const [variant, zipName] of [['pro', `${NAME}.zip`], ['lite', `${NAME}-lite.zip`]]) {
    const stage = join(OUT, 'stage', variant)
    const files = []
    for (const [path, rawText] of set) {
      if (excluded(path, variant)) continue
      const text = path.endsWith('.md') ? applyMarkers(rawText, variant) : rawText
      const data = Buffer.from(text.replace(/\r\n/g, '\n'), 'utf8')
      files.push({ name: path, data })
      const dest = join(stage, ...path.split('/'))
      mkdirSync(dirname(dest), { recursive: true })
      writeFileSync(dest, data)
    }
    const zip = writeZip(files)
    writeFileSync(join(OUT, zipName), zip)
    const bytes = files.reduce((n, f) => n + f.data.length, 0)
    summary.push(`${zipName}: ${files.length} files, ${(bytes / 1024).toFixed(0)} KB unpacked, ${(zip.length / 1024).toFixed(0)} KB zipped`)
  }
  console.log(`Built from ${idx.count} patterns.\n  ${summary.join('\n  ')}\n  stage dirs: release/stage/{pro,lite}/${NAME}/`)
}

main().catch((e) => { console.error(`build-skill failed: ${e.message}`); process.exit(1) })
