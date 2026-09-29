import { useEffect, useRef, useState } from 'react'

/*
 * Confirm dialog on native <dialog>.showModal(): focus trap, Esc, inert
 * background. Initial focus goes to the SAFE action (Cancel), the
 * destructive button is visually distinct, and typing the name to confirm
 * guards irreversible actions. Returns focus to the trigger on close.
 */

export function ConfirmModal({ open, onClose, onConfirm, name }: { open: boolean; onClose: () => void; onConfirm: () => void; name: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [typed, setTyped] = useState('')
  useEffect(() => {
    const d = ref.current!
    if (open && !d.open) {
      setTyped('')
      d.showModal()
    } else if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="cm-title"
      aria-describedby="cm-desc"
      className="modal m-auto w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-6 text-fg shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <style>{`.modal[open]{animation:pop .3s var(--ease-spring)} @keyframes pop{from{opacity:0;transform:scale(.95)}}`}</style>
      <h2 id="cm-title" className="text-lg font-semibold">Delete project?</h2>
      <p id="cm-desc" className="mt-2 text-sm text-fg-muted">
        This permanently deletes <b className="text-fg">{name}</b> and all its data. This can't be undone.
      </p>
      <label className="mt-4 block text-sm">
        Type <span className="font-mono">{name}</span> to confirm
        <input value={typed} onChange={(e) => setTyped(e.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm outline-none focus:border-danger" />
      </label>
      <div className="mt-6 flex justify-end gap-2">
        <button autoFocus onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
        <button disabled={typed !== name} onClick={() => { onConfirm(); onClose() }} className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
          Delete
        </button>
      </div>
    </dialog>
  )
}

export default function ConfirmModalDemo() {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  return (
    <div className="flex flex-col items-start gap-3">
      <button onClick={() => setOpen(true)} className="rounded-lg border border-danger/40 px-4 py-2 text-sm text-danger">Delete project…</button>
      <p className="text-sm text-fg-muted" aria-live="polite">{msg}</p>
      <ConfirmModal open={open} onClose={() => setOpen(false)} onConfirm={() => setMsg('Project deleted (demo).')} name="ui-lab" />
    </div>
  )
}
