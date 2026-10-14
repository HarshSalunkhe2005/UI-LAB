import { useState } from 'react'

/*
 * Container queries: a card that rearranges itself based on the width of the space it is in, not the screen. Drag the
 * slider to resize the container. Below about 28rem the card stacks; above it the picture moves beside the text. The same
 * component works in a narrow sidebar and a wide main column with no media queries. Unsupported browsers just get the
 * stacked layout.
 */

const CSS = `
.cq-wrap { container-type: inline-size; container-name: card; }
.cq-card { display: grid; gap: .75rem; padding: 1rem; border: 1px solid var(--color-border); border-radius: .75rem; background: var(--color-surface); }
.cq-pic { aspect-ratio: 16 / 9; border-radius: .5rem; background: linear-gradient(135deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 40%, var(--color-surface-2))); }
.cq-card h3 { font-size: 1.125rem; font-weight: 600; }
.cq-card p { color: var(--color-fg-muted); font-size: .9rem; }
@container card (min-width: 28rem) {
  .cq-card { grid-template-columns: 10rem 1fr; align-items: center; }
  .cq-pic { aspect-ratio: 1; }
  .cq-card h3 { font-size: 1.375rem; }
}
`

export default function ContainerQueryCard() {
  const [w, setW] = useState(70)
  return (
    <div>
      <style>{CSS}</style>
      <label className="mb-4 flex items-center gap-3 text-sm">
        Container width: {w}%
        <input type="range" min={30} max={100} value={w} onChange={(e) => setW(Number(e.target.value))} className="h-11 w-56" />
      </label>
      <div className="cq-wrap" style={{ width: `${w}%` }}>
        <article className="cq-card">
          <div className="cq-pic" aria-hidden />
          <div>
            <h3>A card that adapts to its space</h3>
            <p>Resize the container, not the window. The layout changes when the card has room for it.</p>
          </div>
        </article>
      </div>
    </div>
  )
}
