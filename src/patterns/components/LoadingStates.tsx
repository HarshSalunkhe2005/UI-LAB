import { useState } from 'react'

/*
 * The three states every data view needs: skeleton (loading), empty and
 * error, plus the loaded state, switchable in the demo. Skeletons use a
 * shimmer that stops under reduced motion; the container sets aria-busy
 * while loading and the error uses role="alert".
 */

const CSS = `
.skel { background: linear-gradient(90deg, var(--surface-2) 25%, var(--border) 37%, var(--surface-2) 63%); background-size: 400% 100%; animation: skel 1.4s ease infinite; border-radius: 6px; }
@keyframes skel { from { background-position: 100% 0 } to { background-position: 0 0 } }
@media (prefers-reduced-motion: reduce) { .skel { animation: none; } }
`

type S = 'loading' | 'empty' | 'error' | 'loaded'

export default function LoadingStates() {
  const [s, setS] = useState<S>('loading')
  return (
    <div className="space-y-4">
      <style>{CSS}</style>
      <div className="flex flex-wrap gap-2">
        {(['loading', 'empty', 'error', 'loaded'] as S[]).map((x) => (
          <button key={x} aria-pressed={s === x} onClick={() => setS(x)} className={`rounded-full border px-3 py-1 text-xs capitalize ${s === x ? 'border-fg bg-fg text-bg' : 'border-border text-fg-muted'}`}>{x}</button>
        ))}
      </div>
      <div aria-busy={s === 'loading'} className="min-h-56 rounded-xl border border-border p-4">
        {s === 'loading' && (
          <ul className="space-y-4" aria-label="Loading items">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="skel h-10 w-10 !rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skel h-3 w-1/3" />
                  <div className="skel h-3 w-2/3" />
                </div>
              </li>
            ))}
          </ul>
        )}
        {s === 'empty' && (
          <div className="grid h-48 place-items-center text-center">
            <div>
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-xl" aria-hidden>📭</div>
              <p className="font-medium">No projects yet</p>
              <p className="mt-1 text-sm text-fg-muted">Create one to get started.</p>
              <button className="mt-4 rounded-lg bg-fg px-4 py-2 text-sm text-bg">New project</button>
            </div>
          </div>
        )}
        {s === 'error' && (
          <div role="alert" className="grid h-48 place-items-center text-center">
            <div>
              <p className="font-medium text-danger">Couldn't load projects</p>
              <p className="mt-1 text-sm text-fg-muted">Network timeout after 10s.</p>
              <button onClick={() => setS('loading')} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm">Retry</button>
            </div>
          </div>
        )}
        {s === 'loaded' && (
          <ul className="divide-y divide-border">
            {['Aurora site', 'Checkout revamp', 'Mobile onboarding'].map((p, i) => (
              <li key={p} className="flex items-center gap-3 py-3">
                <span className="h-10 w-10 rounded-full" style={{ background: `hsl(${i * 80 + 200} 60% 55%)` }} />
                <div>
                  <p className="text-sm font-medium">{p}</p>
                  <p className="text-xs text-fg-muted">Updated {i + 2}h ago</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
