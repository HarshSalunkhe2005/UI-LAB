#!/usr/bin/env node
// One command for Gate 5: audit + render at 1440 and a true 375 + the mechanical gates + the slices + the log.
//
//   node scripts/verify.mjs <page.html | folder-with-index.html> [--out <dir>] [--slices <max per width>]
//
// What it does, in order:
//   1. runs scripts/audit-ui.mjs on the page (static lint);
//   2. loads the page in a local Chrome or Edge (headless, from the file system, no network) inside a frame that is
//      really 375 px wide (headless browsers refuse windows narrower than about 500 px), and measures 7 gates at
//      both widths: console clean, no horizontal overflow at 375, targets of at least 44 px at 375, one h1 and a
//      main landmark, a reduced-motion rule, a focus style, no text collisions;
//   3. saves screen-sized slices of the page at 1440 and 375 to <out>/ (default design/verify/) as PNG files;
//   4. writes design/verify.md with the real numbers (plus the manual checks it cannot do, left blank for you);
//   5. exits 0 only when the audit has no critical finding and all 7 gates pass.
//
// Exit codes: 0 all clear, 1 a gate or the audit failed, 2 no browser found (audit only; the log says so loudly).
// Environment: the CHROME_PATH variable overrides the browser location. Node 18 or newer, no packages.
// The only reason this file starts a process is to run your own local browser on your own page.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { env } from 'node:process'

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def }
const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out' && args[i - 1] !== '--slices')
if (!target) { console.error('Usage: node scripts/verify.mjs <page.html | folder> [--out <dir>] [--slices <max>]'); process.exit(2) }

const abs = resolve(target)
if (!existsSync(abs)) { console.error(`Not found: ${abs}`); process.exit(2) }
const isDir = statSync(abs).isDirectory()
const pagePath = isDir ? join(abs, 'index.html') : abs
if (!existsSync(pagePath)) { console.error(`No index.html in ${abs}`); process.exit(2) }
const root = isDir ? abs : dirname(abs)
const outDir = resolve(opt('--out', join(root, 'design', 'verify')))
const logPath = join(dirname(outDir), 'verify.md')
const MAX = Math.max(1, Number(opt('--slices', 12)))
mkdirSync(outDir, { recursive: true })

// ---- 1. audit ----------------------------------------------------------------------------------------------------
const audit = (() => {
  const r = spawnSync(process.execPath, [join(here, 'audit-ui.mjs'), pagePath, '--json'], { encoding: 'utf8' })
  try { return JSON.parse(r.stdout) } catch { return null }
})()

// ---- 2. browser --------------------------------------------------------------------------------------------------
const pf = [env['ProgramFiles'], env['ProgramFiles(x86)'], env['LOCALAPPDATA']].filter(Boolean)
const CANDIDATES = [
  env['CHROME_PATH'],
  ...pf.flatMap((p) => [`${p}/Google/Chrome/Application/chrome.exe`, `${p}/Microsoft/Edge/Application/msedge.exe`]),
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean)
const browser = CANDIDATES.find((p) => existsSync(p))

// one browser profile per run: two runs at once must not share one (the second would get no measurement)
const profile = join(tmpdir(), `ui-lab-verify-${process.pid}`)
const FLAGS = ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files',
  `--user-data-dir=${profile}`, '--enable-logging=stderr', '--v=0']
const run = (extra, url) => spawnSync(browser, [...FLAGS, ...extra, url], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120000 })

// The probe page: loads the real page in a frame of the exact width and measures it, or shows one screen of it.
const probeSrc = readFileSync(join(here, 'verify-probe.js'), 'utf8')
const PAGE_JS = `
const PAGE = ${JSON.stringify(pathToFileURL(pagePath).href)}
const PROBE = ${JSON.stringify(probeSrc)}
const H = { 1440: 900, 375: 812 }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
function frame(w) {
  const f = document.createElement('iframe')
  f.style.cssText = 'position:absolute;left:0;top:0;border:0;background:#fff;width:' + w + 'px;height:' + H[w] + 'px'
  f.src = PAGE
  document.body.append(f)
  return new Promise((res) => f.addEventListener('load', () => setTimeout(() => res(f), 700)))
}
async function reveal(f) {
  const win = f.contentWindow
  const total = win.document.documentElement.scrollHeight
  for (let y = 0; y < total; y += 400) { win.scrollTo(0, y); await wait(100) }
  win.scrollTo(0, 0)
  await wait(500)
}
async function measure() {
  const out = {}
  for (const w of [1440, 375]) {
    const f = await frame(w)
    try {
      await reveal(f)
      const s = f.contentDocument.createElement('script')
      s.textContent = PROBE
      f.contentDocument.head.append(s)
      out[w] = f.contentWindow.__probe
    } catch (e) { out[w] = { error: String(e) } }
    f.remove()
  }
  const el = document.createElement('script')
  el.type = 'application/json'
  el.id = 'result'
  el.textContent = JSON.stringify(out)
  document.body.append(el)
}
async function slice(w, i) {
  const f = await frame(w)
  await reveal(f)
  f.contentWindow.scrollTo(0, i * H[w])
  await wait(600)
}
const m = location.hash.match(/shot=(\\d+),(\\d+)/)
if (m) slice(Number(m[1]), Number(m[2])); else measure()
`
const probePage = join(outDir, 'probe.html')
writeFileSync(probePage, `<!doctype html><meta charset="utf-8"><title>verify probe</title>
<style>html,body{margin:0;background:#222;overflow:hidden}</style><body><script>${PAGE_JS}</script>`)
const probeUrl = pathToFileURL(probePage).href

let probe = null
let consoleErrors = { 1440: [], 375: [] }
const notes = []
const slices = []
if (browser) {
  let r, m
  for (let attempt = 0; attempt < 2 && !m; attempt++) {
    r = run(['--virtual-time-budget=40000', '--window-size=1500,1000', '--dump-dom'], probeUrl)
    m = (r.stdout || '').match(/<script type="application\/json" id="result">([\s\S]*?)<\/script>/)
  }
  if (m) { try { probe = JSON.parse(m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')) } catch { probe = null } }
  // Console lines: [pid:tid:date:LEVEL:CONSOLE(n)] "message", source: file (line). Resource failures from the network are
  // reported as notes, not failures: this check runs offline-tolerant.
  const errs = []
  for (const line of (r.stderr || '').split(/\r?\n/)) {
    const c = line.match(/:(ERROR|WARNING|INFO):CONSOLE\(\d+\)\]\s*"?(.*)$/)
    if (!c) continue
    if (c[1] !== 'ERROR') continue
    if (/Failed to load resource: net::ERR_(INTERNET_DISCONNECTED|NAME_NOT_RESOLVED|CONNECTION|NETWORK|PROXY|TUNNEL)/.test(c[2])) {
      notes.push(`network resource did not load (counted as a note, not a failure): ${c[2].slice(0, 120)}`)
      continue
    }
    if (/source: .*verify|probe\.html/.test(c[2])) continue
    errs.push(c[2].slice(0, 160))
  }
  consoleErrors = { 1440: errs, 375: errs }
  // ---- 3. slices ---------------------------------------------------------------------------------------------------
  if (probe && probe[1440] && probe[375]) {
    for (const w of [1440, 375]) {
      const H = w === 1440 ? 900 : 812
      const n = Math.min(MAX, Math.ceil(probe[w].docHeight / H))
      for (let i = 0; i < n; i++) {
        const file = join(outDir, `slice-${w}-${String(i + 1).padStart(2, '0')}.png`)
        const size = w === 1440 ? '1440,900' : '500,812'
        run(['--hide-scrollbars', '--virtual-time-budget=40000', `--window-size=${size}`, `--screenshot=${file}`], `${probeUrl}#shot=${w},${i}`)
        if (existsSync(file)) slices.push({ w, i: i + 1, of: Math.ceil(probe[w].docHeight / H), file: basename(file) })
      }
    }
  }
}

// ---- 4. gates ----------------------------------------------------------------------------------------------------
const d = probe?.[1440]
const m3 = probe?.[375]
const ANCHOR = {"console clean (both widths)":"console","no horizontal overflow at 375":"overflow","targets >= 44px at 375":"targets","one h1 and a main landmark":"h1-main","reduced-motion rule present":"reduced-motion","focus style present":"focus","no text collisions (1440 and 375)":"collisions"}
const gates = probe && d && m3 && !d.error && !m3.error ? [
  ['console clean (both widths)', errsOk(consoleErrors[1440]), consoleErrors[1440].slice(0, 3).join(' | ')],
  ['no horizontal overflow at 375', !m3.hOverflow, m3.hOverflow ? `document is ${m3.docWidth}px wide` : ''],
  ['targets >= 44px at 375', m3.smallTargets === 0, m3.smallSamples.join('; ')],
  ['one h1 and a main landmark', d.h1Count === 1 && d.hasMain, `${d.h1Count} h1, main ${d.hasMain ? 'present' : 'missing'}`],
  ['reduced-motion rule present', d.hasReducedMotion, ''],
  ['focus style present', d.focusStyle, ''],
  ['no text collisions (1440 and 375)', d.collisions === 0 && m3.collisions === 0,
    [...d.collisionSamples.map((s) => '1440: ' + s), ...m3.collisionSamples.map((s) => '375: ' + s)].join('; ')],
] : null
function errsOk(list) { return list.length === 0 }

const crit = audit ? audit.summary.critical : null
const pass = (gates ? gates.every((g) => g[1]) : false) && crit === 0
const noBrowser = !browser
const measureFailed = browser && !gates

// ---- 5. the log --------------------------------------------------------------------------------------------------
const sum = audit ? `${audit.summary.critical} critical, ${audit.summary.warning} warning, ${audit.summary.suggestion} suggestion` : 'audit did not run'
const L = []
L.push('# Verification log (written by scripts/verify.mjs)', '')
L.push(`**Page:** ${basename(pagePath)}   **Run:** ${new Date().toISOString()}`)
L.push(`**Method:** ${noBrowser ? 'STATIC AUDIT ONLY. NO BROWSER WAS FOUND, SO NOTHING WAS RENDERED.' : 'headless local browser, exact 375 px frame and 1440 px frame'}`, '')
if (noBrowser) L.push('> **WARNING: no Chrome or Edge was found. Layout, overflow, targets, console and collisions were NOT checked. Install one or set CHROME_PATH and run again. Do not call this page verified.**', '')
if (measureFailed) L.push('> **WARNING: the browser ran but the measurement did not come back. Run again; if it repeats, open the page by hand.**', '')
L.push('## Result', '', `**${pass ? 'PASS' : 'FAIL'}**`, '')
L.push(`- Static audit: ${sum}`)
if (audit) for (const f of audit.findings.filter((x) => x.severity !== 'suggestion')) L.push(`  - ${f.severity.toUpperCase()} [${f.rule}] line ${f.line}: ${f.message}${f.heuristic ? ' (heuristic)' : ''}`)
if (gates) {
  L.push('', '## Gates (measured)', '', '| # | Gate | Result | Detail |', '|---|---|---|---|')
  gates.forEach((g, i) => L.push(`| ${i + 1} | ${g[0]} | ${g[1] ? 'PASS' : 'FAIL'} | ${[g[2], g[1] ? '' : 'see references/fixes.md#' + ANCHOR[g[0]]].filter(Boolean).join(' ; ')} |`))
  L.push('', '## 375 px measurement', '', '```',
    `page height ${m3.docHeight}px, document width ${m3.docWidth}px, horizontal overflow: ${m3.hOverflow ? 'YES' : 'no'}`,
    `interactive elements: ${m3.interactive}; under 44px: ${m3.smallTargets}`, ...m3.smallSamples.map((s) => '  ' + s),
    `h1 count: ${m3.h1Count}; images without alt: ${m3.imgsMissingAlt}; inputs without a label: ${m3.inputsUnlabelled}`,
    `headline lines at 1440: ${d.h1Lines}; at 375: ${m3.h1Lines}`, '```')
  if (d.h1Lines > 4) L.push('', `Note: the headline is about ${d.h1Lines} lines at 1440 (the limit is 4).`)
}
for (const n of [...new Set(notes)].slice(0, 5)) L.push('', `Note: ${n}`)
L.push('', '## Slices to look at (open every one; this is the part the script cannot judge)', '')
if (slices.length) for (const s of slices) L.push(`- ${s.w === 1440 ? '1440' : '375'} slice ${s.i} of ${s.of}: \`${basename(outDir)}/${s.file}\`   what is in it / any defect:`)
else L.push('- no slices were saved')
L.push('', '## Manual checks (fill these in; the script cannot do them)', '', '| Check | Result | Evidence |', '|---|---|---|',
  '| Contrast of every text pair (scripts/contrast.mjs) | | |',
  '| Visible focus and no keyboard trap (tab through) | | |',
  '| Every control does something | | |',
  '| One place of visual weight per slice; no half-empty band; headline and primary action on the first screen | | |',
  '| Code blocks render as one block; tables keep their key columns at 375 | | |',
  '', '**Found and fixed:**', '**Left as known defects (and why):**', '**Could not check:**', '')
writeFileSync(logPath, L.join('\n'))
if (probe) writeFileSync(join(outDir, 'result.json'), JSON.stringify({ audit: audit?.summary, gates: gates?.map((g) => ({ gate: g[0], pass: g[1] })), probe }, null, 2))

// ---- console summary ---------------------------------------------------------------------------------------------
console.log(`verify: ${basename(pagePath)}`)
console.log(`  audit: ${sum}`)
if (noBrowser) console.log('  NO BROWSER FOUND: audit only, nothing was rendered. Set CHROME_PATH and run again.')
if (measureFailed) console.log('  The browser ran but the measurement did not come back. Run again.')
if (gates) for (const g of gates) console.log(`  ${g[1] ? 'PASS' : 'FAIL'}  ${g[0]}${!g[1] && g[2] ? '  -> ' + g[2] : ''}${g[1] ? '' : '   [references/fixes.md#' + ANCHOR[g[0]] + ']'}`)
console.log(`  slices saved: ${slices.length} in ${outDir}`)
console.log(`  log: ${logPath}`)
console.log(pass ? 'RESULT: PASS. Now open every slice listed in the log.' : 'RESULT: FAIL. Fix the failures above and run again.')
process.exit(noBrowser ? 2 : pass ? 0 : 1)
