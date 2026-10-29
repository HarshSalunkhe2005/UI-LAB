// Screenshot + mechanical-check harness for eval runs. Node built-ins only (Node 22+).
// Usage: node evals/shoot.mjs <dir-with-index.html> [more dirs...]
// For each dir writes, next to index.html's run folder:
//   shot-1440.png, shot-375.png (full page), fold-1440.png, fold-375.png (first viewport only; full-page
//   captures can misplace sticky/fixed headers) and report.json (mechanical checks from RUBRIC.md).
// Needs Chrome or Edge installed; drives it over the DevTools protocol, headless.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
const chrome = CANDIDATES.find(existsSync)
if (!chrome) throw new Error('No Chrome/Edge found')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const profile = mkdtempSync(join(tmpdir(), 'uilab-shoot-'))
const port = 9300 + Math.floor(Math.random() * 500)
const proc = spawn(chrome, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new', '--disable-gpu', '--no-first-run', 'about:blank'], { stdio: 'ignore' })

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await sleep(250)
  }
  throw new Error('Chrome did not start')
}

const ws = new WebSocket(await connect())
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
const events = []
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } else events.push(d)
}
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id
  pending.set(i, (d) => (d.error ? rej(new Error(d.error.message)) : res(d.result)))
  ws.send(JSON.stringify({ id: i, method, params }))
})
await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable')

// Runs in the page: mechanical checks that feed the rubric.
const PROBE = `(() => {
  const vw = innerWidth
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' }
  const inter = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,[role=button],[tabindex]:not([tabindex="-1"])')].filter(vis)
  const small = inter.filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44 })
  const fam = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null }
  const labelled = (e) => e.labels?.length || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.getAttribute('title')
  const inputs = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')]
  return {
    docWidth: document.documentElement.scrollWidth, viewport: vw, hOverflow: document.documentElement.scrollWidth > vw + 1,
    docHeight: document.documentElement.scrollHeight,
    interactive: inter.length, smallTargets: small.length,
    imgsMissingAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    inputsUnlabelled: inputs.filter((e) => !labelled(e)).length,
    landmarks: ['header,[role=banner]', 'nav,[role=navigation]', 'main,[role=main]', 'footer,[role=contentinfo]'].map((s) => !!document.querySelector(s)),
    h1Count: document.querySelectorAll('h1').length,
    fonts: { h1: fam('h1'), h2: fam('h2'), body: fam('body') },
    hasReducedMotion: [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)) } catch { return false } }),
    focusStyle: [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => /:focus/.test(r.selectorText || '')) } catch { return false } }),
  }
})()`

async function shoot(dir) {
  const abs = resolve(dir)
  const url = pathToFileURL(join(abs, 'index.html')).href
  const out = { dir: abs, url }
  for (const w of [1440, 375]) {
    events.length = 0
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: w === 1440 ? 900 : 812, deviceScaleFactor: 1, mobile: w < 768 })
    await send('Page.navigate', { url })
    await sleep(2500)
    // pages may set scroll-behavior:smooth, which would leave us mid-scroll when we capture
    await send('Runtime.evaluate', { expression: "document.documentElement.style.scrollBehavior='auto'" })
    // scroll through to trigger scroll-reveal content, then back to top
    const h = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.value
    for (let y = 0; y < h; y += 500) { await send('Runtime.evaluate', { expression: `scrollTo(0,${y})` }); await sleep(120) }
    await send('Runtime.evaluate', { expression: 'scrollTo(0,0)' }); await sleep(800)
    const probe = (await send('Runtime.evaluate', { expression: PROBE, returnByValue: true })).result.value
    const errs = events.filter((e) => (e.method === 'Runtime.exceptionThrown') || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')).length
    const fold = await send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(join(abs, `fold-${w}.png`), Buffer.from(fold.data, 'base64'))
    const full = Math.min(probe.docHeight, 12000)
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: full, scale: 1 } })
    writeFileSync(join(abs, `shot-${w}.png`), Buffer.from(shot.data, 'base64'))
    out[w] = { ...probe, consoleErrors: errs }
  }
  writeFileSync(join(abs, 'report.json'), JSON.stringify(out, null, 2))
  console.log(abs, '1440 err', out[1440].consoleErrors, 'h', out[1440].docHeight, '| 375 overflow', out[375].hOverflow, 'small', out[375].smallTargets)
}

try { for (const d of process.argv.slice(2)) await shoot(d) } finally { ws.close(); proc.kill(); await sleep(500); try { rmSync(profile, { recursive: true, force: true }) } catch {} }
