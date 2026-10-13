import { useState } from 'react'

/*
 * Niche world: Field Notebook / Herbarium. A botanical plate with numbered callouts. Hovering or focusing a
 * number (or its entry in the list) lights the matching part of the drawing and shows its note in a handwritten
 * caption. The plate is a hand-built SVG (so it scales and can be restyled); callouts are real buttons; the
 * list is the accessible version of the picture. Reduced motion: no line-draw on load.
 */

const PARTS = [
  { id: 1, name: 'Corolla', note: 'Five fused petals, opening at dusk and closing by noon.', x: 210, y: 92, d: 'M210 92c-28-22-58-6-52 22 6 28 38 30 52 12 14 18 46 16 52-12 6-28-24-44-52-22Z' },
  { id: 2, name: 'Stamen', note: 'Anthers dusted with a pale yellow pollen that rubs off on the finger.', x: 238, y: 150, d: 'M210 120c6 10 6 22 2 34M214 118c10 8 16 18 18 30' },
  { id: 3, name: 'Leaf', note: 'Lanceolate, veined in a pinnate pattern, edge finely serrate.', x: 120, y: 250, d: 'M210 200c-40-8-86 6-106 52 40 14 90 2 106-52Z M210 200c-30 6-60 24-86 48' },
  { id: 4, name: 'Stem', note: 'Hollow and ribbed, hairless below the first node.', x: 214, y: 330, d: 'M210 120c-10 70 6 150-4 240' },
  { id: 5, name: 'Root', note: 'A slender taproot with a few fibrous laterals.', x: 244, y: 392, d: 'M206 360c-14 18-26 30-34 42M206 360c8 22 22 34 40 40M206 360c0 16-2 30-8 42' },
]

export default function PlateCallouts() {
  const [on, setOn] = useState<number | null>(null)
  const part = PARTS.find((p) => p.id === on)

  return (
    <div className="grid gap-6 rounded-xl border border-[#c9b98f] bg-[#f3ead2] p-5 text-[#2b2418] md:grid-cols-[1fr_16rem]">
      <style>{`
        .pc-line { fill: none; stroke: #2b2418; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.25s, stroke-width 0.25s; stroke-dasharray: 700; stroke-dashoffset: 0; animation: pc-draw 1.6s ease-out both; }
        .pc-on { stroke: #a8402a; stroke-width: 3; }
        @keyframes pc-draw { from { stroke-dashoffset: 700; } }
        @media (prefers-reduced-motion: reduce) { .pc-line { animation: none; } }
      `}</style>
      <figure>
        <svg viewBox="0 0 420 430" className="mx-auto w-full max-w-md" role="group" aria-label="Botanical plate of a flowering plant with five numbered parts">
          <rect x="6" y="6" width="408" height="418" rx="2" fill="none" stroke="#2b2418" strokeWidth="1" />
          <rect x="14" y="14" width="392" height="402" rx="1" fill="none" stroke="#2b2418" strokeWidth="0.5" />
          {PARTS.map((p) => (
            <path key={p.id} d={p.d} className={`pc-line ${on === p.id ? 'pc-on' : ''}`} />
          ))}
          {PARTS.map((p) => (
            <g key={p.id}>
              <line x1={p.x} y1={p.y} x2={p.x + (p.x > 210 ? 70 : -70)} y2={p.y - 10} stroke="#2b2418" strokeWidth="0.7" />
              <foreignObject x={p.x + (p.x > 210 ? 62 : -102)} y={p.y - 30} width="40" height="40">
                <button
                  onPointerEnter={() => setOn(p.id)}
                  onPointerLeave={() => setOn(null)}
                  onFocus={() => setOn(p.id)}
                  onBlur={() => setOn(null)}
                  aria-label={`${p.id}. ${p.name}`}
                  className={`grid size-10 place-items-center rounded-full border text-sm font-semibold ${on === p.id ? 'border-[#a8402a] bg-[#a8402a] text-white' : 'border-[#2b2418] bg-[#f3ead2]'}`}
                >
                  {p.id}
                </button>
              </foreignObject>
            </g>
          ))}
          <text x="210" y="418" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#2b2418" style={{ fontFamily: 'var(--font-display)' }}>
            Plate XIV. Campanula, from a hedgerow near the river
          </text>
        </svg>
      </figure>
      <div>
        <ol className="space-y-1">
          {PARTS.map((p) => (
            <li key={p.id}>
              <button
                onPointerEnter={() => setOn(p.id)}
                onPointerLeave={() => setOn(null)}
                onFocus={() => setOn(p.id)}
                onBlur={() => setOn(null)}
                className={`min-h-11 w-full rounded px-2 text-left text-sm ${on === p.id ? 'bg-[#2b2418] text-[#f3ead2]' : 'hover:bg-black/5'}`}
              >
                <span className="font-semibold">{p.id}.</span> {p.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 min-h-24 border-t border-[#c9b98f] pt-3 text-xl leading-snug text-[#7a3523]" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }} aria-live="polite">
          {part ? part.note : 'Point at a number to read the field note.'}
        </p>
      </div>
    </div>
  )
}
