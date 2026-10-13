import { useId, useRef, type SyntheticEvent } from 'react'

/*
 * Modern CSS: a menu with the native Popover API and @starting-style. The browser handles open and close, light
 * dismiss (click outside, Esc), top-layer stacking and focus return; CSS animates entry and exit, including
 * display:none via `transition-behavior: allow-discrete`. Where popover is unsupported the button does nothing
 * visible, so ship a non-popover fallback if you target older browsers.
 */

const CSS = `
.pop-menu { margin: 0; inset: unset; padding: .35rem; min-width: 12rem; border-radius: .75rem; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-fg); box-shadow: 0 12px 40px rgb(0 0 0 / .25); }
.pop-menu a { display: block; padding: .5rem .75rem; border-radius: .5rem; font-size: .875rem; }
.pop-menu a:hover, .pop-menu a:focus-visible { background: var(--color-surface-2); }
@media (prefers-reduced-motion: no-preference) {
  .pop-menu { transition: opacity .18s ease, transform .18s ease, display .18s allow-discrete, overlay .18s allow-discrete; opacity: 0; transform: translateY(-6px) scale(.98); }
  .pop-menu:popover-open { opacity: 1; transform: none; }
  @starting-style { .pop-menu:popover-open { opacity: 0; transform: translateY(-6px) scale(.98); } }
}
`

export default function PopoverStarting() {
  const id = useId().replace(/:/g, '')
  const btn = useRef<HTMLButtonElement>(null)
  // The popover lives in the top layer, so place it from the trigger's rect each time it opens.
  const place = (e: SyntheticEvent<HTMLDivElement>) => {
    if ((e.nativeEvent as unknown as { newState?: string }).newState !== 'open' || !btn.current) return
    const r = btn.current.getBoundingClientRect()
    e.currentTarget.style.top = `${r.bottom + 6}px`
    e.currentTarget.style.left = `${r.left}px`
  }
  return (
    <div className="flex min-h-56 items-start justify-center p-6">
      <style>{CSS}</style>
      <button ref={btn} popoverTarget={id} className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2">
        Open menu
      </button>
      <div id={id} popover="auto" className="pop-menu" onToggle={place} style={{ position: 'fixed' }}>
        <a href="#pop" onClick={(e) => e.preventDefault()}>Rename</a>
        <a href="#pop" onClick={(e) => e.preventDefault()}>Duplicate</a>
        <a href="#pop" onClick={(e) => e.preventDefault()}>Archive</a>
      </div>
    </div>
  )
}
