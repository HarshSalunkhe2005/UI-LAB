/*
 * Vibe-coded move (KATACHI, "gradient blur", v0): content that dissolves at the edge instead of being
 * cut off. Several stacked layers apply increasing backdrop-filter blur, each masked to a narrower band, so the
 * blur ramps up smoothly toward the edge (a single blur plus a fade looks like a smear). The layers are
 * decorative (aria-hidden, pointer-events none); the text underneath stays fully readable when scrolled to.
 */

const LAYERS = [
  { blur: 1, from: 0, to: 40 },
  { blur: 2, from: 15, to: 55 },
  { blur: 4, from: 30, to: 70 },
  { blur: 8, from: 50, to: 85 },
  { blur: 14, from: 70, to: 100 },
]

function Edge({ side }: { side: 'top' | 'bottom' }) {
  const dir = side === 'top' ? 'to bottom' : 'to top'
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 h-16 ${side === 'top' ? 'top-0' : 'bottom-0'}`}>
      {LAYERS.map((l, i) => {
        // darkest blur sits at the very edge: reverse so the strongest layer is nearest the border
        const mask = `linear-gradient(${dir}, black ${100 - l.to}%, transparent ${100 - l.from}%)`
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${l.blur}px)`, WebkitBackdropFilter: `blur(${l.blur}px)`, maskImage: mask, WebkitMaskImage: mask }}
          />
        )
      })}
    </div>
  )
}

export default function V0BlurEdge() {
  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-surface">
      <div className="h-full overflow-y-auto px-8 py-16" tabIndex={0} aria-label="Scrollable article">
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} className="mb-5 text-lg leading-8">
            Handmade furniture is slow on purpose. Each joint is cut, fitted and fitted again until it closes without glue, and the grain is chosen to run the same way
            across a whole table. {i === 0 ? 'Scroll to watch the text melt at the edges.' : ''}
          </p>
        ))}
      </div>
      <Edge side="top" />
      <Edge side="bottom" />
    </div>
  )
}
