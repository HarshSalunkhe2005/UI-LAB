// Static UI audit: scans a project folder's HTML, CSS, JSX and TSX for common problems, with no browser.
// Usage: node scripts/audit-ui.mjs <project-dir>
// Reads files under the given folder only; writes nothing; no network. Exit code 1 if any "high" finding.
// First version: it is a lint, not a render. It cannot see layout, collisions or real contrast.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const root = resolve(process.argv[2] || '.')
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'release'])
const EXT = new Set(['.html', '.htm', '.css', '.jsx', '.tsx', '.vue', '.svelte'])

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (EXT.has(extname(name).toLowerCase())) out.push(p)
  }
  return out
}

const files = walk(root).map((p) => ({ path: relative(root, p), text: readFileSync(p, 'utf8') }))
const all = files.map((f) => f.text).join('\n')
const findings = []
const add = (severity, rule, where, note) => findings.push({ severity, rule, where, note })

// Per-line rules: [severity, rule, regex, note]
const LINE_RULES = [
  ['high', 'outline-none', /outline\s*:\s*(none|0)\b/, 'Focus outline removed; make sure :focus-visible restores a visible ring'],
  ['high', 'lorem-ipsum', /lorem ipsum|dolor sit amet/i, 'Placeholder text'],
  ['high', 'img-no-alt', /<img\b(?![^>]*\balt=)[^>]*>/i, 'Image without alt attribute'],
  ['medium', 'gradient-text', /background-clip\s*:\s*text/, 'Gradient text is a common AI default'],
  ['medium', 'tiny-text', /font-size\s*:\s*(?:[0-9]|1[01])(?:\.\d+)?px/, 'Text under 12px'],
  ['medium', 'vh-100', /\b100vh\b/, 'Prefer 100svh or 100dvh on mobile'],
  ['medium', 'zoom-blocked', /user-scalable\s*=\s*no|maximum-scale\s*=\s*1\b/, 'Blocks pinch zoom'],
  ['low', 'emoji-icon', /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'Emoji used in markup; prefer drawn icons'],
  ['low', 'generic-copy', /unlock the power|supercharge|seamless(ly)?|next level|game[- ]changer|revolutioni[sz]e/i, 'Generic marketing phrasing'],
]
for (const f of files) {
  f.text.split(/\r?\n/).forEach((line, i) => {
    for (const [sev, rule, re, note] of LINE_RULES) if (re.test(line)) add(sev, rule, `${f.path}:${i + 1}`, note)
  })
}

// Whole-project rules
const html = files.filter((f) => /\.html?$/.test(f.path))
for (const f of html) {
  if (!/<html[^>]*\blang=/i.test(f.text)) add('high', 'html-lang', f.path, 'Missing lang attribute on <html>')
  if (!/<meta[^>]+name=.viewport/i.test(f.text)) add('high', 'viewport-meta', f.path, 'Missing viewport meta tag')
  const h1 = (f.text.match(/<h1\b/gi) || []).length
  if (h1 !== 1) add('high', 'h1-count', f.path, `Expected exactly one <h1>, found ${h1}`)
  if (!/<main\b|role=.main/i.test(f.text)) add('high', 'no-main', f.path, 'No <main> landmark')
  if (!/<nav\b/i.test(f.text) && f.text.length > 4000) add('low', 'no-nav', f.path, 'No <nav> landmark')
}
if (html.length && !/prefers-reduced-motion/.test(all)) add('high', 'reduced-motion', '(project)', 'No prefers-reduced-motion handling anywhere')
if (html.length && !/:focus(-visible)?\b/.test(all)) add('high', 'focus-style', '(project)', 'No :focus or :focus-visible styles')
if (/animation[^;]*infinite/.test(all)) add('medium', 'infinite-animation', '(project)', 'Looping animation: confirm it carries meaning and stops under reduced motion')

const families = [...all.matchAll(/font-family\s*:\s*([^;}]+)/gi)].map((m) => m[1].toLowerCase().replace(/["']/g, '').trim())
const SYSTEM = /^(\s*(system-ui|-apple-system|blinkmacsystemfont|segoe ui|roboto|helvetica( neue)?|arial|sans-serif|serif|ui-[a-z-]+|monospace|inherit)\s*,?)+$/
if (families.length && families.every((f) => SYSTEM.test(f))) add('medium', 'system-fonts-only', '(project)', 'Only system fonts declared; no chosen display or text face')
if (families.length && families.every((f) => /\binter\b|\bsystem-ui\b|\bsans-serif\b/.test(f)) && families.some((f) => /\binter\b/.test(f))) add('low', 'inter-only', '(project)', 'Inter is the only face; check the type voice is a decision')

const order = { high: 0, medium: 1, low: 2 }
findings.sort((a, b) => order[a.severity] - order[b.severity])
console.log(`UI audit of ${root}: ${files.length} files scanned`)
for (const sev of ['high', 'medium', 'low']) {
  const group = findings.filter((x) => x.severity === sev)
  if (!group.length) continue
  console.log(`\n${sev.toUpperCase()} (${group.length})`)
  for (const x of group.slice(0, 40)) console.log(`  [${x.rule}] ${x.where}  ${x.note}`)
  if (group.length > 40) console.log(`  ... and ${group.length - 40} more`)
}
if (!findings.length) console.log('\nNo findings. This is a static lint only; render the page to check layout, collisions and contrast.')
process.exit(findings.some((x) => x.severity === 'high') ? 1 : 0)
