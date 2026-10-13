import { useRef, useState } from 'react'

/*
 * Signature move (Are.na): a calm grid of mixed blocks you arrange by hand, in one type size. Blocks are
 * dragged with pointer events: the dragged block follows the pointer and the grid reorders live as it crosses
 * other blocks. Keyboard: focus a block, then Alt+Arrow Left/Right to move it. One font size everywhere is
 * the point: hierarchy comes from the blocks, not from the type scale.
 */

type Block = { id: number; kind: 'text' | 'image' | 'link'; body: string }
const START: Block[] = [
  { id: 1, kind: 'text', body: 'Notes on how ordinary things are arranged.' },
  { id: 2, kind: 'image', body: '' },
  { id: 3, kind: 'link', body: 'are.na/about' },
  { id: 4, kind: 'text', body: 'A channel is a place to put things you want to keep near each other.' },
  { id: 5, kind: 'image', body: '' },
  { id: 6, kind: 'link', body: 'archive.org/details/library' },
]

export default function BlockGrid() {
  const [blocks, setBlocks] = useState(START)
  const [drag, setDrag] = useState<number | null>(null)
  const refs = useRef<Record<number, HTMLElement | null>>({})

  const move = (id: number, to: number) =>
    setBlocks((b) => {
      const from = b.findIndex((x) => x.id === id)
      if (from < 0 || to < 0 || to >= b.length || from === to) return b
      const next = b.slice()
      const [it] = next.splice(from, 1)
      next.splice(to, 0, it)
      return next
    })

  const overIndex = (x: number, y: number) =>
    blocks.findIndex((b) => {
      const r = refs.current[b.id]?.getBoundingClientRect()
      return r ? x >= r.left && x <= r.right && y >= r.top && y <= r.bottom : false
    })

  return (
    <ul
      className="grid gap-3 rounded-xl border border-border bg-surface p-4 text-[15px] sm:grid-cols-3"
      onPointerMove={(e) => {
        if (drag === null) return
        const i = overIndex(e.clientX, e.clientY)
        if (i >= 0) move(drag, i)
      }}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      {blocks.map((b, i) => (
        <li
          key={b.id}
          ref={(el) => { refs.current[b.id] = el }}
          tabIndex={0}
          aria-label={`${b.kind} block ${i + 1} of ${blocks.length}. Alt plus arrow keys to move.`}
          onPointerDown={() => setDrag(b.id)}
          onKeyDown={(e) => {
            if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); move(b.id, i - 1) }
            if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); move(b.id, i + 1) }
          }}
          className={`min-h-32 cursor-grab touch-none rounded-md border p-3 transition-[transform,box-shadow,border-color] duration-200 select-none motion-reduce:transition-none ${drag === b.id ? 'scale-[1.03] border-accent shadow-lg' : 'border-border'}`}
        >
          {b.kind === 'image' ? (
            <div className="h-24 rounded-sm" style={{ background: `linear-gradient(${120 + b.id * 40}deg, hsl(${b.id * 55} 40% 55%), hsl(${b.id * 55 + 60} 35% 30%))` }} aria-hidden />
          ) : b.kind === 'link' ? (
            <p className="text-accent underline underline-offset-4">{b.body}</p>
          ) : (
            <p>{b.body}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
