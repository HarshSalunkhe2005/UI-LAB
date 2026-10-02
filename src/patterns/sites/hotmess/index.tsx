import { useEffect, useRef, useState } from 'react'
import '@fontsource/archivo-black'
import '@fontsource/space-mono'
import '@fontsource/space-mono/700.css'
import './styles.css'
import Stickers from './Stickers'
import { reducedMotion, useSiteScroll } from '../_shared'

const reduced = reducedMotion()

const BEANS = [
  { id: 'fire', name: 'Dumpster Fire', level: 5, notes: 'Burnt toast, dark chocolate, regret.', price: 18, bg: 'tomato', big: true },
  { id: 'sunday', name: 'Sunday Scaries', level: 3, notes: 'Caramel, hazelnut, mild dread.', price: 17, bg: 'lemon' },
  { id: 'oops', name: 'Oops All Fruit', level: 1, notes: 'Blueberry jam, peach, a rumour of tea.', price: 19, bg: 'mint' },
]

const ROASTS = ['Barely warm', 'Sunday scaries', 'Perfectly fine', 'Dark and moody', 'Dumpster fire']
const TAGLINES = ['LIGHT AS A LIE', 'MOSTLY HARMLESS', 'ACCEPTABLY MESSY', 'DARK AS MY SOUL', 'ABSOLUTELY FERAL']
const GRINDS = ['Whole bean', 'Espresso', 'Filter']
const BAG_COLORS = ['#8de8b5', '#ffd23f', '#fff1d6', '#2f5bff', '#ff4b2b']

function Meter({ level }: { level: number }) {
  return (
    <div className="meter" role="img" aria-label={`Roast level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? 'on' : ''} />
      ))}
    </div>
  )
}

export default function HotMessSite() {
  const root = useRef<HTMLDivElement>(null)
  useSiteScroll(root, { smooth: false })
  const [bag, setBag] = useState(0)
  const [pop, setPop] = useState(0)
  const [roast, setRoast] = useState(3)
  const [grind, setGrind] = useState(0)
  const [toast, setToast] = useState('')
  const t = useRef<number>(0)

  const add = (label: string) => {
    setBag((b) => b + 1)
    setPop((p) => p + 1)
    setToast(`${label} added. Bad decision logged.`)
    clearTimeout(t.current)
    t.current = window.setTimeout(() => setToast(''), 1800)
  }

  useEffect(() => {
    if (reduced) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 })
    document.querySelectorAll('.rise').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={root} className="site-hotmess">
      <header className="nav">
        <a href="#top" className="logo">HOT<span>MESS</span></a>
        <nav>
          <a href="#beans">Beans</a>
          <a href="#build">Build a bag</a>
          <button className="bagbtn" aria-label={`Bag, ${bag} items`}>
            Bag <b key={pop} className={pop ? 'pop' : ''}>{bag}</b>
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <h1>
            <span>HOT</span>
            <span className="r">MESS</span>
          </h1>
          <p className="sub">Coffee roasted in small batches by people who should really know better.</p>
          <a className="btn" href="#beans">Shop the beans</a>
          <p className="drag-hint">Go on, grab a sticker. Throw it.</p>
          <Stickers />
        </section>

        <div className="strip a" aria-hidden="true">
          <div>{Array.from({ length: 2 }).map((_, k) => <span key={k}>ROASTED TUESDAY ★ SHIPPED WEDNESDAY ★ GONE BY FRIDAY ★ NO REFUNDS ON REGRET ★ </span>)}</div>
        </div>

        <section className="beans" id="beans">
          <h2 className="rise">The lineup. <span>Pick your poison.</span></h2>
          <div className="lineup">
            {BEANS.map((b) => (
              <article key={b.id} className={`bean ${b.bg} ${b.big ? 'big' : ''} rise`}>
                <h3>{b.name}</h3>
                <Meter level={b.level} />
                <p>{b.notes}</p>
                <div className="buy">
                  <span>${b.price}</span>
                  <button onClick={() => add(b.name)}>Add to bag</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="strip b" aria-hidden="true">
          <div>{Array.from({ length: 2 }).map((_, k) => <span key={k}>SMALL BATCH ★ BIG OPINIONS ★ SMALL BATCH ★ BIG OPINIONS ★ SMALL BATCH ★ BIG OPINIONS ★ </span>)}</div>
        </div>

        <section className="build" id="build">
          <div className="controls rise">
            <h2>Build<br />your bag.</h2>
            <label htmlFor="roast" className="lbl">Roast: <b>{ROASTS[roast - 1]}</b></label>
            <input id="roast" type="range" min={1} max={5} step={1} value={roast} onChange={(e) => setRoast(Number(e.target.value))} aria-valuetext={ROASTS[roast - 1]} />
            <div className="ticks" aria-hidden="true">{[1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}</div>

            <div className="lbl">Grind</div>
            <div className="seg" role="radiogroup" aria-label="Grind">
              {GRINDS.map((g, i) => (
                <button key={g} role="radio" aria-checked={i === grind} className={i === grind ? 'on' : ''} onClick={() => setGrind(i)}>{g}</button>
              ))}
            </div>
            <button className="btn full" onClick={() => add('Custom bag')}>Add to bag · ${16 + roast}</button>
          </div>

          <div className="preview" aria-live="polite">
            <div className="bagshape" style={{ background: BAG_COLORS[roast - 1], color: roast >= 4 ? '#fff1d6' : '#111' }}>
              <div className="fold" />
              <small>HOT MESS COFFEE</small>
              <strong key={roast}>{TAGLINES[roast - 1]}</strong>
              <Meter level={roast} />
              <em>{GRINDS[grind]} · 340 g</em>
              <span className="stamp">NO. {roast}</span>
            </div>
          </div>
        </section>

        <footer className="foot">
          <h2>STAY<br />CAFFEINATED.<br /><span>(Responsibly. Ish.)</span></h2>
          <p>Demo site for a fictional roaster. Nothing is sold.</p>
        </footer>
      </main>

      <div className={`toast ${toast ? 'on' : ''}`} role="status">{toast}</div>
    </div>
  )
}
