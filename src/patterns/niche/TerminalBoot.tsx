import { useEffect, useRef, useState } from 'react'

/*
 * Niche world: Terminal BBS. A text-mode page: a boot sequence prints line by line, then a real prompt accepts
 * commands (help, about, ls, theme, clear). The page is an actual form field in a log region, so it is
 * keyboard-native and readable by screen readers (the log is aria-live polite). Reduced motion: the boot log
 * appears at once.
 */

const BOOT = ['BIOS v2.84 ........ ok', 'MEMORY 640K ........ ok', 'MOUNTING /home ........ ok', 'NET 28.8 kbps ........ connected', '', 'Welcome to HARBOUR BBS. Type help.']
const FILES = ['about.txt', 'rates.txt', 'letters/', 'guestbook.cgi']

export default function TerminalBoot() {
  const [lines, setLines] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  const [amber, setAmber] = useState(false)
  const [input, setInput] = useState('')
  const log = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLines(BOOT)
      setReady(true)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      setLines((l) => [...l, BOOT[i]])
      i += 1
      if (i >= BOOT.length) {
        window.clearInterval(id)
        setReady(true)
      }
    }, 320)
    return () => window.clearInterval(id)
  }, [])
  useEffect(() => {
    log.current?.scrollTo({ top: 1e6 })
  }, [lines])

  const run = (cmd: string) => {
    const [c, ...rest] = cmd.trim().split(/\s+/)
    const out: string[] = [`guest@harbour:~$ ${cmd}`]
    if (c === 'help') out.push('commands: help  about  ls  cat <file>  theme  clear')
    else if (c === 'about') out.push('A text-mode corner of the web since 1994. Be kind.')
    else if (c === 'ls') out.push(FILES.join('   '))
    else if (c === 'cat') out.push(FILES.includes(rest[0]) ? `(${rest[0]}) nothing to see yet` : `cat: ${rest[0] ?? ''}: no such file`)
    else if (c === 'theme') { setAmber((a) => !a); out.push('theme toggled') }
    else if (c === 'clear') return setLines([])
    else if (c) out.push(`${c}: command not found`)
    setLines((l) => [...l, ...out])
  }

  return (
    <div
      className="overflow-hidden rounded-lg border-2 font-mono text-sm"
      style={{ background: '#0a0c08', color: amber ? '#ffb000' : '#7dff8a', borderColor: amber ? '#5a3d00' : '#1f4d26' }}
      onClick={() => field.current?.focus()}
    >
      <div ref={log} role="log" aria-live="polite" aria-label="Terminal output" className="h-64 overflow-y-auto p-4 whitespace-pre-wrap">
        {lines.map((l, i) => <div key={i}>{l || ' '}</div>)}
      </div>
      {ready && (
        <form onSubmit={(e) => { e.preventDefault(); run(input); setInput('') }} className="flex items-center gap-2 border-t border-current/30 px-4 py-2">
          <label htmlFor="tb-in" className="shrink-0">guest@harbour:~$</label>
          <input id="tb-in" ref={field} value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" spellCheck={false} autoCapitalize="none" className="min-h-9 flex-1 bg-transparent outline-none" />
        </form>
      )}
    </div>
  )
}
