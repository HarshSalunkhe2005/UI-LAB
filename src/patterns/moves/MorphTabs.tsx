import { useLayoutEffect, useRef, useState } from 'react'

/*
 * Signature move (Arc): a tab bar whose highlight is one shape that moves and changes colour, not a class
 * that toggles. The pill covers the whole bar and a clip-path window (measured from the active tab) is what
 * slides, so only paint changes, never layout; each tab carries a colour the pill takes on. Proper tablist semantics with arrow-key navigation (roving tabindex).
 * Reduced motion: the pill jumps.
 */

const TABS = [
  { id: 'space', label: 'Spaces', color: '#4d57ff', body: 'Group tabs by context so work and life never share a row.' },
  { id: 'split', label: 'Split view', color: '#ff7a59', body: 'Two pages side by side, without a second window.' },
  { id: 'easel', label: 'Easels', color: '#1fb589', body: 'A canvas to collect pages, notes and images.' },
  { id: 'boost', label: 'Boosts', color: '#c453ff', body: 'Restyle any site with your own colours and fonts.' },
]

export default function MorphTabs() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const list = useRef<HTMLDivElement>(null)
  const [clip, setClip] = useState('inset(4px 100% 4px 0 round 9999px)')

  useLayoutEffect(() => {
    const el = refs.current[active]
    const box = list.current
    if (el && box) setClip(`inset(4px ${box.clientWidth - el.offsetLeft - el.offsetWidth}px 4px ${el.offsetLeft}px round 9999px)`)
  }, [active])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1
    if (n < 0) return
    e.preventDefault()
    setActive(n)
    refs.current[n]?.focus()
  }

  return (
    <div className="mx-auto max-w-xl">
      <div ref={list} role="tablist" aria-label="Arc features" className="relative flex gap-1 rounded-full border border-border bg-surface p-1">
        <span
          aria-hidden
          className="absolute inset-0 motion-reduce:transition-none"
          style={{ clipPath: clip, background: TABS[active].color, transition: 'clip-path 380ms var(--ease-out-expo), background 380ms' }}
        />
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el }}
            role="tab"
            id={`mt-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`mt-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative z-10 min-h-11 flex-1 rounded-full px-3 text-sm font-medium transition-colors ${i === active ? 'text-white' : 'text-fg-muted hover:text-fg'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`mt-panel-${TABS[active].id}`} aria-labelledby={`mt-tab-${TABS[active].id}`} className="mt-4 rounded-xl border border-border bg-surface p-5 text-fg-muted">
        {TABS[active].body}
      </div>
    </div>
  )
}
