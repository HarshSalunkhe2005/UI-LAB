import { useEffect, useRef, useState } from 'react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import '@fontsource-variable/libre-franklin'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { ITEMS } from './objects'

/*
 * THE SALT ROAD: an exhibition site. World 14 (Museum Placard), the Experience-mode proof.
 * Signature: the object leads and the label is a real label. Each of six objects gets a wall placard with the full
 * hierarchy a curator would set. A Large print switch scales every placard; an audio-guide keypad jumps to a stop,
 * shows its transcript and plays a short chime (WebAudio, only after you press a key, at a low level).
 */

function chime() {
  try {
    const ac = new AudioContext()
    const g = ac.createGain()
    g.gain.value = 0.0001
    g.connect(ac.destination)
    const o = ac.createOscillator()
    o.type = 'sine'
    o.frequency.value = 660
    o.connect(g)
    g.gain.exponentialRampToValueAtTime(0.06, ac.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.7)
    o.start()
    o.stop(ac.currentTime + 0.75)
    setTimeout(() => void ac.close(), 1000)
  } catch {
    /* audio is optional */
  }
}

export default function SaltRoadSite() {
  const root = useRef<HTMLDivElement>(null)
  const [large, setLarge] = useState(false)
  const [stop, setStop] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [msg, setMsg] = useState('')

  useSiteScroll(root, { smooth: false })

  const go = (n: number) => {
    if (n < 1 || n > ITEMS.length) {
      setMsg(`There is no stop ${n}. Choose 1 to ${ITEMS.length}.`)
      return
    }
    setStop(n)
    setMsg('')
    chime()
    const el = root.current?.querySelector<HTMLElement>(`#stop-${n}`)
    el?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
  }

  useEffect(() => {
    const els = ITEMS.map((i) => root.current?.querySelector<HTMLElement>(`#stop-${i.n}`)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (es) => {
        const best = es.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (best) setStop(Number(best.target.id.replace('stop-', '')))
      },
      { threshold: [0.4, 0.7] },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  const cur = ITEMS.find((i) => i.n === stop)

  return (
    <div className="site-salt-road" ref={root} style={{ ['--scale' as string]: large ? 1.28 : 1 }}>
      <header className="top">
        <a href="#top" className="logo">The Salt Road</a>
        <nav aria-label="Sections">
          <a href="#objects">Objects</a>
          <a href="#guide">Audio guide</a>
          <a href="#visit">Visit</a>
        </nav>
        <button className="size" role="switch" aria-checked={large} onClick={() => setLarge((l) => !l)}>
          <span aria-hidden>Aa</span> Large print <b>{large ? 'On' : 'Off'}</b>
        </button>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="h1">
          <p className="meta">Exhibition · Gallery 3 · Until spring</p>
          <h1 id="h1">The Salt Road</h1>
          <p className="lede">Six objects that travelled the coast with the thing everyone needed. Walk the room in order, or use the audio guide to jump to any stop.</p>
          <a href="#objects" className="go">Begin with object 1</a>
        </section>

        <section id="objects" aria-labelledby="h2o">
          <h2 id="h2o" className="sr-only">The objects</h2>
          {ITEMS.map((it) => (
            <article key={it.n} id={`stop-${it.n}`} className={`obj ${stop === it.n ? 'on' : ''}`} aria-labelledby={`t-${it.n}`}>
              <div className="stage">{it.draw()}<span className="no" aria-hidden>{it.n}</span></div>
              <div className="placard">
                <p className="pn">{it.n} of {ITEMS.length}</p>
                <h3 id={`t-${it.n}`}>{it.title}</h3>
                <p className="who">{it.maker}, {it.dates}</p>
                <p className="mat">{it.medium}</p>
                <p className="dim">{it.size}</p>
                <p className="txt">{it.text}</p>
                <p className="cr">{it.credit}. {it.acc}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="guide" id="guide" aria-labelledby="h2g">
          <h2 id="h2g">Audio guide</h2>
          <p>Type a stop number, or press a key. A short tone plays and the transcript appears below.</p>
          <form
            className="pad"
            onSubmit={(e) => {
              e.preventDefault()
              const n = Number(typed)
              if (!Number.isInteger(n) || typed === '') setMsg('Enter a number from 1 to 6.')
              else go(n)
              setTyped('')
            }}
          >
            <label htmlFor="stopno">Stop number</label>
            <div className="row">
              <input id="stopno" inputMode="numeric" autoComplete="off" value={typed} onChange={(e) => setTyped(e.target.value.replace(/\D/g, '').slice(0, 2))} aria-describedby="gmsg" />
              <button>Go</button>
            </div>
          </form>
          <div className="keys" role="group" aria-label="Stop keys">
            {ITEMS.map((i) => (
              <button key={i.n} onClick={() => go(i.n)} aria-pressed={stop === i.n} aria-label={`Stop ${i.n}: ${i.title}`}>{i.n}</button>
            ))}
          </div>
          <p id="gmsg" className="gmsg" role="status">{msg || (cur ? cur.guide : 'Waiting for a stop number.')}</p>
          <figure className="plan" aria-label="Floor plan">
            <svg viewBox="0 0 300 110" role="img" aria-label={cur ? `Floor plan: you are at stop ${cur.n}` : 'Floor plan of the gallery with six stops'}>
              <rect x="2" y="2" width="296" height="106" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {ITEMS.map((i) => (
                <g key={i.n}>
                  <rect x={14 + (i.n - 1) * 46} y={i.n % 2 ? 18 : 62} width="36" height="30" fill={stop === i.n ? '#7a2e2a' : 'none'} stroke="currentColor" />
                  <text x={32 + (i.n - 1) * 46} y={(i.n % 2 ? 18 : 62) + 20} textAnchor="middle" fontSize="13" fill={stop === i.n ? '#fff' : 'currentColor'}>{i.n}</text>
                </g>
              ))}
            </svg>
          </figure>
        </section>

        <section className="visit" id="visit" aria-labelledby="h2v">
          <h2 id="h2v">Visiting</h2>
          <dl>
            <div><dt>Open</dt><dd>Tuesday to Sunday, 10:00 to 17:00. Late opening Thursday until 20:00.</dd></div>
            <div><dt>Access</dt><dd>Step-free throughout. Seating in every gallery. Large-print labels and a tactile copy of object 3 at the desk.</dd></div>
            <div><dt>Admission</dt><dd>Free. A donation helps us keep it that way.</dd></div>
          </dl>
        </section>
      </main>
      <footer className="foot">The Salt Road is a fictional exhibition. The objects are drawings, not photographs.</footer>
    </div>
  )
}
