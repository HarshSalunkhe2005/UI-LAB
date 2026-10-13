const ROWS = [
  ['Aurora', 'Lumen', 'Mosaic', 'Pulse', 'Relay', 'Tidal'],
  ['Foundry', 'Glyph', 'Harbor', 'Ledger', 'Nova', 'Orbit'],
]
const HUES = [24, 200, 280, 150, 330, 60]

/*
 * Signature move (Framer): rows of template cards drifting past, each tilted in 3D. Two rows run in opposite
 * directions; the whole stack sits in a perspective so the rows lean away, and a row pauses when hovered
 * or focused so cards can be read and clicked. Pure CSS animation. Reduced motion: rows stand still.
 */

export default function TiltMarquee() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface py-8" style={{ perspective: '900px' }}>
      <style>{`
        @keyframes tm-left { to { transform: translateX(-50%); } }
        @keyframes tm-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .tm-row { display: flex; width: max-content; gap: 16px; animation: tm-left 36s linear infinite; }
        .tm-row.rev { animation-name: tm-right; animation-duration: 44s; }
        .tm-wrap:hover .tm-row, .tm-wrap:focus-within .tm-row { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .tm-row { animation: none; } }
      `}</style>
      <div className="tm-wrap space-y-4" style={{ transform: 'rotateX(14deg) rotateZ(-4deg)', transformStyle: 'preserve-3d' }}>
        {ROWS.map((row, r) => (
          <div key={r} className="overflow-hidden">
            <div className={`tm-row ${r % 2 ? 'rev' : ''}`}>
              {[...row, ...row].map((name, i) => (
                <a
                  key={i}
                  href="#/move-tilt-marquee"
                  aria-hidden={i >= row.length}
                  tabIndex={i >= row.length ? -1 : 0}
                  className="block h-32 w-52 shrink-0 rounded-lg border border-border p-3 text-sm font-medium transition-transform hover:-translate-y-1"
                  style={{ background: `linear-gradient(160deg, hsl(${HUES[i % 6]} 70% 55% / 0.55), var(--surface-2))` }}
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
