/*
 * A table whose header stays put while the body scrolls, and whose first column stays put while it scrolls sideways. Both
 * are `position: sticky` on cells, inside a scroll container that is focusable and labelled. Sticky cells need an opaque
 * background so rows do not show through. No JavaScript.
 */

const ROWS = Array.from({ length: 16 }, (_, i) => [`Item ${i + 1}`, 100 + i * 17, 20 + (i % 5) * 7, 4 + (i % 3), `Q${(i % 4) + 1}`, i % 2 ? 'Yes' : 'No', `£${(i * 13 + 20).toFixed(2)}`])
const HEAD = ['Name', 'Units', 'Stock', 'Rating', 'Quarter', 'Active', 'Price']

export default function StickyTableHeader() {
  return (
    <div tabIndex={0} role="region" aria-label="Product table, scrolls both ways" className="max-h-72 overflow-auto rounded-xl border border-border">
      <table className="min-w-[40rem] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Products by quarter</caption>
        <thead>
          <tr>
            {HEAD.map((h, i) => (
              <th key={h} scope="col" className={`sticky top-0 border-b border-border bg-surface-2 px-3 py-2 text-left font-medium ${i === 0 ? 'left-0 z-20' : 'z-10'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (i === 0 ? <th key={i} scope="row" className="sticky left-0 border-b border-border bg-surface px-3 py-2 text-left font-medium">{c}</th> : <td key={i} className="border-b border-border px-3 py-2 tabular-nums">{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
