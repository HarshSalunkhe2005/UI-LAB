/*
 * Eight link hover styles in pure CSS: grow-from-left underline, centre
 * out, strike-through swap, highlighter marker, text roll (duplicate slides
 * up), arrow nudge, double line, and colour fill sweep. Each is a class you
 * can drop on an <a>. All keep a visible focus state.
 */

const CSS = `
.lk { position: relative; text-decoration: none; display: inline-block; }
.lk:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
.lk-grow::after { content: ''; position: absolute; left: 0; bottom: -2px; height: 2px; width: 100%; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .45s var(--ease-out-expo); }
.lk-grow:hover::after, .lk-grow:focus-visible::after { transform: scaleX(1); transform-origin: left; }
.lk-center::after { content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 2px; background: var(--accent); transform: scaleX(0); transition: transform .35s var(--ease-out-expo); }
.lk-center:hover::after, .lk-center:focus-visible::after { transform: scaleX(1); }
.lk-strike::before { content: ''; position: absolute; left: 0; top: 55%; height: 2px; width: 100%; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--ease-out-expo); }
.lk-strike:hover::before { transform: scaleX(1); }
.lk-mark { background: linear-gradient(transparent 55%, color-mix(in oklab, var(--accent) 45%, transparent) 55%) no-repeat 0 0 / 0% 100%; transition: background-size .5s var(--ease-out-expo); }
.lk-mark:hover, .lk-mark:focus-visible { background-size: 100% 100%; }
.lk-roll { overflow: hidden; vertical-align: bottom; }
.lk-roll span { display: block; transition: transform .45s var(--ease-out-expo); }
.lk-roll span::after { content: attr(data-t); position: absolute; left: 0; top: 100%; color: var(--accent); }
.lk-roll:hover span, .lk-roll:focus-visible span { transform: translateY(-100%); }
.lk-arrow::after { content: '→'; display: inline-block; margin-left: .35em; transition: transform .3s var(--ease-out-expo); }
.lk-arrow:hover::after { transform: translateX(6px); }
.lk-double::before, .lk-double::after { content: ''; position: absolute; left: 0; height: 1px; width: 100%; background: currentColor; transform: scaleX(0); transition: transform .4s var(--ease-out-expo); }
.lk-double::before { top: -3px; transform-origin: right; } .lk-double::after { bottom: -3px; transform-origin: left; }
.lk-double:hover::before, .lk-double:hover::after { transform: scaleX(1); }
.lk-fill { background: linear-gradient(90deg, var(--accent) 50%, var(--fg) 50%) 100% 0 / 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; transition: background-position .5s var(--ease-out-expo); }
.lk-fill:hover, .lk-fill:focus-visible { background-position: 0 0; }
@media (prefers-reduced-motion: reduce) { .lk, .lk *, .lk::before, .lk::after { transition: none !important; } }
`

const STYLES: [string, string][] = [
  ['lk-grow', 'Grow underline'], ['lk-center', 'Centre out'], ['lk-strike', 'Strike through'], ['lk-mark', 'Highlighter'],
  ['lk-roll', 'Text roll'], ['lk-arrow', 'Arrow nudge'], ['lk-double', 'Double line'], ['lk-fill', 'Colour sweep'],
]

export default function LinkHoverEffects() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <style>{CSS}</style>
      {STYLES.map(([cls, label]) => (
        <div key={cls} className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <a href="#" onClick={(e) => e.preventDefault()} className={`lk ${cls} text-2xl font-medium`} data-t={label}>
            {cls === 'lk-roll' ? <span data-t={label}>{label}</span> : label}
          </a>
          <code className="font-mono text-[11px] text-fg-muted">.{cls}</code>
        </div>
      ))}
    </div>
  )
}
