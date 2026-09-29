import { useState } from 'react'
import { flushSync } from 'react-dom'

/*
 * Shared-element transition: the same `view-transition-name` on the card (grid)
 * and on the hero (detail) makes the browser morph one into the other.
 * flushSync makes React commit inside the transition callback so the browser
 * snapshots the new DOM, not the old one.
 */

const CARDS = [
  { id: 'dawn', title: 'Dawn', hue: 25 },
  { id: 'noon', title: 'Noon', hue: 50 },
  { id: 'dusk', title: 'Dusk', hue: 330 },
  { id: 'night', title: 'Night', hue: 240 },
  { id: 'rain', title: 'Rain', hue: 200 },
  { id: 'fog', title: 'Fog', hue: 160 },
]

const gradient = (hue: number) =>
  `linear-gradient(135deg, hsl(${hue} 85% 62%), hsl(${hue + 40} 75% 42%))`

function withTransition(update: () => void) {
  if (!document.startViewTransition) return update()
  document.startViewTransition(() => flushSync(update))
}

export default function ViewTransitionGrid() {
  const [open, setOpen] = useState<string | null>(null)
  const card = CARDS.find((c) => c.id === open)

  if (card) {
    return (
      <div>
        <button className="mb-4 text-sm text-fg-muted hover:text-fg" onClick={() => withTransition(() => setOpen(null))}>
          ← Back to grid
        </button>
        <div
          className="h-72 rounded-xl"
          style={{ background: gradient(card.hue), viewTransitionName: `card-${card.id}` }}
        />
        <h3 className="mt-6 text-3xl font-semibold" style={{ viewTransitionName: `title-${card.id}` }}>
          {card.title}
        </h3>
        <p className="mt-2 max-w-prose text-fg-muted">
          The block and heading above are the same elements you clicked. The browser tweens their size and position
          between the two layouts. Everything else cross-fades.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {CARDS.map((c) => (
        <button
          key={c.id}
          onClick={() => withTransition(() => setOpen(c.id))}
          className="group text-left"
        >
          <div
            className="aspect-[4/3] rounded-lg transition-transform duration-300 ease-out-expo group-hover:scale-[1.03]"
            style={{ background: gradient(c.hue), viewTransitionName: `card-${c.id}` }}
          />
          <span className="mt-2 inline-block font-medium" style={{ viewTransitionName: `title-${c.id}` }}>
            {c.title}
          </span>
        </button>
      ))}
    </div>
  )
}
