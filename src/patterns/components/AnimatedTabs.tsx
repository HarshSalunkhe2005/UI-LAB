import { useLayoutEffect, useRef, useState } from 'react'

/*
 * Tabs with a sliding indicator. The indicator measures the active tab
 * (offsetLeft/Width) and transitions to it. Full WAI-ARIA tabs pattern:
 * roving tabindex, arrow keys / Home / End, aria-controls + tabpanel.
 */

const TABS = [
  ['overview', 'Overview', 'A quick look at everything in one place.'],
  ['activity', 'Activity', 'Recent events across your workspace.'],
  ['settings', 'Settings', 'Preferences, members and billing.'],
  ['billing', 'Billing', 'Invoices and payment methods.'],
]

export default function AnimatedTabs() {
  const [i, setI] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const [bar, setBar] = useState({ x: 0, w: 0 })
  useLayoutEffect(() => {
    const el = refs.current[i]
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth })
  }, [i])

  const move = (n: number) => {
    const next = (n + TABS.length) % TABS.length
    setI(next)
    refs.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Sections" className="relative inline-flex rounded-full bg-surface-2 p-1"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') move(i + 1)
          if (e.key === 'ArrowLeft') move(i - 1)
          if (e.key === 'Home') move(0)
          if (e.key === 'End') move(TABS.length - 1)
        }}>
        <span aria-hidden className="absolute top-1 bottom-1 rounded-full bg-surface shadow-sm transition-all duration-300 ease-out-expo" style={{ left: bar.x, width: bar.w }} />
        {TABS.map(([id, label], n) => (
          <button
            key={id}
            ref={(el) => { refs.current[n] = el }}
            role="tab"
            id={`tab-${id}`}
            aria-selected={i === n}
            aria-controls={`panel-${id}`}
            tabIndex={i === n ? 0 : -1}
            onClick={() => setI(n)}
            className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${i === n ? 'text-fg' : 'text-fg-muted hover:text-fg'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {TABS.map(([id, label, body], n) => (
        <div key={id} role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} hidden={i !== n} className="mt-4 rounded-xl border border-border p-5">
          <h4 className="font-medium">{label}</h4>
          <p className="mt-1 text-sm text-fg-muted">{body}</p>
        </div>
      ))}
    </div>
  )
}
