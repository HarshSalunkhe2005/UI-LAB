import { useEffect, useMemo, useRef, useState } from 'react'

/*
 * Signature move (Raycast): when the product is keyboard-first, the page should be too. A launcher that
 * types a query by itself until you touch it, then answers to real input: type to filter, Up/Down to move,
 * Enter to "run". Auto-typing stops on any key or focus; reduced motion skips it and shows a finished query.
 */

const ITEMS = [
  { name: 'Search Files', hint: 'Command' },
  { name: 'Clipboard History', hint: 'Command' },
  { name: 'Snippets: Create', hint: 'Extension' },
  { name: 'Window: Left Half', hint: 'Window' },
  { name: 'Window: Right Half', hint: 'Window' },
  { name: 'Calculator', hint: 'Command' },
  { name: 'Emoji Picker', hint: 'Extension' },
]

export default function CommandDemo() {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const [ran, setRan] = useState<string | null>(null)
  const touched = useRef(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const script = 'wind'
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setQ(script)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      if (touched.current || i >= script.length) return window.clearInterval(id)
      i += 1
      setQ(script.slice(0, i))
    }, 380)
    return () => window.clearInterval(id)
  }, [])

  const results = useMemo(() => ITEMS.filter((it) => it.name.toLowerCase().includes(q.toLowerCase())), [q])
  const active = Math.min(sel, Math.max(0, results.length - 1))

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
      <label className="sr-only" htmlFor="cmd-demo-q">Search commands</label>
      <input
        id="cmd-demo-q"
        ref={input}
        value={q}
        placeholder="Search for apps and commands…"
        onFocus={() => (touched.current = true)}
        onChange={(e) => {
          touched.current = true
          setQ(e.target.value)
          setSel(0)
          setRan(null)
        }}
        onKeyDown={(e) => {
          touched.current = true
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
          if (e.key === 'Enter' && results[active]) setRan(results[active].name)
        }}
        className="w-full border-b border-border bg-transparent px-4 py-3.5 text-lg outline-none"
        role="combobox"
        aria-expanded
        aria-controls="cmd-demo-list"
        aria-activedescendant={results[active] ? `cmd-demo-${active}` : undefined}
      />
      <ul id="cmd-demo-list" role="listbox" className="max-h-72 overflow-auto p-2">
        {results.map((it, i) => (
          <li
            key={it.name}
            id={`cmd-demo-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setSel(i)}
            onClick={() => setRan(it.name)}
            className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 text-sm ${i === active ? 'bg-accent-soft text-fg' : 'text-fg-muted'}`}
          >
            {it.name}
            <span className="font-mono text-[11px] opacity-70">{it.hint}</span>
          </li>
        ))}
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-fg-muted">No results</li>}
      </ul>
      <p className="flex justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-fg-muted" aria-live="polite">
        <span>{ran ? `Ran: ${ran}` : '↑ ↓ to move, Enter to run'}</span>
        <span>{results.length} results</span>
      </p>
    </div>
  )
}
