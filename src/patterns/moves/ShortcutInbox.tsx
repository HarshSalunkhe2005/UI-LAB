import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (Superhuman): speed you can feel. A mini inbox you run entirely from the keyboard:
 * j / k (or the arrows) move, e archives, s stars, u undoes the last archive. The shortcut shows up as a hint
 * beside each action, which is how the product teaches itself. Focus the list to start; every action also
 * has a visible button, so nothing is keyboard-only.
 */

type Mail = { id: number; from: string; subject: string; starred?: boolean }
const START: Mail[] = [
  { id: 1, from: 'Priya', subject: 'Launch checklist for Friday' },
  { id: 2, from: 'GitHub', subject: '[ui-lab] 3 new stars' },
  { id: 3, from: 'Marcus', subject: 'Re: invoice 2041' },
  { id: 4, from: 'Calendar', subject: 'Standup moved to 10:30' },
  { id: 5, from: 'Dana', subject: 'Photos from the offsite' },
]

export default function ShortcutInbox() {
  const [mail, setMail] = useState(START)
  const [sel, setSel] = useState(0)
  const [undo, setUndo] = useState<{ m: Mail; at: number }[]>([])
  const box = useRef<HTMLDivElement>(null)

  // Plain state updates (no side effects inside updater functions, which StrictMode runs twice).
  const archive = () => {
    if (!mail[sel]) return
    const next = mail.filter((_, i) => i !== sel)
    setUndo([...undo, { m: mail[sel], at: sel }])
    setMail(next)
    setSel(Math.min(sel, Math.max(0, next.length - 1)))
  }
  const star = () => setMail(mail.map((m, i) => (i === sel ? { ...m, starred: !m.starred } : m)))
  const restore = () => {
    const last = undo.at(-1)
    if (!last) return
    setUndo(undo.slice(0, -1))
    setMail([...mail.slice(0, last.at), last.m, ...mail.slice(last.at)])
    setSel(last.at)
  }

  useEffect(() => {
    const el = box.current!
    const key = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(mail.length - 1, s + 1)) }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
      else if (e.key === 'e') archive()
      else if (e.key === 's') star()
      else if (e.key === 'u') restore()
    }
    el.addEventListener('keydown', key)
    return () => el.removeEventListener('keydown', key)
  })

  return (
    <div ref={box} className="mx-auto max-w-xl rounded-xl border border-border bg-surface outline-offset-4">
      <ul tabIndex={0} role="listbox" aria-label="Inbox. j and k move, e archives, s stars, u undoes." aria-activedescendant={mail[sel] ? `si-${mail[sel].id}` : undefined} className="outline-offset-4">
        {mail.map((m, i) => (
          <li
            key={m.id}
            id={`si-${m.id}`}
            role="option"
            aria-selected={i === sel}
            onClick={() => setSel(i)}
            className={`flex min-h-12 items-center gap-3 border-b border-border px-4 last:border-0 ${i === sel ? 'bg-accent-soft' : ''}`}
          >
            <span className={m.starred ? 'text-warning' : 'text-fg-muted/40'} aria-label={m.starred ? 'Starred' : 'Not starred'}>★</span>
            <span className="w-20 shrink-0 truncate text-sm font-medium">{m.from}</span>
            <span className="truncate text-sm text-fg-muted">{m.subject}</span>
          </li>
        ))}
      </ul>
      {mail.length === 0 && <p className="px-4 py-10 text-center text-sm text-fg-muted">Inbox zero. Press u to bring one back.</p>}
      <div className="flex flex-wrap gap-2 border-t border-border p-2">
        {[
          ['Archive', 'e', archive],
          ['Star', 's', star],
          ['Undo', 'u', restore],
        ].map(([label, k, fn]) => (
          <button key={label as string} onClick={fn as () => void} className="inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm text-fg-muted hover:bg-surface-2 hover:text-fg">
            {label as string}
            <kbd className="rounded border border-border px-1.5 font-mono text-[11px]">{k as string}</kbd>
          </button>
        ))}
        <span className="ml-auto self-center pr-2 font-mono text-[11px] text-fg-muted">j / k to move</span>
      </div>
    </div>
  )
}
