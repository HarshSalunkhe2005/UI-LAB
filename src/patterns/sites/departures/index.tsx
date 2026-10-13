import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'
import { Board } from './Board'

/*
 * MERIDIAN NIGHT RAIL: a night-train brand set as a departure hall. World 9 (Departures Board).
 * Signature: the board resolves letter by letter on load and again whenever you pick a route; the route line
 * on the map draws itself and the train rides it. All content is real text; the board mirrors a table.
 */

const reduced = reducedMotion()

type Route = { id: string; from: string; to: string; dep: string; arr: string; dur: string; km: number; from_: [number, number]; to_: [number, number]; via: [number, number][]; price: [number, number, number]; status: string }
const ROUTES: Route[] = [
  { id: 'ber-vie', from: 'BERLIN', to: 'VIENNA', dep: '21:40', arr: '07:12', dur: '9H32', km: 680, from_: [60, 60], to_: [330, 210], via: [[150, 70], [230, 120]], price: [59, 99, 189], status: 'ON TIME' },
  { id: 'vie-rom', from: 'VIENNA', to: 'ROME', dep: '19:50', arr: '08:20', dur: '12H30', km: 1010, from_: [330, 210], to_: [300, 330], via: [[340, 260], [320, 300]], price: [69, 119, 219], status: 'BOARDING' },
  { id: 'ams-zrh', from: 'AMSTERDAM', to: 'ZURICH', dep: '20:35', arr: '08:05', dur: '11H30', km: 830, from_: [20, 120], to_: [200, 220], via: [[60, 160], [130, 200]], price: [64, 109, 199], status: 'DELAYED' },
  { id: 'pra-war', from: 'PRAGUE', to: 'WARSAW', dep: '22:15', arr: '06:40', dur: '8H25', km: 640, from_: [200, 100], to_: [390, 90], via: [[260, 110], [330, 100]], price: [49, 89, 169], status: 'ON TIME' },
  { id: 'mun-bud', from: 'MUNICH', to: 'BUDAPEST', dep: '21:05', arr: '07:30', dur: '10H25', km: 700, from_: [210, 180], to_: [390, 200], via: [[270, 190], [330, 190]], price: [54, 94, 179], status: 'ON TIME' },
]
const STATIONS: [string, number, number][] = [['BERLIN', 60, 60], ['PRAGUE', 200, 100], ['WARSAW', 390, 90], ['AMSTERDAM', 20, 120], ['MUNICH', 210, 180], ['BUDAPEST', 390, 200], ['ZURICH', 200, 220], ['VIENNA', 330, 210], ['ROME', 300, 330]]
const BERTHS = ['Seat', 'Couchette', 'Sleeper'] as const

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

export default function DeparturesSite() {
  const root = useRef<HTMLDivElement>(null)
  const now = useClock()
  const [sel, setSel] = useState(0)
  const [berth, setBerth] = useState(1)
  const [ticket, setTicket] = useState<null | { route: Route; berth: number; seat: string }>(null)
  const [form, setForm] = useState({ route: ROUTES[0].id, berth: 1, date: '2026-11-14' })
  const route = ROUTES[sel]

  useSiteScroll(root, { smooth: false })

  const heroRows = useMemo(() => ROUTES.map((r) => [r.dep, r.to, String(1 + ROUTES.indexOf(r) * 2), r.status]), [])
  const detailRows = useMemo(() => [[route.from, route.to, route.dep], ['ARRIVES', route.arr, route.dur]], [route])

  // next departure countdown (to the next whole minute that ends in :40, purely illustrative)
  const secs = 59 - now.getSeconds()
  const mins = (39 - now.getMinutes() + 60) % 60
  const countdown = `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const book = (e: React.FormEvent) => {
    e.preventDefault()
    const r = ROUTES.find((x) => x.id === form.route)!
    setTicket({ route: r, berth: form.berth, seat: `${12 + (r.km % 20)}${'ABCD'[r.km % 4]}` })
  }

  return (
    <div className="site-departures" ref={root}>
      <header className="nav">
        <a href="#top" className="logo">MERIDIAN<span>NIGHT RAIL</span></a>
        <nav aria-label="Sections">
          <a href="#routes">Routes</a>
          <a href="#berths">Berths</a>
          <a href="#book" className="cta-sm">Book</a>
        </nav>
        <time className="clock" dateTime={clock} aria-label={`Local time ${clock}`}>{clock}</time>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <div className="hero-copy">
            <p className="tag">Departures · Hall 2</p>
            <h1 id="h1">The night<br />is the route.</h1>
            <p className="lede">Board at dusk in one capital, wake in the next. Eleven night trains, forty-one stations, no airports.</p>
            <a className="cta" href="#book">Book a berth</a>
          </div>
          <div className="hero-board">
            <Board rows={heroRows} cols={[5, 9, 2, 8]} reduced={reduced} label="Departure board: five night trains tonight" />
            <table className="sr-only">
              <caption>Tonight&apos;s departures</caption>
              <thead><tr><th>Time</th><th>Destination</th><th>Platform</th><th>Status</th></tr></thead>
              <tbody>{heroRows.map((r) => <tr key={r[1]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="routes" id="routes" aria-labelledby="h2r">
          <div className="routes-head">
            <h2 id="h2r">Pick a line.</h2>
            <p>Select a route to see it drawn and the board resolve again.</p>
          </div>
          <div className="routes-grid">
            <ul className="route-list" aria-label="Routes">
              {ROUTES.map((r, i) => (
                <li key={r.id}>
                  <button className={i === sel ? 'on' : ''} aria-pressed={i === sel} onClick={() => setSel(i)}>
                    <span className="r-time">{r.dep}</span>
                    <span className="r-name">{r.from} → {r.to}</span>
                    <span className="r-dur">{r.dur}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="map-wrap">
              <svg viewBox="0 0 490 360" className="map" role="img" aria-label={`Map of the ${route.from} to ${route.to} line`}>
                {ROUTES.map((r, i) => (
                  <polyline key={r.id} points={[r.from_, ...r.via, r.to_].map((p) => p.join(',')).join(' ')} className={`line ${i === sel ? 'sel' : ''}`} pathLength={1} />
                ))}
                {STATIONS.map(([n, x, y]) => {
                  const on = n === route.from || n === route.to
                  return (
                    <g key={n} className={on ? 'stn on' : 'stn'}>
                      <circle cx={x} cy={y} r={on ? 7 : 4} />
                      <text x={x + 10} y={y + 4}>{n}</text>
                    </g>
                  )
                })}
                <circle key={route.id} className="train" r="6" style={{ offsetPath: `path('M${[route.from_, ...route.via, route.to_].map((p) => p.join(' ')).join(' L')}')` }} />
              </svg>
              <div className="detail">
                <Board key={route.id} rows={detailRows} cols={[9, 9, 5]} reduced={reduced} label={`${route.from} to ${route.to}, departs ${route.dep}, arrives ${route.arr}, ${route.dur}`} />
                <dl className="facts">
                  <div><dt>Distance</dt><dd>{route.km} km</dd></div>
                  <div><dt>From</dt><dd>€{route.price[0]}</dd></div>
                  <div><dt>Status</dt><dd className={route.status === 'DELAYED' ? 'late' : ''}>{route.status}</dd></div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="berths" id="berths" aria-labelledby="h2b">
          <h2 id="h2b">Three ways to sleep.</h2>
          <div className="table-scroll">
            <table className="cmp">
              <caption className="sr-only">Berth types compared</caption>
              <thead>
                <tr><td />{BERTHS.map((b, i) => <th key={b} scope="col"><button className={i === berth ? 'on' : ''} onClick={() => setBerth(i)} aria-pressed={i === berth}>{b}</button></th>)}</tr>
              </thead>
              <tbody>
                <tr><th scope="row">Bed</th><td className={berth === 0 ? 'hl' : ''}>Reclining seat</td><td className={berth === 1 ? 'hl' : ''}>Bunk, 4 or 6 per cabin</td><td className={berth === 2 ? 'hl' : ''}>Private bed, 1 to 3 per cabin</td></tr>
                <tr><th scope="row">Bedding</th><td className={berth === 0 ? 'hl' : ''}>Blanket</td><td className={berth === 1 ? 'hl' : ''}>Sheets, pillow</td><td className={berth === 2 ? 'hl' : ''}>Sheets, duvet, towel</td></tr>
                <tr><th scope="row">Breakfast</th><td className={berth === 0 ? 'hl' : ''}>Buy on board</td><td className={berth === 1 ? 'hl' : ''}>Roll and coffee</td><td className={berth === 2 ? 'hl' : ''}>Served at your door</td></tr>
                <tr><th scope="row">From</th><td className={`price ${berth === 0 ? 'hl' : ''}`}>€{route.price[0]}</td><td className={`price ${berth === 1 ? 'hl' : ''}`}>€{route.price[1]}</td><td className={`price ${berth === 2 ? 'hl' : ''}`}>€{route.price[2]}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="note">Prices for {route.from} → {route.to}. Change the line above to see the others.</p>
        </section>

        <section className="book" id="book" aria-labelledby="h2k">
          <h2 id="h2k">Print a ticket.</h2>
          <form onSubmit={book} className="book-form">
            <label>Line
              <select value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })}>
                {ROUTES.map((r) => <option key={r.id} value={r.id}>{r.from} to {r.to}, {r.dep}</option>)}
              </select>
            </label>
            <label>Berth
              <select value={form.berth} onChange={(e) => setForm({ ...form, berth: Number(e.target.value) })}>
                {BERTHS.map((b, i) => <option key={b} value={i}>{b}</option>)}
              </select>
            </label>
            <label>Date
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </label>
            <button className="cta">Print ticket</button>
          </form>
          <div className="slot" aria-live="polite">
            {ticket && (
              <article className="ticket" key={`${ticket.route.id}${ticket.berth}`}>
                <div className="t-main">
                  <p className="t-tag">MERIDIAN NIGHT RAIL · {BERTHS[ticket.berth].toUpperCase()}</p>
                  <p className="t-route">{ticket.route.from} <span>→</span> {ticket.route.to}</p>
                  <p className="t-meta">{form.date} · DEP {ticket.route.dep} · ARR {ticket.route.arr}</p>
                </div>
                <div className="t-stub">
                  <p>SEAT</p>
                  <b>{ticket.seat}</b>
                  <p>€{ticket.route.price[ticket.berth]}</p>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>Next departure in <b className="count">{countdown}</b></p>
        <p className="fine">A fictional railway. Every number on this page is invented.</p>
      </footer>
    </div>
  )
}
