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
t('missing target exits 2 with a message', () => { const r = spawnSync(process.execPath, [script, join(tmpdir(), 'no-such-folder-xyz')], { encoding: 'utf8' }); assert.equal(r.status, 2) })
console.log(`verify: ${n} passed${process.exitCode ? ', some FAILED' : ''}`)
