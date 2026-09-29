import type { ComponentType } from 'react'
import { MeshGradient } from './patterns/recipes/MeshGradient'

/*
 * Tiny, always-running thumbnails for the home grid. Each one hints at
 * what the pattern does without mounting the full demo.
 */

const CSS = `
@keyframes pv-rise { 0%,15% { opacity: 0; transform: translateY(14px); } 45%,100% { opacity: 1; transform: none; } }
@keyframes pv-grow { 0%,20% { inset: 38% 38% 38% 38%; border-radius: 8px; } 55%,80% { inset: 14%; border-radius: 12px; } 100% { inset: 38% 38% 38% 38%; border-radius: 8px; } }
@keyframes pv-press { 0%,40%,100% { transform: scale(1); } 50% { transform: scale(0.94); } 60% { transform: scale(1.02); } }
@keyframes pv-count { from { --n: 0; } to { --n: 97; } }
@keyframes pv-cursor { 0%,100% { transform: translateY(0); } 50% { transform: translateY(22px); } }
@property --n { syntax: '<integer>'; inherits: false; initial-value: 0; }
.pv-count { animation: pv-count 2.4s var(--ease-out-expo) infinite alternate; counter-reset: n var(--n); }
.pv-count::after { content: counter(n) '%'; }
@media (prefers-reduced-motion: reduce) { .pv * { animation: none !important; } }
`

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="pv relative h-full w-full overflow-hidden">
    <style>{CSS}</style>
    {children}
  </div>
)

const Tokens = () => (
  <Frame>
    <div className="absolute inset-0 grid grid-cols-4 gap-1.5 p-5">
      {['--accent', '--fg', '--success', '--warning', '--danger', '--surface-2', '--border', '--accent-soft'].map((c) => (
        <div key={c} className="rounded-sm" style={{ background: `var(${c})` }} />
      ))}
    </div>
  </Frame>
)

const Buttons = () => (
  <Frame>
    <div className="absolute inset-0 flex items-center justify-center gap-2">
      <span className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-accent-fg" style={{ animation: 'pv-press 2s infinite' }}>
        Primary
      </span>
      <span className="rounded-md border border-border px-4 py-2 text-xs">Secondary</span>
    </div>
  </Frame>
)

const Reveal = () => (
  <Frame>
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-5 rounded-sm border border-border bg-surface"
          style={{ animation: `pv-rise 2.4s ${i * 0.25}s var(--ease-out-expo) infinite` }}
        />
      ))}
    </div>
  </Frame>
)

const ViewTransition = () => (
  <Frame>
    <div
      className="absolute"
      style={{
        background: 'linear-gradient(135deg, hsl(330 85% 62%), hsl(10 75% 52%))',
        animation: 'pv-grow 3.2s var(--ease-out-expo) infinite',
      }}
    />
  </Frame>
)

const Count = () => (
  <Frame>
    <div className="absolute inset-0 grid place-items-center">
      <span className="pv-count font-display text-5xl tabular-nums" />
    </div>
  </Frame>
)

const Mesh = () => (
  <Frame>
    <MeshGradient />
  </Frame>
)

const Palette = () => (
  <Frame>
    <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-md border border-border bg-surface p-1.5 shadow-md">
      <div className="mb-1 h-4 w-2/3 rounded-sm bg-surface-2" />
      <div className="relative space-y-1">
        <div className="absolute inset-x-0 top-0 h-4 rounded-sm bg-accent-soft" style={{ animation: 'pv-cursor 2s var(--ease-in-out) infinite' }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative h-4 w-1/2 translate-x-1 scale-y-50 rounded-sm bg-fg-muted/30" style={{ marginTop: i ? 6 : 0 }} />
        ))}
      </div>
    </div>
  </Frame>
)

export const PREVIEWS: Record<string, ComponentType> = {
  tokens: Tokens,
  buttons: Buttons,
  'scroll-reveal': Reveal,
  'view-transition-grid': ViewTransition,
  'count-up': Count,
  'mesh-gradient': Mesh,
  'command-palette': Palette,
}
