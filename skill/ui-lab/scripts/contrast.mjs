// WCAG contrast ratio for two colours. No dependencies, no network, reads nothing from disk.
// Usage: node scripts/contrast.mjs <foreground> <background>
// Colours: #rgb, #rrggbb, rgb(r, g, b). The leading # is optional for hex.
// Prints the ratio and whether it passes AA for body text (4.5), large text (3) and UI components (3).
// Also importable: parseColor(text) returns [r, g, b] in 0..1 or null; contrast(a, b) returns the ratio.

/** Parses a colour string; returns [r, g, b] with channels in 0..1, or null if it is not a plain opaque colour. */
export function parseColor(input) {
  const s = String(input || '').trim().toLowerCase()
  const rgb = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/)
  if (rgb) {
    if (rgb[4] !== undefined && parseFloat(rgb[4]) < 1) return null // translucent: cannot be judged without the backdrop
    return [rgb[1], rgb[2], rgb[3]].map((n) => Math.min(255, Number(n)) / 255)
  }
  let h = s.replace(/^#/, '')
  if (!/^[0-9a-f]+$/.test(h)) return null
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
  if (h.length === 8) { if (parseInt(h.slice(6), 16) < 255) return null; h = h.slice(0, 6) }
  if (h.length !== 6) return null
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}

// Relative luminance per WCAG 2.x.
function luminance([r, g, b]) {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** Contrast ratio between two colour strings, or null if either cannot be parsed. */
export function contrast(fg, bg) {
  const [a, b] = [parseColor(fg), parseColor(bg)]
  if (!a || !b) return null
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const isMain = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/contrast.mjs')
if (isMain) {
  const [fg, bg] = process.argv.slice(2)
  const r = fg && bg ? contrast(fg, bg) : null
  if (r === null) {
    console.log('Usage: node scripts/contrast.mjs <foreground> <background>   (#rgb, #rrggbb or rgb(r, g, b); opaque colours only)')
    process.exitCode = 2
  } else {
    const ok = (min) => (r >= min ? 'pass' : 'FAIL')
    console.log(`${r.toFixed(2)}:1  body text (4.5) ${ok(4.5)}  large text (3) ${ok(3)}  UI component (3) ${ok(3)}`)
    if (r < 4.5) process.exitCode = 1
  }
}
