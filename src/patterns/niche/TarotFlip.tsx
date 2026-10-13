import { useState } from 'react'

/*
 * Niche world: Tarot Deck. Three illustrated cards on a velvet table. Each is a button: press (or Enter/Space)
 * to turn it over in 3D, revealing a glyph and its reading; the back shows a patterned cover. The reading is
 * real text, present in the DOM whether or not the card is turned (hidden from assistive tech until turned),
 * and a "Reshuffle" button deals a new draw. Reduced motion: the card swaps faces without turning.
 */

const DECK = [
  { name: 'The Lantern', glyph: <path d="M60 20v14M44 40h32l-4 44H48zM50 84v8M70 84v8M52 56h16" />, text: 'A small light is enough. Move toward it before the path is clear.' },
  { name: 'The Tide', glyph: <path d="M16 70c14-16 28 16 44 0s30 16 44 0M16 50c14-16 28 16 44 0s30 16 44 0M16 90c14-16 28 16 44 0s30 16 44 0" />, text: 'What returns was never gone. Wait for the water to decide.' },
  { name: 'The Key', glyph: <path d="M60 24a14 14 0 1 1 0 28 14 14 0 0 1 0-28ZM60 52v44M60 78h14M60 92h10" />, text: 'You already hold the thing you are asking for. Try the door.' },
  { name: 'The Orchard', glyph: <path d="M60 96V58M60 58c-22 0-30-26-8-34 6-12 28-12 32 4 14 8 8 30-24 30ZM44 34l2 0M72 40l2 0" />, text: 'Slow work, tended daily, comes to fruit without announcement.' },
  { name: 'The Bridge', glyph: <path d="M10 80h100M20 80c0-34 80-34 80 0M36 56v24M60 48v32M84 56v24" />, text: 'Between two certainties there is a crossing that asks only that you walk.' },
]

function draw() {
  return [...DECK].sort(() => Math.random() - 0.5).slice(0, 3)
}

export default function TarotFlip() {
  const [hand, setHand] = useState(() => draw())
  const [turned, setTurned] = useState<Set<string>>(new Set())

  return (
    <div className="rounded-xl border border-[#3a1f2e] p-6" style={{ background: 'radial-gradient(circle at 50% 30%, #4a1f3a, #1e0f1a)' }}>
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {hand.map((c) => {
          const on = turned.has(c.name)
          return (
            <button
              key={c.name}
              aria-pressed={on}
              aria-label={on ? `${c.name}: ${c.text}` : 'Face-down card. Press to turn over.'}
              onClick={() => setTurned((t) => new Set(t).add(c.name))}
              className="group [perspective:900px]"
            >
              <span className="relative block aspect-[2/3] w-full transition-transform duration-700 [transform-style:preserve-3d] motion-reduce:transition-none" style={{ transform: on ? 'rotateY(180deg)' : 'none' }}>
                <span className="absolute inset-0 grid place-items-center rounded-lg border-2 border-[#d9b66a] [backface-visibility:hidden]" style={{ background: 'repeating-conic-gradient(from 0deg, #3a1530 0 15deg, #4d1d40 15deg 30deg)' }} aria-hidden>
                  <span className="size-10 rotate-45 border-2 border-[#d9b66a]" />
                </span>
                <span className="absolute inset-0 flex flex-col items-center justify-between rounded-lg border-2 border-[#d9b66a] bg-[#f1e4c4] p-2 text-[#2b1530] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="font-display text-sm italic sm:text-base" style={{ fontFamily: 'var(--font-display, serif)' }}>{c.name}</span>
                  <svg viewBox="0 0 120 110" className="w-3/4" fill="none" stroke="#2b1530" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{c.glyph}</svg>
                  <span className="hidden text-center text-[10px] leading-snug sm:block">{c.text}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <button onClick={() => { setHand(draw()); setTurned(new Set()) }} className="mx-auto mt-6 block min-h-11 rounded border border-[#d9b66a] px-5 text-sm text-[#f1e4c4] hover:bg-white/10">Reshuffle</button>
    </div>
  )
}
