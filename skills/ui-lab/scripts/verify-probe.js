// Measurements that verify.mjs runs inside the rendered page (at 1440 and at 375).
// It sets window.__probe to a plain object. Nothing here touches the network or changes the page.
window.__probe = (() => {
  const vw = innerWidth
  const doc = document
  const cs = (e) => getComputedStyle(e)
  // Not visible: zero size, hidden, parked off-screen (visually-hidden text), or fully transparent.
  const vis = (e) => {
    const r = e.getBoundingClientRect()
    const s = cs(e)
    return r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 &&
      s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'
  }
  const TARGETS = 'a[href],button,input:not([type=hidden]),select,textarea,[role=button],[tabindex]:not([tabindex="-1"])'
  const inter = [...doc.querySelectorAll(TARGETS)].filter(vis)
  // Inline text links are exempt from the 44px target rule (WCAG 2.5.8 inline exception).
  const inlineLink = (e) => e.tagName === 'A' && cs(e).display === 'inline' && e.parentElement &&
    [...e.parentElement.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3)
  const small = inter.filter((e) => {
    const r = e.getBoundingClientRect()
    return (r.height < 44 || r.width < 44) && !inlineLink(e)
  })
  // Text hidden by a collapsed or clipping ancestor is not visible, whatever its own rect says.
  const clippedAway = (e) => {
    const det = e.closest('details:not([open])')
    if (det && !e.closest('summary')) return true
    const r = e.getBoundingClientRect()
    for (let a = e.parentElement; a && a !== doc.body; a = a.parentElement) {
      const s = cs(a)
      if (s.overflow !== 'visible' || s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.clipPath !== 'none') {
        const q = a.getBoundingClientRect()
        if (q.height < 2 || q.width < 2 || r.top >= q.bottom - 1 || r.bottom <= q.top + 1 ||
          r.left >= q.right - 1 || r.right <= q.left + 1) return true
      }
      if (s.opacity === '0') return true
    }
    return false
  }
  // Compare per-line client rects: a wrapped inline element's bounding box spans several lines.
  const leaves = [...doc.querySelectorAll('body *')]
    .filter((e) => !e.children.length && e.textContent.trim().length > 1 && vis(e) &&
      !e.closest('[aria-hidden=true],svg,script,style') && !clippedAway(e))
    .map((e) => ({ e, rs: [...e.getClientRects()].filter((r) => r.width > 8 && r.height > 8) }))
    .filter((x) => x.rs.length)
  // A position:fixed overlay (buy bar, cookie bar) sits over content that scrolls beneath it by design.
  const fixedUp = (e) => {
    for (let a = e; a && a !== doc.body; a = a.parentElement) if (cs(a).position === 'fixed') return true
    return false
  }
  for (const l of leaves) l.fixed = fixedUp(l.e)
  const hit = (a, b) => {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left)
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
    return w > 2 && h > 2 && (w * h) / Math.min(a.width * a.height, b.width * b.height) > 0.33
  }
  const collisions = []
  for (let i = 0; i < leaves.length && collisions.length < 12; i++) {
    for (let j = i + 1; j < leaves.length; j++) {
      if (leaves[i].fixed !== leaves[j].fixed) continue
      if (leaves[i].rs.some((a) => leaves[j].rs.some((b) => hit(a, b)))) {
        collisions.push(leaves[i].e.textContent.trim().slice(0, 24) + ' x ' + leaves[j].e.textContent.trim().slice(0, 24))
      }
    }
  }
  const labelled = (e) => e.labels?.length || e.getAttribute('aria-label') ||
    e.getAttribute('aria-labelledby') || e.getAttribute('title')
  const fields = [...doc.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea')]
  const rules = (fn) => [...doc.styleSheets].some((s) => {
    try { return [...s.cssRules].some(fn) } catch (e) { return false }
  })
  const label = (e) => e.tagName.toLowerCase() + ' "' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24) + '" ' +
    Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)
  // ---- layout-defect checks (each issue carries y, the page position, so the log can name the slice) ----
  const yOf = (e) => Math.round(e.getBoundingClientRect().top + pageYOffset)
  const snip = (e) => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
  const lineCount = (e) => {
    const r = doc.createRange()
    r.selectNodeContents(e)
    const tops = new Set([...r.getClientRects()].filter((q) => q.width > 2 && q.height > 4).map((q) => Math.round(q.top / 3)))
    return tops.size
  }
  const BLOCKISH = new Set(['block', 'list-item', 'table-cell', 'flex', 'grid', 'flow-root'])
  const hasBlockChild = (e) => [...e.children].some((c) => BLOCKISH.has(cs(c).display) || ['BR', 'UL', 'OL', 'TABLE'].includes(c.tagName))
  // 1. pathological wrapping: five or more words averaging under 1.5 words per line (one word per line in a narrow column)
  const wrap = []
  for (const e of doc.querySelectorAll('p,li,dd,dt,td,th,h1,h2,h3,h4,blockquote,figcaption,label,a,span,div,small')) {
    if (wrap.length >= 12 || !vis(e) || e.closest('svg,script,style,[aria-hidden=true]') || hasBlockChild(e)) continue
    if (!BLOCKISH.has(cs(e).display)) continue
    const words = (e.textContent || '').trim().split(/\s+/).filter((w) => w.length > 1).length
    if (words < 5) continue
    const lines = lineCount(e)
    if (lines >= 4 && words / lines < 1.5) wrap.push({ text: snip(e), y: yOf(e), words, lines })
  }
  // 2. tables: a cell under 60 px wide that holds words, and a table wider than the viewport outside a scroll wrapper
  const scrolls = (e) => { for (let a = e.parentElement; a && a !== doc.body; a = a.parentElement) { const s = cs(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return true } return false }
  const narrow = []
  const tableOver = []
  for (const t of doc.querySelectorAll('table')) {
    if (!vis(t)) continue
    if (t.getBoundingClientRect().right > vw + 1 && !scrolls(t)) tableOver.push({ text: snip(t), y: yOf(t) })
    for (const c of t.querySelectorAll('td,th')) {
      if (narrow.length >= 8 || !vis(c)) continue
      const words = (c.textContent || '').trim().split(/\s+/).filter(Boolean).length
      if (words >= 2 && c.getBoundingClientRect().width < 60) narrow.push({ text: snip(c), y: yOf(c), width: Math.round(c.getBoundingClientRect().width) })
    }
  }
  // 3. a highlight or marker behind inline text in a heading that breaks across lines mid-phrase
  const hl = []
  for (const e of doc.querySelectorAll('h1 *,h2 *,h3 *,h1,h2,h3')) {
    if (hl.length >= 6 || !vis(e) || e.closest('svg')) continue
    const s = cs(e)
    if (s.display !== 'inline' && e.tagName !== 'MARK') continue
    const filled = (s.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor)) || s.backgroundImage !== 'none'
    if (!filled) continue
    const rs = [...e.getClientRects()].filter((q) => q.width > 2 && q.height > 4)
    if (rs.length >= 2) hl.push({ text: snip(e), y: yOf(e), lines: rs.length })
  }
  // 4. review items (heuristic, not gates): a band far taller than its content, and text lying over an image or figure
  const bands = []
  for (const sct of doc.querySelectorAll('section,header,footer,main>div,body>div')) {
    if (bands.length >= 6 || !vis(sct)) continue
    const r = sct.getBoundingClientRect()
    if (r.height < 420 || r.width < vw * 0.8) continue
    let top = Infinity, bottom = -Infinity
    for (const c of sct.querySelectorAll('*')) {
      if (!vis(c) || cs(c).position === 'fixed') continue
      const q = c.getBoundingClientRect()
      const own = [...c.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || ['IMG', 'SVG', 'CANVAS', 'VIDEO', 'INPUT', 'BUTTON'].includes(c.tagName.toUpperCase())
      if (!own || q.height < 2 || q.top > r.bottom || q.bottom < r.top) continue
      top = Math.min(top, q.top); bottom = Math.max(bottom, q.bottom)
    }
    if (bottom <= top) continue
    const content = bottom - top
    if (r.height > content * 2 && r.height - content > 360 && !/min-height|vh/.test(sct.getAttribute('style') || '')) bands.push({ text: snip(sct), y: yOf(sct), height: Math.round(r.height), content: Math.round(content) })
  }
  const overlap = []
  const figs = [...doc.querySelectorAll('img,svg')].filter((f) => vis(f) && f.getBoundingClientRect().width > 80 && f.getBoundingClientRect().height > 80 && !f.closest('[aria-hidden=true]') && !(f.tagName === 'svg' && f.parentElement && f.parentElement.closest('svg')))
  for (const l of leaves) {
    if (overlap.length >= 6 || l.fixed || l.e.closest('svg')) continue
    const tr = l.rs[0]
    for (const f of figs) {
      if (f.contains(l.e) || l.e.contains(f)) continue
      const q = f.getBoundingClientRect()
      const w = Math.min(tr.right, q.right) - Math.max(tr.left, q.left)
      const h = Math.min(tr.bottom, q.bottom) - Math.max(tr.top, q.top)
      if (w > 4 && h > 4 && (w * h) / (tr.width * tr.height) > 0.5) { overlap.push({ text: snip(l.e), y: yOf(l.e), over: f.tagName.toLowerCase() }); break }
    }
  }
  const heads = [...doc.querySelectorAll('h1,h2,h3')].filter(vis).map((e) => ({ text: snip(e), y: yOf(e) })).slice(0, 40)
  const h1 = [...doc.querySelectorAll('h1')]
  return {
    viewport: vw,
    docWidth: doc.documentElement.scrollWidth,
    docHeight: doc.documentElement.scrollHeight,
    hOverflow: doc.documentElement.scrollWidth > vw + 1,
    interactive: inter.length,
    smallTargets: small.length,
    smallSamples: small.slice(0, 8).map(label),
    collisions: collisions.length,
    collisionSamples: collisions.slice(0, 4),
    imgsMissingAlt: [...doc.images].filter((i) => !i.hasAttribute('alt')).length,
    inputsUnlabelled: fields.filter((e) => !labelled(e)).length,
    hasMain: !!doc.querySelector('main,[role=main]'),
    h1Count: h1.length,
    h1Lines: h1[0] ? Math.round(h1[0].getBoundingClientRect().height / (parseFloat(cs(h1[0]).lineHeight) || parseFloat(cs(h1[0]).fontSize) * 1.2)) : 0,
    hasReducedMotion: rules((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)),
    focusStyle: rules((r) => /:focus/.test(r.selectorText || '')),
    wrap, narrowCells: narrow, tableOverflow: tableOver, highlightBreaks: hl, bands, overlap, heads,
  }
})()
