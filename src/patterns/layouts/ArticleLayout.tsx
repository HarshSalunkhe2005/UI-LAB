import { useEffect, useRef, useState } from 'react'

/*
 * An article layout built for reading: a measure of about 65 characters, a sticky table of contents that marks the
 * section you are in (IntersectionObserver, aria-current), heading anchors, reading time, and generous line height.
 * The contents list is a real nav of real links; without script it still jumps to the sections.
 */

const SECTIONS = [
  ['why', 'Why a measure matters', 'Lines of text that run too long make the eye lose its place on the way back to the next line. Around sixty-five characters is comfortable for most readers. On a wide screen, do not stretch the text. Leave the margin empty, and put something useful in it: a contents list, a note, a figure.'],
  ['leading', 'Line height is a kindness', 'Body text wants roughly one and a half times its size between lines. Headings want less. The difference between a page that feels crowded and one that feels calm is often only this number.'],
  ['links', 'Links that say where they go', 'A link should make sense out of context. “Read the accessibility checklist” works; “click here” does not. Underline links in running text, and keep a visible focus ring for people who navigate by keyboard.'],
  ['end', 'Ending well', 'Finish with the one thing the reader should do or remember. Then stop. A footer of related links is useful; a wall of them is not.'],
] as const

export default function ArticleLayout() {
  const [active, setActive] = useState<string>(SECTIONS[0][0])
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = box.current!
    const io = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (v) setActive(v.target.id.replace('art-', ''))
      },
      { root, rootMargin: '0px 0px -65% 0px' },
    )
    SECTIONS.forEach(([id]) => {
      const el = root.querySelector(`#art-${id}`)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const words = SECTIONS.reduce((n, s) => n + s[2].split(' ').length, 0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg">
      <div ref={box} tabIndex={0} role="region" aria-label="Article, scrolls" className="grid max-h-[26rem] gap-8 overflow-y-auto p-6 md:grid-cols-[11rem_minmax(0,1fr)]">
        <nav aria-label="On this page" className="md:sticky md:top-0 md:self-start">
          <p className="text-xs font-medium tracking-wider text-fg-muted uppercase">On this page</p>
          <ol className="mt-2 space-y-1 text-sm">
            {SECTIONS.map(([id, title]) => (
              <li key={id}>
                <a
                  href={`#art-${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    box.current?.querySelector(`#art-${id}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
                  }}
                  aria-current={active === id ? 'true' : undefined}
                  className={`block min-h-8 rounded px-2 py-1 ${active === id ? 'bg-accent-soft font-medium text-accent' : 'text-fg-muted hover:text-fg'}`}
                >
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-[65ch]">
          <h3 className="text-3xl leading-tight font-semibold tracking-tight">Setting text people can read</h3>
          <p className="mt-2 text-sm text-fg-muted">{Math.max(1, Math.round(words / 200))} min read · Updated October</p>
          {SECTIONS.map(([id, title, body]) => (
            <section key={id} id={`art-${id}`} className="mt-8 scroll-mt-2" aria-labelledby={`art-h-${id}`}>
              <h4 id={`art-h-${id}`} className="text-xl font-semibold">{title}</h4>
              <p className="mt-2 text-[17px] leading-[1.65]">{body}</p>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
