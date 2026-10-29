// WCAG contrast ratio for two colours. No dependencies, no network, reads nothing from disk.
// Usage: node scripts/contrast.mjs <foreground> <background>
// Colours are hex: #rgb, #rrggbb (the leading # is optional).
// Prints the ratio and whether it passes AA for body text (4.5), large text (3) and UI components (3).

function parse(hex) {
  let h = String(hex || '').replace('#', '').trim()
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Not a hex colour: ${hex}`)
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}

// Relative luminance per WCAG 2.x.
function luminance([r, g, b]) {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrast(fg, bg) {
  const [a, b] = [luminance(parse(fg)), luminance(parse(bg))]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const [fg, bg] = process.argv.slice(2)
if (fg && bg) {
  const r = contrast(fg, bg)
  const ok = (min) => (r >= min ? 'pass' : 'FAIL')
  console.log(`${r.toFixed(2)}:1  body text (4.5) ${ok(4.5)}  large text (3) ${ok(3)}  UI component (3) ${ok(3)}`)
  if (r < 4.5) process.exitCode = 1
} else if (process.argv[1] && process.argv[1].endsWith('contrast.mjs')) {
  console.log('Usage: node scripts/contrast.mjs <foreground-hex> <background-hex>')
  process.exitCode = 2
}
