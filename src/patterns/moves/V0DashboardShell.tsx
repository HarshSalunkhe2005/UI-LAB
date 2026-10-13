import { useState } from 'react'

/*
 * Vibe-coded move (Dashboard M.O.N.K.Y, v0): an app shell that makes room. A collapsible sidebar (labels and
 * icons <-> icons only), a top bar with view tabs, and a slide-in chat panel. Collapse state is a button with
 * aria-expanded; the nav keeps accessible names when collapsed (labels move to aria-label); tabs use real
 * tablist semantics. Widths animate; under reduced motion they snap.
 */

const NAV = [
  ['◧', 'Overview'],
  ['↗', 'Traffic'],
  ['◎', 'Goals'],
  ['☰', 'Reports'],
]

export default function V0DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [chat, setChat] = useState(false)
  const [view, setView] = useState<'Overview' | 'Activity'>('Overview')

  return (
    <div className="flex h-96 overflow-hidden rounded-xl border border-border bg-surface">
      <nav aria-label="Sidebar" className="flex shrink-0 flex-col border-r border-border bg-bg/40 p-2 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: collapsed ? 56 : 176 }}>
        <button onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="mb-2 grid min-h-11 w-full place-items-center rounded-md text-fg-muted hover:bg-surface-2 hover:text-fg">
          {collapsed ? '»' : '«'}
        </button>
        <ul className="space-y-1">
          {NAV.map(([icon, label], i) => (
            <li key={label}>
              <a href="#/move-v0-dashboard-shell" aria-label={label} aria-current={i === 0 ? 'page' : undefined} className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm ${i === 0 ? 'bg-accent-soft text-accent' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'}`}>
                <span aria-hidden className="w-4 shrink-0 text-center">{icon}</span>
                {!collapsed && <span>{label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-12 items-center justify-between border-b border-border px-4">
          <div role="tablist" aria-label="View" className="flex gap-1">
            {(['Overview', 'Activity'] as const).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`min-h-9 rounded-md px-3 text-sm ${view === v ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:text-fg'}`}>{v}</button>
            ))}
          </div>
          <button onClick={() => setChat((c) => !c)} aria-expanded={chat} className="min-h-9 rounded-md border border-border px-3 text-sm text-fg-muted hover:text-fg">Chat</button>
        </header>
        <div className="relative flex-1 overflow-hidden p-4">
          <div className="grid grid-cols-3 gap-3">
            {(view === 'Overview' ? [['Visits', '12.4k'], ['Signups', '842'], ['Revenue', '$9.1k']] : [['Today', '311'], ['Week', '2.0k'], ['Month', '8.7k']]).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-bg/40 p-3">
                <p className="text-xs text-fg-muted">{k}</p>
                <p className="font-mono text-xl tabular-nums">{v}</p>
              </div>
            ))}
          </div>
          <aside aria-label="Chat" aria-hidden={!chat} inert={!chat} className="absolute inset-y-0 right-0 w-64 border-l border-border bg-surface-2 p-3 text-sm transition-transform duration-300 motion-reduce:transition-none" style={{ transform: chat ? 'none' : 'translateX(100%)' }}>
            <p className="text-fg-muted">Ask about this dashboard…</p>
          </aside>
        </div>
      </div>
    </div>
  )
}
