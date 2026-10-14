import { useMemo, useRef, useState } from 'react'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { PLACES, day, shade, tempChart, toF, type Place } from './data'

/*
 * LIGHTHOUSE FORECAST: a weather page set as plain text. World 21 (Plain Text Sheet), the Operate-mode proof.
 * Signature: density and honesty. One column, no images, charts drawn with characters. Because a character chart is
 * invisible to a screen reader, every chart has a real table beside it and the art is hidden from assistive tech.
 * Links are text, state is in the URL-sized words ("change place", "show earlier hours"), and it loads instantly.
 */

const NOW = 14

export default function PlainForecastSite() {
  const root = useRef<HTMLDivElement>(null)
  const [place, setPlace] = useState<Place>('Margate')
  const [off, setOff] = useState(0)
  const [unit, setUnit] = useState<'C' | 'F'>('C')
  const [early, setEarly] = useState(false)

  useSiteScroll(root, { smooth: false })

  const d = useMemo(() => day(place, off), [place, off])
  const week = useMemo(() => Array.from({ length: 7 }, (_, i) => day(place, i)), [place])
  const u = (c: number) => (unit === 'C' ? `${c.toFixed(0)}°C` : `${toF(c)}°F`)
  const now = off === 0 ? d.hours[NOW] : null
  const shown = d.hours.filter((h) => (early ? true : off !== 0 || h.h >= NOW - 2))
  const chart = useMemo(() => tempChart(d.hours, off === 0 ? NOW : null, unit), [d, off, unit])

  return (
    <div className="site-plain-forecast" ref={root}>
      <header className="top">
        <p className="brand"><a href="#top">☂ lighthouse.forecast</a></p>
        <p className="meta">
          <button className="lnk" onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} aria-label={`Switch units, now ${unit === 'C' ? 'Celsius' : 'Fahrenheit'}`}>°{unit === 'C' ? 'F' : 'C'}</button>
        </p>
      </header>

      <main id="top">
        <h1>{place} · {d.label}</h1>
        <p className="place">
          <label htmlFor="pl">change place: </label>
          <select id="pl" value={place} onChange={(e) => { setPlace(e.target.value as Place); setEarly(false) }}>
            {PLACES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </p>
        <p className="days" role="group" aria-label="Day">
          <button className="lnk" disabled={off === 0} onClick={() => setOff(off - 1)}>&lt; earlier</button>
          {' '}
          <span aria-current="true">[{d.label}]</span>
          {' '}
          <button className="lnk" disabled={off === 6} onClick={() => setOff(off + 1)}>later &gt;</button>
        </p>

        <section aria-labelledby="hn" className="sec">
          <h2 id="hn">NOW</h2>
          <pre className="pre" aria-hidden>{'='.repeat(60)}</pre>
          {now ? (
            <dl className="kv">
              <div><dt>Conditions</dt><dd>{now.cond}</dd></div>
              <div><dt>Temperature</dt><dd>{u(now.t)} (feels {u(now.feels)})</dd></div>
              <div><dt>Wind</dt><dd>{now.wind} km/h {now.dir}</dd></div>
              <div><dt>Rain chance</dt><dd>{Math.round(now.rain * 100)}%</dd></div>
            </dl>
          ) : (
            <p>Forecast for {d.label}: {d.cond}, {u(d.lo)} to {u(d.hi)}, wind about {d.windAvg} km/h.</p>
          )}
        </section>

        <section aria-labelledby="hh" className="sec">
          <h2 id="hh">HOURLY</h2>
          <pre className="pre" aria-hidden>{'='.repeat(60)}</pre>
          <table>
            <caption className="sr-only">Hourly forecast for {place}, {d.label}</caption>
            <thead><tr><th scope="col">Hour</th><th scope="col">Sky</th><th scope="col" className="n">Temp</th><th scope="col" className="n">Rain</th><th scope="col" className="n">Wind</th></tr></thead>
            <tbody>
              {shown.map((h) => (
                <tr key={h.h} className={off === 0 && h.h === NOW ? 'now' : ''}>
                  <th scope="row">{String(h.h).padStart(2, '0')}:00</th>
                  <td>{h.cond}</td>
                  <td className="n">{u(h.t)}</td>
                  <td className="n">{Math.round(h.rain * 100)}%</td>
                  <td className="n">{h.wind} {h.dir}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><button className="lnk" onClick={() => setEarly((e) => !e)} aria-expanded={early}>{early ? 'show fewer hours' : 'show earlier hours'}</button></p>
        </section>

        <section aria-labelledby="hc" className="sec">
          <h2 id="hc">CHARTS</h2>
          <pre className="pre" aria-hidden>{'='.repeat(60)}</pre>
          <p className="cap">Temperature, 24 hours (°{unit}). The table above has the same numbers.</p>
          <pre className="art" aria-hidden>{chart.join('\n')}</pre>
          <p className="cap">Chance of rain by hour. Key: · under 8%, ░ light, ▒ moderate, ▓ heavy, █ very likely.</p>
          <pre className="art" aria-hidden>{d.hours.map((h) => shade(h.rain).repeat(2)).join('')}{'\n'}{d.hours.map((h) => (h.h % 3 === 0 ? String(h.h).padStart(2, '0') : '  ')).join('')}</pre>
          <p className="sr-only">Rain is most likely at {String(d.hours.reduce((a, h) => (h.rain > a.rain ? h : a)).h).padStart(2, '0')}:00, at {Math.round(d.rainMax * 100)}%.</p>
        </section>

        <section aria-labelledby="hw" className="sec">
          <h2 id="hw">THIS WEEK</h2>
          <pre className="pre" aria-hidden>{'='.repeat(60)}</pre>
          <table>
            <caption className="sr-only">Seven-day forecast for {place}</caption>
            <thead><tr><th scope="col">Day</th><th scope="col">Sky</th><th scope="col" className="n">Low</th><th scope="col" className="n">High</th><th scope="col" className="n">Wind</th></tr></thead>
            <tbody>
              {week.map((w, i) => (
                <tr key={i} className={i === off ? 'now' : ''}>
                  <th scope="row"><button className="lnk" onClick={() => setOff(i)} aria-current={i === off ? 'true' : undefined}>{w.label}</button></th>
                  <td>{w.cond}</td>
                  <td className="n">{u(w.lo)}</td>
                  <td className="n">{u(w.hi)}</td>
                  <td className="n">{w.windAvg} km/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      <footer className="foot">
        <p>This forecast is generated and fictional. It is not real weather.</p>
        <p>Pages like this load in one request and work without scripts for reading: that is the point.</p>
      </footer>
    </div>
  )
}
