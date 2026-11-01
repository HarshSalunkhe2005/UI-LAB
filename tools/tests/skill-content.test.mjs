// Content checks for skill/ui-lab: structure the agent relies on must stay true as the files are edited.
// Run: node tools/tests/skill-content.test.mjs
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SK = join(resolve(dirname(fileURLToPath(import.meta.url)), '..', '..'), 'skill', 'ui-lab')
const read = (p) => readFileSync(join(SK, p), 'utf8').replace(/\r\n/g, '\n')
let n = 0, failed = false
const t = (name, fn) => { try { fn(); n++ } catch (e) { failed = true; console.error(`FAIL ${name}\n  ${e.message}`) } }

const skill = read('SKILL.md')
t('SKILL.md is at most 250 lines', () => assert.ok(skill.split('\n').length <= 250, `${skill.split('\n').length} lines`))

t('every file named in the "Read this when" table exists', () => {
  const missing = []
  const GENERATED = new Set(['patterns/INDEX.md']) // written by tools/build-skill.mjs
  for (const m of skill.matchAll(/`((?:references|templates|scripts|patterns|examples)\/[\w./-]+)`/g)) if (!GENERATED.has(m[1]) && !existsSync(join(SK, m[1]))) missing.push(m[1])
  assert.deepEqual(missing, [])
})

t('SKILL.md names each gate and the family rule', () => {
  for (const k of ['Gate 2', 'Gate 5', 'Gate 6', 'Gate R', 'Gate C', 'world-index.md', 'different world families', 'Roll for variety', 'roll the ground']) assert.ok(skill.includes(k), `missing "${k}"`)
})

const slop = read('references/anti-slop.md')
const rows = slop.split('\n').filter((l) => /^\| [A-D]\d+ \|/.test(l))
t('anti-slop has at least 30 entries in sections A to D', () => {
  assert.ok(rows.length >= 30, `${rows.length} entries`)
  for (const s of 'ABCD') assert.ok(rows.some((r) => r.startsWith(`| ${s}`)), `section ${s} empty`)
})
t('every anti-slop entry has name, why, signal and instead', () => {
  for (const r of rows) assert.equal(r.split('|').length - 2, 5, `bad column count: ${r.slice(0, 60)}`)
})
t('every "audit: <rule>" signal names a rule the audit script implements', () => {
  const audit = readFileSync(join(SK, 'scripts', 'audit-ui.mjs'), 'utf8')
  const bad = []
  for (const r of rows) {
    const m = r.match(/audit: ([a-z0-9-]+)/)
    if (m && m[1] !== 'planned' && !audit.includes(`'${m[1]}'`)) bad.push(`${r.slice(0, 8)} -> ${m[1]}`)
  }
  assert.deepEqual(bad, [])
})

t('typography.md lists fifteen pairings', () => assert.equal(read('references/typography.md').split('\n').filter((l) => /^\| \d+ \|/.test(l)).length, 15))

const files = readdirSync(join(SK, 'patterns')).filter((f) => f.endsWith('.html'))
t('patterns: 12 files (the ones SKILL.md names), each with a complete header and no external requests', () => {
  assert.ok(files.length === 12, `${files.length} patterns`)
  for (const f of files) {
    const text = read(`patterns/${f}`)
    for (const k of ['pattern:', 'title:', 'category:', 'tier:', 'when:', 'a11y:', 'adapt:']) assert.ok(text.includes(`\n${k}`), `${f}: missing ${k}`)
    assert.ok(!/(src|href)="https?:/.test(text) && !/@import|url\(https?:/.test(text), `${f}: external request`)
    assert.ok(/<html lang="en">/.test(text) && /name="viewport"/.test(text), `${f}: needs lang and viewport`)
    assert.ok(/<main|<section|<header|<footer|<figure|<form|<article/.test(text), `${f}: no semantic container`)
  }
})
t('patterns that animate honour reduced motion', () => {
  for (const f of files) {
    const text = read(`patterns/${f}`)
    if (/@keyframes|transition:|animation:|requestAnimationFrame|scroll-behavior/.test(text)) assert.ok(/prefers-reduced-motion|matchMedia\('\(prefers-reduced-motion/.test(text), `${f}: animates without a reduced-motion branch`)
  }
})
t('every packaged pattern is named in the Gate 4 table, and every named pattern exists', () => {
  const named = [...skill.matchAll(/`([\w-]+\.html)`/g)].map((m) => m[1])
  for (const f of files) assert.ok(named.includes(f), `${f} is packaged but SKILL.md does not name it`)
  for (const f of named) assert.ok(files.includes(f), `SKILL.md names ${f} which is not packaged`)
})
t('Gate 5 runs scripts/verify.mjs and every gate it maps has a section in fixes.md', () => {
  assert.ok(skill.includes('scripts/verify.mjs'))
  const fixes = read('references/fixes.md')
  const verify = read('scripts/verify.mjs')
  const anchors = Object.values(JSON.parse(verify.match(/const ANCHOR = (\{[\s\S]*?\n\})/)[1]))
  assert.equal(anchors.length, 10)
  for (const a of anchors) assert.ok(new RegExp('^### ' + a + '$', 'm').test(fixes), `fixes.md has no section for ${a}`)
})
t('every world lists its allowed ground treatments, and every treatment is one of the four', () => {
  const OK = new Set(['light neutral', 'dark', 'saturated colour field', 'tinted mid-tone'])
  for (const f of readdirSync(join(SK, 'references', 'worlds'))) {
    const line = read(`references/worlds/${f}`).split('\n').find((l) => l.startsWith('**Grounds:**'))
    assert.ok(line, `${f} has no Grounds line`)
    const items = line.replace('**Grounds:**', '').replace(/\.$/, '').split(',').map((x) => x.trim())
    assert.ok(items.length >= 1 && items.every((x) => OK.has(x)), `${f}: ${line}`)
  }
})

console.log(`skill content: ${n} checks passed${failed ? ', some FAILED' : ''}`)
if (failed) process.exitCode = 1
