/*
 * Shimmering gradient text + a conic "running border" button. Both use
 * registered custom properties (@property) so the gradient angle/position
 * can be animated by CSS keyframes alone.
 */

const CSS = `
@property --shine { syntax: '<percentage>'; inherits: false; initial-value: -50%; }
@property --spin { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
.shimmer {
  background: linear-gradient(100deg, var(--fg-muted) 30%, var(--fg) 45%, var(--accent) 50%, var(--fg) 55%, var(--fg-muted) 70%) no-repeat;
  background-size: 250% 100%; background-position: var(--shine) 0;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shine 3.2s linear infinite;
}
@keyframes shine { to { --shine: 150%; } }
.run-border {
  background: linear-gradient(var(--surface), var(--surface)) padding-box,
              conic-gradient(from var(--spin), transparent 60%, var(--accent), #ec4899, transparent 90%) border-box;
  border: 1.5px solid transparent; animation: spin 3s linear infinite;
}
@keyframes spin { to { --spin: 360deg; } }
@media (prefers-reduced-motion: reduce) { .shimmer, .run-border { animation: none; } }
`

export default function ShimmerText() {
  return (
    <div className="space-y-8 text-center">
      <style>{CSS}</style>
      <h3 className="shimmer text-4xl font-semibold tracking-tight sm:text-6xl">Now shipping v2</h3>
      <button className="run-border rounded-full px-6 py-2.5 text-sm font-medium">✦ Try the beta</button>
    </div>
  )
}
