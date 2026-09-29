import { useState } from 'react'

/*
 * A hand of cards splayed from a pivot below the deck. Every card uses the
 * same transform-origin (far below its bottom edge) and a single rotate(),
 * so the fan geometry falls out of one number per card. The focused card
 * lifts out of the spread. Arrow keys move focus; each card is a button.
 */

const CARDS = [
  { t: 'Strategy', c: '#f97316' },
  { t: 'Research', c: '#eab308' },
  { t: 'Design', c: '#84cc16' },
  { t: 'Build', c: '#06b6d4' },
  { t: 'Launch', c: '#8b5cf6' },
  { t: 'Grow', c: '#ec4899' },
]

export default function FanDeck() {
  const [active, setActive] = useState(2)
  const mid = (CARDS.length - 1) / 2
  return (
    <div
      className="relative mx-auto h-80 w-full max-w-lg"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') setActive((a) => Math.min(a + 1, CARDS.length - 1))
        if (e.key === 'ArrowLeft') setActive((a) => Math.max(a - 1, 0))
      }}
    >
      {CARDS.map((card, i) => {
        const on = i === active
        const angle = (i - mid) * 9
        return (
          <button
            key={card.t}
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
            aria-pressed={on}
            className="absolute bottom-6 left-1/2 flex h-56 w-40 -ml-20 flex-col justify-between rounded-2xl border border-black/10 p-4 text-left text-black shadow-lg transition-transform duration-500 ease-out-expo"
            style={{
              background: card.c,
              transformOrigin: '50% 260%',
              transform: `rotate(${angle}deg) translateY(${on ? -36 : 0}px) scale(${on ? 1.06 : 1})`,
              zIndex: on ? 10 : i,
            }}
          >
            <span className="font-mono text-[11px] opacity-70">0{i + 1}</span>
            <span className="font-display text-3xl italic">{card.t}</span>
          </button>
        )
      })}
    </div>
  )
}
