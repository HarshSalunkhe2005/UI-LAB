// Static UI audit: scans a file or a folder of HTML, CSS, JSX, TSX, Vue and Svelte for problems, without a browser.
//
// Usage:  node scripts/audit-ui.mjs <file-or-folder> [more paths] [--json] [--fragment] [--no-heuristics] [--rules]
//   --json            machine-readable output
//   --fragment        treat every file as a fragment: skip page-level rules (lang, viewport, h1, main, nav)
//   --no-heuristics   hide findings from regex-level checks that can false-positive
//   --rules           print the rule table and exit
// Exit code: 1 if any critical finding, 2 on usage error, otherwise 0.
//
// Zero dependencies, read-only, no network, nothing outside the paths you give it is read.
// It is a lint, not a render: it cannot see layout, collisions, images, overlays, real contrast on photos, or the
// 375 px behaviour. Findings tagged "heuristic" come from pattern matching and can be wrong: confirm in the render.
// Rule ids marked with an anti-slop id (A1, B2, ...) point at references/anti-slop.md.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'
import { contrast, parseColor } from './contrast.mjs'

// ---------------------------------------------------------------------------------------------------------------------
// Rule table. severity: critical (breaks access or basics), warning (real defect or strong default), suggestion.
// ---------------------------------------------------------------------------------------------------------------------
export const RULES = {
  'zoom-blocked': { severity: 'critical', fix: 'Remove user-scalable=no and maximum-scale=1 from the viewport meta tag.' },
  'viewport-meta': { severity: 'critical', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' },
  'html-lang': { severity: 'critical', fix: 'Add a lang attribute to <html>, for example lang="en".' },
  'img-alt': { severity: 'critical', fix: 'Add alt text (or alt="" if the image is decorative).' },
  'input-label': { severity: 'critical', fix: 'Give the control a visible <label for>, a wrapping <label>, or aria-label. A placeholder is not a label.' },
  'no-focus-style': { severity: 'critical', fix: 'Add a visible :focus-visible style for links, buttons and form controls (for example outline: 3px solid; outline-offset: 2px).' },
  'contrast-fail': { severity: 'critical', fix: 'Pick colours with at least 4.5:1 contrast for text (3:1 absolute minimum for large text).' },
  'contrast-low': { severity: 'warning', fix: 'Raise contrast to 4.5:1 for body text (3:1 is only enough for large text and UI shapes).' },
  'h1-count': { severity: 'warning', fix: 'Use exactly one <h1> that says what the page is.' },
  'no-main': { severity: 'warning', fix: 'Wrap the primary content in one <main> landmark.' },
  'no-nav': { severity: 'suggestion', fix: 'Put site navigation in a <nav aria-label="..."> landmark.' },
  'icon-button-name': { severity: 'warning', heuristic: true, fix: 'Give icon-only buttons and links an accessible name (aria-label or visually hidden text).' },
  'outline-none': { severity: 'warning', fix: 'Do not remove the focus outline without a replacement: style :focus-visible instead.' },
  'no-reduced-motion': { severity: 'warning', fix: 'Add @media (prefers-reduced-motion: reduce) that disables travelling motion, parallax and looping animation.' },
  'infinite-animation': { severity: 'warning', heuristic: true, fix: 'Stop looping decorative animation under reduced motion and give long-running motion a pause control (WCAG 2.2.2).' },
  'small-target': { severity: 'warning', heuristic: true, fix: 'Make interactive elements at least 44px tall at touch widths (min-height: 44px, or padding).' },
  'tiny-text': { severity: 'warning', fix: 'Keep text at 12px or larger (16px for body text on mobile).' },
  'system-fonts-only': { severity: 'warning', anti: 'C6', heuristic: true, fix: 'Choose a display and text face on purpose (see references/typography.md) and load them with a fallback stack.' },
  'inter-only': { severity: 'suggestion', anti: 'A10', heuristic: true, fix: 'Pair the sans with a face that does a different job, or make the single-family choice deliberate with a real scale and weight contrast.' },
  'lorem-ipsum': { severity: 'warning', anti: 'A14', fix: 'Replace placeholder text with real content from the brief.' },
  'generic-copy': { severity: 'suggestion', anti: 'A13', fix: 'Say the specific thing the product does, in the audience\'s words.' },
  'emoji-icon': { severity: 'warning', anti: 'A3', fix: 'Replace emoji used as icons with drawn SVG icons from one set.' },
  'gradient-text': { severity: 'warning', anti: 'A2', fix: 'Use a solid colour for text; emphasise with weight, size or position.' },
  'purple-gradient': { severity: 'warning', anti: 'A1', heuristic: true, fix: 'Use a flat colour chosen from the product or the world instead of a purple or indigo gradient.' },
  'identical-cards': { severity: 'suggestion', anti: 'A4', heuristic: true, fix: 'Vary the form by content (one large, two small; a list; a table) instead of identical icon, heading, sentence cards.' },
  'glow-hover-lift': { severity: 'suggestion', anti: 'A5', heuristic: true, fix: 'Change one property on hover (colour or underline) instead of lifting the element.' },
  'backdrop-filter': { severity: 'suggestion', anti: 'A8', heuristic: true, fix: 'Use solid surfaces with a clear border or tone step; keep blur only where content scrolls beneath it.' },
  'repeated-reveal': { severity: 'suggestion', anti: 'A9', heuristic: true, fix: 'Animate one thing that explains something, not a fade-up on every block.' },
  'nested-containers': { severity: 'suggestion', anti: 'A12', heuristic: true, fix: 'Use one level of container: drop the shadow or radius on the inner element.' },
  'trusted-by': { severity: 'suggestion', anti: 'A7', heuristic: true, fix: 'Use real, sourced proof (a named quote with a role) instead of a "trusted by N teams" line.' },
  'italic-serif-accent': { severity: 'warning', anti: 'B1', heuristic: true, fix: 'Choose type from the subject; emphasise with weight, size or position instead of one italic accent word.' },
  'mono-eyebrow': { severity: 'suggestion', anti: 'B2', heuristic: true, fix: 'Delete the small uppercase mono label above headings, or use it only where it carries a fact.' },
  'rotated-stamp': { severity: 'suggestion', anti: 'B3', heuristic: true, fix: 'Replace the rotated stamp or sticker with one strong object that belongs to the product.' },
  'marquee': { severity: 'suggestion', anti: 'B4', heuristic: true, fix: 'Replace the scrolling ticker with static proof, or give it a pause control and stop it under reduced motion.' },
  'numbered-label': { severity: 'suggestion', anti: 'B5', heuristic: true, fix: 'Use plain headings; number only genuine steps.' },
  'vh-100': { severity: 'suggestion', fix: 'Use 100svh (or 100dvh) so the layout does not jump when the mobile URL bar hides.' },
}

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'release', 'coverage', 'design'])
const EXT = new Set(['.html', '.htm', '.css', '.jsx', '.tsx', '.vue', '.svelte'])
const MAX_BYTES = 1_500_000
const CAP = 4 // findings per rule per file before they are summarised

// ---------------------------------------------------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------------------------------------------------
const lineOf = (text, index) => { let n = 1; for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) n++; return n }
const SYSTEM_FAMILIES = /^(system-ui|-apple-system|blinkmacsystemfont|segoe ui|roboto|helvetica( neue)?|arial|sans-serif|serif|ui-[a-z-]+|monospace|inherit|initial|unset|georgia|times( new roman)?|courier( new)?|menlo|consolas|impact|arial black|arial narrow|verdana|tahoma|trebuchet ms)$/
const SERIF_FIRST = /^(fraunces|playfair display|instrument serif|newsreader|cormorant( garamond)?|dm serif( display)?|recoleta|georgia|times( new roman)?|garamond|eb garamond|source serif( 4)?|lora|libre baskerville|young serif|crimson( pro| text)?|spectral|serif|bodoni moda|gloock)$/
const MONO = /(mono|courier|menlo|consolas|monaco|source code|fira code|jetbrains|ibm plex mono|space mono|vt323)/

function decodeEntities(s) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

function toPx(value) {
  const m = String(value).trim().match(/^(-?[\d.]+)(px|rem|em)?$/)
  if (!m) return null
  const n = parseFloat(m[1])
  return m[2] === 'rem' || m[2] === 'em' ? n * 16 : n
}

// ---------------------------------------------------------------------------------------------------------------------
// CSS parser: rules with declarations, at-rule context, keyframes. Comments are blanked so line numbers stay true.
// ---------------------------------------------------------------------------------------------------------------------
function parseCss(text, firstLine = 1) {
  const src = text.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  const rules = [], keyframes = [], atrules = []
  const stack = []
  let buf = '', line = firstLine, bufLine = firstLine, paren = 0, quote = ''
  const ctxMedia = () => stack.filter((s) => s.type === 'at').map((s) => s.header).join(' ')
  const cur = () => stack[stack.length - 1]
  const addDecl = (raw, atLine) => {
    const c = cur()
    if (!c || c.type !== 'rule' || !raw.trim()) return
    const i = raw.indexOf(':')
    if (i < 0) return
    c.decls.push({ prop: raw.slice(0, i).trim().toLowerCase(), value: raw.slice(i + 1).trim().replace(/\s*!important\s*$/i, ''), line: atLine })
  }
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (ch === '\n') line++
    if (quote) { buf += ch; if (ch === quote && src[i - 1] !== '\\') quote = ''; continue }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue }
    if (ch === '(') paren++
    if (ch === ')') paren = Math.max(0, paren - 1)
    if (!buf.trim() && ch.trim()) bufLine = line
    if (ch === '{' && paren === 0) {
      const header = buf.trim()
      if (/^@(-webkit-)?keyframes/i.test(header)) { const name = header.replace(/^@(-webkit-)?keyframes\s*/i, '').trim(); stack.push({ type: 'keyframes', name, body: '', line: bufLine }); keyframes.push(stack[stack.length - 1]) }
      else if (header.startsWith('@')) { stack.push({ type: /^@(media|supports|container|layer)/i.test(header) ? 'at' : 'other', header }); atrules.push({ header, line: bufLine }) }
      else if (cur() && cur().type === 'keyframes') stack.push({ type: 'frame', header })
      else stack.push({ type: 'rule', selector: header, decls: [], atrule: ctxMedia(), line: bufLine })
      buf = ''
      continue
    }
    if (ch === ';' && paren === 0) { addDecl(buf, bufLine); buf = ''; continue }
    if (ch === '}' && paren === 0) {
      addDecl(buf, bufLine); buf = ''
      const top = stack.pop()
      if (top && top.type === 'rule') rules.push(top)
      continue
    }
    buf += ch
    const k = stack.find((s) => s.type === 'keyframes')
    if (k) k.body += ch
  }
  return { rules, keyframes, atrules }
}

// ---------------------------------------------------------------------------------------------------------------------
// HTML parser: a small tolerant tokenizer that builds a tree (enough for structure checks; not a full HTML5 parser).
// ---------------------------------------------------------------------------------------------------------------------
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

function parseHtml(text) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null, line: 1 }
  const styles = [], scripts = []
  let cursor = root
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*?)(\/?)>|[^<]+|</gi
  let line = 1, last = 0, skipUntil = 0
  const attrRe = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  for (const m of text.matchAll(re)) {
    if (m.index < skipUntil) continue // inside the body of a <style> or <script>, already consumed
    if (m.index > last) line += (text.slice(last, m.index).match(/\n/g) || []).length
    last = m.index
    const tok = m[0], tokLine = line
    line += (tok.match(/\n/g) || []).length
    last = m.index + tok.length
    if (tok.startsWith('<!--') || /^<!doctype/i.test(tok)) continue
    if (m[1]) {
      const name = m[1].toLowerCase()
      let n = cursor
      while (n && n.tag !== name) n = n.parent
      if (n && n.parent) cursor = n.parent
      continue
    }
    if (m[2]) {
      const name = m[2].toLowerCase(), attrs = {}
      for (const a of m[3].matchAll(attrRe)) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? ''
      const node = { tag: name, attrs, children: [], parent: cursor, line: tokLine }
      cursor.children.push(node)
      if (name === 'style' || name === 'script') {
        const bodyStart = m.index + tok.length
        const close = text.toLowerCase().indexOf(`</${name}`, bodyStart)
        const end = close < 0 ? text.length : close
        const body = text.slice(bodyStart, end)
        ;(name === 'style' ? styles : scripts).push({ text: body, line: tokLine })
        line += (body.match(/\n/g) || []).length
        skipUntil = end
        last = end
        continue
      }
      if (!VOID.has(name) && !m[4]) cursor = node
      continue
    }
    if (tok === '<') continue
    cursor.children.push({ tag: '#text', text: tok, parent: cursor, line: tokLine, attrs: {}, children: [] })
  }
  return { root, styles, scripts }
}

function walkTree(node, fn, depth = 0) { for (const c of node.children) { fn(c, depth); walkTree(c, fn, depth + 1) } }
const textOf = (n) => (n.tag === '#text' ? decodeEntities(n.text) : n.children.map(textOf).join(' '))
const cls = (n) => (n.attrs && n.attrs.class ? n.attrs.class.split(/\s+/).filter(Boolean) : [])

// ---------------------------------------------------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------------------------------------------------
export function auditPaths(paths, opts = {}) {
  const files = []
  const collect = (p) => {
    const st = statSync(p)
    if (st.isDirectory()) {
      for (const name of readdirSync(p)) {
        if (SKIP_DIRS.has(name) || name.startsWith('.')) continue
        collect(join(p, name))
      }
    } else if (EXT.has(extname(p).toLowerCase()) && !/\.min\./.test(p) && st.size <= MAX_BYTES) files.push(p)
  }
  const bases = paths.map((p) => resolve(p))
  for (const p of bases) collect(p)
  const base = bases.length === 1 && statSync(bases[0]).isDirectory() ? bases[0] : null
  const rel = (p) => (base ? relative(base, p) : basename(p)).split('\\').join('/')

  const all = files.map((p) => ({ path: p, rel: rel(p), ext: extname(p).toLowerCase(), text: readFileSync(p, 'utf8').replace(/\r\n/g, '\n') }))
  const findings = []
  const counts = new Map()
  const add = (rule, file, line, message, override = {}) => {
    const key = `${rule}|${file}`
    const n = (counts.get(key) || 0) + 1
    counts.set(key, n)
    if (n > CAP) return
    const meta = RULES[rule]
    findings.push({ rule, severity: override.severity || meta.severity, anti: meta.anti || null, heuristic: !!meta.heuristic, file, line, message, fix: meta.fix })
  }

  // 1. parse everything once
  const css = [] // { file, rules, keyframes, atrules }
  const pages = []
  for (const f of all) {
    if (f.ext === '.css') css.push({ file: f.rel, ...parseCss(f.text) })
    else if (['.html', '.htm', '.vue', '.svelte'].includes(f.ext)) {
      const doc = parseHtml(f.text)
      pages.push({ f, doc, fragment: opts.fragment || !/<html[\s>]/i.test(f.text) })
      for (const s of doc.styles) css.push({ file: f.rel, ...parseCss(s.text, s.line) })
    }
  }
  const jsx = all.filter((f) => ['.jsx', '.tsx'].includes(f.ext))
  const allRules = css.flatMap((c) => c.rules.map((r) => ({ ...r, file: c.file })))
  const allKeyframes = css.flatMap((c) => c.keyframes.map((k) => ({ ...k, file: c.file })))

  // 2. global facts
  const tokens = {}
  for (const r of allRules) if (/^(:root|html|body|\*)$/.test(r.selector.trim()) && !/prefers-color-scheme|dark/i.test(r.atrule)) for (const d of r.decls) if (d.prop.startsWith('--')) tokens[d.prop] = d.value
  const resolveVars = (v, depth = 0) => (depth > 4 ? v : v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)/g, (_, name, fb) => (tokens[name] !== undefined ? resolveVars(tokens[name], depth + 1) : fb || '')))
  const hasReduced = css.some((c) => c.atrules.some((a) => /prefers-reduced-motion/i.test(a.header))) || all.some((f) => /prefers-reduced-motion/i.test(f.text))
  const hasFocusRule = allRules.some((r) => /:focus(-visible)?\b/.test(r.selector) && r.decls.some((d) => /^(outline|box-shadow|border|border-color|background|background-color|text-decoration)/.test(d.prop)))
  const anyFocusSelector = allRules.some((r) => /:focus(-visible)?\b/.test(r.selector))
  const interactiveAnywhere = pages.some((p) => { let found = false; walkTree(p.doc.root, (n) => { if (['button', 'select', 'textarea', 'summary'].includes(n.tag) || (n.tag === 'a' && n.attrs.href !== undefined) || (n.tag === 'input' && n.attrs.type !== 'hidden')) found = true }); return found }) || jsx.some((f) => /<button|<a\s|onClick|<input/.test(f.text))
  const hasAnimation = allRules.some((r) => r.decls.some((d) => (d.prop === 'animation' || d.prop === 'animation-name') && !/^\s*none\s*$/.test(d.value))) || all.some((f) => f.ext !== '.css' && /\banimate-(spin|pulse|bounce|ping)\b|animation:/.test(f.text))
  const firstFile = css[0] ? css[0].file : (all[0] ? all[0].rel : '(project)')

  // 3. CSS-level rules (project-wide, reported at the rule's own file:line)
  const classUse = {}
  for (const p of pages) walkTree(p.doc.root, (n) => { for (const c of cls(n)) classUse[c] = (classUse[c] || 0) + 1 })
  for (const f of jsx) for (const m of f.text.matchAll(/class(?:Name)?=["'{`]([^"'`}]*)/g)) for (const c of m[1].split(/\s+/)) if (c) classUse[c] = (classUse[c] || 0) + 1
  const shadowRadius = new Set()
  const keyframesText = Object.fromEntries(allKeyframes.map((k) => [k.name, k.body]))
  const interactiveSel = /(^|[\s,>+~])(button|a|input|select|textarea|summary)(?=$|[\s.:#\[,>+~])|\.(btn|button|cta|nav-link|menu-toggle|toggle|tab)(?![\w-])/
  // last compound of a selector, without pseudo-classes: ".nav a:hover" -> "a"
  const lastCompound = (sel) => sel.trim().split(/[\s>+~]+/).pop().replace(/::?[\w-]+(\([^)]*\))?/g, '')
  const minHeightBySelector = {}, touchOverride = new Set()
  for (const r of allRules) for (const d of r.decls) if (/^(min-)?height$/.test(d.prop)) {
    const px = toPx(resolveVars(d.value))
    if (px === null) continue
    minHeightBySelector[r.selector] = Math.max(minHeightBySelector[r.selector] || 0, d.prop === 'min-height' ? px : 0, px >= 44 ? px : 0)
    if (px >= 44 && /max-width|pointer:\s*coarse|hover:\s*none/.test(r.atrule)) for (const part of r.selector.split(',')) touchOverride.add(lastCompound(part))
  }
  const fontFamilies = []
  let marqueeSeen = false

  for (const r of allRules) {
    const dec = (p) => r.decls.find((d) => d.prop === p)
    const val = (p) => { const d = dec(p); return d ? resolveVars(d.value) : null }
    const isPrint = /print/.test(r.atrule)

    // contrast: colour and background declared together
    const fg = val('color'), bgD = dec('background-color') || (dec('background') && !/gradient|url\(/i.test(dec('background').value) ? dec('background') : null)
    if (fg && bgD && !/::selection/.test(r.selector)) {
      const ratio = contrast(fg, resolveVars(bgD.value.split(/\s+/).find((w) => parseColor(resolveVars(w))) || bgD.value))
      const px = toPx(val('font-size') || '') || 16
      const large = px >= 24 || (px >= 18.66 && /bold|[6-9]00/.test(val('font-weight') || ''))
      if (ratio !== null && (ratio < 3 || (ratio < 4.5 && !large))) add(ratio < 3 ? 'contrast-fail' : 'contrast-low', r.file, dec('color').line, `${r.selector.split(',')[0].trim()}: ${fg} on ${resolveVars(bgD.value)} is ${ratio.toFixed(2)}:1`)
    }
    // tiny text
    const fs = val('font-size')
    if (fs && !isPrint && !/::?(before|after)\s*$/.test(r.selector) && !/(^|[^r])em$/.test(fs.trim())) { const px = toPx(fs); if (px !== null && px > 0 && px < 12) add('tiny-text', r.file, dec('font-size').line, `${r.selector.split(',')[0].trim()}: font-size ${fs} (${px}px)`) }
    // font families
    const shorthand = (val('font') || '').match(/[\d.]+(?:px|rem|em|%)(?:\/[\d.]+(?:px|rem|em)?)?\s+(.+)$/)
    const ff = val('font-family') || (shorthand ? shorthand[1] : null)
    if (ff && !/^(inherit|initial)$/.test(ff.trim())) fontFamilies.push({ list: ff.split(',').map((x) => x.replace(/["']/g, '').trim().toLowerCase()).filter(Boolean), file: r.file, line: (dec('font-family') || dec('font')).line, selector: r.selector })
    // outline removal
    const ol = dec('outline') || dec('outline-style')
    if (ol && /^(none|0|0px)\b/.test(ol.value.trim()) && !hasFocusRule) add('outline-none', r.file, ol.line, `${r.selector.split(',')[0].trim()}: outline removed and no :focus-visible replacement exists`)
    // 100vh
    if (r.decls.some((d) => /^(min-)?height$/.test(d.prop) && /(^|\s)100vh\b/.test(d.value))) add('vh-100', r.file, (dec('min-height') || dec('height')).line, `${r.selector.split(',')[0].trim()}: uses 100vh`)
    // gradients
    for (const d of r.decls) {
      if (/background/.test(d.prop) && /gradient\(/.test(d.value)) {
        const v = resolveVars(d.value)
        const stops = [...v.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(purple|indigo|violet|magenta|fuchsia)\b/gi)].map((s) => s[0])
        let purple = 0, deep = 0
        for (const s of stops) {
          if (/^(purple|indigo|violet|magenta|fuchsia)$/i.test(s)) { purple++; deep++; continue }
          const rgb = /^hsl/i.test(s) ? null : parseColor(s.replace(/,\s*[\d.]+\s*\)$/, ')').replace(/^rgba/i, 'rgb'))
          let h = null, sat = 0
          if (rgb) { const [r1, g1, b1] = rgb, mx = Math.max(r1, g1, b1), mn = Math.min(r1, g1, b1); sat = mx === 0 ? 0 : (mx - mn) / mx; if (mx !== mn) h = mx === r1 ? ((g1 - b1) / (mx - mn) + 6) % 6 : mx === g1 ? (b1 - r1) / (mx - mn) + 2 : (r1 - g1) / (mx - mn) + 4; h = h === null ? null : h * 60 }
          else if (/^hsl/i.test(s)) { const hm = s.match(/hsla?\(\s*([\d.]+)/i); h = hm ? parseFloat(hm[1]) : null; sat = 1 }
          if (h !== null && h >= 225 && h <= 320 && sat >= 0.35) { purple++; if (h >= 255) deep++ }
        }
        if (purple >= 2 && deep >= 1) add('purple-gradient', r.file, d.line, `${r.selector.split(',')[0].trim()}: gradient with ${purple} purple or indigo stops`)
      }
      if (/background-clip$/.test(d.prop) && /^text$/i.test(d.value.trim())) add('gradient-text', r.file, d.line, `${r.selector.split(',')[0].trim()}: background-clip: text`)
      if (/backdrop-filter$/.test(d.prop) && /blur/.test(d.value)) add('backdrop-filter', r.file, d.line, `${r.selector.split(',')[0].trim()}: ${d.prop}: ${d.value}`)
    }
    // hover lift
    if (/:hover/.test(r.selector)) { const t = val('transform'); const m = t && t.match(/translate(?:Y|3d)?\(\s*(?:0[,\s]+)?(-[\d.]+)(px|rem)/); if (m && Math.abs(parseFloat(m[1])) >= (m[2] === 'rem' ? 0.2 : 3)) add('glow-hover-lift', r.file, dec('transform').line, `${r.selector.split(',')[0].trim()}: lifts ${m[1]}${m[2]} on hover`) }
    // rotated stamp
    const tr = val('transform')
    const rot = tr && tr.match(/rotate\(\s*(-?[\d.]+)deg/)
    if (rot && Math.abs(parseFloat(rot[1])) >= 2 && Math.abs(parseFloat(rot[1])) <= 25 && (/stamp|sticker|badge|label|seal|tag/i.test(r.selector) || /uppercase/.test(val('text-transform') || ''))) add('rotated-stamp', r.file, dec('transform').line, `${r.selector.split(',')[0].trim()}: rotated ${rot[1]}deg badge or label`)
    // marquee by name
    if (!marqueeSeen && /marquee|ticker/i.test(r.selector) && r.decls.some((d) => /^animation/.test(d.prop) || d.prop === 'white-space')) { marqueeSeen = true; add('marquee', r.file, r.line, `${r.selector.split(',')[0].trim()}: scrolling ticker`) }
    // infinite animation
    const anim = r.decls.find((d) => d.prop === 'animation' && /infinite/.test(d.value))
    if (anim) {
      const name = (resolveVars(anim.value).match(/[a-zA-Z_][\w-]*/g) || []).find((w) => keyframesText[w] !== undefined)
      if (name && /translate[X3d]*\([^)]*-\s*\d+(\.\d+)?%/.test(keyframesText[name]) && /linear/.test(anim.value) && !marqueeSeen) { marqueeSeen = true; add('marquee', r.file, anim.line, `${r.selector.split(',')[0].trim()}: looping translateX animation (${name})`) }
      const paused = allRules.some((x) => x.decls.some((d) => d.prop === 'animation-play-state')) || allRules.some((x) => /prefers-reduced-motion/.test(x.atrule) && x.decls.some((d) => /^animation/.test(d.prop)))
      if (!paused) add('infinite-animation', r.file, anim.line, `${r.selector.split(',')[0].trim()}: infinite animation with no reduced-motion override or pause`)
    }
    // small targets
    const parts = r.selector.split(',').map((x) => x.trim())
    const target = parts.find((x) => interactiveSel.test(lastCompound(x)) && !/::|:checked|checkbox|radio/.test(x) && !touchOverride.has(lastCompound(x)))
    if (!isPrint && target && !dec('min-height') && !dec('height')) {
      // no declared height: estimate it from padding and line height (a rough guess, hence heuristic)
      const pad = (val('padding') || '').trim().split(/\s+/).map(toPx)
      const padV = dec('padding-top') && dec('padding-bottom') ? toPx(val('padding-top')) + toPx(val('padding-bottom')) : pad.length && pad[0] !== null ? (pad.length === 1 ? pad[0] * 2 : pad.length === 3 ? pad[0] + pad[2] : pad[0] * 2) : null
      const fpx = toPx(val('font-size') || '') || 16, lh = val('line-height'), lpx = lh ? (/^[\d.]+$/.test(lh) ? parseFloat(lh) * fpx : toPx(lh)) : fpx * 1.4
      const est = padV !== null && !Number.isNaN(padV) && lpx ? padV + lpx : null
      if (est !== null && est < 36 && !/inline/.test(val('display') || '') && !(minHeightBySelector[r.selector] >= 44)) add('small-target', r.file, (dec('padding') || dec('padding-top')).line, `${target}: about ${Math.round(est)}px tall from padding (estimate)`)
    }
    if (!isPrint && target) {
      const h = r.decls.find((d) => /^(min-)?height$/.test(d.prop)); const px = h ? toPx(resolveVars(h.value)) : null
      if (px !== null && px > 0 && px < 44 && !(minHeightBySelector[r.selector] >= 44) && !/^(auto|100%)$/.test(h.value)) add('small-target', r.file, h.line, `${r.selector.split(',')[0].trim()}: ${h.prop} ${px}px`)
    }
    // classes with shadow + radius, mono uppercase eyebrow
    const sh = val('box-shadow'), rad = val('border-radius')
    const single = r.selector.trim().match(/^\.([\w-]+)$/)
    if (single && sh && !/^none$/.test(sh) && rad && !/^0(px)?$/.test(rad) && !/btn|button|chip|pill|badge|tag|avatar|icon|input|toggle|swatch|thumb|dot/.test(single[1])) shadowRadius.add(single[1])
    const ls = val('letter-spacing'), lsPx = ls ? (ls.endsWith('em') ? parseFloat(ls) * 16 : toPx(ls)) : null
    if (single && /uppercase/.test(val('text-transform') || '') && lsPx !== null && lsPx >= 0.05 * 16 * 0.8 && MONO.test((val('font-family') || val('font') || '').toLowerCase()) && (classUse[single[1]] || 0) >= 3) add('mono-eyebrow', r.file, r.line, `.${single[1]}: uppercase mono label used ${classUse[single[1]]} times`)
  }

  // font checks (project-wide)
  if (css.length) {
    const lists = fontFamilies.map((x) => x.list)
    if (!lists.length) add('system-fonts-only', firstFile, 1, 'no font-family declared: the browser default face is used')
    else if (lists.every((l) => l.every((n) => SYSTEM_FAMILIES.test(n)))) add('system-fonts-only', fontFamilies[0].file, fontFamilies[0].line, `only system fonts declared (${[...new Set(lists.flat())].slice(0, 4).join(', ')})`)
    else if (lists.every((l) => l.filter((n) => !SYSTEM_FAMILIES.test(n)).every((n) => /^inter( tight| variable)?$/.test(n)) )) add('inter-only', fontFamilies[0].file, fontFamilies[0].line, 'Inter is the only web font declared')
  }
  // reduced motion
  if (css.length && !hasReduced) {
    const smooth = allRules.some((r) => r.decls.some((d) => d.prop === 'scroll-behavior' && /smooth/.test(d.value)))
    const moves = hasAnimation || smooth || allRules.some((r) => r.decls.some((d) => d.prop === 'transition' && /(transform|all)/.test(d.value) && !/^\s*none/.test(d.value)))
    if (moves) add('no-reduced-motion', firstFile, 1, 'animation or transitions are used but nothing handles prefers-reduced-motion')
  }
  // focus
  if (interactiveAnywhere && !anyFocusSelector && (css.length || pages.length)) add('no-focus-style', firstFile, 1, 'interactive elements exist but no :focus or :focus-visible rule is defined')

  // token role pairs
  const role = (re) => Object.keys(tokens).find((k) => re.test(k.replace(/^--(color-)?/, '')))
  const pairs = [[/^(ink|text|fg|foreground)$/, /^(surface|bg|background|paper|canvas|page)$/], [/^(ink-muted|text-muted|muted|fg-muted|muted-foreground|ink-2)$/, /^(surface|bg|background|paper|canvas|page)$/], [/^(accent-ink|on-accent|accent-foreground)$/, /^(accent|primary)$/], [/^(ink|text|fg|foreground)$/, /^(surface-raised|card|panel|raised)$/]]
  for (const [a, b] of pairs) {
    const ka = role(a), kb = role(b)
    if (!ka || !kb) continue
    const ratio = contrast(resolveVars(tokens[ka]), resolveVars(tokens[kb]))
    if (ratio !== null && ratio < 4.5) add(ratio < 3 ? 'contrast-fail' : 'contrast-low', firstFile, 1, `token pair ${ka} on ${kb} (${resolveVars(tokens[ka])} on ${resolveVars(tokens[kb])}) is ${ratio.toFixed(2)}:1`)
  }

  // 4. markup rules per page
  for (const { f, doc, fragment } of pages) {
    const nodes = []
    walkTree(doc.root, (n) => nodes.push(n))
    const tags = (t) => nodes.filter((n) => n.tag === t)
    if (!fragment) {
      const html = tags('html')[0]
      if (!html || !html.attrs.lang) add('html-lang', f.rel, html ? html.line : 1, '<html> has no lang attribute')
      const vp = tags('meta').find((n) => (n.attrs.name || '').toLowerCase() === 'viewport')
      if (!vp) add('viewport-meta', f.rel, 1, 'no viewport meta tag')
      const h1 = tags('h1').length
      if (h1 !== 1) add('h1-count', f.rel, (tags('h1')[0] || {}).line || 1, `expected exactly one <h1>, found ${h1}`)
      if (!tags('main').length && !nodes.some((n) => n.attrs.role === 'main')) add('no-main', f.rel, 1, 'no <main> landmark')
      if (!tags('nav').length && f.text.length > 4000 && tags('a').filter((a) => a.attrs.href !== undefined).length >= 4) add('no-nav', f.rel, 1, 'no <nav> landmark on a long page')
    }
    for (const n of nodes.filter((x) => x.tag === 'meta' && (x.attrs.name || '').toLowerCase() === 'viewport')) if (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(n.attrs.content || '')) add('zoom-blocked', f.rel, n.line, 'viewport blocks pinch zoom')
    for (const n of tags('img')) if (n.attrs.alt === undefined) add('img-alt', f.rel, n.line, '<img> without alt')
    const labelFor = new Set(tags('label').map((l) => l.attrs.for).filter(Boolean))
    const insideLabel = (n) => { for (let p = n.parent; p; p = p.parent) if (p.tag === 'label') return true; return false }
    for (const n of nodes.filter((x) => ['input', 'select', 'textarea'].includes(x.tag))) {
      const type = (n.attrs.type || 'text').toLowerCase()
      if (['hidden', 'submit', 'button', 'image', 'reset'].includes(type) || n.tag === 'input' && n.attrs.type === 'hidden') continue
      const ok = n.attrs['aria-label'] || n.attrs['aria-labelledby'] || n.attrs.title || (n.attrs.id && labelFor.has(n.attrs.id)) || insideLabel(n)
      if (!ok) add('input-label', f.rel, n.line, `<${n.tag}${n.attrs.type ? ` type=${n.attrs.type}` : ''}> has no label`)
    }
    for (const n of nodes.filter((x) => x.tag === 'button' || (x.tag === 'a' && x.attrs.href !== undefined))) {
      let hasText = false, imgAlt = false
      walkTree({ children: [n] }, (c) => { if (c.tag === '#text' && decodeEntities(c.text).replace(/\s/g, '').length) hasText = true; if (c.tag === 'img' && c.attrs.alt) imgAlt = true })
      const sr = n.children.some((c) => /sr-only|visually-hidden|screen-reader/.test(c.attrs.class || ''))
      if (!hasText && !imgAlt && !sr && !n.attrs['aria-label'] && !n.attrs['aria-labelledby'] && !n.attrs.title) add('icon-button-name', f.rel, n.line, `<${n.tag}> has no text or accessible name`)
    }
    // text-level
    let emoji = 0, generic = 0, numbered = 0, numberedLine = 0
    for (const n of nodes.filter((x) => x.tag === '#text')) {
      if (n.parent && ['code', 'pre', 'script', 'style', 'kbd'].includes(n.parent.tag)) continue
      const t = decodeEntities(n.text).replace(/\s+/g, ' ').trim()
      if (!t) continue
      if (/lorem ipsum|dolor sit amet/i.test(t)) add('lorem-ipsum', f.rel, n.line, 'placeholder text')
      if (t.length <= 4 && /\p{Emoji_Presentation}/u.test(t) && emoji++ < 99) add('emoji-icon', f.rel, n.line, `emoji "${t}" used as an icon`)
      if (/unlock the power|supercharge|seamless(ly)?\b|next[- ]level|game[- ]chang|revolutioni[sz]e|take your .{1,20} to the next level|all-in-one platform/i.test(t) && generic++ < 99) add('generic-copy', f.rel, n.line, `generic phrasing: "${t.slice(0, 60)}"`)
      if (/^0\d\s*[/\u2014\u2013.-]\s*[A-Za-z]/.test(t) && t.length < 45 && !['li', 'td', 'th', 'time', 'summary'].includes(n.parent.tag) && !(n.parent.parent && n.parent.parent.tag === 'ol')) { numbered++; if (!numberedLine) numberedLine = n.line }
      if (/trusted by\b/i.test(t) && /\d/.test(t)) add('trusted-by', f.rel, n.line, `"${t.slice(0, 60)}"`)
    }
    if (numbered >= 2) add('numbered-label', f.rel, numberedLine, `${numbered} numbered section labels such as "01 / ..."`)
    // headings with one italic accent word on a serif display face (serif faces from this page's CSS or linked CSS files)
    const serifHere = fontFamilies.some((x) => SERIF_FIRST.test(x.list[0] || '') && (x.file === f.rel || x.file.endsWith('.css')))
    const emNormal = allRules.some((r) => /(^|[\s,])(h[1-3]\s+)?(em|i)\s*(,|$)/.test(r.selector.trim()) && r.decls.some((d) => d.prop === 'font-style' && /normal/.test(d.value)) && (r.file === f.rel || r.file.endsWith('.css')))
    for (const h of nodes.filter((x) => ['h1', 'h2'].includes(x.tag))) {
      const em = h.children.find((c) => c.tag === 'em' || c.tag === 'i' || (c.tag === 'span' && /ital|accent|serif/.test(c.attrs.class || '')))
      if (em && textOf(em).trim() && serifHere && !emNormal) { add('italic-serif-accent', f.rel, h.line, `heading with one italic accent word ("${textOf(em).trim().slice(0, 30)}") on a serif display face`); break }
    }
    // repeated reveal
    const reveal = nodes.filter((n) => /(^|[\s-_])(reveal|fade-?(in|up)|animate-in|appear|scroll-reveal)(?![\w])/.test(n.attrs.class || '') || n.attrs['data-aos'] !== undefined || n.attrs['data-reveal'] !== undefined)
    if (reveal.length >= 4) add('repeated-reveal', f.rel, reveal[0].line, `the same reveal animation is applied to ${reveal.length} elements`)
    // identical icon cards
    for (const n of nodes) {
      const kids = n.children.filter((c) => c.tag !== '#text')
      if (kids.length < 3) continue
      const key = (c) => cls(c).join(' ') + '|' + c.children.filter((x) => x.tag !== '#text').map((x) => x.tag).join(',')
      const groups = {}
      for (const c of kids) (groups[key(c)] ||= []).push(c)
      const g = Object.values(groups).find((x) => x.length >= 3)
      if (!g) continue
      const sample = g[0], first = sample.children.find((x) => x.tag !== '#text')
      const sig = sample.children.filter((x) => x.tag !== '#text').map((x) => x.tag)
      const hasHeading = sig.some((t) => /^h[2-5]$/.test(t)) && sig.includes('p')
      const iconLike = first && (['svg', 'img', 'i'].includes(first.tag) || /icon|ico|glyph|badge/.test(first.attrs.class || '') || (first.tag !== 'p' && !/^h\d$/.test(first.tag) && textOf(first).trim().length <= 3))
      if (hasHeading && iconLike) { add('identical-cards', f.rel, g[0].line, `${g.length} sibling cards with the same icon, heading and sentence structure`); break }
    }
    // nested containers
    if (shadowRadius.size) {
      for (const n of nodes) {
        if (!cls(n).some((c) => shadowRadius.has(c))) continue
        let inner = null
        walkTree(n, (d) => { if (!inner && cls(d).some((c) => shadowRadius.has(c))) inner = d })
        if (inner) { add('nested-containers', f.rel, inner.line, `a card with shadow and radius contains another (.${cls(inner).find((c) => shadowRadius.has(c))})`); break }
      }
    }
  }

  // 5. JSX / TSX: line-level rules only
  for (const f of jsx) {
    f.text.split('\n').forEach((line, i) => {
      const ln = i + 1
      if (/<img\b(?![^>]*\balt=)[^>]*>/.test(line)) add('img-alt', f.rel, ln, '<img> without alt')
      if (/lorem ipsum|dolor sit amet/i.test(line)) add('lorem-ipsum', f.rel, ln, 'placeholder text')
      if (/>\s*\p{Emoji_Presentation}\s*</u.test(line)) add('emoji-icon', f.rel, ln, 'emoji used as an icon')
      if (/unlock the power|supercharge|seamless(ly)?\b|next[- ]level|game[- ]chang/i.test(line)) add('generic-copy', f.rel, ln, 'generic phrasing')
      if (/\bbg-clip-text\b/.test(line) && /text-transparent/.test(line)) add('gradient-text', f.rel, ln, 'bg-clip-text with text-transparent')
      if (/\b(from|via|to)-(purple|violet|indigo|fuchsia)-\d+/.test(line) && /bg-gradient/.test(line)) add('purple-gradient', f.rel, ln, 'purple or indigo gradient utility classes')
      if (/\bbackdrop-blur/.test(line)) add('backdrop-filter', f.rel, ln, 'backdrop-blur utility')
      if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1\b/.test(line)) add('zoom-blocked', f.rel, ln, 'viewport blocks pinch zoom')
      if (/\boutline-none\b/.test(line) && !/focus-visible:|focus:ring|focus:outline/.test(line)) add('outline-none', f.rel, ln, 'outline-none without a focus-visible style on the same element')
      if (/\bhover:-translate-y-/.test(line)) add('glow-hover-lift', f.rel, ln, 'hover lift utility')
    })
  }

  // 6. cap summaries
  for (const [key, n] of counts) if (n > CAP) { const [rule, file] = key.split('|'); const last = [...findings].reverse().find((x) => x.rule === rule && x.file === file); if (last) last.message += ` (+${n - CAP} more in this file)` }

  const visible = opts.heuristics === false ? findings.filter((x) => !x.heuristic) : findings
  const order = { critical: 0, warning: 1, suggestion: 2 }
  visible.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line)
  const summary = { critical: 0, warning: 0, suggestion: 0 }
  for (const x of visible) summary[x.severity]++
  return { files: all.map((f) => f.rel), summary, findings: visible }
}

// ---------------------------------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------------------------------
function main() {
  const args = process.argv.slice(2)
  const flags = new Set(args.filter((a) => a.startsWith('--')))
  const paths = args.filter((a) => !a.startsWith('--'))
  if (flags.has('--rules')) {
    for (const [id, r] of Object.entries(RULES)) console.log(`${id.padEnd(22)} ${r.severity.padEnd(10)} ${(r.anti || '-').padEnd(4)} ${r.heuristic ? 'heuristic' : ''}`)
    return 0
  }
  if (!paths.length) { console.error('Usage: node scripts/audit-ui.mjs <file-or-folder> [--json] [--fragment] [--no-heuristics] [--rules]'); return 2 }
  let result
  try { result = auditPaths(paths, { fragment: flags.has('--fragment'), heuristics: !flags.has('--no-heuristics') }) } catch (e) { console.error(`audit failed: ${e.message}`); return 2 }
  if (flags.has('--json')) { console.log(JSON.stringify({ paths, ...result }, null, 2)); return result.summary.critical ? 1 : 0 }
  console.log(`UI audit: ${paths.join(', ')} (${result.files.length} files scanned)`)
  for (const sev of ['critical', 'warning', 'suggestion']) {
    const group = result.findings.filter((x) => x.severity === sev)
    if (!group.length) continue
    console.log(`\n${sev.toUpperCase()} (${group.length})`)
    for (const x of group) {
      const tags = [x.anti, x.heuristic ? 'heuristic' : null].filter(Boolean).join(', ')
      console.log(`  [${x.rule}] ${x.file}:${x.line}  ${x.message}${tags ? `  (${tags})` : ''}`)
      console.log(`      fix: ${x.fix}`)
    }
  }
  const s = result.summary
  console.log(`\n${s.critical} critical, ${s.warning} warning, ${s.suggestion} suggestion.`)
  console.log('Static lint only: it cannot see layout, collisions, images, overlays or the 375 px view. "heuristic" findings can be wrong. Render the page to confirm.')
  return s.critical ? 1 : 0
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/audit-ui.mjs')) process.exitCode = main()
