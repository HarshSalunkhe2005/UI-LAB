import { useState } from 'react'

/*
 * Animated toggle icons: hamburger ↔ close (three bars rotate/fade),
 * heart like with a burst ring, bookmark fill, play ↔ pause morph, and a
 * self-drawing checkmark. Each is a button with aria-pressed and an
 * accessible label; motion collapses to instant under reduced motion.
 */

const CSS = `
.ai * { transition: transform .4s var(--ease-out-expo), opacity .3s, stroke-dashoffset .5s var(--ease-out-expo), fill .3s, d .35s var(--ease-out-expo); }
.ai .ring { transform-origin: center; transform: scale(0); opacity: 0; }
.ai[aria-pressed=true] .ring { animation: ring .6s var(--ease-out-expo); }
@keyframes ring { 0% { transform: scale(.4); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
.ai[aria-pressed=true] .pop { animation: pop .45s var(--ease-spring); }
@keyframes pop { 0% { transform: scale(.6); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .ai *, .ai .ring, .ai .pop { transition: none !important; animation: none !important; } }
`

function Toggle({ label, children }: { label: string; children: (on: boolean) => React.ReactNode }) {
  const [on, setOn] = useState(false)
  return (
    <button aria-label={label} aria-pressed={on} onClick={() => setOn(!on)} className="ai grid h-16 w-16 place-items-center rounded-2xl border border-border hover:bg-surface-2">
      <svg viewBox="0 0 24 24" className="h-7 w-7 overflow-visible" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children(on)}
      </svg>
    </button>
  )
}

export default function AnimatedIcons() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      <style>{CSS}</style>
      <Toggle label="Menu">
        {(on) => (
          <>
            <line x1="4" y1="6" x2="20" y2="6" style={{ transformOrigin: '12px 12px', transform: on ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <line x1="4" y1="12" x2="20" y2="12" style={{ opacity: on ? 0 : 1 }} />
            <line x1="4" y1="18" x2="20" y2="18" style={{ transformOrigin: '12px 12px', transform: on ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </>
        )}
      </Toggle>
      <Toggle label="Like">
        {(on) => (
          <>
            <circle className="ring" cx="12" cy="12" r="10" stroke="#f43f5e" />
            <path className="pop" style={{ transformOrigin: 'center' }} fill={on ? '#f43f5e' : 'none'} stroke={on ? '#f43f5e' : 'currentColor'} d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z" />
          </>
        )}
      </Toggle>
      <Toggle label="Bookmark">
        {(on) => <path className="pop" style={{ transformOrigin: 'center' }} fill={on ? 'currentColor' : 'none'} d="M6 3h12v18l-6-4-6 4z" />}
      </Toggle>
      <Toggle label="Play">
        {(on) => (
          <path
            fill="currentColor"
            stroke="none"
            style={{ d: `path('${on ? 'M6 4h4v16H6zM14 4h4v16h-4z' : 'M6 4l7 4v8l-7 4zM13 8l7 4-7 4z'}')` } as React.CSSProperties}
          />
        )}
      </Toggle>
      <Toggle label="Done">
        {(on) => (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M7 12.5l3.2 3.2L17 9" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1 }} />
          </>
        )}
      </Toggle>
    </div>
  )
}
