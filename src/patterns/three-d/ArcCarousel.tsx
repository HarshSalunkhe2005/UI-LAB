import { useState } from 'react'
import { img } from './_shared'

/*
 * Cards riding a very large circle whose top peeks into the frame. All cards
 * share one transform-origin at the circle's centre (far below), so
 * rotate() alone places AND tilts them tangent to the arc. The active card
 * sits upright at the apex.
 */

const N = 9
const STEP = 12

export default function ArcCarousel() {
  const [active, setActive] = useState(4)
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-72 w-full overflow-hidden" role="listbox" aria-label="Arc carousel" tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setActive((a) => Math.min(a + 1, N - 1))
          if (e.key === 'ArrowLeft') setActive((a) => Math.max(a - 1, 0))
        }}>
        {Array.from({ length: N }, (_, i) => {
          const o = i - active
          return (
            <button
              key={i}
              role="option"
              aria-selected={o === 0}
              tabIndex={-1}
              onClick={() => setActive(i)}
              className="absolute top-10 left-1/2 -ml-16 h-48 w-32 overflow-hidden rounded-xl shadow-lg transition-transform duration-700 ease-out-expo"
              style={{ transformOrigin: '50% 900px', transform: `rotate(${o * STEP}deg) scale(${o === 0 ? 1.08 : 0.92})`, zIndex: 20 - Math.abs(o) }}
            >
              <img src={img(i + 500, 260, 380)} alt={`Slide ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          )
        })}
      </div>
      <p className="font-mono text-xs text-fg-muted" aria-live="polite">{active + 1} / {N}</p>
    </div>
  )
}
