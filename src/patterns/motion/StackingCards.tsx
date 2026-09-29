/*
 * Sticky stacking cards: each card is position: sticky with an increasing
 * top offset, so as you scroll they pile up on each other. The ones buried
 * underneath shrink slightly via a scroll-driven animation (view timeline),
 * with no JS. Without scroll-timeline support they simply stack.
 */

const CSS = `
@supports (animation-timeline: view()) {
  .stack-card { animation: stack-shrink linear both; animation-timeline: view(); animation-range: exit-crossing 0% exit-crossing 100%; }
}
@keyframes stack-shrink { to { transform: scale(.9); filter: brightness(.6); } }
@media (prefers-reduced-motion: reduce) { .stack-card { animation: none; } }
`

const CARDS = [
  { t: 'Research', d: 'Interviews, analytics and teardown of competitors.', hue: 250 },
  { t: 'Design', d: 'Tokens first, then screens, then motion.', hue: 320 },
  { t: 'Build', d: 'One component at a time, each with a live demo.', hue: 20 },
  { t: 'Launch', d: 'Measure, fix, and ship again next Friday.', hue: 160 },
]

export default function StackingCards() {
  return (
    <div className="h-96 overflow-y-auto rounded-xl border border-border" tabIndex={0} aria-label="Stacking cards, scroll inside">
      <style>{CSS}</style>
      <div className="space-y-6 p-4 pb-40">
        <p className="font-mono text-xs text-fg-muted">scroll ↓</p>
        {CARDS.map((c, i) => (
          <article
            key={c.t}
            className="stack-card sticky flex h-60 flex-col justify-between rounded-2xl p-6 text-white shadow-lg"
            style={{ top: 16 + i * 14, background: `linear-gradient(140deg, hsl(${c.hue} 70% 55%), hsl(${c.hue + 30} 60% 25%))` }}
          >
            <span className="font-mono text-xs opacity-80">0{i + 1}</span>
            <div>
              <h4 className="font-display text-4xl italic">{c.t}</h4>
              <p className="mt-1 text-sm opacity-90">{c.d}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
