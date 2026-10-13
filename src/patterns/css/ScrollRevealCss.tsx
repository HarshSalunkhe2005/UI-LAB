/*
 * Modern CSS: scroll-driven reveal with no JavaScript. `animation-timeline: view()` ties each card's animation to its
 * own position in the scroll box. Wrapped in @supports so browsers without it (Firefox stable at the time of writing)
 * simply show the cards; nothing is ever hidden by an unsupported feature. Reduced motion removes the animation.
 */

const CSS = `
.sdr-box { height: 340px; overflow-y: auto; padding: 1rem; display: grid; gap: 1rem; align-content: start; }
.sdr-card { padding: 1.25rem; border-radius: 0.75rem; border: 1px solid var(--color-border); background: var(--color-surface); }
.sdr-card h3 { font-weight: 600; }
.sdr-card p { margin-top: .25rem; font-size: .875rem; color: var(--color-fg-muted); }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .sdr-card { animation: sdr-in linear both; animation-timeline: view(); animation-range: entry 0% cover 35%; }
    @keyframes sdr-in { from { opacity: 0; transform: translateY(36px) scale(.96); } to { opacity: 1; transform: none; } }
  }
}
`

export default function ScrollRevealCss() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <style>{CSS}</style>
      <div className="sdr-box" tabIndex={0} aria-label="Scrollable list, cards reveal as they enter">
        {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((n) => (
          <article key={n} className="sdr-card">
            <h3>Card {n}</h3>
            <p>Animated by the browser on the compositor, with no scroll listener and no IntersectionObserver.</p>
          </article>
        ))}
      </div>
    </div>
  )
}
