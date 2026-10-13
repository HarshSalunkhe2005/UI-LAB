import { useState } from 'react'

/*
 * Niche world: CRT Arcade. The phosphor look in CSS only: scanlines (a repeating gradient overlay), a soft
 * vignette, text glow, slight screen curvature from border-radius and an inset shadow, and an optional flicker.
 * The overlay is pointer-events none and aria-hidden, so the content underneath stays normal accessible text
 * and the effect can be toggled. Reduced motion: no flicker (the static scanlines remain).
 */

export default function CrtScanlines() {
  const [crt, setCrt] = useState(true)
  const [pick, setPick] = useState(0)
  const items = ['START GAME', 'HIGH SCORES', 'OPTIONS', 'INSERT COIN']

  return (
    <div>
      <style>{`
        .crt-screen { position: relative; background: #07130a; color: #5dff7a; font: 500 18px/1.6 var(--font-mono, monospace); border-radius: 26px / 20px; overflow: hidden; box-shadow: inset 0 0 90px rgba(0,0,0,0.85), 0 0 0 10px #222, 0 0 0 12px #111; }
        .crt-on .crt-text { text-shadow: 0 0 6px rgba(93,255,122,0.8), 0 0 18px rgba(93,255,122,0.35); }
        .crt-fx { pointer-events: none; position: absolute; inset: 0; background: repeating-linear-gradient(to bottom, rgba(0,0,0,0.28) 0, rgba(0,0,0,0.28) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%); animation: crt-flick 4s steps(2) infinite; }
        @keyframes crt-flick { 0%, 94%, 100% { opacity: 1; } 96% { opacity: 0.86; } }
        @media (prefers-reduced-motion: reduce) { .crt-fx { animation: none; } }
      `}</style>
      <div className={`crt-screen mx-auto max-w-xl p-8 ${crt ? 'crt-on' : ''}`}>
        <p className="crt-text text-3xl tracking-[0.2em]">ARCADE 84</p>
        <ul className="crt-text mt-6 space-y-1" role="listbox" aria-label="Main menu" tabIndex={0} onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setPick((p) => Math.min(items.length - 1, p + 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setPick((p) => Math.max(0, p - 1)) }
        }} aria-activedescendant={`crt-${pick}`}>
          {items.map((t, i) => (
            <li key={t} id={`crt-${i}`} role="option" aria-selected={i === pick} onClick={() => setPick(i)} className="min-h-9 cursor-pointer">
              {i === pick ? '> ' : '  '}{t}
            </li>
          ))}
        </ul>
        <p className="crt-text mt-6 text-sm opacity-70">HI-SCORE 048210 · CREDITS 02</p>
        {crt && <div className="crt-fx" aria-hidden />}
      </div>
      <button onClick={() => setCrt((c) => !c)} aria-pressed={crt} className="mx-auto mt-5 block min-h-11 rounded-md border border-border px-4 text-sm text-fg-muted hover:text-fg">
        CRT effect: {crt ? 'on' : 'off'}
      </button>
    </div>
  )
}
