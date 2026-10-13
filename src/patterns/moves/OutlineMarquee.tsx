/*
 * Signature move (basement.studio): type that flips between solid and outline. Two rows of huge words scroll in
 * opposite directions; alternate words are filled or stroked (-webkit-text-stroke), and hovering the band
 * inverts them, so the same line reads two ways. Pure CSS. The words are real text (duplicated copy is
 * aria-hidden). Reduced motion: the rows stop.
 */

const WORDS = ['Brand', 'Web', 'Motion', 'Type', 'Systems', '3D']

function Row({ reverse }: { reverse?: boolean }) {
  return (
    <div className="om-row" style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
      {[0, 1].map((copy) => (
        <span key={copy} className="flex shrink-0 gap-8 pr-8" aria-hidden={copy === 1}>
          {WORDS.map((w, i) => (
            <span key={w} className={(i + (reverse ? 1 : 0)) % 2 ? 'om-solid' : 'om-line'}>{w}</span>
          ))}
        </span>
      ))}
    </div>
  )
}

export default function OutlineMarquee() {
  return (
    <div className="om overflow-hidden rounded-xl border border-border bg-bg py-6">
      <style>{`
        .om-row { display: flex; width: max-content; animation: om-go 30s linear infinite; font: 800 clamp(3.5rem, 12vw, 7.5rem)/1 var(--font-sans); letter-spacing: -0.04em; text-transform: uppercase; }
        .om-line { color: transparent; -webkit-text-stroke: 2px var(--fg); transition: color 0.3s, -webkit-text-stroke-color 0.3s; }
        .om-solid { color: var(--fg); transition: color 0.3s, -webkit-text-stroke-color 0.3s; -webkit-text-stroke: 2px transparent; }
        .om:hover .om-line { color: var(--accent); -webkit-text-stroke-color: var(--accent); }
        .om:hover .om-solid { color: transparent; -webkit-text-stroke-color: var(--fg); }
        @keyframes om-go { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .om-row { animation: none; } }
      `}</style>
      <Row />
      <Row reverse />
    </div>
  )
}
