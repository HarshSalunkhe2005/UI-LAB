import { useId, useState, type ReactElement } from 'react'

/*
 * Tooltip that shows on hover AND keyboard focus, hides on Escape, and is
 * wired with aria-describedby. Positioned with plain CSS (top/bottom), which
 * covers most cases; for viewport collision use CSS anchor positioning or
 * Floating UI.
 */

export function Tooltip({ label, side = 'top', children }: { label: string; side?: 'top' | 'bottom'; children: ReactElement<{ 'aria-describedby'?: string }> }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <span aria-describedby={id} className="inline-flex">{children}</span>
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 rounded-md bg-fg px-2 py-1 text-xs whitespace-nowrap text-bg shadow-md transition-all duration-150 ${
          side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        } ${open ? 'opacity-100' : 'translate-y-1 opacity-0'}`}
      >
        {label}
      </span>
    </span>
  )
}

export default function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-10">
      {[['B', 'Bold (Ctrl+B)'], ['I', 'Italic (Ctrl+I)'], ['U', 'Underline (Ctrl+U)']].map(([l, t]) => (
        <Tooltip key={l} label={t}>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border font-semibold" aria-label={t.split(' ')[0]}>{l}</button>
        </Tooltip>
      ))}
      <Tooltip label="Shown below" side="bottom">
        <button className="rounded-md border border-border px-3 py-2 text-sm">Bottom</button>
      </Tooltip>
    </div>
  )
}
