/*
 * Layout primitives: six small CSS layouts that answer most page-structure questions with no media queries. Stack
 * (vertical rhythm), Cluster (wrapping row), Sidebar (a fixed-width side that stacks when there is no room), Switcher
 * (a row that becomes a column below a width), Center (a readable column) and Auto grid (columns that fit). They use
 * flex-wrap, gap, min() and auto-fit, so they respond to the space they are in, not to the viewport.
 */

const Box = ({ children, h }: { children: React.ReactNode; h?: string }) => (
  <div className="grid place-items-center rounded-md border border-border bg-accent-soft px-3 py-2 text-xs font-medium text-accent" style={{ minHeight: h }}>{children}</div>
)

function Demo({ name, rule, children }: { name: string; rule: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold">{name}</h3>
      <p className="mt-0.5 font-mono text-[11px] text-fg-muted">{rule}</p>
      <div className="mt-3 overflow-hidden rounded-lg border border-dashed border-border p-2">{children}</div>
    </section>
  )
}

export default function LayoutPrimitives() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Demo name="Stack" rule="display:flex; flex-direction:column; gap:1rem">
        <div className="flex flex-col gap-3"><Box>One</Box><Box>Two</Box><Box>Three</Box></div>
      </Demo>
      <Demo name="Cluster" rule="display:flex; flex-wrap:wrap; gap:.5rem">
        <div className="flex flex-wrap gap-2">{['design', 'type', 'motion', 'access', 'colour', 'layout', 'forms', 'tables'].map((t) => <Box key={t}>{t}</Box>)}</div>
      </Demo>
      <Demo name="Sidebar" rule="flex-wrap; side flex-basis:10rem; main flex-basis:0; flex-grow:999">
        <div className="flex flex-wrap gap-3">
          <div className="grow basis-40"><Box h="5rem">Side</Box></div>
          <div className="basis-0 grow-[999] [min-inline-size:50%]"><Box h="5rem">Main content</Box></div>
        </div>
      </Demo>
      <Demo name="Switcher" rule="flex-wrap; each flex-basis: calc((30rem - 100%) * 999)">
        <div className="flex flex-wrap gap-3">{['A', 'B', 'C'].map((t) => <div key={t} className="grow" style={{ flexBasis: 'calc((26rem - 100%) * 999)' }}><Box h="3.5rem">{t}</Box></div>)}</div>
      </Demo>
      <Demo name="Center" rule="max-inline-size:40ch; margin-inline:auto">
        <div className="mx-auto" style={{ maxInlineSize: '40ch' }}><Box h="5rem">A readable column</Box></div>
      </Demo>
      <Demo name="Auto grid" rule="grid-template-columns: repeat(auto-fit, minmax(min(100%, 7rem), 1fr))">
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 7rem), 1fr))' }}>{Array.from({ length: 6 }, (_, i) => <Box key={i} h="3rem">{i + 1}</Box>)}</div>
      </Demo>
    </div>
  )
}
