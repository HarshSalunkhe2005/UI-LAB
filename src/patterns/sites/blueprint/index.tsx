import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'

/*
 * FENWICK & ODE: a structural engineering practice, set as a drawing sheet. World 22 (Blueprint).
 * Signature: the page is an instrument. A title block, dimension lines and a grid behind everything; a truss that draws
 * itself on arrival; and a working "quick beam check" whose diagram bends as you change the span, load and material.
 * The sums are the textbook ones for a simply supported beam and are labelled indicative.
 */

const MATERIALS = [
  { id: 'timber', name: 'Timber', ratio: 15, e: 11, note: 'span / 15' },
  { id: 'steel', name: 'Steel', ratio: 20, e: 210, note: 'span / 20' },
  { id: 'concrete', name: 'Concrete', ratio: 18, e: 30, note: 'span / 18' },
] as const

const SHEETS = [
  ['S-101', 'Foundations and ground', 'Piles, rafts and retaining walls'],
  ['S-201', 'Frames', 'Steel, timber and concrete structures'],
  ['S-301', 'Refurbishment', 'Surveys, openings and strengthening'],
  ['S-401', 'Temporary works', 'Propping, scaffold and crane bases'],
] as const

const JOBS = [
  ['2025', 'Millbank Warehouse conversion', 'Leeds', 'Six storeys, retained cast-iron columns'],
  ['2024', 'Harrow Sound footbridge', 'Kent', '42 m span, weathering steel'],
  ['2023', 'St Anne’s school hall', 'York', 'Glulam portal frames'],
  ['2022', 'Quayside housing, block C', 'Hull', 'Precast concrete, 112 flats'],
] as const

export default function BlueprintSite() {
  const root = useRef<HTMLDivElement>(null)
  const [span, setSpan] = useState(6)
  const [load, setLoad] = useState(8)
  const [mat, setMat] = useState<(typeof MATERIALS)[number]['id']>('steel')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [state, setState] = useState<'idle' | 'bad' | 'ok'>('idle')
  const paths = useRef<(SVGPathElement | null)[]>([])

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    const ps = paths.current.filter(Boolean) as SVGPathElement[]
    if (reducedMotion()) return
    ps.forEach((p, i) => {
      const len = p.getTotalLength()
      p.style.transition = 'none'
      p.style.strokeDasharray = String(len)
      p.style.strokeDashoffset = String(len)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        p.style.transition = `stroke-dashoffset 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) ${i * 90}ms`
        p.style.strokeDashoffset = '0'
      }))
    })
  }, [])

  const m = MATERIALS.find((x) => x.id === mat)!
  const calc = useMemo(() => {
    const moment = (load * span * span) / 8 // kN.m
    const depth = Math.ceil((span * 1000) / m.ratio / 10) * 10 // mm
    // Indicative mid-span deflection for a rectangular section of that depth and 1/3 width, w L^4 5 / (384 E I)
    const b = depth / 3
    const I = (b * depth ** 3) / 12 // mm^4
    const E = m.e * 1000 // N/mm2
    const delta = (5 * load * (span * 1000) ** 4) / (384 * E * I) // mm (1 kN/m = 1 N/mm)
    return { moment, depth, delta }
  }, [span, load, m])

  const bend = Math.min(26, Math.max(2, calc.delta * 0.9))
  const beamD = `M60 130 Q 270 ${130 + bend} 480 130`

  return (
    <div className="site-blueprint" ref={root}>
      <div className="frame" aria-hidden />
      <header className="tb">
        <a href="#top" className="firm">FENWICK <span>&amp;</span> ODE</a>
        <dl>
          <div><dt>Drawing</dt><dd>S-000</dd></div>
          <div><dt>Scale</dt><dd>1:50</dd></div>
          <div><dt>Rev</dt><dd>C</dd></div>
        </dl>
        <nav aria-label="Sections">
          <a href="#check">Beam check</a>
          <a href="#sheets">Services</a>
          <a href="#rfi">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <div className="copy">
            <p className="note">Structural engineers, Leeds. Est. 1998.</p>
            <h1 id="h1">We design the parts of buildings you never see.</h1>
            <p className="lede">Frames, foundations and fixes for projects that have to stand up and stay standing. Small team, plain answers, drawings you can read.</p>
            <a className="cta" href="#check">Try the beam check</a>
          </div>
          <figure className="sheet">
            <svg viewBox="0 0 520 260" role="img" aria-label="Elevation drawing of a steel truss bridge with dimension lines">
              <g fill="none" stroke="#e9f4ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path ref={(n) => { paths.current[0] = n }} d="M30 190 H490" />
                <path ref={(n) => { paths.current[1] = n }} d="M30 190 L90 110 H430 L490 190" />
                <path ref={(n) => { paths.current[2] = n }} d="M90 110 L150 190 L210 110 L270 190 L330 110 L390 190 L430 110" />
                <path ref={(n) => { paths.current[3] = n }} d="M150 190 V110 M270 190 V110 M390 190 V110" opacity="0.6" />
              </g>
              <g stroke="#7fd4ff" strokeWidth="1" fill="none">
                <path d="M30 222 H490 M30 214 V230 M490 214 V230" />
                <path d="M520 110 V190 M512 110 H528 M512 190 H528" />
              </g>
              <text x="260" y="244" textAnchor="middle" className="dim">46 000</text>
              <text x="506" y="154" className="dim" transform="rotate(90 506 154)" textAnchor="middle">8 000</text>
              <text x="30" y="30" className="dim">ELEVATION A-A · WARREN TRUSS</text>
            </svg>
            <figcaption>Elevation A-A. Dimensions in millimetres.</figcaption>
          </figure>
        </section>

        <section className="check" id="check" aria-labelledby="h2c">
          <h2 id="h2c">Quick beam check</h2>
          <p className="sub">A simply supported beam under an even load. Indicative only: it tells you the scale of the problem, not the answer.</p>
          <div className="check-grid">
            <div className="ctl">
              <label htmlFor="sp">Span <b>{span.toFixed(1)} m</b></label>
              <input id="sp" type="range" min={2} max={14} step={0.5} value={span} onChange={(e) => setSpan(Number(e.target.value))} aria-valuetext={`${span} metres`} />
              <label htmlFor="ld">Load <b>{load} kN/m</b></label>
              <input id="ld" type="range" min={1} max={30} step={1} value={load} onChange={(e) => setLoad(Number(e.target.value))} aria-valuetext={`${load} kilonewtons per metre`} />
              <fieldset>
                <legend>Material</legend>
                <div className="mats" role="radiogroup" aria-label="Material">
                  {MATERIALS.map((x) => <button key={x.id} role="radio" aria-checked={mat === x.id} className={mat === x.id ? 'on' : ''} onClick={() => setMat(x.id)}>{x.name}</button>)}
                </div>
              </fieldset>
            </div>
            <div className="out">
              <svg viewBox="0 0 540 190" role="img" aria-label={`Beam diagram: span ${span} metres, load ${load} kilonewtons per metre, deflection about ${calc.delta.toFixed(1)} millimetres`}>
                <g stroke="#7fd4ff" strokeWidth="1.4" fill="none">
                  {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${80 + i * 50} 52 V ${110}`} markerEnd="url(#a)" />)}
                  <path d="M60 52 H480" />
                </g>
                <defs><marker id="a" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto"><path d="M0 0 L4 8 L8 0" fill="none" stroke="#7fd4ff" /></marker></defs>
                <path d={beamD} fill="none" stroke="#e9f4ff" strokeWidth="5" strokeLinecap="round" />
                <path d="M60 130 L40 160 H80 Z M480 130 L460 160 H500 Z" fill="none" stroke="#e9f4ff" strokeWidth="1.6" />
                <text x="270" y="40" textAnchor="middle" className="dim">{load} kN/m</text>
                <text x="270" y="182" textAnchor="middle" className="dim">{span.toFixed(1)} m</text>
              </svg>
              <div role="status"><dl className="res">
                <div><dt>Max moment</dt><dd>{calc.moment.toFixed(1)} kN·m</dd></div>
                <div><dt>Indicative depth</dt><dd>{calc.depth} mm <small>({m.note})</small></dd></div>
                <div><dt>Mid-span sag</dt><dd>{calc.delta.toFixed(1)} mm <small>({calc.delta > (span * 1000) / 250 ? 'too much: deepen it' : 'within span / 250'})</small></dd></div>
              </dl></div>
            </div>
          </div>
        </section>

        <section className="sheets" id="sheets" aria-labelledby="h2s">
          <h2 id="h2s">Drawing list</h2>
          <table>
            <caption className="sr-only">What we do, as a drawing list</caption>
            <thead><tr><th scope="col">Sheet</th><th scope="col">Title</th><th scope="col">Covers</th></tr></thead>
            <tbody>{SHEETS.map(([n, t, d]) => <tr key={n}><th scope="row">{n}</th><td>{t}</td><td>{d}</td></tr>)}</tbody>
          </table>
          <h3>Recent work</h3>
          <ul className="jobs">{JOBS.map(([y, t, p, d]) => <li key={t}><span>{y}</span><b>{t}</b><i>{p}</i><em>{d}</em></li>)}</ul>
        </section>

        <section className="rfi" id="rfi" aria-labelledby="h2r">
          <h2 id="h2r">Request for information</h2>
          <p className="sub">Tell us what you are building. A named engineer replies within two working days.</p>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setState(name.trim().length > 1 && msg.trim().length > 9 ? 'ok' : 'bad')
            }}
          >
            <label htmlFor="rn">Your name</label>
            <input id="rn" value={name} onChange={(e) => { setName(e.target.value); setState('idle') }} aria-invalid={state === 'bad' && name.trim().length < 2} aria-describedby="rm" autoComplete="name" />
            <label htmlFor="rq">What are you building?</label>
            <textarea id="rq" rows={4} value={msg} onChange={(e) => { setMsg(e.target.value); setState('idle') }} aria-invalid={state === 'bad' && msg.trim().length < 10} aria-describedby="rm" />
            <button>Send RFI</button>
            <p id="rm" role={state === 'bad' ? 'alert' : 'status'}>{state === 'bad' ? 'Please give your name and a sentence or two about the project.' : state === 'ok' ? `Thank you, ${name.trim()}. RFI logged: you will hear from us by Thursday.` : ' '}</p>
          </form>
        </section>
      </main>
      <footer className="foot">Fenwick &amp; Ode is a fictional practice. The beam check is a teaching aid and must not be used for design.</footer>
    </div>
  )
}
