import { useEffect, useId, useRef, useState } from 'react'

/*
 * A dropdown action menu following the ARIA menu-button pattern. The button opens a role=menu; arrow keys move
 * through role=menuitem entries (roving focus), Home and End jump, type a letter to jump to a matching item, Esc closes
 * and returns focus to the button, Tab closes. Clicking outside closes. Use it for actions, not for navigation.
 */

const ITEMS = ['Rename', 'Duplicate', 'Move to…', 'Share', 'Archive', 'Delete']

export default function MenuButton() {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState('')
  const btn = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const items = () => [...(menu.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])]

  useEffect(() => {
    if (open) items()[0]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (!menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false)
    }
    addEventListener('mousedown', down)
    return () => removeEventListener('mousedown', down)
  }, [open])

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) btn.current?.focus()
  }
  const key = (e: React.KeyboardEvent) => {
    const list = items()
    const i = list.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus() }
    else if (e.key === 'Home') { e.preventDefault(); list[0].focus() }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus() }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
    else if (e.key === 'Tab') close(false)
    else if (e.key.length === 1 && /\w/.test(e.key)) {
      const next = list.find((el, n) => n > i && el.textContent!.toLowerCase().startsWith(e.key.toLowerCase())) ?? list.find((el) => el.textContent!.toLowerCase().startsWith(e.key.toLowerCase()))
      next?.focus()
    }
  }

  return (
    <div className="relative mx-auto grid min-h-72 max-w-xs place-items-start justify-center pt-6">
      <button
        ref={btn}
        id={`${id}-b`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-m`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); setOpen(true) } }}
        className="min-h-11 rounded-md border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-2"
      >
        Actions ▾
      </button>
      {open && (
        <div ref={menu} id={`${id}-m`} role="menu" aria-labelledby={`${id}-b`} onKeyDown={key} className="absolute top-20 z-10 w-48 rounded-lg border border-border bg-surface p-1 shadow-lg">
          {ITEMS.map((t) => (
            <button
              key={t}
              role="menuitem"
              tabIndex={-1}
              onClick={() => { setLast(t); close() }}
              className={`flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm hover:bg-surface-2 focus:bg-surface-2 focus:outline-none ${t === 'Delete' ? 'text-danger' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <p className="mt-24 text-sm text-fg-muted" role="status">{last ? `You chose: ${last}.` : 'Press Enter or the down arrow on the button.'}</p>
    </div>
  )
}
