const COLORS = [
  'bg', 'surface', 'surface-2', 'border', 'fg', 'fg-muted',
  'accent', 'accent-fg', 'accent-soft', 'success', 'warning', 'danger',
]
const TYPE = ['5xl', '4xl', '3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs']
const SPACE = [1, 2, 3, 4, 6, 8, 12, 16, 24]
const RADII = ['sm', 'md', 'lg', 'xl', 'full']
const SHADOWS = ['sm', 'md', 'lg']
const EASINGS = ['ease-standard', 'ease-out-expo', 'ease-in-out', 'ease-spring']

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">{title}</h3>
      {children}
    </section>
  )
}

export default function Tokens() {
  return (
    <div className="space-y-10">
      <Section title="Color">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c} className="overflow-hidden rounded-md border border-border">
              <div className="h-14" style={{ background: `var(--${c})` }} />
              <code className="block bg-surface px-3 py-2 font-mono text-xs">--{c}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <div className="space-y-2">
          {TYPE.map((t) => (
            <div key={t} className="flex items-baseline gap-4">
              <code className="w-20 shrink-0 font-mono text-xs text-fg-muted">--text-{t}</code>
              <span className="truncate font-semibold" style={{ fontSize: `var(--text-${t})`, lineHeight: 'var(--leading-tight)' }}>
                Reconstruct the day
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing">
        <div className="space-y-1.5">
          {SPACE.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <code className="w-20 shrink-0 font-mono text-xs text-fg-muted">--space-{s}</code>
              <div className="h-3 rounded-sm bg-accent" style={{ width: `var(--space-${s})` }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius & elevation">
        <div className="flex flex-wrap gap-4">
          {RADII.map((r) => (
            <div key={r} className="grid h-20 w-20 place-items-center border border-border bg-surface-2 font-mono text-xs" style={{ borderRadius: `var(--radius-${r})` }}>
              {r}
            </div>
          ))}
          {SHADOWS.map((s) => (
            <div key={s} className="grid h-20 w-28 place-items-center rounded-md bg-surface font-mono text-xs" style={{ boxShadow: `var(--shadow-${s})` }}>
              shadow-{s}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Easing (hover a row)">
        <div className="space-y-2">
          {EASINGS.map((e) => (
            <div key={e} className="group flex items-center gap-4 rounded-md bg-surface-2 p-2">
              <code className="w-32 shrink-0 font-mono text-xs text-fg-muted">--{e}</code>
              <div className="relative h-6 flex-1">
                <div
                  className="absolute top-0 h-6 w-6 rounded-full bg-accent group-hover:left-[calc(100%-1.5rem)]"
                  style={{ left: 0, transition: `left var(--dur-slower) var(--${e})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
