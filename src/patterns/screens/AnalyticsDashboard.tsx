/*
 * A complete analytics screen: sidebar, KPI tiles with sparklines, a paired
 * bar histogram, a segmented arc dial, a donut and an orders table. Every
 * chart is hand-drawn SVG (no chart library), each with role="img" and a
 * text description, and the numbers also exist as real text/table cells.
 */

const KPIS = [
  { k: 'Revenue', v: '₹4.82L', d: '+12.4%', up: true, s: [3, 5, 4, 6, 7, 6, 9] },
  { k: 'Orders', v: '1,284', d: '+8.1%', up: true, s: [4, 4, 5, 6, 5, 7, 8] },
  { k: 'Conversion', v: '3.6%', d: '−0.4%', up: false, s: [6, 5, 6, 5, 4, 4, 3] },
  { k: 'Avg. order', v: '₹375', d: '+2.2%', up: true, s: [5, 5, 6, 5, 6, 6, 7] },
]
const WEEK = [
  ['Mon', 62, 40], ['Tue', 75, 52], ['Wed', 58, 38], ['Thu', 90, 61], ['Fri', 84, 57], ['Sat', 70, 44], ['Sun', 48, 30],
] as const
const ORDERS = [
  ['#4821', 'Aarav Shah', '₹1,240', 'Shipped'],
  ['#4820', 'Meera Iyer', '₹860', 'Processing'],
  ['#4819', 'Kabir Rao', '₹2,110', 'Delivered'],
  ['#4818', 'Zoya Khan', '₹540', 'Refunded'],
]
const STATUS: Record<string, string> = {
  Shipped: 'bg-accent-soft text-accent',
  Processing: 'bg-warning/15 text-warning',
  Delivered: 'bg-success/15 text-success',
  Refunded: 'bg-danger/15 text-danger',
}

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 80},${24 - (v / max) * 22}`).join(' ')
  return (
    <svg viewBox="0 0 80 26" className={`h-7 w-20 ${up ? 'text-success' : 'text-danger'}`} aria-hidden>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArcDial({ value }: { value: number }) {
  const segs = 24
  return (
    <svg viewBox="0 0 200 116" className="w-full" role="img" aria-label={`Goal progress ${value}%`}>
      {Array.from({ length: segs }, (_, i) => {
        const a = Math.PI + (i / (segs - 1)) * Math.PI
        const on = i / (segs - 1) <= value / 100
        const [x1, y1, x2, y2] = [100 + Math.cos(a) * 72, 104 + Math.sin(a) * 72, 100 + Math.cos(a) * 92, 104 + Math.sin(a) * 92]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="6" strokeLinecap="round" className={on ? 'stroke-accent' : 'stroke-border'} />
      })}
      <text x="100" y="98" textAnchor="middle" className="fill-fg text-[26px] font-semibold">
        {value}%
      </text>
      <text x="100" y="114" textAnchor="middle" className="fill-fg-muted text-[10px]">
        of monthly goal
      </text>
    </svg>
  )
}

function Donut({ parts }: { parts: [string, number, string][] }) {
  const total = parts.reduce((s, p) => s + p[1], 0)
  const C = 2 * Math.PI * 40
  let acc = 0
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90" role="img" aria-label={parts.map(([n, v]) => `${n} ${Math.round((v / total) * 100)}%`).join(', ')}>
        {parts.map(([n, v, c]) => {
          const len = (v / total) * C
          const el = <circle key={n} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="14" strokeDasharray={`${len - 2} ${C - len + 2}`} strokeDashoffset={-acc} />
          acc += len
          return el
        })}
      </svg>
      <ul className="space-y-1 text-xs">
        {parts.map(([n, v, c]) => (
          <li key={n} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: c }} />
            <span className="text-fg-muted">{n}</span>
            <span className="tabular-nums">{Math.round((v / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const card = 'rounded-xl border border-border bg-surface p-4'

export default function AnalyticsDashboard() {
  const max = Math.max(...WEEK.map((w) => w[1]))
  return (
    <div className="flex overflow-hidden rounded-xl border border-border bg-bg text-sm">
      <nav aria-label="Dashboard" className="hidden w-44 shrink-0 border-r border-border p-4 lg:block">
        <p className="mb-6 font-semibold">storefront</p>
        {['Overview', 'Orders', 'Products', 'Customers', 'Settings'].map((l, i) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} aria-current={i === 0 ? 'page' : undefined} className={`block rounded-md px-2 py-1.5 ${i === 0 ? 'bg-surface-2 font-medium' : 'text-fg-muted hover:text-fg'}`}>
            {l}
          </a>
        ))}
      </nav>
      <main className="min-w-0 flex-1 space-y-4 p-4">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Overview</h3>
          <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-fg-muted">Last 7 days</span>
        </header>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k.k} className={card}>
              <p className="text-xs text-fg-muted">{k.k}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <p className="text-xl font-semibold tabular-nums">{k.v}</p>
                <Spark data={k.s} up={k.up} />
              </div>
              <p className={`mt-1 text-xs ${k.up ? 'text-success' : 'text-danger'}`}>{k.d} vs last week</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <div className={`${card} xl:col-span-2`}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium">Revenue vs orders</p>
              <div className="flex gap-3 text-xs text-fg-muted">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-accent" />Revenue</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-fg-muted/40" />Orders</span>
              </div>
            </div>
            <div className="flex h-40 items-end gap-3" role="img" aria-label={`Weekly revenue and orders. Peak on Thursday.`}>
              {WEEK.map(([d, r, o]) => (
                <div key={d} className="group flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-32 w-full items-end justify-center gap-1">
                    <div className="w-1/3 rounded-t-sm bg-accent transition-opacity group-hover:opacity-80" style={{ height: `${(r / max) * 100}%` }} />
                    <div className="w-1/3 rounded-t-sm bg-fg-muted/40" style={{ height: `${(o / max) * 100}%` }} />
                  </div>
                  <span className="font-mono text-[10px] text-fg-muted">{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${card} space-y-4`}>
            <ArcDial value={72} />
            <Donut parts={[['Direct', 42, 'var(--accent)'], ['Social', 28, '#ec4899'], ['Search', 20, '#22c55e'], ['Email', 10, '#f59e0b']]} />
          </div>
        </div>

        <div className={card}>
          <p className="mb-3 font-medium">Recent orders</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-fg-muted">
                <tr>
                  {['Order', 'Customer', 'Total', 'Status'].map((h) => (
                    <th key={h} scope="col" className="pb-2 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ORDERS.map(([id, name, total, st]) => (
                  <tr key={id}>
                    <td className="py-2 font-mono text-xs">{id}</td>
                    <td className="py-2">{name}</td>
                    <td className="py-2 tabular-nums">{total}</td>
                    <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${STATUS[st]}`}>{st}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
