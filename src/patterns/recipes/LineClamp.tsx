import { useState } from 'react'

/*
 * Truncating text without losing it. `line-clamp` shortens a paragraph to N lines with an ellipsis; a "Read more" button
 * (aria-expanded) removes the clamp. The full text stays in the DOM for search and screen readers. Single-line truncation
 * uses `text-overflow: ellipsis` and a title is not enough on its own: give the full text a way to be reached.
 */

const TEXT = 'Good truncation is a promise that the rest is one click away. This paragraph is longer than the three lines it is allowed at first, so the browser cuts it with an ellipsis. Everything after the cut is still in the page: assistive technology reads it, search engines index it, and the button below restores it for everyone else.'

export default function LineClamp() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <p className={`text-[15px] leading-relaxed ${open ? '' : 'line-clamp-3'}`} id="lc-p">{TEXT}</p>
        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="lc-p" className="mt-1 min-h-11 text-sm font-medium text-accent underline underline-offset-2">{open ? 'Show less' : 'Read more'}</button>
      </div>
      <div className="rounded-lg border border-border p-3">
        <p className="truncate text-sm" tabIndex={0} aria-label="A long file name, focus to read it all">quarterly-report-final-FINAL-v7-reviewed-by-everyone-2026.pdf</p>
        <p className="mt-1 text-xs text-fg-muted">Single line with an ellipsis. Make the full name available some other way.</p>
      </div>
    </div>
  )
}
