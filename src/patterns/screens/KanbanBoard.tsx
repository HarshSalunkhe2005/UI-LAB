import { useState } from 'react'

/*
 * Kanban board with drag and drop (native HTML5 DnD) AND a keyboard path:
 * each card has a "Move to…" select, since DnD alone is not accessible.
 * Columns show counts; a live region announces moves.
 */

type Card = { id: number; t: string; tag: string }
const COLS = ['Backlog', 'In progress', 'Review', 'Done'] as const
type Col = (typeof COLS)[number]
const TAGS: Record<string, string> = { design: 'bg-pink-500/15 text-pink-500', eng: 'bg-sky-500/15 text-sky-500', bug: 'bg-danger/15 text-danger' }

export default function KanbanBoard() {
  const [board, setBoard] = useState<Record<Col, Card[]>>({
    Backlog: [{ id: 1, t: 'Pricing page copy', tag: 'design' }, { id: 2, t: 'Rate-limit the API', tag: 'eng' }],
    'In progress': [{ id: 3, t: 'Shader presets', tag: 'design' }, { id: 4, t: 'Fix Safari blur', tag: 'bug' }],
    Review: [{ id: 5, t: 'OTP input', tag: 'eng' }],
    Done: [{ id: 6, t: 'Design tokens', tag: 'design' }],
  })
  const [msg, setMsg] = useState('')
  const [over, setOver] = useState<Col | null>(null)

  const move = (id: number, to: Col) => {
    setBoard((b) => {
      const from = COLS.find((c) => b[c].some((x) => x.id === id))!
      if (from === to) return b
      const card = b[from].find((x) => x.id === id)!
      setMsg(`Moved "${card.t}" to ${to}`)
      return { ...b, [from]: b[from].filter((x) => x.id !== id), [to]: [...b[to], card] }
    })
  }

  return (
    <div>
      <div className="grid gap-3 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
        {COLS.map((col) => (
          <section
            key={col}
            aria-label={col}
            onDragOver={(e) => { e.preventDefault(); setOver(col) }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => { move(Number(e.dataTransfer.getData('text')), col); setOver(null) }}
            className={`min-h-48 rounded-xl border p-3 transition-colors ${over === col ? 'border-accent bg-accent-soft/40' : 'border-border bg-surface/50'}`}
          >
            <h4 className="mb-3 flex justify-between text-sm font-medium">{col}<span className="font-mono text-xs text-fg-muted">{board[col].length}</span></h4>
            <ul className="space-y-2">
              {board[col].map((c) => (
                <li key={c.id} draggable onDragStart={(e) => e.dataTransfer.setData('text', String(c.id))} className="cursor-grab rounded-lg border border-border bg-surface p-3 shadow-sm active:cursor-grabbing">
                  <p className="text-sm">{c.t}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${TAGS[c.tag]}`}>{c.tag}</span>
                    <label className="sr-only" htmlFor={`mv-${c.id}`}>Move {c.t}</label>
                    <select id={`mv-${c.id}`} value={col} onChange={(e) => move(c.id, e.target.value as Col)} className="rounded border border-border bg-bg px-1 text-[11px] text-fg-muted">
                      {COLS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p aria-live="polite" className="mt-2 h-4 font-mono text-xs text-fg-muted">{msg}</p>
    </div>
  )
}
