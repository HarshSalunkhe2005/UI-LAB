/*
 * Pure-CSS scroll reveal. The whole trick is the <style> block:
 *   animation-timeline: view()  → the animation progresses as the element crosses the viewport
 *   animation-range             → only play during the element's entry
 * Browsers without support just show the content (the @supports guard).
 */
const CSS = `
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-up linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 90%;
  }
}
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(48px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; }
}
`

const ITEMS = [
  ['Collect', 'Messages, photos and location pings arrive out of order.'],
  ['Align', 'Timestamps get normalised across sources and time zones.'],
  ['Link', 'Fragments that describe the same moment are clustered.'],
  ['Reconstruct', 'A single, readable timeline of the day emerges.'],
  ['Review', 'Low-confidence links are flagged for a human to confirm.'],
  ['Ship', 'Export the timeline or share it as a live page.'],
]

export default function ScrollReveal() {
  return (
    <div>
      <style>{CSS}</style>
      <p className="mb-6 text-sm text-fg-muted">Scroll down ↓</p>
      <div className="space-y-6 pb-24">
        {ITEMS.map(([title, body], i) => (
          <article key={title} className="reveal rounded-lg border border-border bg-surface p-6 shadow-sm">
            <span className="font-mono text-xs text-accent">0{i + 1}</span>
            <h4 className="mt-1 text-xl font-semibold">{title}</h4>
            <p className="mt-1 text-fg-muted">{body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
