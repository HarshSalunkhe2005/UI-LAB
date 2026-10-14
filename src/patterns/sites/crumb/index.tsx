import { useMemo, useRef, useState } from 'react'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/hanken-grotesk'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { BAKES } from './bakes'

/*
 * CRUMB & CO: a neighbourhood bakery. World 8 (Warm Organic).
 * Signature: made by hand, and useful. Arch-cropped hand-drawn bakes on grainy oat paper, a stamp, and a line that
 * draws itself under the headline. Beneath the charm it works: each bake shows whether it is ready, sold out or not yet
 * baked at the time you choose, the order form totals live, and "open now" is computed from the real hours.
 */

const HOURS: [string, number, number][] = [
  ['Tuesday to Friday', 7, 16],
  ['Saturday', 7, 15],
  ['Sunday', 8, 13],
]
const money = (n: number) => `£${n.toFixed(2)}`
const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

export default function CrumbSite() {
  const root = useRef<HTMLDivElement>(null)
  const [hour, setHour] = useState(new Date().getHours() >= 7 && new Date().getHours() <= 16 ? new Date().getHours() : 9)
  const [qty, setQty] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [slot, setSlot] = useState('')
  const [state, setState] = useState<'idle' | 'bad' | 'ok'>('idle')

  useSiteScroll(root, { smooth: false })

  const status = (b: (typeof BAKES)[number]) => (hour < b.ready ? 'Out of the oven at ' + hh(b.ready) : hour >= b.out ? 'Sold out for today' : 'Ready now')
  const avail = (b: (typeof BAKES)[number]) => hour >= b.ready && hour < b.out
  const total = useMemo(() => BAKES.reduce((n, b) => n + (qty[b.id] ?? 0) * b.price, 0), [qty])
  const count = Object.values(qty).reduce((a, b) => a + b, 0)
  const open = hour >= 7 && hour < 16

  return (
    <div className="site-crumb" ref={root}>
      <header className="top">
        <a href="#top" className="logo">Crumb <span>&amp;</span> Co.</a>
        <nav aria-label="Sections">
          <a href="#bakes">Today&rsquo;s bakes</a>
          <a href="#order">Order ahead</a>
          <a href="#find">Find us</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <div className="copy">
            <p className="stamp" aria-hidden><span>Baked</span><b>5 am</b></p>
            <h1 id="h1">
              Baked at five.
              <br />
              <span className="gone">Gone by noon.</span>
              <svg className="uline" viewBox="0 0 320 22" aria-hidden><path d="M4 14 C60 4 110 22 170 10 C220 2 270 18 316 8" pathLength={1} /></svg>
            </h1>
            <p className="lede">A small bakery on Spring Lane. Long-fermented bread, a handful of buns, and not much else. When it is gone, it is gone.</p>
            <a href="#order" className="cta">Order ahead</a>
          </div>
          <div className="arch" aria-hidden>
            <div className="arch-in">{BAKES[0].draw()}</div>
          </div>
        </section>

        <section className="bakes" id="bakes" aria-labelledby="h2b">
          <div className="head">
            <h2 id="h2b">Today&rsquo;s bakes</h2>
            <label className="clock" htmlFor="hr">
              Showing
              <select id="hr" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => 7 + i).map((h) => <option key={h} value={h}>{hh(h)}</option>)}
              </select>
            </label>
          </div>
          <ul className="list">
            {BAKES.map((b) => (
              <li key={b.id} className={avail(b) ? '' : 'off'}>
                <div className="pic" aria-hidden>{b.draw()}</div>
                <div className="info">
                  <h3>{b.name} <span>{money(b.price)}</span></h3>
                  <p>{b.note}</p>
                  <p className={`st ${avail(b) ? 'ok' : ''}`}>{avail(b) ? '● ' : '○ '}{status(b)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="order" id="order" aria-labelledby="h2o">
          <h2 id="h2o">Order ahead</h2>
          <p className="sub">Reserve a box and collect it at the counter. Pay when you pick up.</p>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setState(name.trim().length > 1 && slot && count > 0 ? 'ok' : 'bad')
            }}
          >
            <fieldset>
              <legend>What would you like?</legend>
              {BAKES.map((b) => (
                <div className="line" key={b.id}>
                  <span>{b.name}</span>
                  <span className="step">
                    <button type="button" aria-label={`One fewer ${b.name}`} onClick={() => setQty({ ...qty, [b.id]: Math.max(0, (qty[b.id] ?? 0) - 1) })}>−</button>
                    <output aria-label={`${b.name} quantity`}>{qty[b.id] ?? 0}</output>
                    <button type="button" aria-label={`One more ${b.name}`} onClick={() => setQty({ ...qty, [b.id]: (qty[b.id] ?? 0) + 1 })}>+</button>
                  </span>
                </div>
              ))}
            </fieldset>
            <label htmlFor="nm">Name for the bag</label>
            <input id="nm" value={name} onChange={(e) => { setName(e.target.value); setState('idle') }} autoComplete="given-name" aria-invalid={state === 'bad' && name.trim().length < 2} aria-describedby="om" />
            <label htmlFor="sl">Collection time</label>
            <select id="sl" value={slot} onChange={(e) => { setSlot(e.target.value); setState('idle') }} aria-invalid={state === 'bad' && !slot} aria-describedby="om">
              <option value="">Choose a time</option>
              {['08:00', '09:00', '10:00', '11:00', '12:00'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <p className="tot" role="status">{count} item{count === 1 ? '' : 's'} · <b>{money(total)}</b></p>
            <button className="send">Reserve my box</button>
            <p id="om" role={state === 'bad' ? 'alert' : 'status'}>{state === 'bad' ? 'Please add something to the box, your name and a collection time.' : state === 'ok' ? `Thank you, ${name.trim()}. Your box will be ready at ${slot}.` : ' '}</p>
          </form>
        </section>

        <section className="find" id="find" aria-labelledby="h2f">
          <h2 id="h2f">Find us</h2>
          <p className={`now ${open ? 'on' : ''}`}>{open ? '● Open now until 16:00' : '○ Closed at this time'} <small>(for {hh(hour)} in the selector above)</small></p>
          <table>
            <caption className="sr-only">Opening hours</caption>
            <tbody>{HOURS.map(([d, a, b]) => <tr key={d}><th scope="row">{d}</th><td>{hh(a)} to {hh(b)}</td></tr>)}<tr><th scope="row">Monday</th><td>Closed</td></tr></tbody>
          </table>
          <p className="addr">12 Spring Lane, Leeds LS6 1AB. Step-free entrance, one low counter, and a bench outside.</p>
        </section>
      </main>
      <footer className="foot">Crumb &amp; Co. is a fictional bakery. The drawings are ours; the bread is imaginary.</footer>
    </div>
  )
}
