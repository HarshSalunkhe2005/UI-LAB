/*
 * Accessibility sweep for UI Lab (or any hash-routed site that serves /patterns.json).
 *
 * How to use: open the site in a browser (dev server or live), open the developer console, paste this whole file, press
 * Enter, and wait. It loads axe-core, visits every pattern page, waits for its heading, runs axe on <main>, and prints a
 * table of violations grouped by rule. Whole sites (#/live/...) are checked separately at the end.
 *
 * Notes: it turns off view transitions for the run (they stall in background tabs); it is slow on purpose (a few seconds
 * per page), so leave the tab visible and in front. Run `window.__axeStop = true` to stop early.
 */
(async () => {
  const AXE = 'https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js'
  document.startViewTransition = undefined
  if (!window.axe) {
    const src = await (await fetch(location.hostname === 'localhost' ? '/node_modules/axe-core/axe.min.js' : AXE)).text()
    ;(0, eval)(src)
  }
  const list = (await (await fetch('/patterns.json')).json()).patterns
  const found = {}
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  const opts = { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } }

  window.__axeStop = false
  for (const p of list) {
    if (window.__axeStop) break
    const live = p.category === 'Sites'
    location.hash = live ? `#/live/${p.slug}` : `#/${p.slug}`
    if (!live) for (let i = 0; i < 40 && document.querySelector('main h1')?.textContent.trim() !== p.title.trim(); i++) await wait(100)
    else await wait(2500)
    await wait(350)
    const r = await axe.run(live ? document : document.querySelector('main'), opts)
    for (const v of r.violations) {
      if (v.id === 'landmark-unique' && !live) continue // the pattern page shell has two labelled navs on purpose
      ;(found[v.id] ||= []).push(`${p.slug} (${v.nodes.length}): ${(v.nodes[0].html || '').slice(0, 80)}`)
    }
  }
  console.table(Object.fromEntries(Object.entries(found).map(([k, v]) => [k, `${v.length} page(s)`])))
  console.log(found)
  return found
})()
