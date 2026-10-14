import { useEffect, useRef, useState } from 'react'
import '@fontsource-variable/hanken-grotesk'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'

/*
 * THE COMMUTE REPORT: an annual data report set as a poster. World 7 (Swiss Grid / Data Poster).
 * Signature: the grid is visible (toggle it), one earned statistic is the page's argument, and the charts are labelled
 * directly instead of through a legend. Three type sizes, tabular figures, one red. Motion is limited to a counter, a
 * line that draws and rules that extend as sections enter; every chart also has its data as a real table.
 */

const YEARS = [2016, 2018, 2020, 2022, 2024, 2026]
const SERIES: { name: string; color: string; values: number[] }[] = [
  { name: 'Car', color: '#111', values: [64, 62, 49, 54, 52, 49] },
  { name: 'Bus and train', color: '#7a7a7a', values: [22, 22, 14, 18, 19, 20] },
  { name: 'Walking', color: '#b4b4b4', values: [9, 9, 17, 14, 14, 13] },
  { name: 'Cycling', color: '#e4002b', values: [3, 4, 9, 9, 11, 14] },
]
const DISTRICTS = [
  ['City centre', 58],
  ['Headingley', 47],
  ['Chapel Allerton', 39],
  ['Horsforth', 31],
  ['Morley', 24],
  ['Otley', 17],
] as const

const W = 640
const H = 300
const X = (i: number) => 40 + (i / (YEARS.length - 1)) * (W - 160)
const Y = (v: number) => H - 30 - (v / 70) * (H - 60)

/** Label positions, nudged apart so direct labels never overlap. */
const LABEL_Y = (() => {
  const ys = SERIES.map((s) => ({ name: s.name, y: Y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y)
  for (let i = 1; i < ys.length; i++) if (ys[i].y - ys[i - 1].y < 16) ys[i].y = ys[i - 1].y + 16
  return Object.fromEntries(ys.map((o) => [o.name, o.y]))
})()

function useIn<T extends Element>() {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (reducedMotion()) return setOn(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.25 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, on] as const
}

export default function CommuteReportSite() {
  const root = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState(false)
  const [n, setN] = useState(0)
  const [chartRef, chartOn] = useIn<SVGSVGElement>()
  const [barsRef, barsOn] = useIn<HTMLDivElement>()

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    const target = 51
    if (reducedMotion()) return setN(target)
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="site-commute" ref={root}>
      <div className="grid-overlay" aria-hidden style={{ opacity: grid ? 1 : 0 }}>{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>

      <header className="bar">
        <p>Leeds Transport Observatory · Annual report 2026</p>
        <button className="gridbtn" role="switch" aria-checked={grid} onClick={() => setGrid((g) => !g)}>
          Show the grid <b>{grid ? 'On' : 'Off'}</b>
        </button>
      </header>

      <main id="top">
        <section className="lead" aria-labelledby="h1">
          <h1 id="h1" className="sr-only">How Leeds travels to work, 2026</h1>
          <p className="num" aria-hidden>{n}%</p>
          <div className="lead-text">
            <p className="claim">of Leeds commuters now get to work without driving alone.</p>
            <p className="small">Up from 36% in 2016. Source: the 2026 travel-to-work survey of 11,400 residents.</p>
            <p className="sr-only">51 percent of Leeds commuters now get to work without driving alone, up from 36 percent in 2016.</p>
          </div>
        </section>

        <section className="sec" aria-labelledby="h2a">
          <p className="idx">01</p>
          <div className="body">
            <h2 id="h2a">Cycling has grown more than fourfold in ten years.</h2>
            <svg ref={chartRef} viewBox={`0 0 ${W} ${H}`} className={`chart ${chartOn ? 'in' : ''}`} role="img" aria-label="Line chart of how people travel to work in Leeds from 2016 to 2026. Car fell from 64 to 49 percent. Cycling rose from 3 to 14 percent.">
              {[0, 20, 40, 60].map((v) => (
                <g key={v}>
                  <line x1="40" x2={W - 120} y1={Y(v)} y2={Y(v)} className="gl" />
                  <text x="30" y={Y(v) + 4} textAnchor="end" className="ax">{v}%</text>
                </g>
              ))}
              {YEARS.map((y, i) => <text key={y} x={X(i)} y={H - 8} textAnchor="middle" className="ax">{y}</text>)}
              {SERIES.map((s) => (
                <g key={s.name}>
                  <polyline
                    points={s.values.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={s.name === 'Cycling' ? 3.5 : 2}
                    pathLength={1}
                    className="ln"
                  />
                  <text x={X(YEARS.length - 1) + 10} y={LABEL_Y[s.name] + 4} className="lbl" fill={s.name === 'Cycling' ? '#e4002b' : '#111'}>{s.name} {s.values[s.values.length - 1]}%</text>
                </g>
              ))}
            </svg>
            <details className="data">
              <summary>Show the data as a table</summary>
              <table>
                <caption className="sr-only">Share of commuters by mode, percent</caption>
                <thead><tr><th scope="col">Year</th>{SERIES.map((s) => <th key={s.name} scope="col" className="n">{s.name}</th>)}</tr></thead>
                <tbody>{YEARS.map((y, i) => <tr key={y}><th scope="row">{y}</th>{SERIES.map((s) => <td key={s.name} className="n">{s.values[i]}</td>)}</tr>)}</tbody>
              </table>
            </details>
          </div>
        </section>

        <section className="sec" aria-labelledby="h2b">
          <p className="idx">02</p>
          <div className="body">
            <h2 id="h2b">The centre leads. The edge still drives.</h2>
            <p className="small">Share of residents who commute without a car, by district.</p>
            <div ref={barsRef} className={`bars ${barsOn ? 'in' : ''}`}>
              {DISTRICTS.map(([name, v], i) => (
                <div className="bar-row" key={name}>
                  <span className="bn">{name}</span>
                  <span className="track"><span className="fill" style={{ width: `${v}%`, transitionDelay: `${i * 80}ms` }} /></span>
                  <span className="bv">{v}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" aria-labelledby="h2c">
          <p className="idx">03</p>
          <div className="body">
            <h2 id="h2c">What we recommend</h2>
            <ol className="recs">
              <li><b>Finish the cycle network.</b> Three gaps account for most of the journeys that still go by car.</li>
              <li><b>Fix the bus before the road.</b> Reliability matters more to commuters than fares.</li>
              <li><b>Measure every year.</b> The trend is the evidence; a single number is not.</li>
            </ol>
          </div>
        </section>

        <section className="sec" aria-labelledby="h2d">
          <p className="idx">04</p>
          <div className="body">
            <h2 id="h2d">Method</h2>
            <p className="small meth">Responses were weighted by age, district and household size. Margin of error is plus or minus 1.2 points for the whole sample and plus or minus 4 points for any single district. Figures are fictional and for demonstration.</p>
          </div>
        </section>
      </main>
      <footer className="foot">Leeds Transport Observatory is fictional. The data are invented.</footer>
    </div>
  )
}
