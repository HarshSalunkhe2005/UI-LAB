import { useEffect, useRef, useState } from 'react'

/*
 * A site header that works for everyone: a skip link, a real nav landmark, aria-current on the active page, and on
 * small screens a menu button that toggles a list (aria-expanded, Esc to close, focus returns to the button).
 * No library. The links are real links; in this demo they only change the "current page" state.
 */

const LINKS = ['Work', 'Services', 'Journal', 'Contact']

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('Work')
  const btn = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [open])

  const go = (l: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrent(l)
    setOpen(false)
  }

  return (
    <div className="relative rounded-xl border border-border bg-surface">
      <a href="#demo-main" onClick={(e) => e.preventDefault()} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <header className="flex items-center justify-between gap-4 px-4 py-3">
        <a href="#demo" onClick={(e) => e.preventDefault()} className="text-lg font-semibold tracking-tight">Studio</a>
        <nav aria-label="Main" className="hidden sm:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l}>
                <a href="#demo" onClick={go(l)} aria-current={current === l ? 'page' : undefined} className={`grid min-h-11 place-items-center rounded-md px-3 text-sm ${current === l ? 'bg-accent-soft font-medium text-accent' : 'text-fg-muted hover:text-fg'}`}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button ref={btn} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="demo-menu" className="min-h-11 rounded-md border border-border px-4 text-sm font-medium sm:hidden">
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <nav aria-label="Main (mobile)" className={`border-t border-border sm:hidden ${open ? '' : 'hidden'}`}>
        <ul id="demo-menu" ref={menu} className="p-2">
          {LINKS.map((l) => (
            <li key={l}>
              <a href="#demo" onClick={go(l)} aria-current={current === l ? 'page' : undefined} className={`flex min-h-12 items-center rounded-md px-3 text-base ${current === l ? 'bg-accent-soft font-medium text-accent' : ''}`}>
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p id="demo-main" className="px-4 pb-4 text-sm text-fg-muted">Current page: {current}. Resize below 640px to see the menu button.</p>
    </div>
  )
}
