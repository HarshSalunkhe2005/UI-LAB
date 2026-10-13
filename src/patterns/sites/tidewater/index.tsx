import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { H, N, W, contour, extremes, hhmm, sample, seabed, tideAt } from './chart'

/*
 * HARROW SOUND: a harbour authority's tide and pilotage page. World 20 (Nautical Chart), the Operate-mode proof.
 * Signature: the chart is the tool. Pick your vessel's draft, scrub the time of day, and the generated seabed redraws:
 * land dries, shallows turn hazard-pink, and a plain sentence says whether the channel is safe to enter.
 * The chart is a canvas for the tints and SVG for the contours, so the numbers stay real text.
 */

const DRAFTS = [1.2, 2.5, 3.5, 4.5]
const CLEARANCE = 0.6
const CHANNEL = [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.59, 0.62, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9].map((u) => [u, 0.42 + 0.26 * u] as const)

function tint(a: number, danger: number): [number, number, number] {
  if (a < 0) return [230, 211, 163] // dries
  if (a < danger) return [221, 170, 196] // too shallow for this vessel
  if (a < 4) return [207, 231, 226]
  if (a < 9) return [190, 224, 220]
  if (a < 15) return [166, 211, 212]
  return [136, 188, 196]
}

export default function TidewaterSite() {
  const root = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(9)
  const [draft, setDraft] = useState(2.5)
  const [vessel, setVessel] = useState('')
  const [eta, setEta] = useState('')
  const [sent, setSent] = useState<'idle' | 'bad' | 'ok'>('idle')

  useSiteScroll(root, { smooth: false })

  const f = useMemo(seabed, [])
  const tide = tideAt(t)
  const danger = draft + CLEARANCE
  const lines = useMemo(() => [0, 5, 10, 15, 20].map((l) => [l, contour(f, l)] as const), [f])
  const ex = useMemo(extremes, [])
  const rising = tideAt(t + 0.1) > tide

  const limiting = useMemo(() => Math.min(...CHANNEL.map(([u, v]) => sample(f, u * (N - 1), v * (N - 1)) + tide)), [f, tide])
  const safe = limiting >= danger

  useEffect(() => {
    const c = cv.current
    if (!c) return
    const cw = 280
    const ch = Math.round(cw * (H / W))
    c.width = cw
    c.height = ch
    const g = c.getContext('2d')!
    const img = g.createImageData(cw, ch)
    for (let y = 0; y < ch; y++)
      for (let x = 0; x < cw; x++) {
        const a = sample(f, (x / (cw - 1)) * (N - 1), (y / (ch - 1)) * (N - 1)) + tide
        const [r, gg, b] = tint(a, danger)
        const i = (y * cw + x) * 4
        img.data[i] = r
        img.data[i + 1] = gg
        img.data[i + 2] = b
        img.data[i + 3] = 255
      }
    g.putImageData(img, 0, 0)
  }, [f, tide, danger])

  const soundings = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const gx = 3 + ((i * 7) % 42)
        const gy = 3 + ((i * 11) % 42)
        return { x: (gx / (N - 1)) * W, y: (gy / (N - 1)) * H, d: f[gy * N + gx] }
      }),
    [f],
  )

  const next = ex.find((e) => e.t > t) ?? ex[0]

  return (
    <div className="site-tidewater" ref={root}>
      <header className="top">
        <a href="#top" className="logo">Harrow Sound <span>Harbour Authority</span></a>
        <nav aria-label="Sections">
          <a href="#planner">Tide planner</a>
          <a href="#table">Tide table</a>
          <a href="#pilot">Pilotage</a>
          <a href="#notices">Notices</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <p className="kicker">Chart datum, metres. Times local.</p>
          <h1 id="h1">Know the water before you leave the berth.</h1>
          <p className="lede">The channel into Harrow Sound moves with the tide. Choose your draft, set the time you will arrive, and see on the chart whether there is water under you.</p>
          <a className="cta" href="#planner">Open the planner</a>
        </section>

        <section className="planner" id="planner" aria-labelledby="h2p">
          <h2 id="h2p">Tide planner</h2>
          <div className="plan-grid">
            <figure className="chart">
              <div className="chart-box">
                <canvas ref={cv} aria-hidden />
                <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Chart of Harrow Sound at ${hhmm(t)}. Tide ${tide.toFixed(1)} metres. Limiting depth in the channel ${limiting.toFixed(1)} metres. ${safe ? 'Safe to enter' : 'Not safe to enter'} for a ${draft} metre draft.`}>
                  {lines.map(([l, d]) => (
                    <path key={l} d={d} fill="none" stroke="#2a5b6b" strokeWidth={l === 0 ? 1.8 : 0.8} opacity={l === 0 ? 0.95 : 0.55} />
                  ))}
                  {CHANNEL.map(([u, v], i) => (i === 0 ? null : <line key={i} x1={CHANNEL[i - 1][0] * W} y1={CHANNEL[i - 1][1] * H} x2={u * W} y2={v * H} stroke="#a22b63" strokeWidth="1.4" strokeDasharray="5 4" />))}
                  <text x={0.62 * W} y={(0.42 + 0.26 * 0.62) * H - 16} fontSize="10" textAnchor="middle" className="snd" fontWeight="500">THE BAR</text>
                  {soundings.map((s, i) => (
                    <text key={i} x={s.x} y={s.y} fontSize="9" textAnchor="middle" className="snd">{Math.abs(s.d).toFixed(0)}{s.d < 0 ? 'D' : ''}</text>
                  ))}
                  <rect x="2" y="2" width={W - 4} height={H - 4} fill="none" stroke="#11303a" strokeWidth="1.5" />
                </svg>
              </div>
              <figcaption>Generated chart. Magenta dashes are the dredged channel; soundings are metres below chart datum, D marks ground that dries.</figcaption>
            </figure>

            <div className="controls">
              <fieldset>
                <legend>Vessel draft</legend>
                <div className="drafts" role="radiogroup" aria-label="Vessel draft">
                  {DRAFTS.map((d) => (
                    <button key={d} role="radio" aria-checked={draft === d} className={draft === d ? 'on' : ''} onClick={() => setDraft(d)}>{d.toFixed(1)} m</button>
                  ))}
                </div>
              </fieldset>

              <label className="time" htmlFor="tm">Time of arrival <b>{hhmm(t)}</b></label>
              <input id="tm" type="range" min={0} max={95} step={1} value={Math.round(t * 4)} onChange={(e) => setT(Number(e.target.value) / 4)} aria-valuetext={`${hhmm(t)}, tide ${tide.toFixed(1)} metres, ${rising ? 'rising' : 'falling'}`} />
              <div className="ticks" aria-hidden><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>

              <dl className="read">
                <div><dt>Tide</dt><dd>{tide.toFixed(1)} m {rising ? '▲ rising' : '▼ falling'}</dd></div>
                <div><dt>Next {next.kind.toLowerCase()} water</dt><dd>{hhmm(next.t)} · {next.h.toFixed(1)} m</dd></div>
                <div><dt>Shallowest in channel</dt><dd>{limiting.toFixed(1)} m</dd></div>
                <div><dt>You need</dt><dd>{danger.toFixed(1)} m ({draft.toFixed(1)} + {CLEARANCE} clearance)</dd></div>
              </dl>
              <p className={`verdict ${safe ? 'ok' : 'no'}`} role="status">
                {safe ? '✓ Enough water to enter the channel at this time.' : '✕ Not enough water at this time. Wait for the tide, or reduce draft.'}
              </p>
            </div>
          </div>
        </section>

        <section className="table-sec" id="table" aria-labelledby="h2t">
          <h2 id="h2t">Tide table, today</h2>
          <table>
            <caption className="sr-only">High and low waters</caption>
            <thead><tr><th scope="col">Time</th><th scope="col">Water</th><th scope="col" className="n">Height</th></tr></thead>
            <tbody>
              {ex.map((e) => (
                <tr key={e.t}>
                  <th scope="row">{hhmm(e.t)}</th>
                  <td>{e.kind === 'High' ? '▲ High water' : '▼ Low water'}</td>
                  <td className="n">{e.h.toFixed(1)} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="pilot" id="pilot" aria-labelledby="h2b">
          <h2 id="h2b">Request a pilot</h2>
          <p>Pilotage is compulsory for vessels over 60 m. Send your details at least four hours ahead.</p>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setSent(vessel.trim().length > 1 && /^\d{1,2}:\d{2}$/.test(eta) ? 'ok' : 'bad')
            }}
          >
            <label htmlFor="vn">Vessel name</label>
            <input id="vn" value={vessel} onChange={(e) => { setVessel(e.target.value); setSent('idle') }} aria-invalid={sent === 'bad' && vessel.trim().length < 2} aria-describedby="pm" autoComplete="off" />
            <label htmlFor="eta">Estimated arrival (HH:MM)</label>
            <input id="eta" value={eta} onChange={(e) => { setEta(e.target.value); setSent('idle') }} placeholder="14:30" inputMode="numeric" aria-invalid={sent === 'bad' && !/^\d{1,2}:\d{2}$/.test(eta)} aria-describedby="pm" autoComplete="off" />
            <button>Send request</button>
            <p id="pm" role={sent === 'bad' ? 'alert' : 'status'}>{sent === 'bad' ? 'Enter the vessel name and an arrival time like 14:30.' : sent === 'ok' ? `Request noted for ${vessel.trim()}. A pilot will call you on channel 12.` : ' '}</p>
          </form>
        </section>

        <section className="notices" id="notices" aria-labelledby="h2n">
          <h2 id="h2n">Notices to mariners</h2>
          <ul>
            <li><b>Dredging</b> Channel buoys 3 and 4 moved 40 m east until the end of the month. Keep to the magenta line on the chart.</li>
            <li><b>Shoaling</b> The bar south of the breakwater has built up. Allow an extra half metre for deep-draft vessels.</li>
            <li><b>Speed</b> Five knots inside the breakwater at all states of the tide.</li>
          </ul>
        </section>
      </main>
      <footer className="foot">Harrow Sound is a fictional harbour. The chart and tide model are generated and must never be used for navigation.</footer>
    </div>
  )
}
