// Measures how much skill text an agent loads for typical tasks, from the built package (release/stage/pro).
// Tokens are estimated as bytes / 4 (a standard rough rule for English and code). Run after `npm run skill`.
// Usage: node tools/skill-budget.mjs [--max 18000] [--quiet]   Exit code 1 if the typical Build scenario exceeds --max.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PKG = join(ROOT, 'release', 'stage', 'pro', 'ui-lab')
if (!existsSync(PKG)) { console.error('Run `npm run skill` first (no staged package found).'); process.exit(2) }
const max = Number(process.argv[process.argv.indexOf('--max') + 1]) || 18000
const quiet = process.argv.includes('--quiet')
const log = (...a) => { if (!quiet) console.log(...a) }

const tok = (rel) => Math.round(readFileSync(join(PKG, rel)).length / 4)
const avg = (dir, ext) => {
  const f = readdirSync(join(PKG, dir)).filter((n) => n.endsWith(ext) && n !== 'INDEX.md')
  return Math.round(f.reduce((s, n) => s + tok(`${dir}/${n}`), 0) / f.length)
}
const world = avg('references/worlds', '.md')
const pattern = avg('patterns', '.html')

// each scenario: [label, tokens]; "world" and "pattern" are the average file sizes
const base = [
  ['SKILL.md', tok('SKILL.md')], ['references/anti-slop.md', tok('references/anti-slop.md')], ['references/world-index.md', tok('references/world-index.md')],
  ['2 world files (average)', 2 * world], ['templates: brief, direction-card, verify-log, handoff', ['brief', 'direction-card', 'verify-log', 'handoff'].reduce((s, n) => s + tok(`templates/${n}.md`), 0)],
  ['scripts/verify.mjs output (log + fixes.md when a gate fails)', tok('references/fixes.md') / 2], ['patterns/INDEX.md', tok('patterns/INDEX.md')], ['2 patterns (average)', 2 * pattern],
]
const scenarios = {
  'Typical Build (landing page, product page)': base,
  'Dashboard or dense UI (typical + dense-ui)': [...base, ['references/dense-ui.md', tok('references/dense-ui.md')]],
  'Build with type, colour and motion detail': [...base, ['references/typography.md', tok('references/typography.md')], ['references/color.md', tok('references/color.md')], ['references/motion.md', tok('references/motion.md')]],
  'Critique or Redesign': [
    ['SKILL.md', tok('SKILL.md')], ['references/anti-slop.md', tok('references/anti-slop.md')], ['references/world-index.md', tok('references/world-index.md')], ['2 world files (average)', 2 * world],
    ['templates: critique-report, direction-card, verify-log, handoff', ['critique-report', 'direction-card', 'verify-log', 'handoff'].reduce((s, n) => s + tok(`templates/${n}.md`), 0)],
    ['scripts/verify.mjs output (log + fixes.md when a gate fails)', tok('references/fixes.md') / 2], ['references/accessibility.md', tok('references/accessibility.md')],
  ],
}
let typical = 0
for (const [name, parts] of Object.entries(scenarios)) {
  const total = parts.reduce((s, [, n]) => s + n, 0)
  if (!typical) typical = total
  console.log(`\n${name}: ~${total} tokens`)
  for (const [label, n] of parts) console.log(`  ${String(n).padStart(5)}  ${label}`)
}
console.log(`\naverage world file ~${world} tokens, average pattern ~${pattern} tokens`)
console.log(typical <= max ? `\nTypical Build is within the ${max}-token target.` : `\nTypical Build EXCEEDS the ${max}-token target.`)
process.exit(typical <= max ? 0 : 1)
