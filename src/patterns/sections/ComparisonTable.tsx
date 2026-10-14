/*
 * A comparison table that does not rely on colour or on tiny ticks. Each cell says "Included" or "Not included" in words
 * (visually as a symbol with hidden text), the plan columns are proper column headers, rows are row headers, and the
 * recommended plan is marked in text as well as by emphasis. On small screens the table scrolls inside a focusable
 * region instead of squashing.
 */

const PLANS = ['Free', 'Studio', 'Team'] as const
const ROWS: [string, boolean[]][] = [
  ['Projects', [true, true, true]],
  ['Version history', [false, true, true]],
  ['Private sharing links', [false, true, true]],
  ['Comments and review', [false, false, true]],
  ['Single sign-on', [false, false, true]],
]
const NOTES = ['3 projects', 'Unlimited', 'Unlimited']

export default function ComparisonTable() {
  return (
    <div tabIndex={0} role="region" aria-label="Plan comparison, scrolls sideways on small screens" className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[30rem] border-collapse text-sm">
        <caption className="sr-only">What each plan includes</caption>
        <thead>
          <tr className="bg-surface-2">
            <td className="p-3" />
            {PLANS.map((p) => (
              <th key={p} scope="col" className="p-3 text-center font-semibold">
                {p}
                {p === 'Studio' && <span className="mt-0.5 block text-xs font-normal text-accent">Recommended</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <th scope="row" className="p-3 text-left font-medium">Projects</th>
            {NOTES.map((n, i) => <td key={i} className="p-3 text-center">{n}</td>)}
          </tr>
          {ROWS.slice(1).map(([name, vals]) => (
            <tr key={name}>
              <th scope="row" className="p-3 text-left font-medium">{name}</th>
              {vals.map((v, i) => (
                <td key={i} className="p-3 text-center">
                  <span aria-hidden className={v ? 'font-bold text-success' : 'text-fg-muted'}>{v ? '✓' : '–'}</span>
                  <span className="sr-only">{v ? 'Included' : 'Not included'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
