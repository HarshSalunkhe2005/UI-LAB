import { useState } from 'react'

/*
 * Blueprint intro: construction lines draw across the frame, then the mark
 * traces itself on top, then the tagline fades in. Everything is SVG
 * strokes animated with stroke-dashoffset; pathLength="1" normalises every
 * line so one keyframe works for all of them.
 * Reduced motion: the finished drawing appears without animation.
 */

const CSS = `
.bp line, .bp circle, .bp path { fill: none; stroke-dasharray: 1; stroke-dashoffset: 1; vector-effect: non-scaling-stroke; }
.bp .guide { stroke: currentColor; stroke-opacity: .28; stroke-width: 1; animation: bp-draw 1.1s var(--ease-in-out) forwards; }
.bp .mark  { stroke: currentColor; stroke-width: 2; animation: bp-draw 1.4s var(--ease-out-expo) 1.2s forwards; }
.bp .tag   { opacity: 0; animation: bp-fade .8s ease 2.4s forwards; }
@keyframes bp-draw { to { stroke-dashoffset: 0; } }
@keyframes bp-fade { to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .bp line, .bp circle, .bp path { stroke-dashoffset: 0; animation: none; }
  .bp .tag { opacity: 1; animation: none; }
}
`

const GUIDES: [number, number, number, number][] = [
  [0, 60, 400, 60], [0, 118, 400, 118], [0, 176, 400, 176], [0, 186, 400, 186],
  [120, 0, 120, 240], [280, 0, 280, 240], [110, 250, 230, -10], [170, -10, 290, 250],
]

export function BlueprintIntro({ tagline = 'Architect worlds that move.' }: { tagline?: string }) {
  return (
    <div className="bp relative text-fg" role="img" aria-label={`Logo drawing: ${tagline}`}>
      <style>{CSS}</style>
      <svg viewBox="0 0 400 240" className="w-full">
        {GUIDES.map(([x1, y1, x2, y2], i) => (
          <line key={i} className="guide" x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} style={{ animationDelay: `${i * 70}ms` }} />
        ))}
        <circle className="guide" cx={200} cy={120} r={78} pathLength={1} style={{ animationDelay: '300ms' }} />
        <path className="mark" d="M200 40 L290 186 L110 186 Z M200 92 L258 176 L142 176 Z" pathLength={1} />
      </svg>
      <p className="tag mt-2 text-center font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">{tagline}</p>
    </div>
  )
}

export default function BlueprintIntroDemo() {
  const [key, setKey] = useState(0)
  return (
    <div className="mx-auto max-w-xl rounded-xl bg-black p-6 text-white [--fg:#fff] [--fg-muted:#a1a1aa]">
      <BlueprintIntro key={key} />
      <button onClick={() => setKey((k) => k + 1)} className="mt-4 text-sm text-neutral-400 hover:text-white">
        ↻ Replay
      </button>
    </div>
  )
}
