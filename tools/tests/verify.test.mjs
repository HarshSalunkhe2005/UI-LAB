// Tests for skill/ui-lab/scripts/verify.mjs: a good page exits 0, a bad page exits 1 and names each failed gate.
// Skipped (with a message) when no Chrome or Edge is installed. Run: node tools/tests/verify.test.mjs
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const script = 'skill/ui-lab/scripts/verify.mjs'
const GOOD = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Good</title>
<style>body{margin:0;font:16px/1.5 system-ui}a,button{min-height:44px;min-width:44px;display:inline-flex;align-items:center}
a:focus-visible,button:focus-visible{outline:3px solid #000}@media (prefers-reduced-motion:reduce){*{animation:none}}main{padding:16px}</style></head>
<body><main><h1>Good page</h1><p>Some text.</p><a href="#x">One link</a> <button type="button">Do it</button></main></body></html>`
const BAD = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bad</title>
<style>body{margin:0;font:16px/1.5 system-ui}.wide{width:900px;background:#ddd}a{font-size:12px}</style></head>
<body><h1>One</h1><h1>Two</h1><div class="wide">too wide</div><a href="#a">tiny</a></body></html>`

const WRAP = GOOD.replace('<p>Some text.</p>', '<div style="width:70px"><p>Ask Support which customers matter every single week please.</p></div><table style="width:100%"><tr><td style="width:40px">two words here</td><td>x</td></tr></table><h1 style="font-size:40px;max-width:420px">Stop <mark style="background:#ee0">read what customers already asked for in the tickets</mark></h1>').replace('<h1>Good page</h1>', '')
const mk = (html) => { const d = mkdtempSync(join(tmpdir(), 'uilab-vt-')); writeFileSync(join(d, 'index.html'), html); return d }
const run = (d) => spawnSync(process.execPath, [script, d], { encoding: 'utf8', timeout: 180000 })

const probe = run(mk(GOOD))
if (probe.status === 2) { console.log('verify: SKIPPED (no browser found)'); process.exit(0) }
let n = 0
const t = (name, fn) => { try { fn(); n++ } catch (e) { console.error(`FAIL ${name}\n  ${e.message}`); process.exitCode = 1 } }

t('good page passes, exit 0', () => { assert.equal(probe.status, 0, probe.stdout); assert.match(probe.stdout, /RESULT: PASS/) })
const gd = mk(GOOD); run(gd)
t('writes the log and slices', () => {
  assert.ok(existsSync(join(gd, 'design', 'verify.md')))
  assert.ok(existsSync(join(gd, 'design', 'verify', 'slice-375-01.png')))
  assert.ok(existsSync(join(gd, 'design', 'verify', 'slice-1440-01.png')))
})
const bad = run(mk(BAD))
t('bad page fails, exit 1', () => assert.equal(bad.status, 1, bad.stdout))
t('names the overflow, the h1 count, the targets, the missing rules', () => {
  assert.match(bad.stdout, /FAIL\s+no horizontal overflow at 375/)
  assert.match(bad.stdout, /FAIL\s+one h1 and a main landmark/)
  assert.match(bad.stdout, /FAIL\s+targets >= 44px at 375/)
  assert.match(bad.stdout, /FAIL\s+reduced-motion rule present/)
  assert.match(bad.stdout, /FAIL\s+focus style present/)
})
const wrapRes = run(mk(WRAP))
t('one word per line, a squeezed cell and a split highlight fail their gates', () => {
  assert.equal(wrapRes.status, 1, wrapRes.stdout)
  assert.match(wrapRes.stdout, /FAIL\s+no one-word-per-line wrapping/)
  assert.match(wrapRes.stdout, /FAIL\s+tables fit at 375/)
  assert.match(wrapRes.stdout, /FAIL\s+no headline highlight split across lines at 1440/)
})
t('writes both contact sheets and says to open them', () => {
  assert.ok(existsSync(join(gd, 'design', 'verify', 'sheet-375.png')) && existsSync(join(gd, 'design', 'verify', 'sheet-1440.png')))
  assert.match(probe.stdout, /Open these 2 images before writing the handoff/)
})
t('missing target exits 2 with a message', () => { const r = spawnSync(process.execPath, [script, join(tmpdir(), 'no-such-folder-xyz')], { encoding: 'utf8' }); assert.equal(r.status, 2) })
console.log(`verify: ${n} passed${process.exitCode ? ', some FAILED' : ''}`)
