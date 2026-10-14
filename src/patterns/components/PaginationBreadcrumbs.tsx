import { useState } from 'react'

/*
 * Two orientation aids that are easy to get wrong. Breadcrumbs: an ordered list in a labelled nav, the last item is
 * the current page (aria-current) and not a link. Pagination: a labelled nav with real previous, next and numbered
 * buttons, the current page marked with aria-current, ellipses collapsed so there are never more than seven slots, and
 * a status line saying which results are shown. Disabled ends keep their place so the layout does not jump.
 */

const TOTAL = 24
const PER = 5

function slots(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (page >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', page - 1, page, page + 1, '…', total]
}

export default function PaginationBreadcrumbs() {
  const [page, setPage] = useState(1)
  const pages = Math.ceil(TOTAL / PER)
  const from = (page - 1) * PER + 1
  const to = Math.min(TOTAL, page * PER)
  return (
    <div className="mx-auto max-w-xl space-y-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {['Home', 'Journal', 'Design', 'Setting readable type'].map((c, i, a) => (
            <li key={c} className="flex items-center gap-2">
              {i < a.length - 1 ? (
                <a href="#bc" onClick={(e) => e.preventDefault()} className="grid min-h-8 place-items-center text-fg-muted underline underline-offset-2 hover:text-fg">{c}</a>
              ) : (
                <span aria-current="page" className="font-medium">{c}</span>
              )}
              {i < a.length - 1 && <span aria-hidden className="text-fg-muted">/</span>}
            </li>
          ))}
        </ol>
      </nav>

      <div>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {Array.from({ length: to - from + 1 }, (_, i) => from + i).map((n) => (
            <li key={n} className="px-4 py-3 text-sm">Result {n}</li>
          ))}
        </ul>
        <nav aria-label="Pagination" className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg-muted" role="status">Showing {from} to {to} of {TOTAL}</p>
          <ul className="flex items-center gap-1">
            <li><button onClick={() => setPage(page - 1)} disabled={page === 1} aria-label="Previous page" className="grid size-11 place-items-center rounded-md border border-border disabled:opacity-40">‹</button></li>
            {slots(page, pages).map((s, i) => (
              <li key={i}>
                {s === '…' ? (
                  <span aria-hidden className="grid size-8 place-items-center text-fg-muted">…</span>
                ) : (
                  <button onClick={() => setPage(s)} aria-label={`Page ${s}`} aria-current={s === page ? 'page' : undefined} className={`grid size-11 place-items-center rounded-md border text-sm tabular-nums ${s === page ? 'border-fg bg-fg text-bg' : 'border-border hover:bg-surface-2'}`}>{s}</button>
                )}
              </li>
            ))}
            <li><button onClick={() => setPage(page + 1)} disabled={page === pages} aria-label="Next page" className="grid size-11 place-items-center rounded-md border border-border disabled:opacity-40">›</button></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
