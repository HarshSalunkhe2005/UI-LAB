import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@fontsource-variable/geist'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'
import { net, startNetwork } from './network'

gsap.registerPlugin(ScrollTrigger)
const reduced = reducedMotion()

type Line = { step: number; kind: 'cmd' | 'out' | 'ok' | 'warn'; text: string }

const STEPS = [
  { title: 'Create', body: 'One command makes a Postgres-compatible database with sync built in.' },
  { title: 'Deploy', body: 'Pick regions. Data replicates to each; nothing to configure per region.' },
  { title: 'Query', body: 'Reads land on the nearest replica. Writes are conflict-free by construction.' },
  { title: 'Fail over', body: 'Lose a region and traffic moves on. No dropped writes, no pager.' },
  { title: 'Scale out', body: 'Add regions while serving traffic. Edges join the mesh in seconds.' },
]

const LINES: Line[] = [
  { step: 0, kind: 'cmd', text: 'npx lattice init orders-db' },
  { step: 0, kind: 'ok', text: 'created project orders-db (iad)' },
  { step: 1, kind: 'cmd', text: 'lattice deploy --regions iad,fra,sin' },
  { step: 1, kind: 'out', text: 'provisioning fra ........ done  1.1s' },
  { step: 1, kind: 'out', text: 'provisioning sin ........ done  1.3s' },
  { step: 1, kind: 'ok', text: '3 regions live, replication lag 9ms' },
  { step: 2, kind: 'cmd', text: `lattice query "select * from orders where user = 'ada'"` },
  { step: 2, kind: 'out', text: 'served from fra  ·  11ms' },
  { step: 2, kind: 'ok', text: '14 rows' },
  { step: 3, kind: 'cmd', text: 'lattice chaos --kill iad' },
  { step: 3, kind: 'warn', text: 'iad unreachable' },
  { step: 3, kind: 'ok', text: 'traffic rerouted to fra  ·  0 writes dropped' },
  { step: 4, kind: 'cmd', text: 'lattice scale --add syd,gru,nrt,lhr,bom,sfo' },
  { step: 4, kind: 'ok', text: '9 regions live  ·  p99 14ms worldwide' },
]

const LIT_BY_STEP = [1, 3, 3, 3, 9]

const PALETTE = [
  { id: 'top', label: 'Overview', hint: 'top' },
  { id: 'how', label: 'How it works', hint: 'story' },
  { id: 'race', label: 'Latency, felt', hint: 'compare' },
  { id: 'why', label: 'Why Lattice', hint: 'features' },
  { id: 'install', label: 'Install', hint: 'npm' },
]

const CITIES: Record<string, { single: number; lattice: number }> = {
  Sydney: { single: 212, lattice: 9 },
  'São Paulo': { single: 128, lattice: 11 },
  Frankfurt: { single: 94, lattice: 7 },
  Singapore: { single: 236, lattice: 10 },
}

function Terminal({ step }: { step: number }) {
  const [typed, setTyped] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const current = useMemo(() => LINES.filter((l) => l.step === step), [step])
  const total = current.reduce((n, l) => n + l.text.length + 4, 0)

  useEffect(() => {
    if (reduced) return setTyped(total)
    setTyped(0)
    const id = setInterval(() => setTyped((t) => (t >= total ? t : t + 2)), 16)
    return () => clearInterval(id)
  }, [step, total])

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight })
  }, [typed, step])

  let budget = typed
  return (
    <div className="term" role="img" aria-label={`Terminal session, step ${step + 1}: ${STEPS[step].title}`}>
      <div className="term-bar">
        <i /><i /><i />
        <span>orders-db — zsh</span>
      </div>
      <div className="term-body" ref={box}>
        {LINES.filter((l) => l.step <= step).map((l, i) => {
          let text = l.text
          if (l.step === step) {
            if (budget <= 0) return null
            text = l.text.slice(0, Math.min(l.text.length, budget))
            budget -= l.text.length + 4
          }
          return (
            <div key={i} className={`ln ${l.kind}`}>
              <span className="g">{l.kind === 'cmd' ? '$' : l.kind === 'ok' ? '✔' : l.kind === 'warn' ? '!' : '·'}</span>
              <span>{text}</span>
            </div>
          )
        })}
        <div className="ln cmd"><span className="g">$</span><span className="caret" /></div>
      </div>
    </div>
  )
}

function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const items = PALETTE.filter((p) => (p.label + p.hint).toLowerCase().includes(q.toLowerCase()))
  useEffect(() => {
    if (open) {
      setQ('')
      setI(0)
      setTimeout(() => input.current?.focus(), 0)
    }
  }, [open])
  if (!open) return null
  const go = (id: string) => {
    onClose()
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }) // ids are unique inside this page
  }
  return (
    <div className="pal-back" onMouseDown={onClose}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={input}
          value={q}
          placeholder="Jump to…"
          onChange={(e) => {
            setQ(e.target.value)
            setI(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') (e.preventDefault(), setI((v) => Math.min(items.length - 1, v + 1)))
            if (e.key === 'ArrowUp') (e.preventDefault(), setI((v) => Math.max(0, v - 1)))
            if (e.key === 'Enter' && items[i]) go(items[i].id)
            if (e.key === 'Escape') onClose()
          }}
        />
        <ul>
          {items.map((p, n) => (
            <li key={p.id}>
              <button className={n === i ? 'sel' : ''} onMouseEnter={() => setI(n)} onClick={() => go(p.id)}>
                {p.label}
                <kbd>{p.hint}</kbd>
              </button>
            </li>
          ))}
          {!items.length && <li className="none">No match</li>}
        </ul>
      </div>
    </div>
  )
}

export default function LatticeSite() {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(0)
  const [city, setCity] = useState('Sydney')
  const [pal, setPal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => startNetwork(canvas.current!, reduced), [])

  useSiteScroll(root)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPal((v) => !v)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  // story steps follow the scroll through the pinned section
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '.story',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const s = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
          setStep((cur) => (cur === s ? cur : s))
          net.lit = self.progress < 0.004 ? 4 : LIT_BY_STEP[s]
          net.dead = self.progress >= 0.004 && s === 3
        },
      })
      gsap.from('.hero .line', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.1 })
      gsap.from('.hero .fade', { opacity: 0, y: 14, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.5 })
      gsap.utils.toArray<HTMLElement>('.rv').forEach((el) =>
        gsap.from(el, { opacity: 0, y: 28, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  // latency race
  const c = CITIES[city]
  useEffect(() => {
    const max = 240
    gsap.to('.bar.single i', { width: `${(c.single / max) * 100}%`, duration: reduced ? 0 : 1.1, ease: 'expo.out' })
    gsap.to('.bar.lattice i', { width: `${(c.lattice / max) * 100}%`, duration: reduced ? 0 : 1.1, ease: 'expo.out' })
    const o = { a: 0, b: 0 }
    gsap.to(o, {
      a: c.single,
      b: c.lattice,
      duration: reduced ? 0 : 1.1,
      ease: 'expo.out',
      onUpdate: () => {
        const A = document.querySelector('.bar.single b')
        const B = document.querySelector('.bar.lattice b')
        if (A) A.textContent = `${Math.round(o.a)} ms`
        if (B) B.textContent = `${Math.round(o.b)} ms`
      },
    })
  }, [c])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('npm i @lattice/client')
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div ref={root} className="site-lattice">
      <canvas ref={canvas} className="net" aria-hidden="true" />

      <header className="nav">
        <a href="#top" className="logo"><span aria-hidden="true">◈</span> lattice</a>
        <nav>
          <a href="#how">How it works</a>
          <a href="#race">Latency</a>
          <a href="#why">Why</a>
          <button className="kbd" onClick={() => setPal(true)} aria-label="Open command palette">
            <span>Jump to</span><kbd>Ctrl K</kbd>
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <h1>
            <span className="mask"><span className="line">Your database,</span></span>
            <span className="mask"><span className="line">already where</span></span>
            <span className="mask"><span className="line">your users <em>are.</em></span></span>
          </h1>
          <p className="fade lede">Postgres-compatible data, replicated to the edge with strong reads and conflict-free writes. Deploy once, serve everywhere.</p>
          <div className="fade actions">
            <button className="install" onClick={copy} aria-label="Copy install command">
              <code><span className="g">$</span> npm i @lattice/client</code>
              <span className="cp">{copied ? 'copied' : 'copy'}</span>
            </button>
            <a className="ghost" href="#how">See it work ↓</a>
          </div>
          <p className="fade hint">Move your pointer over the grid. Nine regions, waiting.</p>
        </section>

        <section className="story" id="how" style={{ height: `${STEPS.length * 90 + 40}svh` }}>
          <div className="stage">
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className={i === step ? 'on' : i < step ? 'done' : ''}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{s.title}</h2>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Terminal step={step} />
          </div>
        </section>

        <section className="race" id="race">
          <h2 className="rv">Latency, <em>felt.</em></h2>
          <p className="rv sub">Round-trip for a read, one user, one city. Illustrative numbers for the demo.</p>
          <div className="cities rv" role="radiogroup" aria-label="User location">
            {Object.keys(CITIES).map((k) => (
              <button key={k} role="radio" aria-checked={k === city} className={k === city ? 'on' : ''} onClick={() => setCity(k)}>{k}</button>
            ))}
          </div>
          <div className="lanes">
            <div className="lane">
              <span>Single region (us-east-1)</span>
              <div className="bar single"><i /><b>0 ms</b></div>
            </div>
            <div className="lane">
              <span>Lattice (nearest edge)</span>
              <div className="bar lattice"><i /><b>0 ms</b></div>
            </div>
          </div>
        </section>

        <section className="why" id="why">
          <h2 className="rv">Built for the 3 a.m. page.</h2>
          <dl>
            {[
              ['Conflict-free by default', 'Writes merge deterministically across regions. No last-write-wins surprises, no manual reconciliation.', 'await db.insert(orders, row)'],
              ['One connection string', 'Your driver talks to the nearest region. Nothing to route, nothing to pin.', 'postgres://edge.lattice.dev/orders'],
              ['Region failure is a non-event', 'Reads and writes continue through the surviving mesh. Replay catches the dead region up when it returns.', 'lattice chaos --kill iad'],
              ['Local-first friendly', 'The same sync engine runs in the browser, so offline edits converge when the network returns.', 'const db = await open(\'orders\')'],
            ].map(([t, d, code]) => (
              <div key={t} className="rv">
                <dt>{t}</dt>
                <dd>
                  <p>{d}</p>
                  <code>{code}</code>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="foot" id="install">
          <h2>Ship it close to everyone.</h2>
          <button className="install big" onClick={copy} aria-label="Copy install command">
            <code><span className="g">$</span> npm i @lattice/client</code>
            <span className="cp">{copied ? 'copied' : 'copy'}</span>
          </button>
          <small>Demo site for a fictional product. Numbers are illustrative.</small>
        </footer>
      </main>

      <Palette open={pal} onClose={() => setPal(false)} />
    </div>
  )
}
