import { useRef, useState } from 'react'
import '@fontsource-variable/bricolage-grotesque'
import './styles.css'
import { useSiteScroll } from '../_shared'
import Mascot, { type Mood } from './Mascot'

/*
 * PIP: a tiny-habits app landing page. World 6 (Soft Playful).
 * Signature: a character that reacts. Pip's eyes follow you, it squashes when pressed, and it changes mood as you tick
 * habits in the live demo. Big rounded shapes, pastel fields with two hot pops, springy easing (an overshoot curve),
 * and a friendly ink instead of black. Everything cheerful is also readable: type is large and contrast is checked.
 */

const HABITS = ['Drink a glass of water', 'Stretch for two minutes', 'Write one line in a journal', 'Step outside for five minutes']

export default function PipSite() {
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState<boolean[]>(HABITS.map(() => false))
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'bad' | 'ok'>('idle')
  const [pops, setPops] = useState<{ id: number; x: number }[]>([])

  useSiteScroll(root, { smooth: false })

  const n = done.filter(Boolean).length
  const mood: Mood = n === 0 ? 'calm' : n === HABITS.length ? 'cheer' : 'happy'
  const toggle = (i: number) => {
    const next = done.map((v, j) => (j === i ? !v : v))
    setDone(next)
    if (next[i]) {
      const id = Date.now() + i
      setPops((p) => [...p, { id, x: 20 + Math.random() * 60 }])
      setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 900)
    }
  }

  return (
    <div className="site-pip" ref={root}>
      <header className="top">
        <a href="#top" className="logo"><span aria-hidden>●</span> pip</a>
        <nav aria-label="Sections">
          <a href="#try">Try it</a>
          <a href="#why">Why it works</a>
          <a href="#join" className="pill">Get Pip</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <div className="copy">
            <h1 id="h1">Tiny habits, with a tiny friend.</h1>
            <p className="lede">Pip nudges you toward one small thing at a time. No streak shaming, no guilt trips, and nobody sees your list but you.</p>
            <a className="cta" href="#join">Get early access</a>
            <p className="note">Free on iPhone and Android. No account needed.</p>
          </div>
          <div className="stage">
            <Mascot mood="calm" size={300} />
          </div>
        </section>

        <section className="try" id="try" aria-labelledby="h2t">
          <h2 id="h2t">Try today&rsquo;s list</h2>
          <p className="sub">Tick one and watch Pip.</p>
          <div className="try-grid">
            <ul className="habits">
              {HABITS.map((h, i) => (
                <li key={h}>
                  <label>
                    <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} />
                    <span className="box" aria-hidden>{done[i] ? '✓' : ''}</span>
                    <span className="text">{h}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="friend">
              <Mascot mood={mood} size={200} />
              <div className="pops" aria-hidden>
                {pops.map((p) => <span key={p.id} style={{ left: `${p.x}%` }}>+1</span>)}
              </div>
              <p className="say" role="status">{n === 0 ? 'Hi! Pick one small thing.' : n === HABITS.length ? 'All four. You are on a roll!' : `${n} of ${HABITS.length}. Nice and easy.`}</p>
            </div>
          </div>
        </section>

        <section className="why" id="why" aria-labelledby="h2w">
          <h2 id="h2w">Why small works</h2>
          <div className="why-grid">
            <article className="big a"><h3>Two minutes, not two hours.</h3><p>A habit you can finish while the kettle boils is a habit you keep. Pip starts there and grows only when you ask.</p></article>
            <article className="b"><h3>Kind reminders</h3><p>One nudge a day, at the time you pick. Miss a day and Pip just says hello again.</p></article>
            <article className="c"><h3>Private by default</h3><p>Your list stays on your phone.</p></article>
          </div>
        </section>

        <section className="join" id="join" aria-labelledby="h2j">
          <h2 id="h2j">Be first to meet Pip</h2>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? 'ok' : 'bad')
            }}
          >
            <label htmlFor="pe">Your email</label>
            <div className="row">
              <input id="pe" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setState('idle') }} aria-invalid={state === 'bad'} aria-describedby="pm" />
              <button>Count me in</button>
            </div>
            <p id="pm" role={state === 'bad' ? 'alert' : 'status'}>{state === 'bad' ? 'Hmm, that email looks off. Try name@example.com.' : state === 'ok' ? 'You are on the list. Pip is excited.' : ' '}</p>
          </form>
        </section>
      </main>
      <footer className="foot">Pip is a fictional app. The habits here are examples, and nothing you tick is saved.</footer>
    </div>
  )
}
