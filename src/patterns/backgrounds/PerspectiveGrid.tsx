/*
 * Retro perspective grid floor (synthwave): a large grid of lines drawn
 * with two repeating linear-gradients, tilted with rotateX, scrolling toward
 * the viewer by animating background-position. A horizon glow and a sun on
 * top. Pure CSS; static under reduced motion.
 */

const CSS = `
.pgrid { background-image: linear-gradient(to right, rgb(236 72 153 / .7) 1px, transparent 1px), linear-gradient(to bottom, rgb(236 72 153 / .7) 1px, transparent 1px);
  background-size: 48px 48px; transform: rotateX(72deg); transform-origin: top; animation: pgrid 1.2s linear infinite; }
@keyframes pgrid { to { background-position: 0 48px; } }
@media (prefers-reduced-motion: reduce) { .pgrid { animation: none; } }
`

export default function PerspectiveGrid() {
  return (
    <div className="relative h-80 overflow-hidden rounded-xl bg-gradient-to-b from-[#0b0220] via-[#2a0a3d] to-[#0b0220] [perspective:300px]" role="img" aria-label="Synthwave sun over a moving neon grid">
      <style>{CSS}</style>
      <div className="absolute top-[18%] left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-300 via-orange-400 to-pink-600 [mask-image:repeating-linear-gradient(to_bottom,#000_0_12px,transparent_12px_16px)]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-pink-400 shadow-[0_0_30px_8px_rgba(236,72,153,.6)]" />
      <div className="pgrid absolute top-1/2 -left-1/2 h-[200%] w-[200%]" />
      <div className="absolute inset-x-0 top-1/2 h-16 bg-gradient-to-b from-[#2a0a3d] to-transparent" />
    </div>
  )
}
