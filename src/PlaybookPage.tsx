import { Fragment, useMemo, type ReactNode } from 'react'

/* The design playbook (playbook/*.md): the procedure, worlds, inspiration method, verification loop, recipes.
   Same files are served to agents at /playbook/<name>.md. Tiny markdown renderer: headings, lists, tables, code, bold, links. */

const FILES = import.meta.glob('/playbook/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

type Doc = { name: string; title: string; body: string }

const DOCS: Doc[] = Object.entries(FILES)
  .map(([path, body]) => {
    const name = path.split('/').pop()!.replace(/\.md$/, '')
    return { name, title: body.match(/^#\s+(.+)$/m)?.[1] ?? name, body }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const t = m[0]
    if (t.startsWith('`')) parts.push(<code key={i++} className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em]">{t.slice(1, -1)}</code>)
    else if (t.startsWith('**')) parts.push(<strong key={i++} className="font-semibold text-fg">{t.slice(2, -2)}</strong>)
    else if (t.startsWith('*')) parts.push(<em key={i++}>{t.slice(1, -1)}</em>)
    else {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!
      const external = /^https?:/.test(href)
      const doc = href.match(/^([\w-]+)\.md$/)?.[1]
      parts.push(
        <a key={i++} href={doc ? `#/playbook/${doc}` : href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className="text-accent underline-offset-2 hover:underline">
          {label}
        </a>,
      )
    }
    last = m.index + t.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function Markdown({ src }: { src: string }) {
  const blocks = useMemo(() => {
    const lines = src.split('\n')
    const out: ReactNode[] = []
    let i = 0
    let k = 0
    while (i < lines.length) {
      const line = lines[i]
      if (line.startsWith('```')) {
        const buf: string[] = []
        i++
        while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
        i++
        out.push(<pre key={k++} className="my-5 overflow-x-auto rounded-xl border border-border bg-surface-2 p-4 font-mono text-[13px] leading-relaxed">{buf.join('\n')}</pre>)
      } else if (/^#{1,4}\s/.test(line)) {
        const level = line.match(/^#+/)![0].length
        const text = line.replace(/^#+\s+/, '')
        const cls = ['text-4xl sm:text-5xl font-semibold tracking-tight mb-6', 'text-2xl font-semibold tracking-tight mt-12 mb-3', 'text-lg font-semibold mt-8 mb-2', 'font-semibold mt-6 mb-2'][level - 1]
        const Tag = (`h${level}` as 'h1')
        out.push(<Tag key={k++} className={cls}>{inline(text)}</Tag>)
        i++
      } else if (line.startsWith('|')) {
        const rows: string[][] = []
        while (i < lines.length && lines[i].startsWith('|')) {
          if (!/^\|[\s:|-]+\|?$/.test(lines[i])) rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()))
          i++
        }
        const [head, ...body] = rows
        out.push(
          <div key={k++} className="my-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-fg-muted">
                <tr>{head.map((c, j) => <th key={j} className="px-3 py-2 font-medium">{inline(c)}</th>)}</tr>
              </thead>
              <tbody>
                {body.map((r, j) => <tr key={j} className="border-t border-border align-top">{r.map((c, n) => <td key={n} className="px-3 py-2">{inline(c)}</td>)}</tr>)}
              </tbody>
            </table>
          </div>,
        )
      } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
        const ordered = /^\s*\d+\./.test(line)
        const items: string[] = []
        while (i < lines.length && lines[i].trim() !== '' && !/^(#|```|\||>)/.test(lines[i])) {
          if (/^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''))
          else items[items.length - 1] += ' ' + lines[i].trim()
          i++
        }
        const L = ordered ? 'ol' : 'ul'
        out.push(<L key={k++} className={`my-4 space-y-1.5 pl-6 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-fg-muted`}>{items.map((t, j) => <li key={j}>{inline(t)}</li>)}</L>)
      } else if (line.startsWith('>')) {
        out.push(<blockquote key={k++} className="my-4 border-l-2 border-border pl-4 text-fg-muted">{inline(line.replace(/^>\s?/, ''))}</blockquote>)
        i++
      } else if (line.trim() === '' || line.trim() === '---') {
        i++
      } else {
        const buf = [line]
        i++
        while (i < lines.length && lines[i].trim() !== '' && !/^(#|```|\||>|\s*([-*]|\d+\.)\s)/.test(lines[i])) buf.push(lines[i++])
        out.push(<p key={k++} className="my-3 leading-relaxed text-fg-muted">{buf.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}</p>)
      }
    }
    return out
  }, [src])
  return <Fragment>{blocks}</Fragment>
}

export default function PlaybookPage({ doc }: { doc?: string }) {
  const current = DOCS.find((d) => d.name === doc) ?? DOCS[0]
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-3 font-mono text-xs tracking-wider text-accent uppercase">Playbook</p>
        <nav aria-label="Playbook pages" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {DOCS.map((d) => (
            <a
              key={d.name}
              href={`#/playbook/${d.name}`}
              aria-current={d.name === current.name ? 'page' : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${d.name === current.name ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg'}`}
            >
              {d.title.replace(/:.*$/, '')}
            </a>
          ))}
        </nav>
        <p className="mt-6 hidden text-xs text-fg-muted lg:block">
          Agents: <a href="/llms.txt" className="font-mono text-accent hover:underline">/llms.txt</a> lists these as raw markdown under <span className="font-mono">/playbook/</span>.
        </p>
      </aside>
      <article className="min-w-0 max-w-3xl text-[15px]">
        <Markdown src={current.body} />
      </article>
    </div>
  )
}
