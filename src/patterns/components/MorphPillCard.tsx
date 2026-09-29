import { useState } from 'react'

/*
 * An avatar pill that grows into a full profile card. It is one element
 * whose width, height and radius animate between two sizes, with content
 * cross-fading inside, so the pill visibly becomes the card instead of a
 * second card appearing. Opens on hover or focus, toggles on click/Enter.
 */

export default function MorphPillCard() {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid h-80 place-items-center">
      <div
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label="Maya Chen, product designer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpen((o) => !o)}
        className="relative cursor-pointer overflow-hidden border border-border bg-surface shadow-md transition-all duration-500 ease-out-expo"
        style={{ width: open ? 300 : 190, height: open ? 260 : 52, borderRadius: open ? 20 : 999 }}
      >
        <div
          className="absolute flex items-center gap-3 transition-all duration-500 ease-out-expo"
          style={{ top: open ? 20 : 8, left: open ? 20 : 8 }}
        >
          <div
            className="shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-violet-600 transition-all duration-500 ease-out-expo"
            style={{ width: open ? 56 : 36, height: open ? 56 : 36 }}
          />
          <div>
            <p className="text-sm font-medium whitespace-nowrap">Maya Chen</p>
            <p className="text-xs whitespace-nowrap text-fg-muted">Product designer</p>
          </div>
        </div>
        <div
          className="absolute inset-x-5 bottom-5 space-y-4 transition-all duration-500"
          style={{ opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(10px)', transitionDelay: open ? '150ms' : '0ms' }}
          aria-hidden={!open}
        >
          <p className="text-sm text-fg-muted">Designing calm interfaces for noisy data. Previously at Linear.</p>
          <div className="grid grid-cols-3 text-center text-xs">
            {[['128', 'shots'], ['9.4k', 'followers'], ['312', 'following']].map(([n, l]) => (
              <div key={l}>
                <p className="font-medium text-fg">{n}</p>
                <p className="text-fg-muted">{l}</p>
              </div>
            ))}
          </div>
          <button tabIndex={open ? 0 : -1} className="w-full rounded-full bg-fg py-2 text-xs font-medium text-bg">
            Follow
          </button>
        </div>
      </div>
    </div>
  )
}
