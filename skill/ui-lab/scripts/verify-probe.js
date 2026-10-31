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
  }
})()
