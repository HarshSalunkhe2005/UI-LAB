import type { ReactNode } from 'react'

/*
 * Cursor spotlight + subtle tilt. Pointer position is written to CSS vars
 * (no React state, so no re-renders); a radial gradient and transform read them.
 */
function track(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  el.style.setProperty('--x', `${x}px`)
  el.style.setProperty('--y', `${y}px`)
  el.style.setProperty('--rx', `${((y / r.height) - 0.5) * -6}deg`)
  el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 6}deg`)
}

function reset(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      onPointerMove={track}
      onPointerLeave={reset}
      className={`spot group relative overflow-hidden rounded-xl border border-border bg-surface p-6 ${className}`}
    >
      <style>{`
        .spot { transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform var(--dur-base) var(--ease-out-expo); }
        .spot::before {
          content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity var(--dur-base);
          background: radial-gradient(320px circle at var(--x) var(--y), color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%);
        }
        .spot:hover::before { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .spot { transform: none; } }
      `}</style>
      <div className="relative">{children}</div>
    </div>
  )
}

const FEATURES = [
  ['Tokens first', 'Every colour, radius and duration comes from one file.'],
  ['Live demos', 'Nothing gets in without a working example.'],
  ['Copy-paste', 'Each pattern is one file with no hidden dependencies.'],
]

export default function SpotlightDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {FEATURES.map(([t, d]) => (
        <SpotlightCard key={t}>
          <h4 className="font-medium">{t}</h4>
          <p className="mt-2 text-sm text-fg-muted">{d}</p>
        </SpotlightCard>
      ))}
    </div>
  )
}
