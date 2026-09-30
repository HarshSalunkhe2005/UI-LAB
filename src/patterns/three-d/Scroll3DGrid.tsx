import { img } from './_shared'

/*
 * 3D grid on scroll: each image rotates in on X and comes forward in Z as
 * it enters, then tilts away as it leaves, driven by a CSS view timeline.
 * Alternate columns use different transform origins for a staggered,
 * "flipping pages" feel. No JS; flat grid without support.
 */

const CSS = `
.g3 { perspective: 900px; }
@supports (animation-timeline: view()) {
  .g3 figure { animation: g3-in linear both; animation-timeline: view(); animation-range: entry 0% exit 100%; }
  .g3 figure:nth-child(3n+2) { transform-origin: 50% 100%; }
  .g3 figure:nth-child(3n) { transform-origin: 0% 50%; }
}
@keyframes g3-in {
  0% { transform: rotateX(70deg) translateZ(-200px); opacity: 0; filter: blur(4px); }
  35%, 65% { transform: none; opacity: 1; filter: none; }
  100% { transform: rotateX(-50deg) translateZ(-150px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .g3 figure { animation: none; } }
`

export default function Scroll3DGrid() {
  return (
    <div className="h-96 overflow-y-auto rounded-xl border border-border bg-bg" tabIndex={0} aria-label="3D grid, scroll inside">
      <style>{CSS}</style>
      <div className="g3 grid grid-cols-3 gap-4 p-6 py-40">
        {Array.from({ length: 18 }, (_, i) => (
          <figure key={i} className="overflow-hidden rounded-lg">
            <img src={img(i + 1300, 300, 380)} alt="" className="aspect-[4/5] w-full object-cover" />
          </figure>
        ))}
      </div>
    </div>
  )
}
