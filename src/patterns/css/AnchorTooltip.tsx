import { useId } from 'react'

/*
 * Modern CSS: anchor positioning. A tooltip is tied to its trigger with `anchor-name` / `position-anchor` /
 * `position-area`, and flips to the other side by itself when it would leave the viewport (`position-try-fallbacks`).
 * No measuring code. Without support the tooltip is simply shown under the button as normal flow text.
 */

const CSS = `
.anc-wrap { display: inline-block; }
.anc-tip { margin-top: .5rem; padding: .4rem .65rem; border-radius: .5rem; background: var(--color-fg); color: var(--color-bg); font-size: .75rem; max-width: 16rem; }
@supports (anchor-name: --a) {
  .anc-btn { anchor-name: --anc; }
  .anc-tip { margin: 0; position: fixed; position-anchor: --anc; position-area: top; position-try-fallbacks: flip-block; margin-block: .5rem; inset: auto; opacity: 0; pointer-events: none; transition: opacity .15s ease; }
  .anc-wrap:hover .anc-tip, .anc-btn:focus-visible + .anc-tip { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) { .anc-tip { transition: none; } }
`

export default function AnchorTooltip() {
  const id = useId()
  return (
    <div className="grid min-h-56 place-items-center p-6">
      <style>{CSS}</style>
      <span className="anc-wrap">
        <button className="anc-btn rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2" aria-describedby={id}>
          Hover or focus me
        </button>
        <span id={id} role="tooltip" className="anc-tip">Placed by the browser next to its anchor, and flipped if there is no room.</span>
      </span>
    </div>
  )
}
