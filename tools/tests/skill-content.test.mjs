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
  const GENERATED = new Set(['references/patterns-index.md', 'patterns/INDEX.md']) // written by tools/build-skill.mjs
  for (const m of skill.matchAll(/`((?:references|templates|scripts|patterns|examples)\/[\w./-]+)`/g)) if (!GENERATED.has(m[1]) && !existsSync(join(SK, m[1]))) missing.push(m[1])
  assert.deepEqual(missing, [])
})

t('SKILL.md names each gate and the family rule', () => {
  for (const k of ['Gate 2', 'Gate 5', 'Gate 6', 'Gate R', 'Gate C', 'world-index.md', 'different families']) assert.ok(skill.includes(k), `missing "${k}"`)
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
t('patterns: 30 to 36 files, each with a complete header and no external requests', () => {
  assert.ok(files.length >= 30 && files.length <= 36, `${files.length} patterns`)
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

console.log(`skill content: ${n} checks passed${failed ? ', some FAILED' : ''}`)
if (failed) process.exitCode = 1
