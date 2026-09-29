import { useEffect, useMemo, useRef, useState } from 'react'

export type Command = { id: string; label: string; group?: string; hint?: string }

/*
 * ⌘K / Ctrl+K palette. Uses the native <dialog> for focus trapping, Esc and
 * the backdrop; arrow keys move, Enter runs. Filtering is a simple
 * all-words-present match, which is plenty for < a few hundred items.
 */
export function CommandPalette({
  commands,
  open,
  onOpenChange,
  onRun,
  hotkey = true,
}: {
  commands: Command[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onRun: (cmd: Command) => void
  /** Bind ⌘K / Ctrl+K globally. Turn off when another palette owns the shortcut. */
  hotkey?: boolean
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      setQuery('')
      setIndex(0)
      d.showModal()
    } else if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open, onOpenChange, hotkey])

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group ?? ''} ${c.hint ?? ''}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
  }, [commands, query])

  const run = (cmd?: Command) => {
    if (!cmd) return
    onOpenChange(false)
    onRun(cmd)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') run(results[index])
  }

  return (
    <dialog
      ref={dialog}
      onClose={() => onOpenChange(false)}
      onClick={(e) => e.target === dialog.current && onOpenChange(false)}
      className="cmdk m-auto mt-[15vh] w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface p-0 text-fg shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <style>{`
        .cmdk[open] { animation: cmdk-in var(--dur-base) var(--ease-out-expo); }
        @keyframes cmdk-in { from { opacity: 0; transform: translateY(-8px) scale(0.98); } }
      `}</style>
      <input
        autoFocus
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIndex(0)
        }}
        onKeyDown={onKeyDown}
        placeholder="Search patterns…"
        className="w-full border-b border-border bg-transparent px-4 py-3.5 text-base outline-none placeholder:text-fg-muted"
      />
      <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-fg-muted">No matches</li>}
        {results.map((c, i) => (
          <li
            key={c.id}
            role="option"
            aria-selected={i === index}
            onMouseMove={() => setIndex(i)}
            onClick={() => run(c)}
            className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm ${
              i === index ? 'bg-accent-soft text-accent' : ''
            }`}
          >
            <span>{c.label}</span>
            {c.group && <span className="font-mono text-xs text-fg-muted">{c.group}</span>}
          </li>
        ))}
      </ul>
    </dialog>
  )
}

const DEMO: Command[] = [
  { id: 'new', label: 'New project', group: 'Create' },
  { id: 'invite', label: 'Invite teammate', group: 'Create' },
  { id: 'theme', label: 'Toggle theme', group: 'Settings' },
  { id: 'billing', label: 'Open billing', group: 'Settings' },
  { id: 'docs', label: 'Search docs', group: 'Help' },
]

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-3">
      <button
        onClick={() => setOpen(true)}
        className="flex w-72 items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg-muted hover:text-fg"
      >
        Search…
        <span className="font-mono text-xs">click</span>
      </button>
      <p className="text-sm text-fg-muted">{last ? `Ran: ${last}` : 'Open it, type, use ↑ ↓ and Enter.'}</p>
      <CommandPalette commands={DEMO} open={open} onOpenChange={setOpen} onRun={(c) => setLast(c.label)} hotkey={false} />
    </div>
  )
}
