import { useState } from 'react'

/*
 * 3D flip card: two faces back-to-back (backface-visibility: hidden), the
 * inner wrapper rotates 180° on Y. Flips on hover for pointers and on
 * click/Enter for everyone; the hidden face is aria-hidden so screen
 * readers only get the visible side.
 */

export function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false)
  const face = 'absolute inset-0 rounded-2xl [backface-visibility:hidden]'
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      className="group relative h-64 w-48 text-left [perspective:900px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-out-expo [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]'}`}
      >
        <div className={face} aria-hidden={flipped}>{front}</div>
        <div className={`${face} [transform:rotateY(180deg)]`} aria-hidden={!flipped}>{back}</div>
      </div>
    </button>
  )
}

export default function FlipCardDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {[['Aurora', 160], ['Ember', 20], ['Tide', 200]].map(([t, h]) => (
        <FlipCard
          key={t}
          front={
            <div className="flex h-full flex-col justify-end rounded-2xl p-4 text-white" style={{ background: `linear-gradient(160deg, hsl(${h} 80% 60%), hsl(${Number(h) + 40} 70% 25%))` }}>
              <p className="font-display text-3xl italic">{t}</p>
              <p className="font-mono text-[11px] opacity-70">hover / tap to flip</p>
            </div>
          }
          back={
            <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm text-fg-muted">A short description lives on the back, with an action.</p>
              <span className="rounded-full bg-fg px-3 py-1.5 text-center text-xs text-bg">View {t}</span>
            </div>
          }
        />
      ))}
    </div>
  )
}
