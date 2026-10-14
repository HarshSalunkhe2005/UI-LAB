import { useRef, useState } from 'react'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/newsreader'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'
import Figure, { H, W, type Pt } from './Figure'

/*
 * A GENTLE GUIDE TO CURVES: an explorable explainer. World 24 (Explorable Explainer).
 * Signature: the figure is the argument. Each idea is a short passage beside a figure you can drag, nudge with the arrow
 * keys and scrub with a slider, and the numbers underneath (the formula, the SVG path, the CSS easing) update as you
 * move. It builds from a line to a quadratic to a cubic Bezier and ends on the easing curves used in CSS.
 */

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const f = (n: number) => Math.round(n)
const seg = (a: Pt, b: Pt, cls: string) => <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className={cls} />

function T({ t, set, id }: { t: number; set: (n: number) => void; id: string }) {
  return (
    <div className="tctl">
      <label htmlFor={id}>t = <b>{t.toFixed(2)}</b></label>
      <input id={id} type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => set(Number(e.target.value))} aria-valuetext={`t equals ${t.toFixed(2)}`} />
    </div>
  )
}

export default function CurvesSite() {
  const root = useRef<HTMLDivElement>(null)
  useSiteScroll(root, { smooth: false })

  const [l, setL] = useState<Pt[]>([[70, 220], [340, 80]])
  const [lt, setLt] = useState(0.4)
  const [q, setQ] = useState<Pt[]>([[60, 230], [200, 40], [360, 210]])
  const [qt, setQt] = useState(0.5)
  const [c, setC] = useState<Pt[]>([[50, 230], [120, 40], [300, 40], [370, 230]])
  const [ct, setCt] = useState(0.5)
  const [ex, setEx] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1])
  const [run, setRun] = useState(0)
  const [copied, setCopied] = useState(false)

  const lp = lerp(l[0], l[1], lt)
  const q01 = lerp(q[0], q[1], qt), q12 = lerp(q[1], q[2], qt), qp = lerp(q01, q12, qt)
  const c01 = lerp(c[0], c[1], ct), c12 = lerp(c[1], c[2], ct), c23 = lerp(c[2], c[3], ct)
  const c012 = lerp(c01, c12, ct), c123 = lerp(c12, c23, ct), cp = lerp(c012, c123, ct)
  const cd = `M ${f(c[0][0])} ${f(c[0][1])} C ${f(c[1][0])} ${f(c[1][1])}, ${f(c[2][0])} ${f(c[2][1])}, ${f(c[3][0])} ${f(c[3][1])}`
  const ease = `cubic-bezier(${ex.map((n) => n.toFixed(2)).join(', ')})`

  // Easing editor: two handles in a unit square mapped to a 300x240 box.
  const BX = 60, BY = 30, BW = 300, BH = 240
  const ep = (x: number, y: number): Pt => [BX + x * BW, BY + (1 - y) * BH]
  const fromEp = ([px, py]: Pt) => [Math.max(0, Math.min(1, (px - BX) / BW)), Math.max(-0.5, Math.min(1.5, 1 - (py - BY) / BH))]
  const h1 = ep(ex[0], ex[1]), h2 = ep(ex[2], ex[3])
  const setEase = (p: Pt[]) => {
    const a = fromEp(p[0]), b = fromEp(p[1])
    setEx([a[0], a[1], b[0], b[1]])
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ease)
    } catch {
      /* clipboard may be blocked */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="site-curves" ref={root}>
      <header className="top">
        <a href="#top" className="logo">Curves</a>
        <nav aria-label="Sections"><a href="#line">Line</a><a href="#quad">Quadratic</a><a href="#cubic">Cubic</a><a href="#ease">Easing</a></nav>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="h1">
          <p className="kicker">An explorable guide</p>
          <h1 id="h1">A gentle guide to curves</h1>
          <p className="lede">Every smooth shape on a screen, from a letter to a button’s animation, is made from one idea. You will build it in four steps, and you can drag everything. No maths needed to start.</p>
          <p className="tip">Drag the round points, or focus one and use the arrow keys (hold Shift for bigger steps).</p>
        </section>

        <section className="step" id="line" aria-labelledby="h2l">
          <div className="text">
            <p className="num">1</p>
            <h2 id="h2l">A line is a blend of two points</h2>
            <p>Take two points. Pick a number <i>t</i> between 0 and 1. At 0 you are on the first point; at 1 you are on the second; in between you are some fraction of the way along. That blend is called a <b>linear interpolation</b>.</p>
            <T t={lt} set={setLt} id="tl" />
            <p className="calc" role="status">P = (1 − {lt.toFixed(2)})·P0 + {lt.toFixed(2)}·P1 = ({f(lp[0])}, {f(lp[1])})</p>
          </div>
          <Figure pts={l} set={setL} labels={['Point 0', 'Point 1']} caption="Two draggable points and the blended point between them.">
            {seg(l[0], l[1], 'ln')}
            <circle cx={lp[0]} cy={lp[1]} r="7" className="mover" />
          </Figure>
        </section>

        <section className="step" id="quad" aria-labelledby="h2q">
          <div className="text">
            <p className="num">2</p>
            <h2 id="h2q">Add a third point and the line bends</h2>
            <p>Blend P0 with P1, and P1 with P2, at the same <i>t</i>. You now have two moving points. Blend <em>those</em> and you get a point that traces a smooth arc: a <b>quadratic Bézier curve</b>. The middle point pulls the curve towards itself without ever touching it.</p>
            <T t={qt} set={setQt} id="tq" />
            <p className="calc" role="status">Point on the curve at t = {qt.toFixed(2)}: ({f(qp[0])}, {f(qp[1])})</p>
          </div>
          <Figure pts={q} set={setQ} labels={['Point 0', 'Point 1', 'Point 2']} caption="A quadratic Bézier curve and the construction lines that make it.">
            {seg(q[0], q[1], 'guide')}
            {seg(q[1], q[2], 'guide')}
            {seg(q01, q12, 'ln2')}
            <path d={`M ${q[0][0]} ${q[0][1]} Q ${q[1][0]} ${q[1][1]} ${q[2][0]} ${q[2][1]}`} className="curve" fill="none" />
            <circle cx={q01[0]} cy={q01[1]} r="5" className="mid" />
            <circle cx={q12[0]} cy={q12[1]} r="5" className="mid" />
            <circle cx={qp[0]} cy={qp[1]} r="7" className="mover" />
          </Figure>
        </section>

        <section className="step" id="cubic" aria-labelledby="h2c">
          <div className="text">
            <p className="num">3</p>
            <h2 id="h2c">Four points make the curves you draw with</h2>
            <p>Repeat once more and you have a <b>cubic Bézier</b>: two end points and two handles. This is what the pen tool in a drawing program makes, and what fonts and logos are built from. In an SVG it is the letter <code>C</code>.</p>
            <T t={ct} set={setCt} id="tc" />
            <pre className="code" tabIndex={0} aria-label="SVG path for this curve">{`<path d="${cd}" />`}</pre>
          </div>
          <Figure pts={c} set={setC} labels={['Point 0', 'Handle 1', 'Handle 2', 'Point 3']} caption="A cubic Bézier curve with two handles.">
            {seg(c[0], c[1], 'guide')}
            {seg(c[2], c[3], 'guide')}
            {seg(c[1], c[2], 'guide faint')}
            {seg(c012, c123, 'ln2')}
            <path d={cd} className="curve" fill="none" />
            {[c01, c12, c23, c012, c123].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4.5" className="mid" />)}
            <circle cx={cp[0]} cy={cp[1]} r="7" className="mover" />
          </Figure>
        </section>

        <section className="step" id="ease" aria-labelledby="h2e">
          <div className="text">
            <p className="num">4</p>
            <h2 id="h2e">Time can bend too</h2>
            <p>CSS uses the same curve to describe speed. Put time on the horizontal axis and progress on the vertical one. A steep part means fast; a flat part means slow. Drag the two handles, then press Play.</p>
            <div className="presets" role="group" aria-label="Presets">
              {([['ease', [0.25, 0.1, 0.25, 1]], ['ease-in-out', [0.42, 0, 0.58, 1]], ['overshoot', [0.34, 1.56, 0.64, 1]], ['linear', [0, 0, 1, 1]]] as const).map(([n, v]) => <button key={n} onClick={() => { setEx([...v] as [number, number, number, number]); setRun((r) => r + 1) }}>{n}</button>)}
            </div>
            <pre className="code" tabIndex={0} aria-label="CSS easing">{`transition-timing-function: ${ease};`}</pre>
            <div className="row">
              <button className="play" onClick={() => setRun((r) => r + 1)}>Play</button>
              <button className="copy" onClick={copy}>{copied ? 'Copied' : 'Copy the CSS'}</button>
            </div>
            <div className="track" aria-hidden>
              <span key={run} className="ball" style={{ animation: reducedMotion() || run === 0 ? 'none' : `cv-curves-go 1.2s ${ease} forwards`, translate: reducedMotion() ? 'calc(100cqw - 22px) 0' : undefined }} />
            </div>
            <p className="calc" role="status">{reducedMotion() ? 'Reduced motion is on: the dot jumps to the end, but the curve still shows the speed.' : 'The dot follows this easing for 1.2 seconds.'}</p>
          </div>
          <Figure pts={[h1, h2]} set={setEase} labels={['Handle 1', 'Handle 2']} caption="An easing curve: time across, progress up. Handles may go beyond the box to overshoot.">
            <rect x={BX} y={BY} width={BW} height={BH} className="unit" />
            <line x1={BX} y1={BY + BH} x2={h1[0]} y2={h1[1]} className="guide" />
            <line x1={BX + BW} y1={BY} x2={h2[0]} y2={h2[1]} className="guide" />
            <path d={`M ${BX} ${BY + BH} C ${h1[0]} ${h1[1]}, ${h2[0]} ${h2[1]}, ${BX + BW} ${BY}`} className="curve" fill="none" />
            <text x={BX} y={H - 8} className="plabel" aria-hidden>time →</text>
            <text x="8" y={BY + 10} className="plabel" aria-hidden>progress</text>
            <text x={W - 10} y={H - 8} className="plabel" textAnchor="end" aria-hidden>{ease}</text>
          </Figure>
        </section>
      </main>
      <footer className="foot">
        <p>A fictional explorable guide, written for UI Lab. The same curve draws your handwriting font, your logo and the way a menu slides open.</p>
      </footer>
    </div>
  )
}
