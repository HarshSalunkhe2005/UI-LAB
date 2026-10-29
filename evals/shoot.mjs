// Screenshot + mechanical-check harness for eval runs. Node built-ins only (Node 22+).
// Usage: node evals/shoot.mjs <dir-with-index.html> [more dirs...]
// For each dir writes, next to index.html's run folder:
//   shot-1440.png, shot-375.png (full page), seg-<w>-<n>.png (native-scale crops), fold-1440.png, fold-375.png (first viewport only; full-page
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
  // inline text links are exempt from the 44px target rule (WCAG 2.5.8 inline exception)
  const inlineLink = (e) => e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.parentElement && [...e.parentElement.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3)
  const small = inter.filter((e) => { const r = e.getBoundingClientRect(); return (r.height < 44 || r.width < 44) && !inlineLink(e) })
  // leaf text boxes that overlap each other by more than a third of the smaller one (stamps over text, header over heading...)
  // text hidden by a collapsed or clipping ancestor (accordion panels, carousels) is not visible, whatever its own rect says
  const clippedAway = (e) => { const det = e.closest('details:not([open])'); if (det && !e.closest('summary')) return true; const r = e.getBoundingClientRect(); for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const s = getComputedStyle(a); if (s.overflow !== 'visible' || s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.clipPath !== 'none') { const q = a.getBoundingClientRect(); if (q.height < 2 || q.width < 2 || r.top >= q.bottom - 1 || r.bottom <= q.top + 1 || r.left >= q.right - 1 || r.right <= q.left + 1) return true } if (s.opacity === '0') return true } return false }
  // compare per-line client rects, not bounding boxes: a wrapped inline element's bounding box spans several lines
  const leaves = [...document.querySelectorAll('body *')].filter((e) => !e.children.length && e.textContent.trim().length > 1 && vis(e) && !e.closest('[aria-hidden=true],svg,script,style') && !clippedAway(e)).map((e) => ({ e, rs: [...e.getClientRects()].filter((r) => r.width > 8 && r.height > 8) })).filter((x) => x.rs.length)
  const collisions = []
  const hit = (a, b) => { const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return w > 2 && h > 2 && (w * h) / Math.min(a.width * a.height, b.width * b.height) > 0.33 }
  for (let i = 0; i < leaves.length && collisions.length < 12; i++) for (let j = i + 1; j < leaves.length; j++) {
    if (leaves[i].rs.some((a) => leaves[j].rs.some((b) => hit(a, b)))) collisions.push(leaves[i].e.textContent.trim().slice(0, 24) + ' x ' + leaves[j].e.textContent.trim().slice(0, 24))
  }
  const fam = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim() : null }
  const labelled = (e) => e.labels?.length || e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.getAttribute('title')
  const inputs = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')]
  return {
    docWidth: document.documentElement.scrollWidth, viewport: vw, hOverflow: document.documentElement.scrollWidth > vw + 1,
    docHeight: document.documentElement.scrollHeight,
    interactive: inter.length, smallTargets: small.length, collisions: collisions.length, collisionSamples: collisions.slice(0, 4),
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
    // readable crops at native scale (a tall full-page image is downscaled past legibility when viewed)
    const segH = w === 1440 ? 1300 : 1400
    for (let n = 0, y = 0; y < full && n < (w === 1440 ? 5 : 6); n++, y += segH) {
      const seg = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(segH, full - y), scale: 1 } })
      writeFileSync(join(abs, `seg-${w}-${n + 1}.png`), Buffer.from(seg.data, 'base64'))
    }
    out[w] = { ...probe, consoleErrors: errs }
  }
  writeFileSync(join(abs, 'report.json'), JSON.stringify(out, null, 2))
  console.log(abs, '1440 err', out[1440].consoleErrors, 'h', out[1440].docHeight, '| 375 overflow', out[375].hOverflow, 'small', out[375].smallTargets)
}

try { for (const d of process.argv.slice(2)) await shoot(d) } finally { ws.close(); proc.kill(); await sleep(500); try { rmSync(profile, { recursive: true, force: true }) } catch {} }
