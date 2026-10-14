/*
 * A scroll-snap gallery: a horizontal row that stops neatly on each slide, with no JavaScript. It scrolls with touch, a
 * trackpad, arrow keys (the row is focusable) and the scrollbar. `scroll-snap-type: x mandatory` and `scroll-snap-align`
 * do the work; `scroll-padding` keeps the first slide off the edge. Add visible controls if the content matters, because a
 * swipe is invisible to people who do not know to try it.
 */

const SLIDES = [['#f2c9a1', 'Morning'], ['#bfd8c6', 'Noon'], ['#c5cdea', 'Evening'], ['#e6c0d4', 'Night'], ['#e8dca9', 'Dawn']]

export default function ScrollSnapGallery() {
  return (
    <div>
      <ul tabIndex={0} aria-label="Gallery, scroll sideways" className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 rounded-xl border border-border p-4 [scrollbar-width:thin]">
        {SLIDES.map(([bg, t]) => (
          <li key={t} className="grid h-44 w-64 shrink-0 snap-center place-content-center rounded-lg text-center text-[#1d1b18]" style={{ background: bg }}>
            <p className="text-2xl font-semibold">{t}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-fg-muted">Scroll, swipe, or focus the row and use the arrow keys.</p>
    </div>
  )
}
