// Checks the world token blocks in skill/ui-lab/references: each of the 24 worlds has a full :root block, a family, and
// passing contrast for ink/surface, ink-muted/surface and accent-ink/accent; and world-index.md lists every world once.
// Run: node tools/tests/worlds.test.mjs
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REF = join(resolve(dirname(fileURLToPath(import.meta.url)), '..', '..'), 'skill', 'ui-lab', 'references')
const lum = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

const REQUIRED = ['--surface', '--surface-raised', '--ink', '--ink-muted', '--accent', '--accent-ink', '--border', '--font-display', '--font-text', '--font-mono',
  '--step--1', '--step-0', '--step-1', '--step-2', '--step-3', '--step-4', '--space-1', '--space-6', '--radius', '--dur-fast', '--dur', '--ease']
const FAMILIES = ['Paper and Print', 'Loud and Graphic', 'Machine and Signal', 'Instrument and Spec', 'Soft and Living', 'Cinematic and Spatial']

let n = 0, failed = false
const t = (name, fn) => { try { fn(); n++ } catch (e) { failed = true; console.error(`FAIL ${name}\n  ${e.message}`) } }

const worlds = []
for (const f of readdirSync(join(REF, 'worlds')).filter((n) => n.endsWith('.md')).sort()) {
  const text = readFileSync(join(REF, 'worlds', f), 'utf8').replace(/\r\n/g, '\n')
  const head = text.match(/^# World (\d+)\. (.+)$/m)
  assert.ok(head, `${f}: heading must be "# World N. Name"`)
  assert.ok(f.startsWith(String(head[1]).padStart(2, '0') + '-'), `${f}: file name must start with the zero-padded number`)
  worlds.push({ num: Number(head[1]), name: head[2].trim(), text, file: f })
}

t('24 worlds numbered 1 to 24, once each', () => assert.deepEqual(worlds.map((w) => w.num).sort((a, b) => a - b), Array.from({ length: 24 }, (_, i) => i + 1)))

const index = readFileSync(join(REF, 'world-index.md'), 'utf8')
for (const w of worlds) {
  t(`world ${w.num} ${w.name}: structure`, () => {
    const fam = w.text.match(/\*\*Family:\*\* ([^.]+)\./)?.[1]
    assert.ok(FAMILIES.includes(fam), `family "${fam}" not one of the six`)
    for (const k of ['**Metaphor:**', '**Use when:**', '**Never when:**', '**Grounds:**', '**Fonts:**', '**Signature:**', '**Refuse:**', '**First screen:**']) assert.ok(w.text.includes(k), `missing ${k}`)
    assert.ok(/\*\*Refuse:\*\* 1\..*2\..*3\./.test(w.text), 'refusals must be numbered 1, 2, 3')
    assert.ok(new RegExp(`\\| ${w.num} ${w.name.split(' ')[0]}`).test(index), 'not listed in world-index.md')
    assert.ok(index.includes(`### ${fam}`), 'family heading missing from the index')
  })
  t(`world ${w.num} ${w.name}: tokens and contrast`, () => {
    const css = w.text.match(/```css\n([\s\S]*?)```/)?.[1]
    assert.ok(css, 'no css block')
    const tok = Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
    for (const r of REQUIRED) assert.ok(tok[r], `missing ${r}`)
    for (const [fg, bg, min] of [['--ink', '--surface', 4.5], ['--ink-muted', '--surface', 4.5], ['--accent-ink', '--accent', 4.5]]) {
      const c = ratio(tok[fg], tok[bg])
      assert.ok(c >= min, `${fg} on ${bg} is ${c.toFixed(2)}:1 (need ${min})`)
    }
  })
}
console.log(`worlds: ${n} checks passed${failed ? ', some FAILED' : ''}`)
if (failed) process.exitCode = 1
