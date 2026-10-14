import { useEffect, useRef, useState } from 'react'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/hanken-grotesk'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { BASE_SERVES, INGREDIENTS, STEPS, TITLE, convert } from './recipe'

/*
 * HEARTH: a recipe page built for the kitchen. World 25 (Recipe Card / Cook Mode).
 * Signature: it adapts to someone with floury hands. Servings scale every amount (written as cooks say them: 1½, ¾),
 * a unit switch changes metric and US measures, steps tick off, each timed step has its own countdown, and Cook mode
 * makes the type large and asks the screen to stay awake. Sound is off unless you press the bell.
 */

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function StepTimer({ minutes, name }: { minutes: number; name: string }) {
  const [left, setLeft] = useState(minutes * 60)
  const [run, setRun] = useState(false)
  const [bell, setBell] = useState(false)
  const done = left === 0

  useEffect(() => {
    if (!run || left === 0) return
    const t = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => window.clearInterval(t)
  }, [run, left])
  useEffect(() => {
    if (left !== 0 || !bell) return
    try {
      const ac = new AudioContext()
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.frequency.value = 880
      g.gain.value = 0.08
      o.connect(g).connect(ac.destination)
      o.start()
      o.stop(ac.currentTime + 0.5)
      setTimeout(() => void ac.close(), 800)
    } catch {
      /* sound is optional */
    }
  }, [left, bell])

  return (
    <div className="timer">
      <span role="timer" aria-label={`${name} timer`} className={done ? 'done' : ''}>{done ? 'Done' : mmss(left)}</span>
      <button onClick={() => setRun((r) => !r)} disabled={done} aria-label={`${run ? 'Pause' : 'Start'} the ${minutes} minute timer`}>{run ? 'Pause' : 'Start'}</button>
      <button onClick={() => { setLeft(minutes * 60); setRun(false) }} aria-label="Reset the timer">Reset</button>
      <button role="switch" aria-checked={bell} onClick={() => setBell((b) => !b)} aria-label="Sound when finished">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 14V9a5 5 0 0 1 10 0v5l1.5 2h-13z" /><path d="M8.5 18a1.8 1.8 0 0 0 3 0" /></svg>
        <span className="sr-only"> Sound {bell ? 'on' : 'off'}</span>
      </button>
    </div>
  )
}

export default function HearthSite() {
  const root = useRef<HTMLDivElement>(null)
  const [serves, setServes] = useState(BASE_SERVES)
  const [imperial, setImperial] = useState(false)
  const [cook, setCook] = useState(false)
  const [done, setDone] = useState<boolean[]>(STEPS.map(() => false))
  const [have, setHave] = useState<boolean[]>(INGREDIENTS.map(() => false))
  const lock = useRef<{ release: () => Promise<void> } | null>(null)

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    let alive = true
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }
    if (cook && nav.wakeLock) {
      nav.wakeLock.request('screen').then((l) => { if (alive) lock.current = l; else void l.release() }).catch(() => {})
    }
    return () => {
      alive = false
      void lock.current?.release()
      lock.current = null
    }
  }, [cook])

  const left = done.filter((d) => !d).length

  return (
    <div className="site-hearth" ref={root} style={{ ['--cook' as string]: cook ? 1.4 : 1 }}>
      <header className="top">
        <a href="#top" className="logo">Hearth</a>
        <button className="cookbtn" role="switch" aria-checked={cook} onClick={() => setCook((c) => !c)}>Cook mode <b>{cook ? 'On' : 'Off'}</b></button>
      </header>

      <main id="top">
        <article>
          <header className="head">
            <p className="meta">Serves {serves} · about 1 hour · vegan</p>
            <h1>{TITLE}</h1>
            <p className="lede">A pan of tomatoes and beans that tastes better the longer you leave it. Cook it on Sunday, eat it all week.</p>
          </header>

          <section className="ing" aria-labelledby="hi">
            <div className="bar">
              <h2 id="hi">Ingredients</h2>
              <div className="ctrl">
                <div className="srv" role="group" aria-label="Servings">
                  <button onClick={() => setServes(Math.max(1, serves - 1))} aria-label="Fewer servings" disabled={serves <= 1}>−</button>
                  <output aria-label={`${serves} servings`}>{serves}</output>
                  <button onClick={() => setServes(Math.min(24, serves + 1))} aria-label="More servings" disabled={serves >= 24}>+</button>
                </div>
                <button className="unit" role="switch" aria-checked={imperial} onClick={() => setImperial((i) => !i)}>{imperial ? 'US measures' : 'Metric'}</button>
              </div>
            </div>
            <ul>
              {INGREDIENTS.map((i, k) => {
                const c = convert(i, serves, imperial)
                return (
                  <li key={i.name}>
                    <label>
                      <input type="checkbox" checked={have[k]} onChange={() => setHave(have.map((v, j) => (j === k ? !v : v)))} />
                      <span className="amt">{c.amount} {c.unit}</span>
                      <span className={have[k] ? 'got' : ''}>{i.name}{i.note ? <em>, {i.note}</em> : null}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="steps" aria-labelledby="hm">
            <h2 id="hm">Method <span className="count" role="status">{left === 0 ? 'All done. Enjoy.' : `${left} step${left === 1 ? '' : 's'} to go`}</span></h2>
            <ol>
              {STEPS.map((s, i) => (
                <li key={i} className={done[i] ? 'ok' : ''}>
                  <label className="tick">
                    <input type="checkbox" checked={done[i]} onChange={() => setDone(done.map((v, j) => (j === i ? !v : v)))} />
                    <span className="n" aria-hidden>{i + 1}</span>
                    <span className="sr-only">Step {i + 1}, done</span>
                  </label>
                  <div>
                    <p>{s.text}</p>
                    {s.minutes && <StepTimer minutes={s.minutes} name={`Step ${i + 1}`} />}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </article>
      </main>
      <footer className="foot">Hearth is a demonstration recipe page. Quantities are scaled linearly; adjust salt and spice to taste when you scale far from the original.</footer>
    </div>
  )
}
