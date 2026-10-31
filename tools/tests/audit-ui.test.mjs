// Tests for skill/ui-lab/scripts/audit-ui.mjs.
//  1. every rule fires on a minimal snippet that has the problem, and a clean page produces no findings
//  2. the generic Orbit fixture and the Phase 0 baseline pages surface their known issues
//  3. the 12 packaged patterns and the skill-built pages in evals/runs come out nearly clean (false-positive budget)
//  4. CLI behaviour: exit codes and --json
// Run: node tools/tests/audit-ui.test.mjs      (test-only: uses child_process to run the CLI, as the shipped script never does)
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SCRIPT = join(ROOT, 'skill', 'ui-lab', 'scripts', 'audit-ui.mjs')
const { auditPaths, RULES } = await import(new URL(`file:///${SCRIPT.replace(/\\/g, '/')}`).href)

let n = 0, failed = false
const t = (name, fn) => { try { fn(); n++ } catch (e) { failed = true; console.error(`FAIL ${name}\n  ${e.message}`) } }

const tmp = mkdtempSync(join(tmpdir(), 'uilab-audit-'))
let k = 0
// writes one page into its own folder and audits it
function page(body, { css = '', head = '', html = '<html lang="en">', fragment = false } = {}) {
  const dir = join(tmp, `p${k++}`)
  mkdirSync(dir)
  writeFileSync(join(dir, 'index.html'), `<!doctype html>\n${html}<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}<title>t</title><style>${css}</style></head><body>${body}</body></html>`)
  return auditPaths([dir], { fragment }).findings
}
const rules = (f) => new Set(f.map((x) => x.rule))

// A clean base: webfont stack, focus style, reduced motion, one h1, main, labelled input.
const CLEAN_CSS = `:root{--surface:#ffffff;--ink:#111111}
body{font-family:"Work Sans",system-ui,sans-serif;background:var(--surface);color:var(--ink)}
a:focus-visible,button:focus-visible{outline:3px solid #1d4f6b}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`
const CLEAN_BODY = '<main><h1>Title</h1><p>Real text.</p><a href="#x">Go</a><label for="e">Email</label><input id="e" type="email"></main>'
t('a clean page has no findings', () => assert.deepEqual(page(CLEAN_BODY, { css: CLEAN_CSS }).map((x) => x.rule), []))

// positives: [rule, body, options]
const POS = [
  ['zoom-blocked', CLEAN_BODY, { css: CLEAN_CSS, head: '<meta name="viewport" content="width=device-width, user-scalable=no">' }],
  ['viewport-meta', CLEAN_BODY, { css: CLEAN_CSS, special: 'noviewport' }],
  ['html-lang', CLEAN_BODY, { css: CLEAN_CSS, html: '<html>' }],
  ['img-alt', '<main><h1>t</h1><img src="a.png"></main>', { css: CLEAN_CSS }],
  ['input-label', '<main><h1>t</h1><input type="text" placeholder="Email"></main>', { css: CLEAN_CSS }],
  ['no-focus-style', '<main><h1>t</h1><a href="#x">Go</a></main>', { css: 'body{font-family:"Work Sans",sans-serif}' }],
  ['contrast-fail', CLEAN_BODY, { css: CLEAN_CSS + '.x{color:#bbbbbb;background:#ffffff}' }],
  ['contrast-low', CLEAN_BODY, { css: CLEAN_CSS + '.x{color:#888888;background:#ffffff}' }],
  ['h1-count', '<main><h2>t</h2></main>', { css: CLEAN_CSS }],
  ['no-main', '<h1>t</h1><p>x</p>', { css: CLEAN_CSS }],
  ['icon-button-name', '<main><h1>t</h1><button><svg viewBox="0 0 1 1"></svg></button></main>', { css: CLEAN_CSS }],
  ['outline-none', '<main><h1>t</h1><a href="#x">Go</a></main>', { css: 'body{font-family:"Work Sans",sans-serif}a{outline:none}' }],
  ['no-reduced-motion', CLEAN_BODY, { css: 'body{font-family:"Work Sans",sans-serif}a:focus-visible{outline:2px solid}.x{animation:spin 1s linear}@keyframes spin{to{transform:rotate(1turn)}}' }],
  ['infinite-animation', CLEAN_BODY, { css: 'body{font-family:"Work Sans",sans-serif}a:focus-visible{outline:2px solid}.x{animation:pulse 2s ease infinite}@keyframes pulse{50%{opacity:.5}}' }],
  ['small-target', CLEAN_BODY, { css: CLEAN_CSS + 'button{height:32px}' }],
  ['tiny-text', CLEAN_BODY, { css: CLEAN_CSS + '.fine{font-size:10px}' }],
  ['system-fonts-only', CLEAN_BODY, { css: 'a:focus-visible{outline:2px solid}body{font-family:system-ui,sans-serif}' }],
  ['inter-only', CLEAN_BODY, { css: 'a:focus-visible{outline:2px solid}body{font-family:Inter,sans-serif}' }],
  ['lorem-ipsum', '<main><h1>t</h1><p>Lorem ipsum dolor sit amet</p></main>', { css: CLEAN_CSS }],
  ['generic-copy', '<main><h1>Unlock the power of your data</h1></main>', { css: CLEAN_CSS }],
  ['emoji-icon', '<main><h1>t</h1><div class="i">&#9889;</div></main>', { css: CLEAN_CSS }],
  ['gradient-text', '<main><h1 class="g">t</h1></main>', { css: CLEAN_CSS + '.g{background:linear-gradient(#ff0000,#0000ff);-webkit-background-clip:text}' }],
  ['purple-gradient', '<main><h1>t</h1></main>', { css: CLEAN_CSS + 'main{background:linear-gradient(135deg,#667eea,#764ba2)}' }],
  ['identical-cards', '<main><h1>t</h1><div><div class="c"><div class="icon">&#9889;</div><h3>A</h3><p>x</p></div><div class="c"><div class="icon">&#9889;</div><h3>B</h3><p>y</p></div><div class="c"><div class="icon">&#9889;</div><h3>C</h3><p>z</p></div></div></main>', { css: CLEAN_CSS }],
  ['glow-hover-lift', '<main><h1>t</h1></main>', { css: CLEAN_CSS + '.card:hover{transform:translateY(-8px)}' }],
  ['backdrop-filter', '<main><h1>t</h1></main>', { css: CLEAN_CSS + '.glass{backdrop-filter:blur(12px)}' }],
  ['repeated-reveal', '<main><h1>t</h1>' + '<section class="reveal">x</section>'.repeat(4) + '</main>', { css: CLEAN_CSS }],
  ['nested-containers', '<main><h1>t</h1><div class="card"><div class="inner">x</div></div></main>', { css: CLEAN_CSS + '.card,.inner{}.card{box-shadow:0 2px 8px #0003;border-radius:12px}.inner{box-shadow:0 1px 4px #0003;border-radius:8px}' }],
  ['trusted-by', '<main><h1>t</h1><p>Trusted by 10,000+ teams worldwide</p></main>', { css: CLEAN_CSS }],
  ['italic-serif-accent', '<main><h1>Your roadmap, <em>annotated</em> by users</h1></main>', { css: CLEAN_CSS + 'h1{font-family:Fraunces,Georgia,serif}' }],
  ['mono-eyebrow', '<main><h1>t</h1>' + '<p class="eb">Label</p>'.repeat(3) + '</main>', { css: CLEAN_CSS + '.eb{font-family:"IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.12em;font-size:12px}' }],
  ['rotated-stamp', '<main><h1>t</h1><span class="stamp">SAMPLE</span></main>', { css: CLEAN_CSS + '.stamp{transform:rotate(-6deg);text-transform:uppercase}' }],
  ['marquee', '<main><h1>t</h1><div class="marquee">x</div></main>', { css: CLEAN_CSS + '.marquee{animation:m 20s linear infinite}@keyframes m{to{transform:translateX(-50%)}}' }],
  ['numbered-label', '<main><h1>t</h1><p>01 / How it works</p><p>02 / Features</p></main>', { css: CLEAN_CSS }],
  ['vh-100', CLEAN_BODY, { css: CLEAN_CSS + '.hero{min-height:100vh}' }],
  ['no-nav', '<main><h1>t</h1><a href="#a">a</a><a href="#b">b</a><a href="#c">c</a><a href="#d">d</a><p>' + 'x'.repeat(4100) + '</p></main>', { css: CLEAN_CSS }],
]
for (const [rule, body, opt] of POS) {
  t(`rule ${rule} fires`, () => {
    let f
    if (opt.special === 'noviewport') {
      const dir = join(tmp, `p${k++}`); mkdirSync(dir)
      writeFileSync(join(dir, 'index.html'), `<!doctype html><html lang="en"><head><title>t</title><style>${opt.css}</style></head><body>${body}</body></html>`)
      f = auditPaths([dir]).findings
    } else f = page(body, opt)
    assert.ok(rules(f).has(rule), `expected ${rule}, got: ${[...rules(f)].join(', ') || 'nothing'}`)
  })
}
t('every rule in the table has a positive test', () => assert.deepEqual(Object.keys(RULES).filter((r) => !POS.some((p) => p[0] === r)), []))
t('every rule has a severity, a fix and a known anti-slop id or none', () => {
  for (const [id, r] of Object.entries(RULES)) {
    assert.ok(['critical', 'warning', 'suggestion'].includes(r.severity), `${id} severity`)
    assert.ok(r.fix && r.fix.length > 15, `${id} fix`)
    assert.ok(!r.anti || /^[A-D]\d+$/.test(r.anti), `${id} anti id`)
  }
})

// negatives that must not fire
t('em with font-style normal is not an italic accent', () => assert.ok(!rules(page('<main><h1>A <em>b</em></h1></main>', { css: CLEAN_CSS + 'h1{font-family:Fraunces,serif}em{font-style:normal}' })).has('italic-serif-accent')))
t('a button with a mobile 44px override is not a small target', () => assert.ok(!rules(page(CLEAN_BODY, { css: CLEAN_CSS + 'button{height:32px}@media (max-width:600px){button{min-height:44px}}' })).has('small-target')))
t('labelled by wrapping label or aria-label is fine', () => assert.ok(!rules(page('<main><h1>t</h1><label>Name <input></label><input aria-label="Search"></main>', { css: CLEAN_CSS })).has('input-label')))
t('em units in font-size are not judged as tiny', () => assert.ok(!rules(page(CLEAN_BODY, { css: CLEAN_CSS + '.n small{font-size:.38em}' })).has('tiny-text')))
t('star glyphs and hamburger are not emoji icons', () => assert.ok(!rules(page('<main><h1>t</h1><button aria-label="m">&#9776;</button><span>&#9733;&#9733;</span></main>', { css: CLEAN_CSS })).has('emoji-icon')))
t('fragment mode skips page-level rules', () => assert.deepEqual([...rules(page('<p>x</p>', { css: CLEAN_CSS, fragment: true }))].filter((r) => ['h1-count', 'no-main', 'html-lang', 'viewport-meta'].includes(r)), []))

// JSX
t('JSX: img without alt, lorem and tailwind gradient text are found', () => {
  const dir = join(tmp, `p${k++}`); mkdirSync(dir)
  writeFileSync(join(dir, 'App.tsx'), 'export const A = () => (\n<div>\n<img src="a.png" />\n<p>Lorem ipsum dolor</p>\n<h1 className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Hi</h1>\n</div>)\n')
  const r = rules(auditPaths([dir]).findings)
  for (const id of ['img-alt', 'lorem-ipsum', 'gradient-text', 'purple-gradient']) assert.ok(r.has(id), `missing ${id}`)
})

// real pages: known issues must surface
const has = (dir, ids, opts) => { const r = rules(auditPaths([join(ROOT, dir)], opts).findings); const miss = ids.filter((i) => !r.has(i)); assert.deepEqual(miss, [], `missing ${miss.join(', ')}`) }
t('Orbit fixture lights up (house-style, a11y, copy)', () => {
  const res = auditPaths([join(ROOT, 'evals/fixtures/generic-landing')])
  assert.ok(res.findings.length >= 15, `${res.findings.length} findings`)
  assert.ok(res.summary.critical >= 1)
  has('evals/fixtures/generic-landing', ['no-focus-style', 'no-reduced-motion', 'no-main', 'gradient-text', 'purple-gradient', 'emoji-icon', 'identical-cards', 'glow-hover-lift', 'generic-copy', 'inter-only', 'trusted-by', 'contrast-low'])
})
t('baseline 01 (editorial house style) shows B1 to B5 and the lift', () => has('evals/runs/baseline/01-saas-landing', ['italic-serif-accent', 'mono-eyebrow', 'rotated-stamp', 'marquee', 'numbered-label', 'glow-hover-lift', 'small-target']))
t('baseline 02 (dashboard) shows no h1, tiny text, system fonts, low contrast, small targets', () => has('evals/runs/baseline/02-analytics-dashboard', ['h1-count', 'tiny-text', 'system-fonts-only', 'contrast-low', 'small-target']))
t('baseline 04 (restaurant) shows the italic accent, the ticker, blur and tiny text', () => has('evals/runs/baseline/04-restaurant-site', ['italic-serif-accent', 'marquee', 'backdrop-filter', 'tiny-text']))

// false-positive budget on pages that were built with the skill and on the shipped patterns
t('the 12 patterns: no criticals and at most 6 findings in total', () => {
  const r = auditPaths([join(ROOT, 'skill/ui-lab/patterns')], { fragment: true })
  assert.equal(r.files.length, 12)
  assert.equal(r.summary.critical, 0)
  assert.ok(r.findings.length <= 6, `${r.findings.length}: ${r.findings.map((x) => x.rule).join(', ')}`)
})
for (const d of ['evals/runs/skill-r1/01-saas-landing', 'evals/runs/skill-r1/02-analytics-dashboard', 'evals/runs/skill-r1/08-redesign-generic-page', 'evals/runs/skill-r2/01-saas-landing', 'evals/runs/skill-p3/06-ecommerce-product-page']) {
  t(`skill-built page ${d.split('/').slice(-2).join('/')}: no criticals, at most 3 findings`, () => {
    const r = auditPaths([join(ROOT, d)])
    assert.equal(r.summary.critical, 0)
    assert.ok(r.findings.length <= 3, `${r.findings.length}: ${r.findings.map((x) => x.rule).join(', ')}`)
  })
}

// CLI
t('CLI exits 1 with a critical finding and 0 without; --json is valid', () => {
  const bad = spawnSync(process.execPath, [SCRIPT, join(ROOT, 'evals/fixtures/generic-landing')], { encoding: 'utf8' })
  assert.equal(bad.status, 1)
  assert.match(bad.stdout, /CRITICAL \(\d+\)/)
  const good = spawnSync(process.execPath, [SCRIPT, join(ROOT, 'skill/ui-lab/patterns/empty-state.html'), '--fragment'], { encoding: 'utf8' })
  assert.equal(good.status, 0)
  const json = JSON.parse(execFileSync(process.execPath, [SCRIPT, join(ROOT, 'skill/ui-lab/patterns/empty-state.html'), '--fragment', '--json'], { encoding: 'utf8' }))
  assert.ok(Array.isArray(json.findings) && json.summary)
  assert.equal(spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' }).status, 2)
  assert.match(spawnSync(process.execPath, [SCRIPT, '--rules'], { encoding: 'utf8' }).stdout, /purple-gradient\s+warning\s+A1\s+heuristic/)
})
t('--no-heuristics hides heuristic findings', () => assert.ok(auditPaths([join(ROOT, 'evals/runs/baseline/01-saas-landing')], { heuristics: false }).findings.every((x) => !x.heuristic)))

rmSync(tmp, { recursive: true, force: true })
console.log(`audit-ui: ${n} checks passed${failed ? ', some FAILED' : ''}`)
if (failed) process.exitCode = 1
