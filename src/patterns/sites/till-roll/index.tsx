import { useMemo, useRef, useState } from 'react'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import './styles.css'
import { useSiteScroll } from '../_shared'

/*
 * TILL ROLL: a coffee roaster whose order page is a till receipt. World 23 (Thermal Receipt).
 * Signature: the receipt is the interface. Choose beans on the left and the roll prints a line for each on the right,
 * with dotted leaders, a running total, a tip selector and a barcode generated from the order. The torn edges are a CSS
 * mask. It stays honest as a form: real buttons, a live total, and a printed summary that is also plain text.
 */

const BEANS = [
  { id: 'ethiopia', name: 'Yirgacheffe', note: 'Blueberry, jasmine', price: 9.5 },
  { id: 'colombia', name: 'Huila', note: 'Red apple, caramel', price: 8.5 },
  { id: 'brazil', name: 'Santos', note: 'Hazelnut, cocoa', price: 7.5 },
  { id: 'kenya', name: 'Nyeri AA', note: 'Blackcurrant, citrus', price: 10.5 },
] as const
const TIPS = [0, 5, 10]
const money = (n: number) => n.toFixed(2).padStart(7)

function bars(seed: string) {
  let h = 7
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const out: number[] = []
  for (let i = 0; i < 46; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    out.push(1 + ((h >> 16) % 3))
  }
  return out
}

export default function TillRollSite() {
  const root = useRef<HTMLDivElement>(null)
  const [qty, setQty] = useState<Record<string, number>>({ ethiopia: 1 })
  const [tip, setTip] = useState(5)
  const [name, setName] = useState('')
  const [state, setState] = useState<'idle' | 'bad' | 'ok'>('idle')

  useSiteScroll(root, { smooth: false })

  const lines = BEANS.filter((b) => qty[b.id])
  const sub = lines.reduce((n, b) => n + b.price * qty[b.id], 0)
  const tipAmt = (sub * tip) / 100
  const total = sub + tipAmt
  const code = useMemo(() => lines.map((b) => `${b.id}${qty[b.id]}`).join('-') + tip, [lines, qty, tip])
  const set = (id: string, q: number) => setQty((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n })
  const order = state === 'ok'

  return (
    <div className="site-till" ref={root}>
      <header className="top">
        <a href="#top" className="logo">TILL ROLL<span> coffee</span></a>
        <nav aria-label="Sections"><a href="#beans">Beans</a><a href="#receipt">Your receipt</a></nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <p className="tag">Roasted Tuesdays · Posted Wednesdays</p>
          <h1 id="h1">Fresh coffee.<br />Itemised.</h1>
          <p className="lede">Four beans, one roaster, no subscription. Pick what you want and watch the receipt print. What you see is exactly what you pay.</p>
        </section>

        <div className="work">
          <section className="beans" id="beans" aria-labelledby="h2b">
            <h2 id="h2b">Beans</h2>
            <ul>
              {BEANS.map((b) => (
                <li key={b.id}>
                  <div>
                    <b>{b.name}</b>
                    <span>{b.note}</span>
                    <i>£{b.price.toFixed(2)} / 250 g</i>
                  </div>
                  <div className="step">
                    <button aria-label={`One fewer ${b.name}`} onClick={() => set(b.id, (qty[b.id] ?? 0) - 1)} disabled={!qty[b.id]}>−</button>
                    <output aria-label={`${b.name} bags`}>{qty[b.id] ?? 0}</output>
                    <button aria-label={`One more ${b.name}`} onClick={() => set(b.id, (qty[b.id] ?? 0) + 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <fieldset>
              <legend>Tip the roaster</legend>
              <div role="radiogroup" aria-label="Tip" className="tips">
                {TIPS.map((t) => <button key={t} role="radio" aria-checked={tip === t} className={tip === t ? 'on' : ''} onClick={() => setTip(t)}>{t}%</button>)}
              </div>
            </fieldset>
          </section>

          <section className="paper-wrap" id="receipt" aria-labelledby="h2r">
            <h2 id="h2r" className="sr-only">Your receipt</h2>
            <article className="paper">
              <p className="c b">TILL ROLL COFFEE</p>
              <p className="c">14 Dock Street, Leeds</p>
              <p className="rule" aria-hidden>{'- '.repeat(18)}</p>
              {lines.length === 0 ? (
                <p className="c">Nothing on the roll yet.<br />Add some beans.</p>
              ) : (
                <ul className="items">
                  {lines.map((b) => (
                    <li key={b.id}>
                      <span>{qty[b.id]} × {b.name}</span>
                      <span className="lead" aria-hidden />
                      <span>{money(b.price * qty[b.id])}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="rule" aria-hidden>{'- '.repeat(18)}</p>
              <div role="status"><dl className="tot">
                <div><dt>SUBTOTAL</dt><dd>{money(sub)}</dd></div>
                <div><dt>TIP {tip}%</dt><dd>{money(tipAmt)}</dd></div>
                <div className="big"><dt>TOTAL GBP</dt><dd>{money(total)}</dd></div>
              </dl></div>
              <p className="rule" aria-hidden>{'- '.repeat(18)}</p>
              <svg viewBox="0 0 184 46" className="bars" role="img" aria-label={`Barcode for order ${code}`}>
                {(() => {
                  let x = 4
                  return bars(code).map((w, i) => {
                    const r = i % 2 === 0 ? <rect key={i} x={x} y="2" width={w} height="42" fill="#1c1b19" /> : null
                    x += w + 1.2
                    return r
                  })
                })()}
              </svg>
              <p className="c small">{order ? `ORDER FOR ${name.trim().toUpperCase()}` : `ORDER ${code.toUpperCase().slice(0, 18)}`}</p>
              {order && <p className="stamp" role="status">PAID WHEN COLLECTED</p>}
              <p className="c">THANK YOU</p>
            </article>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                setState(name.trim().length > 1 && lines.length > 0 ? 'ok' : 'bad')
              }}
            >
              <label htmlFor="tn">Name on the order</label>
              <input id="tn" value={name} onChange={(e) => { setName(e.target.value); setState('idle') }} autoComplete="given-name" aria-invalid={state === 'bad' && name.trim().length < 2} aria-describedby="tm" />
              <button>Place order</button>
              <p id="tm" role={state === 'bad' ? 'alert' : 'status'}>{state === 'bad' ? 'Add at least one bag and your name first.' : state === 'ok' ? 'Order placed. We will email a copy of this receipt.' : ' '}</p>
            </form>
          </section>
        </div>
      </main>
      <footer className="foot">Till Roll is a fictional roaster. No order is placed.</footer>
    </div>
  )
}
