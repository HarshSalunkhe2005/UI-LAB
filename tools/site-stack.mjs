#!/usr/bin/env node
/*
 * site-stack: fetch a page and its scripts, report which front-end libraries and techniques it uses.
 * Part of the UI Lab inspiration workflow (playbook/inspiration.md). Read-only: one GET per asset.
 *
 *   node tools/site-stack.mjs https://example.com
 *
 * Detection is by signature in HTML/JS text, so minified or bundled code is still recognised.
 * It cannot see code loaded after interaction; confirm in DevTools when it matters.
 */

const SIGNATURES = [
  ['GSAP', /gsap|GreenSock/i],
  ['GSAP ScrollTrigger', /ScrollTrigger/],
  ['GSAP SplitText', /SplitText/],
  ['Lenis (smooth scroll)', /lenis/i],
  ['Locomotive Scroll', /locomotive-scroll|locomotivescroll/i],
  ['three.js', /THREE\.|three\.module|WebGLRenderer/],
  ['React Three Fiber', /react-three-fiber|@react-three/],
  ['Spline', /spline\.design|@splinetool/],
  ['Rive', /rive\.app|@rive-app|\.riv\b/],
  ['Lottie', /lottie/i],
  ['Framer Motion / Motion', /framer-motion|motion\.dev|"motion\/react"/],
  ['Anime.js', /anime(\.min)?\.js|animejs/i],
  ['Barba / page transitions', /barba/i],
  ['View Transitions API', /startViewTransition|view-transition/],
  ['WebGL (raw)', /getContext\(['"]webgl2?['"]\)/],
  ['OGL / regl / PixiJS', /\bPIXI\.|\bogl\b|regl/],
  ['Matter / Rapier physics', /matter-js|rapier/i],
  ['Next.js', /_next\//],
  ['Nuxt', /_nuxt\//],
  ['Astro', /astro-island|\/_astro\//],
  ['Webflow', /webflow/i],
  ['Framer (site builder)', /framerusercontent|framer\.com/],
  ['Tailwind', /tailwind/i],
]

const url = process.argv[2]
if (!url) {
  console.error('usage: node tools/site-stack.mjs <url>')
  process.exit(1)
}

const get = async (u) => {
  const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 UI-Lab-site-stack' } })
  if (!r.ok) throw new Error(`${r.status} ${u}`)
  return r.text()
}

const html = await get(url)
const base = new URL(url)
const srcs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => new URL(m[1], base).href)
const links = [...html.matchAll(/<link[^>]+rel=["'](?:modulepreload|preload)["'][^>]*href=["']([^"']+)["']/gi)].map((m) => new URL(m[1], base).href)
const scripts = [...new Set([...srcs, ...links.filter((l) => /\.m?js(\?|$)/.test(l))])].slice(0, 40)

const corpus = [html]
let fetched = 0
for (const s of scripts) {
  try {
    corpus.push(await get(s))
    fetched++
  } catch {
    /* third-party or blocked; skip */
  }
}
const text = corpus.join('\n')

const found = SIGNATURES.filter(([, re]) => re.test(text)).map(([n]) => n)
const media = {
  video: (html.match(/<video/gi) ?? []).length,
  canvas: (html.match(/<canvas/gi) ?? []).length,
  glb: [...new Set([...text.matchAll(/[\w\-./]+\.(?:glb|gltf)\b/g)].map((m) => m[0]))].slice(0, 5),
  'image sequences (numbered frames)': /\b\w+[-_]?0*\d{2,4}\.(?:jpg|webp|png)\b/.test(text) && /frame|seq/i.test(text),
}
const fonts = [...new Set([...text.matchAll(/font-family:\s*["']?([A-Za-z0-9 \-]+)["']?/g)].map((m) => m[1].trim()))]
  .filter((f) => !/^(inherit|sans|serif|system|monospace|-apple|arial|helvetica)/i.test(f))
  .slice(0, 8)

console.log(`\n${url}`)
console.log(`scanned HTML + ${fetched}/${scripts.length} scripts\n`)
console.log('Detected:', found.length ? found.join(', ') : '(nothing recognised; likely custom/bundled or loaded late)')
console.log('Media:   ', `<video> x${media.video}, <canvas> x${media.canvas}`, media.glb.length ? `, models: ${media.glb.join(', ')}` : '')
if (fonts.length) console.log('Fonts:   ', fonts.join(', '))
console.log('\nNext: open it in the browser, scroll slowly, and write the teardown (playbook/inspiration.md).\n')
