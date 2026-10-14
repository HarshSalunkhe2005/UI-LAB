import { useId, useMemo, useState } from 'react'

/*
 * A WCAG contrast checker you can keep. Type or pick two colours; it computes the relative luminance of each (the WCAG
 * formula, with sRGB linearisation) and the contrast ratio, then says in words whether normal text, large text and UI
 * components pass AA and AAA. The sample renders your pair at real sizes. Pure maths, no library.
 */

function parse(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
const lin = (v: number) => {
  const c = v / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
const lum = ([r, g, b]: [number, number, number]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
export const ratio = (a: [number, number, number], b: [number, number, number]) => {
  const x = lum(a)
  const y = lum(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export default function ContrastChecker() {
  const id = useId()
  const [fg, setFg] = useState('#4f46e5')
  const [bg, setBg] = useState('#ffffff')
  const f = parse(fg)
  const b = parse(bg)
  const r = useMemo(() => (f && b ? ratio(f, b) : null), [f, b])
  const rows: [string, number, string][] = [
    ['Normal text, AA', 4.5, 'body copy, labels'],
    ['Normal text, AAA', 7, 'the enhanced level'],
    ['Large text, AA', 3, '24px, or 19px bold and up'],
    ['UI parts and icons, AA', 3, 'borders, focus rings, icons'],
  ]
  return (
    <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
      <div className="space-y-3">
        {[['Text colour', fg, setFg, 'fg'], ['Background', bg, setBg, 'bg']].map(([label, val, set, k]) => (
          <div key={k as string}>
            <label htmlFor={`${id}-${k}`} className="text-sm font-medium">{label as string}</label>
            <div className="mt-1 flex gap-2">
              <input type="color" aria-label={`${label} picker`} value={parse(val as string) ? `#${(val as string).replace('#', '').padStart(6, '0').slice(0, 6)}` : '#000000'} onChange={(e) => (set as (v: string) => void)(e.target.value)} className="size-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-1" />
              <input id={`${id}-${k}`} value={val as string} onChange={(e) => (set as (v: string) => void)(e.target.value)} aria-invalid={!parse(val as string)} className="min-h-12 w-full rounded-md border border-border bg-surface px-3 font-mono text-sm" />
            </div>
          </div>
        ))}
        <button onClick={() => { setFg(bg); setBg(fg) }} className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-surface">Swap colours</button>
        <p className="text-sm text-fg-muted" role="status">
          {r === null ? 'Enter colours as hex, like #1a1a1a or #fff.' : <>Contrast ratio <b className="text-fg tabular-nums">{r.toFixed(2)} : 1</b></>}
        </p>
      </div>
      <div>
        <div className="rounded-xl border border-border p-5" style={{ background: b ? bg : '#fff', color: f ? fg : '#000' }}>
          <p className="text-2xl font-semibold">Large sample text</p>
          <p className="mt-1 text-base">Body text at sixteen pixels, the size most people read.</p>
          <p className="mt-2 text-xs">Small print at twelve pixels.</p>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {rows.map(([name, min, hint]) => {
            const ok = r !== null && r >= min
            return (
              <li key={name} className="flex items-center justify-between gap-3">
                <span>{name} <span className="text-fg-muted">({hint})</span></span>
                <span className={`font-medium ${ok ? 'text-success' : 'text-danger'}`}>{r === null ? '—' : ok ? '✓ Pass' : '✕ Fail'}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
