import { useId, useRef, useState } from 'react'

/*
 * A file upload that works without a mouse. The drop area is a real button that opens the file picker (Enter or Space),
 * and the hidden input is the actual control, so dragging files in is an extra, not the only way. Selected files are
 * listed with their size and a labelled Remove button; limits (type and size) are stated up front and checked, with the
 * reasons given in words. Nothing is uploaded here: this demo only keeps the list in memory.
 */

const MAX = 2 * 1024 * 1024
const OK = ['image/png', 'image/jpeg', 'application/pdf']
const kb = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`)

export default function FileDropzone() {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [over, setOver] = useState(false)

  const add = (list: FileList | File[]) => {
    const errs: string[] = []
    const ok: File[] = []
    for (const f of Array.from(list)) {
      if (!OK.includes(f.type)) errs.push(`${f.name} was not added: only PNG, JPG and PDF files are accepted.`)
      else if (f.size > MAX) errs.push(`${f.name} was not added: it is ${kb(f.size)} and the limit is 2 MB.`)
      else ok.push(f)
    }
    setErrors(errs)
    setFiles((p) => [...p, ...ok])
  }

  return (
    <div className="mx-auto max-w-md">
      <p id={`${id}-h`} className="text-sm font-medium">Attach your documents</p>
      <input ref={input} id={id} type="file" multiple accept=".png,.jpg,.jpeg,.pdf" hidden onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = '' }} />
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files) }}
        aria-describedby={`${id}-help`}
        aria-labelledby={`${id}-h`}
        className={`mt-1 grid min-h-32 w-full place-content-center gap-1 rounded-xl border-2 border-dashed px-4 text-center transition-colors motion-reduce:transition-none ${over ? 'border-accent bg-accent-soft' : 'border-border hover:bg-surface'}`}
      >
        <span className="font-medium">Choose files, or drop them here</span>
        <span id={`${id}-help`} className="text-sm text-fg-muted">PNG, JPG or PDF, up to 2 MB each</span>
      </button>
      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 text-sm text-danger">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}
      <ul className="mt-3 divide-y divide-border rounded-lg border border-border empty:hidden" aria-label="Selected files">
        {files.map((f, i) => (
          <li key={f.name + i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <span className="min-w-0 truncate">{f.name} <span className="text-fg-muted">({kb(f.size)})</span></span>
            <button onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`} className="min-h-11 shrink-0 px-2 text-fg-muted underline underline-offset-2 hover:text-fg">Remove</button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-fg-muted" role="status">{files.length ? `${files.length} file${files.length === 1 ? '' : 's'} selected.` : 'No files selected.'}</p>
    </div>
  )
}
