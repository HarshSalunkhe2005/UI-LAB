import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (Tailwind docs): a table of contents that follows you. An IntersectionObserver marks the
 * heading nearest the top of the reading area as current; the link for it is highlighted and exposed with
 * aria-current. Clicking a link scrolls its section into view inside the container (smooth, unless reduced
 * motion). No scroll handler, no layout reads in a loop.
 */

const SECTIONS = [
  ['install', 'Installation'],
  ['utility', 'Utility-first'],
  ['responsive', 'Responsive design'],
  ['dark', 'Dark mode'],
  ['custom', 'Customisation'],
]

export default function Scrollspy() {
  const [active, setActive] = useState('install')
  const pane = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heads = pane.current!.querySelectorAll<HTMLElement>('h3[id]')
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id.replace('sp-', ''))
      },
      { root: pane.current, rootMargin: '0px 0px -75% 0px', threshold: 0 },
    )
    heads.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [])

  const go = (id: string) => {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches
    pane.current!.querySelector(`#sp-${id}`)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <div className="grid h-96 grid-cols-[11rem_1fr] overflow-hidden rounded-xl border border-border bg-surface">
      <nav aria-label="On this page" className="border-r border-border p-4">
        <p className="mb-2 font-mono text-[11px] tracking-wider text-fg-muted uppercase">On this page</p>
        <ul className="space-y-0.5">
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <button
                onClick={() => go(id)}
                aria-current={active === id ? 'location' : undefined}
                className={`min-h-9 w-full rounded-md px-2 text-left text-sm transition-colors ${active === id ? 'bg-accent-soft font-medium text-accent' : 'text-fg-muted hover:text-fg'}`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div ref={pane} className="overflow-y-auto p-6" tabIndex={0} aria-label="Documentation">
        {SECTIONS.map(([id, label]) => (
          <section key={id} className="mb-10">
            <h3 id={`sp-${id}`} className="scroll-mt-2 text-xl font-semibold">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-fg-muted">
              Documentation reads best when you always know where you are. As this section crosses the top of the page the link on the left lights up, and the
              rest wait their turn. Scroll the page and watch the contents follow, then click a link to jump.
            </p>
            <p className="mt-2 text-sm leading-6 text-fg-muted">A second paragraph gives the section some height so the active link can change at a believable pace.</p>
          </section>
        ))}
      </div>
    </div>
  )
}
