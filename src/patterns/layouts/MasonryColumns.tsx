/*
 * A masonry layout with CSS columns: items of different heights pack into columns with no JavaScript. The catch to know
 * about: columns fill top to bottom, so the visual order is down each column, not across. That is fine for a gallery and
 * wrong for anything numbered or ranked. `break-inside: avoid` keeps each card whole. Column count follows the width.
 */

const ITEMS = [
  ['Notes on kerning', 120], ['A field guide', 200], ['Three small rules', 90], ['The long read', 260], ['Colour, briefly', 140],
  ['Why margins matter', 180], ['Fonts we love', 110], ['A short list', 80], ['On line length', 220], ['Sketchbook', 150],
] as const

export default function MasonryColumns() {
  return (
    <div className="[column-gap:1rem] [columns:2_9rem] md:[columns:3_11rem]">
      {ITEMS.map(([t, h], i) => (
        <article key={t} className="mb-4 break-inside-avoid rounded-xl border border-border bg-surface p-4" style={{ minHeight: h }}>
          <p className="font-mono text-[11px] text-fg-muted">{String(i + 1).padStart(2, '0')}</p>
          <h3 className="mt-1 font-semibold">{t}</h3>
          <p className="mt-1 text-sm text-fg-muted">Cards keep their natural height, and the columns settle around them.</p>
        </article>
      ))}
    </div>
  )
}
