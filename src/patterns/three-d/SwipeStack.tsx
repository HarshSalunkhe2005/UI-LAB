import { useState } from 'react'
import { img } from './_shared'

/*
 * Swipeable card stack. The top card follows the pointer with rotation
 * proportional to horizontal drag; past a threshold it flies off and the
 * next card scales up from the pile. Buttons + arrow keys do the same for
 * keyboard and screen-reader users, and the decision is announced.
 */

const PEOPLE = ['Ira', 'Dev', 'Noor', 'Arjun', 'Tara', 'Kian'].map((n, i) => ({ n, seed: i + 300 }))

export default function SwipeStack() {
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const [fly, setFly] = useState<0 | 1 | -1>(0)
  const [last, setLast] = useState('')

  const decide = (dir: 1 | -1) => {
    if (index >= PEOPLE.length) return
    setFly(dir)
    setLast(`${PEOPLE[index].n}: ${dir > 0 ? 'liked' : 'passed'}`)
    setTimeout(() => {
      setIndex((i) => i + 1)
      setFly(0)
      setDrag({ x: 0, y: 0, active: false })
    }, 280)
  }

  return (
    <div
      className="flex flex-col items-center gap-5"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') decide(1)
        if (e.key === 'ArrowLeft') decide(-1)
      }}
      aria-label="Card stack. Left arrow passes, right arrow likes."
    >
      <div className="relative h-80 w-60">
        {PEOPLE.slice(index, index + 3)
          .map((p, k) => {
            const top = k === 0
            const x = top ? (fly ? fly * 500 : drag.x) : 0
            const rot = top ? x * 0.06 : 0
            return (
              <div
                key={p.n}
                className={`absolute inset-0 overflow-hidden rounded-2xl bg-surface shadow-lg ${top ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(${x}px, ${top ? drag.y : k * 10}px) rotate(${rot}deg) scale(${1 - k * 0.05})`,
                  transition: drag.active && top ? 'none' : 'transform .3s var(--ease-out-expo)',
                  zIndex: 10 - k,
                }}
                onPointerDown={(e) => {
                  if (!top) return
                  e.currentTarget.setPointerCapture(e.pointerId)
                  setDrag({ x: 0, y: 0, active: true })
                  ;(e.currentTarget as HTMLElement).dataset.sx = String(e.clientX)
                  ;(e.currentTarget as HTMLElement).dataset.sy = String(e.clientY)
                }}
                onPointerMove={(e) => {
                  if (!top || !drag.active) return
                  const el = e.currentTarget as HTMLElement
                  setDrag({ x: e.clientX - Number(el.dataset.sx), y: (e.clientY - Number(el.dataset.sy)) * 0.3, active: true })
                }}
                onPointerUp={() => {
                  if (!top) return
                  if (Math.abs(drag.x) > 100) decide(drag.x > 0 ? 1 : -1)
                  else setDrag({ x: 0, y: 0, active: false })
                }}
                aria-hidden={!top}
              >
                <img src={img(p.seed, 400, 540)} alt="" draggable={false} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4 text-white">
                  <p className="text-xl font-semibold">{p.n}</p>
                </div>
                {top && (
                  <>
                    <span className="absolute top-5 left-5 rounded-md border-2 border-green-400 px-2 font-bold text-green-400" style={{ opacity: Math.max(0, x / 100) }}>LIKE</span>
                    <span className="absolute top-5 right-5 rounded-md border-2 border-red-400 px-2 font-bold text-red-400" style={{ opacity: Math.max(0, -x / 100) }}>NOPE</span>
                  </>
                )}
              </div>
            )
          })
          .reverse()}
        {index >= PEOPLE.length && (
          <button onClick={() => setIndex(0)} className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed border-border text-sm text-fg-muted">
            ↻ Start over
          </button>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={() => decide(-1)} className="rounded-full border border-border px-5 py-2 text-sm" aria-label="Pass">✕</button>
        <button onClick={() => decide(1)} className="rounded-full bg-fg px-5 py-2 text-sm text-bg" aria-label="Like">♥</button>
      </div>
      <p aria-live="polite" className="h-4 font-mono text-xs text-fg-muted">{last}</p>
    </div>
  )
}
