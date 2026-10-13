import { useEffect, useRef, useState } from 'react'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource/caveat/500.css'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'
import { Plant, SPECIES } from './Plant'

/*
 * HEDGEROW PRESS: a pressed-plant print shop set as an open field notebook. World 10 (Herbarium).
 * Signature: a plate you can interrogate (numbered callouts with handwritten notes) and a plant press you
 * turn with a slider, so you watch a flower dry and flatten over fourteen days. Everything is real text.
 */

const reduced = reducedMotion()
const SEASONS = ['All', 'Spring', 'Summer', 'Autumn'] as const

const PARTS = [
  { n: 1, name: 'Corolla', note: 'Five petals, opening at dusk and closing by noon.', top: '16%', left: '66%' },
  { n: 2, name: 'Leaf', note: 'Lanceolate, finely serrate. Press it flat the same day.', top: '73%', left: '22%' },
  { n: 3, name: 'Stem', note: 'Hollow and ribbed. It bends, so tie it before pressing.', top: '48%', left: '50%' },
  { n: 4, name: 'Root', note: 'Left in the ground. We only ever take the flower and one leaf.', top: '95%', left: '50%' },
]

export default function HerbariumSite() {
  const root = useRef<HTMLDivElement>(null)
  const [part, setPart] = useState<number | null>(null)
  const [season, setSeason] = useState<(typeof SEASONS)[number]>('All')
  const [days, setDays] = useState(0)
  const [pick, setPick] = useState(0)
  const [frame, setFrame] = useState('Oak')
  const [ordered, setOrdered] = useState(false)
  const rows = SPECIES.filter((s) => season === 'All' || s.season === season)
  const sp = SPECIES[pick]
  const frames: Record<string, number> = { Oak: 24, Ash: 24, Walnut: 36, Unframed: 0 }

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    if (reduced) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.2 })
    root.current?.querySelectorAll('.rev').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="site-herbarium" ref={root}>
      <header className="mast">
        <a href="#top" className="brand">Hedgerow <em>Press</em></a>
        <nav aria-label="Sections">
          <a href="#index">The index</a>
          <a href="#press">The press</a>
          <a href="#order">Order a plate</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <div className="hero-text">
            <p className="label">Plate XIV · Campanula, from a hedgerow near the river</p>
            <h1 id="h1">Notes from<br />the <em>hedgerow</em>.</h1>
            <p className="lede">Pressed-plant prints and field guides, made one season at a time. Every plate is a single specimen, collected by hand and mounted on cotton paper.</p>
            <a href="#index" className="btn">Browse the index</a>
          </div>
          <figure className="plate" onPointerLeave={() => setPart(null)}>
            <div className="art">
              <Plant petals={5} leaves={4} hue={255} className="plate-art" label="A pressed harebell on a cream plate with four numbered parts" />
              {PARTS.map((p) => (
                <button key={p.n} className={`pin ${part === p.n ? 'on' : ''}`} style={{ top: p.top, left: p.left }} onPointerEnter={() => setPart(p.n)} onFocus={() => setPart(p.n)} onBlur={() => setPart(null)} aria-label={`${p.n}. ${p.name}`}>{p.n}</button>
              ))}
            </div>
            <figcaption className="note" aria-live="polite">{part ? PARTS[part - 1].note : 'Point at a number to read the field note.'}</figcaption>
          </figure>
        </section>

        <section className="index rev" id="index" aria-labelledby="h2i">
          <div className="head">
            <h2 id="h2i">The index</h2>
            <div className="seasons" role="radiogroup" aria-label="Filter by season">
              {SEASONS.map((s) => <button key={s} role="radio" aria-checked={season === s} className={season === s ? 'on' : ''} onClick={() => setSeason(s)}>{s}</button>)}
            </div>
          </div>
          <table>
            <caption className="sr-only">Specimens in the index</caption>
            <thead><tr><th scope="col">Plant</th><th scope="col">Latin</th><th scope="col">Habitat</th><th scope="col">Season</th><th scope="col" className="r">Plate</th></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} onPointerEnter={() => setPick(SPECIES.indexOf(s))} onFocus={() => setPick(SPECIES.indexOf(s))} tabIndex={0}>
                  <th scope="row">{s.common}</th>
                  <td className="latin">{s.latin}</td>
                  <td>{s.hab}</td>
                  <td>{s.season}</td>
                  <td className="r">£{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside className="peek" aria-hidden>
            <Plant petals={sp.petals} leaves={sp.leaves} hue={sp.hue} className="peek-art" label={sp.common} />
            <p>{sp.common}</p>
          </aside>
        </section>

        <section className="press rev" id="press" aria-labelledby="h2p">
          <h2 id="h2p">Fourteen days under the weight.</h2>
          <p className="intro">Fresh plants are mostly water. In the press they lose it slowly between blotting paper, and flatten, and fade to the colours of old books. Turn the screw and watch.</p>
          <div className="press-box">
            <div className="press-art">
              <Plant petals={sp.petals} leaves={sp.leaves} hue={sp.hue} dry={days / 14} className="press-plant" label={`${sp.common}, pressed for ${days} days`} />
            </div>
            <div className="press-ctl">
              <label htmlFor="days">Days pressed: <b>{days}</b></label>
              <input id="days" type="range" min={0} max={14} value={days} onChange={(e) => setDays(Number(e.target.value))} aria-valuetext={`${days} days`} />
              <p className="hand" aria-live="polite">{days === 0 ? 'Just picked. Still full of water.' : days < 5 ? 'Colour holding. Change the blotting paper.' : days < 11 ? 'Flattening nicely. Do not peek.' : days < 14 ? 'Nearly paper. The colours have softened.' : 'Ready to mount.'}</p>
              <div className="pick" role="radiogroup" aria-label="Choose a specimen">
                {SPECIES.map((s, i) => <button key={s.id} role="radio" aria-checked={pick === i} className={pick === i ? 'on' : ''} onClick={() => setPick(i)}>{s.common}</button>)}
              </div>
            </div>
          </div>
        </section>

        <section className="order rev" id="order" aria-labelledby="h2o">
          <h2 id="h2o">Order a plate.</h2>
          <form onSubmit={(e) => { e.preventDefault(); setOrdered(true) }}>
            <label>Specimen
              <select value={pick} onChange={(e) => setPick(Number(e.target.value))}>{SPECIES.map((s, i) => <option key={s.id} value={i}>{s.common}</option>)}</select>
            </label>
            <label>Frame
              <select value={frame} onChange={(e) => setFrame(e.target.value)}>{Object.keys(frames).map((f) => <option key={f}>{f}</option>)}</select>
            </label>
            <p className="total">Total <b>£{sp.price + frames[frame]}</b></p>
            <button className="btn">Reserve this plate</button>
          </form>
          <p className="hand big" aria-live="polite">{ordered ? `Reserved: ${sp.common}, ${frame.toLowerCase()} frame. We will write to you when it is mounted.` : ' '}</p>
        </section>
      </main>

      <footer className="colophon">
        <p>Set in Fraunces and Caveat. Every plant was collected with permission and only where it was common.</p>
        <p className="fine">A fictional press. Names, prices and places are invented.</p>
      </footer>
    </div>
  )
}
