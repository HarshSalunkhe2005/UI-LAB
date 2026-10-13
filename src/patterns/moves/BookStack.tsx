import { useState } from 'react'

/*
 * Signature move (Stripe Press): the shelf is the menu. Covers are stacked like a pile of books; the one you
 * point at (or focus) slides out of the stack and the rest make room, so each title is read at full size
 * without leaving the page. Covers are real buttons in a list. Reduced motion: no slide, only a highlight.
 */

const BOOKS = [
  { title: 'High Growth Handbook', by: 'Elad Gil', color: '#2d4a6b', w: 92 },
  { title: 'Maintenance', by: 'Stewart Brand', color: '#8a6320', w: 100 },
  { title: 'The Dream Machine', by: 'M. Mitchell Waldrop', color: '#7a2e3a', w: 88 },
  { title: 'Scaling People', by: 'Claire Hughes Johnson', color: '#3a6b52', w: 96 },
  { title: 'Poor Charlie’s Almanack', by: 'Charles T. Munger', color: '#1f2a44', w: 100 },
]

export default function BookStack() {
  const [out, setOut] = useState<number | null>(null)
  return (
    <div className="mx-auto flex max-w-md flex-col items-stretch rounded-xl border border-border bg-[#201819] p-6" onPointerLeave={() => setOut(null)}>
      <ul className="flex flex-col items-center gap-1">
        {BOOKS.map((b, i) => {
          const isOut = out === i
          return (
            <li key={b.title} style={{ transform: isOut ? 'translateX(36px) rotate(-1.5deg)' : 'none', transition: 'transform 420ms var(--ease-out-expo)', width: `${b.w}%` }} className="motion-reduce:!transition-none">
              <button
                onPointerEnter={() => setOut(i)}
                onFocus={() => setOut(i)}
                onBlur={() => setOut(null)}
                className="flex min-h-14 w-full items-center justify-between rounded-sm px-4 text-left text-sm text-white/90 shadow-md outline-offset-2 focus-visible:outline-2"
                style={{ background: b.color, boxShadow: isOut ? '0 12px 24px rgb(0 0 0 / 0.5)' : '0 2px 4px rgb(0 0 0 / 0.4)' }}
              >
                <span className="font-display text-base italic">{b.title}</span>
                <span className="font-mono text-[10px]">{b.by}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
