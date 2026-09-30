import { useId } from 'react'

/*
 * Text input effects: floating label (label shrinks to the top when focused
 * or filled, via :placeholder-shown), line-draw underline, and a boxed
 * "border trace" style. Real <label>s; the trick needs placeholder=" " so
 * :placeholder-shown can detect empty.
 */

const CSS = `
.fl { position: relative; }
.fl input { width: 100%; background: transparent; outline: none; padding: 1.25rem .75rem .5rem; border: 1px solid var(--border); border-radius: 10px; transition: border-color .2s; }
.fl label { position: absolute; left: .75rem; top: .9rem; color: var(--fg-muted); pointer-events: none; transform-origin: left; transition: transform .25s var(--ease-out-expo), color .2s; }
.fl input:focus { border-color: var(--accent); }
.fl input:focus + label, .fl input:not(:placeholder-shown) + label { transform: translateY(-.6rem) scale(.78); color: var(--accent); }

.ul { position: relative; padding-top: 1.2rem; }
.ul input { width: 100%; background: transparent; outline: none; border: 0; border-bottom: 1px solid var(--border); padding: .4rem 0; }
.ul label { position: absolute; left: 0; top: 1.6rem; color: var(--fg-muted); pointer-events: none; transition: all .25s var(--ease-out-expo); }
.ul .bar { position: absolute; left: 0; bottom: 0; height: 2px; width: 100%; background: var(--accent); transform: scaleX(0); transition: transform .4s var(--ease-out-expo); }
.ul input:focus ~ .bar { transform: scaleX(1); }
.ul input:focus ~ label, .ul input:not(:placeholder-shown) ~ label { top: 0; font-size: .75rem; color: var(--accent); }

.tr { position: relative; }
.tr input { width: 100%; background: var(--surface); outline: none; border: 0; padding: .9rem .9rem; border-radius: 0; }
.tr svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.tr rect { fill: none; stroke: var(--accent); stroke-width: 2; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s var(--ease-out-expo); }
.tr .base { stroke: var(--border); stroke-dashoffset: 0; stroke-width: 1; }
.tr input:focus ~ svg rect:not(.base) { stroke-dashoffset: 0; }
@media (prefers-reduced-motion: reduce) { .fl *, .ul *, .tr * { transition: none !important; } }
`

export default function FloatingInputs() {
  const a = useId(), b = useId(), c = useId()
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <style>{CSS}</style>
      <div className="fl">
        <input id={a} placeholder=" " />
        <label htmlFor={a}>Floating label</label>
      </div>
      <div className="ul">
        <input id={b} placeholder=" " />
        <label htmlFor={b}>Underline draw</label>
        <span className="bar" aria-hidden />
      </div>
      <div className="tr">
        <label htmlFor={c} className="mb-1.5 block text-sm text-fg-muted">Border trace</label>
        <div className="relative">
          <input id={c} placeholder="Type here" />
          <svg aria-hidden preserveAspectRatio="none"><rect className="base" x="0" y="0" width="100%" height="100%" pathLength={1} /><rect x="0" y="0" width="100%" height="100%" pathLength={1} /></svg>
        </div>
      </div>
    </div>
  )
}
