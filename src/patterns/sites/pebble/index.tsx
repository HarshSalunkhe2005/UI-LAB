import { useEffect, useRef, useState } from 'react'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource-variable/newsreader'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { ABOUT, FILES, PERSON, PROJECTS, USES } from './content'

/*
 * PEBBLE: a systems engineer's portfolio as a terminal that actually works. World 16 (Terminal BBS).
 * Signature: it is a real prompt (help, ls, cat, theme, history, clear, tab completion, arrow-key history) over real
 * content, and the same content is always one switch away as an ordinary page. The terminal is a log region with a
 * labelled input; the plain view is the accessible default for anyone who does not want to type.
 */

type Line = { kind: 'in' | 'out' | 'err'; text: string }
const THEMES: Record<string, { fg: string; bg: string; dim: string; hi: string; err: string }> = {
  green: { fg: '#8dffb0', bg: '#08100b', dim: '#6fb98b', hi: '#d6ffe3', err: '#ff9a90' },
  amber: { fg: '#ffcb6b', bg: '#120d05', dim: '#c79a45', hi: '#ffe7b0', err: '#ff9a90' },
  paper: { fg: '#1d1b16', bg: '#f1ede1', dim: '#5c5748', hi: '#000000', err: '#a5281b' },
}
const COMMANDS = ['help', 'about', 'ls', 'cat', 'projects', 'open', 'contact', 'theme', 'history', 'clear', 'whoami']

const BANNER = [`${PERSON.name} · ${PERSON.role}`, 'Type help to see what this machine understands.', '']

export default function PebbleSite() {
  const root = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const [plain, setPlain] = useState(false)
  const [theme, setTheme] = useState('green')
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ kind: 'out', text: t })))
  const [val, setVal] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [lines])

  const run = (raw: string) => {
    const cmd = raw.trim()
    const out: Line[] = [{ kind: 'in', text: cmd }]
    const [c, ...args] = cmd.split(/\s+/)
    const say = (t: string) => t.split('\n').forEach((x) => out.push({ kind: 'out', text: x }))
    const err = (t: string) => out.push({ kind: 'err', text: t })
    switch (c.toLowerCase()) {
      case '':
        break
      case 'help':
        say('about            who I am\nls               list files\ncat <file>       read a file\nprojects         things I have built\nopen <project>   read about one\ncontact          how to reach me\ntheme <name>     green, amber or paper\nhistory          commands you have run\nclear            clear the screen')
        break
      case 'whoami':
        say(`${PERSON.name}, ${PERSON.role}, ${PERSON.place}`)
        break
      case 'about':
        say(ABOUT)
        break
      case 'ls':
        say([...Object.keys(FILES), ...PROJECTS.map((p) => `projects/${p.id}`)].join('\n'))
        break
      case 'cat': {
        const f = args[0]
        if (!f) err('cat: which file? Try ls.')
        else if (FILES[f]) say(FILES[f])
        else {
          const p = PROJECTS.find((x) => f === x.id || f === `projects/${x.id}`)
          if (p) say(`${p.name} (${p.year})\n${p.line}\n\n${p.detail}`)
          else err(`cat: ${f}: no such file`)
        }
        break
      }
      case 'projects':
        PROJECTS.forEach((p) => say(`${p.name.padEnd(10)} ${p.year}  ${p.line}`))
        say('\nopen <name> for more.')
        break
      case 'open': {
        const p = PROJECTS.find((x) => x.id === args[0])
        if (!p) err(`open: unknown project "${args[0] ?? ''}". Try projects.`)
        else say(`${p.name} (${p.year})\n${p.line}\n\n${p.detail}`)
        break
      }
      case 'contact':
        say(FILES['contact.txt'])
        break
      case 'theme': {
        const t = (args[0] ?? '').toLowerCase()
        if (THEMES[t]) {
          setTheme(t)
          say(`theme: ${t}`)
        } else err('theme: choose green, amber or paper')
        break
      }
      case 'history':
        if (!hist.length) say('nothing yet')
        else hist.forEach((h, i) => say(`${String(i + 1).padStart(3)}  ${h}`))
        break
      case 'clear':
        setLines([])
        if (cmd) setHist((h) => [...h, cmd])
        return
      case 'sudo':
        err('nice try.')
        break
      default:
        err(`${c}: command not found. Type help.`)
    }
    if (cmd) setHist((h) => [...h, cmd])
    setHi(-1)
    setLines((l) => [...l, ...out])
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const i = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1)
      if (hist[i] !== undefined) {
        setHi(i)
        setVal(hist[i])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hi + 1
      if (i >= hist.length) {
        setHi(-1)
        setVal('')
      } else {
        setHi(i)
        setVal(hist[i])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const [c, ...rest] = val.split(/\s+/)
      if (!rest.length) {
        const m = COMMANDS.filter((x) => x.startsWith(c))
        if (m.length === 1) setVal(m[0] + ' ')
      } else if (['cat', 'open'].includes(c)) {
        const pool = c === 'cat' ? [...Object.keys(FILES), ...PROJECTS.map((p) => p.id)] : PROJECTS.map((p) => p.id)
        const m = pool.filter((x) => x.startsWith(rest[rest.length - 1]))
        if (m.length === 1) setVal(`${c} ${m[0]}`)
      }
    }
  }

  const t = THEMES[theme]
  return (
    <div
      className="site-pebble"
      ref={root}
      style={{ ['--fg' as string]: t.fg, ['--bg' as string]: t.bg, ['--dim' as string]: t.dim, ['--hi' as string]: t.hi, ['--err' as string]: t.err }}
    >
      <header className="bar">
        <span className="who">{PERSON.name}</span>
        <button className="mode" onClick={() => setPlain((p) => !p)} aria-pressed={plain}>
          {plain ? 'Show terminal' : 'Show plain page'}
        </button>
      </header>

      {!plain ? (
        <main className="term" id="top">
          <h1 className="sr-only">{PERSON.name}, {PERSON.role}: an interactive terminal</h1>
          <div className="screen" onClick={() => inputRef.current?.focus()}>
            <div ref={logRef} className="log" role="log" aria-live="polite" aria-label="Terminal output">
              {lines.map((l, i) => (
                <p key={i} className={l.kind}>
                  {l.kind === 'in' && <span className="ps">$ </span>}
                  {l.text || ' '}
                </p>
              ))}
            </div>
            <form
              className="prompt"
              onSubmit={(e) => {
                e.preventDefault()
                run(val)
                setVal('')
              }}
            >
              <label htmlFor="cmd" className="ps">$</label>
              <input id="cmd" ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-describedby="hint" />
            </form>
          </div>
          <p id="hint" className="hint">Try <button onClick={() => run('help')}>help</button> <button onClick={() => run('projects')}>projects</button> <button onClick={() => run('contact')}>contact</button>. Tab completes, up and down recall.</p>
        </main>
      ) : (
        <main className="plain" id="top">
          <h1>{PERSON.name}</h1>
          <p className="role">{PERSON.role}, {PERSON.place}</p>
          <p className="about">{ABOUT}</p>
          <h2>Projects</h2>
          <ul className="list">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <h3>{p.name} <span>{p.year}</span></h3>
                <p>{p.line}</p>
                <p className="d">{p.detail}</p>
              </li>
            ))}
          </ul>
          <h2>What I use</h2>
          <ul className="uses">{USES.map((u) => <li key={u}>{u}</li>)}</ul>
          <h2>Contact</h2>
          <p><a href={`mailto:${PERSON.email}`}>{PERSON.email}</a></p>
        </main>
      )}
      <footer className="foot">PEBBLE is a fictional portfolio. Everything in the terminal is also on the plain page.</footer>
    </div>
  )
}
