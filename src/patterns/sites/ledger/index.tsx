import { useEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import '@fontsource-variable/libre-franklin'
import './styles.css'
import { useSiteScroll } from '../_shared'

/*
 * THE LEDGER: a small finance newsletter set as a broadsheet. World 12 (Broadsheet), the Read-mode proof.
 * Signature: reading is the interface. A progress rule, text-size control, marginal sidenotes instead of footnotes,
 * justified hyphenated columns, and a markets table where change is shown by sign and arrow, not colour alone.
 */

const MARKETS: [string, string, number, number[]][] = [
  ['Nifty 50', '24,812', 0.4, [10, 12, 11, 14, 13, 16, 18, 17, 20]],
  ['Sensex', '81,340', 0.3, [8, 9, 12, 11, 13, 14, 13, 16, 17]],
  ['Gold, 10 g', '74,120', -0.1, [18, 17, 19, 16, 17, 15, 16, 15, 14]],
  ['Brent', '81.4', 1.2, [9, 8, 10, 9, 12, 11, 14, 15, 16]],
  ['USD / INR', '83.6', 0.0, [12, 12, 13, 12, 12, 13, 12, 12, 12]],
  ['10-yr G-sec', '7.02%', -0.02, [14, 15, 14, 13, 14, 12, 13, 12, 12]],
]

const SIDENOTES = [
  'Reserves rose from $571bn to $646bn over the two years the essay covers. The central bank does not publish daily intervention figures.',
  'A currency that moves less than its peers is not necessarily strong. It may simply be managed.',
  'The 2013 taper episode is the usual comparison. It is a poor one: the current account deficit then was more than three times today’s.',
]

const SIZES = [
  ['S', 16],
  ['M', 18],
  ['L', 21],
] as const

function Spark({ pts, up }: { pts: number[]; up: boolean }) {
  const d = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (pts.length - 1)) * 60} ${24 - y}`).join('')
  return (
    <svg viewBox="0 0 60 26" className="spark" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={up ? undefined : '0'} />
    </svg>
  )
}

export default function LedgerSite() {
  const root = useRef<HTMLDivElement>(null)
  const art = useRef<HTMLElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(18)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'bad' | 'ok'>('idle')

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const a = art.current
      if (!a || !bar.current) return
      const r = a.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.6
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.2 - r.top) / Math.max(1, total)))
      bar.current.style.transform = `scaleX(${p})`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', on, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  const date = useMemo(() => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()), [])

  return (
    <div className="site-ledger" ref={root}>
      <div className="prog" aria-hidden><div ref={bar} className="prog-bar" /></div>
      <header className="mast">
        <p className="strap"><span>Vol. XII · No. 214</span><span>{date}</span><span>Mumbai</span></p>
        <h1 className="title">The Ledger</h1>
        <nav className="sections" aria-label="Sections">
          <a href="#front">Front page</a>
          <a href="#markets">Markets</a>
          <a href="#essay">The essay</a>
          <a href="#letters">Letters</a>
          <a href="#subscribe" className="sub">Subscribe</a>
        </nav>
      </header>

      <main>
        <section id="front" className="front" aria-labelledby="lead">
          <article className="lead">
            <p className="kicker">Economics</p>
            <h2 id="lead">A currency that refuses to move, and the price of that stillness</h2>
            <p className="deck">For two years the rupee has traded in a band so narrow that traders stopped quoting the range. The calm is deliberate, and it is not free.</p>
            <p className="by">By the Economics Desk · <a href="#essay">Read the essay, 9 min</a></p>
          </article>
          <article className="side">
            <p className="kicker">Business</p>
            <h3>Small lenders quietly tighten the screws</h3>
            <p>Microfinance books grew twice as fast as incomes last year. This quarter the loan officers stopped saying yes.</p>
          </article>
          <article className="side">
            <p className="kicker">Policy</p>
            <h3>The budget’s smallest line is its biggest bet</h3>
            <p>Four hundred crore for a payments rail nobody has built yet, and the argument for why it might be the best money spent.</p>
          </article>
        </section>

        <section id="markets" className="markets" aria-labelledby="mk">
          <h2 id="mk">Markets</h2>
          <table>
            <caption className="sr-only">Closing levels and change</caption>
            <thead><tr><th scope="col">Instrument</th><th scope="col" className="n">Close</th><th scope="col" className="n">Change</th><th scope="col"><span className="sr-only">Trend, last nine sessions</span></th></tr></thead>
            <tbody>
              {MARKETS.map(([n, v, c, p]) => (
                <tr key={n}>
                  <th scope="row">{n}</th>
                  <td className="n">{v}</td>
                  <td className="n chg">{c > 0 ? '▲ +' : c < 0 ? '▼ ' : '– '}{Math.abs(c).toFixed(2)}%</td>
                  <td className="tr"><Spark pts={p} up={c >= 0} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <article id="essay" className="essay" ref={art} style={{ ['--fs' as string]: `${size}px` }} aria-labelledby="et">
          <header>
            <p className="kicker">The essay</p>
            <h2 id="et">The price of a quiet rupee</h2>
            <div className="ctl" role="radiogroup" aria-label="Text size">
              Text size
              {SIZES.map(([l, px]) => <button key={l} role="radio" aria-checked={size === px} className={size === px ? 'on' : ''} onClick={() => setSize(px)} aria-label={`${l === 'S' ? 'Small' : l === 'M' ? 'Medium' : 'Large'} text`}>{l}</button>)}
            </div>
          </header>
          <div className="body">
            <div className="blk"><p className="first">The rupee has spent most of the year doing very little, which is itself the story. Traders who expected a swing in either direction found a currency that moved the way a tide does, slowly and with a predictable return.<sup><a href="#sn1" id="r1">1</a></sup></p><aside id="sn1" className="sn"><b>1</b> {SIDENOTES[0]}</aside></div>
            <p>Behind the calm sits a central bank that has been quietly buying dollars on every dip, building a cushion that few outside the market appreciate. The cost is real, and it is paid in the form of reserves that cannot be spent twice.</p>
            <div className="blk"><p>Economists disagree about how long the arrangement can last. Some argue that a stable currency is worth almost any price; others point out that stability purchased with reserves is borrowed against the next shock.<sup><a href="#sn2" id="r2">2</a></sup></p><aside id="sn2" className="sn"><b>2</b> {SIDENOTES[1]}</aside></div>
            <blockquote>“Stability bought with reserves is borrowed against the next shock.”</blockquote>
            <div className="blk"><p>What both camps accept is that the margin for error is shrinking. A single bad quarter of exports, or one oil spike that lasts a month rather than a week, would test the cushion in ways the last two years have not.<sup><a href="#sn3" id="r3">3</a></sup></p><aside id="sn3" className="sn"><b>3</b> {SIDENOTES[2]}</aside></div>
            <p>For households the lesson is more modest. A steady rupee has made imported goods predictable, and the habit of planning around it has spread. The risk is that planning becomes assumption, and that the first year of movement arrives as a surprise to everyone who stopped watching.</p>
          </div>
        </article>

        <section id="letters" className="letters" aria-labelledby="lt">
          <h2 id="lt">Letters</h2>
          <div className="cols">
            <blockquote><p>Your piece on microfinance was the first to mention the loan officers. They are the early warning, not the footnote.</p><cite>R. Nair, Kochi</cite></blockquote>
            <blockquote><p>Please stop putting the ticker above the fold. I came for the essay and I stayed for the weather.</p><cite>A. Dsouza, Pune</cite></blockquote>
          </div>
        </section>

        <section id="subscribe" className="subscribe" aria-labelledby="sb">
          <h2 id="sb">Subscribe to the morning edition</h2>
          <p>One email at 6am. The numbers, one essay, no adverts.</p>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? 'ok' : 'bad')
            }}
          >
            <label htmlFor="em">Email address</label>
            <div className="row">
              <input id="em" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle') }} aria-invalid={state === 'bad'} aria-describedby="em-msg" />
              <button>Subscribe</button>
            </div>
            <p id="em-msg" role={state === 'bad' ? 'alert' : 'status'}>{state === 'bad' ? 'Please enter a valid email address.' : state === 'ok' ? 'Welcome. The first edition arrives tomorrow at 6am.' : ' '}</p>
          </form>
        </section>
      </main>
      <footer className="foot">The Ledger is a fictional publication. Figures are illustrative.</footer>
    </div>
  )
}
