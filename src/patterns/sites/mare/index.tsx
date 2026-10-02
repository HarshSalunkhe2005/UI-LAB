import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@fontsource/instrument-serif'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/geist'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'

gsap.registerPlugin(ScrollTrigger)

const reduced = reducedMotion()

const STATEMENT =
  'For one season we followed the shoreline by ferry, on foot and by the last bus, sleeping wherever the final boat of the day left us. This issue is what the tide kept.'

const CHAPTERS = [
  { img: 6, title: 'The Last Ferry', fig: 'Fig. 01', cap: 'Moored boat, harbour wall, 06:10', w: 'tall' },
  { img: 2, title: 'Salt & Stone', fig: 'Fig. 02', cap: 'A gull keeping watch over the quay', w: 'wide' },
  { img: 15, title: 'Houses That Lean', fig: 'Fig. 03', cap: 'Alley to the water, mid-morning', w: 'tall' },
  { img: 22, title: 'What the Tide Kept', fig: 'Fig. 04', cap: 'Under the pier at low water', w: 'wide' },
  { img: 19, title: 'A Pier at Dusk', fig: 'Fig. 05', cap: 'The last light, the last bird', w: 'tall' },
]

const INDEX = [
  { n: '01', t: 'The Last Ferry', place: 'Harbour towns', p: 12, img: 6 },
  { n: '02', t: 'Salt & Stone', place: 'The quay walls', p: 28, img: 2 },
  { n: '03', t: 'Houses That Lean', place: 'Old town', p: 44, img: 15 },
  { n: '04', t: 'What the Tide Kept', place: 'Under the pier', p: 60, img: 22 },
  { n: '05', t: 'A Pier at Dusk', place: 'West shore', p: 76, img: 19 },
  { n: '06', t: 'Slow Is a Direction', place: 'Afterword', p: 92, img: 20 },
]

export default function MareSite() {
  const root = useRef<HTMLDivElement>(null)
  const [peek, setPeek] = useState<{ img: number; on: boolean }>({ img: 6, on: false })
  const peekRef = useRef<HTMLDivElement>(null)

  useSiteScroll(root)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // HERO: the framed photograph opens to full bleed as you scroll; the headline lifts away.
      gsap.set('.hero-frame', { clipPath: 'inset(24% 33% 12% 33%)' })
      gsap.set('.hero-img', { scale: 1.25 })
      const hero = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.5 },
      })
      hero
        .to('.hero-frame', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
        .to('.hero-img', { scale: 1, duration: 1 }, 0)
        .to('.hero-title', { yPercent: -60, opacity: 0, duration: 0.55 }, 0.1)
        .fromTo('.hero-end', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.7)

      // intro lines
      gsap.from('.hero-title .line', { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.1 })
      gsap.from('.nav', { opacity: 0, y: -12, duration: 1, delay: 0.7 })

      // STATEMENT: words ink in as you read
      gsap.fromTo('.w', { opacity: 0.16 }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: '.statement', start: 'top 72%', end: 'bottom 58%', scrub: true },
      })

      // CHAPTERS: horizontal pinned gallery (desktop and phones alike); inner photographs drift against the track
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = document.querySelector<HTMLElement>('.track')!
        const dist = () => track.scrollWidth - window.innerWidth
        const slide = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: { trigger: '.chapters', pin: true, scrub: 0.6, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true },
        })
        gsap.utils.toArray<HTMLElement>('.panel').forEach((p) => {
          gsap.fromTo(p.querySelector('img'), { xPercent: -9 }, {
            xPercent: 9,
            ease: 'none',
            scrollTrigger: { trigger: p, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
          })
        })
        gsap.to('.progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.chapters', start: 'top top', end: () => '+=' + dist(), scrub: true, invalidateOnRefresh: true },
        })
      })

      // INDEX rows slide in
      gsap.utils.toArray<HTMLElement>('.row').forEach((r) =>
        gsap.from(r, { yPercent: 40, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 92%', once: true } }),
      )
      gsap.from('.big-mare span', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.foot', start: 'top 70%', once: true } })
    }, root)

    const refresh = () => ScrollTrigger.refresh()
    addEventListener('load', refresh)
    return () => {
      removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])

  // cursor-following preview for the index
  useEffect(() => {
    const el = peekRef.current
    if (!el || reduced) return
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e: PointerEvent) => {
      x(e.clientX + 24)
      y(e.clientY - 120)
    }
    addEventListener('pointermove', move)
    return () => removeEventListener('pointermove', move)
  }, [])

  return (
    <div ref={root} className="site-mare">
      <header className="nav">
        <a href="#top" className="logo">Mare</a>
        <span className="issue">Issue 07 · The Slow Coast</span>
        <a href="#end" className="sub">Subscribe</a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-pin">
            <h1 className="hero-title">
              <span className="mask"><span className="line">The slow</span></span>
              <span className="mask"><span className="line"><em>coast</em></span></span>
            </h1>
            <div className="hero-frame">
              <img className="hero-img" src="/img/4.webp" alt="Rocky shoreline at sunset, a lighthouse on the far point" />
              <div className="grain" />
            </div>
            <p className="hero-end">Seven harbours.<br />One coastline.<br /><em>No timetable.</em></p>
          </div>
        </section>

        <section className="statement">
          <p aria-label={STATEMENT}>
            {STATEMENT.split(' ').map((w, i) => (
              <span key={i} className="w" aria-hidden="true">{w}{' '}</span>
            ))}
          </p>
        </section>

        <section className="chapters" aria-label="Photo essay">
          <div className="track">
            <div className="lead">
              <h2>Five<br />frames,<br /><em>slowly.</em></h2>
              <p>Scroll sideways through the essay. Every picture was taken between the first and last boat.</p>
            </div>
            {CHAPTERS.map((c) => (
              <figure key={c.fig} className={`panel ${c.w}`}>
                <div className="ph">
                  <img src={`/img/${c.img}.webp`} alt={c.cap} loading="lazy" />
                </div>
                <figcaption>
                  <span className="fig">{c.fig}</span>
                  <b>{c.title}</b>
                  <span>{c.cap}</span>
                </figcaption>
              </figure>
            ))}
            <div className="lead end"><h2><em>Slow</em> is a<br />direction.</h2></div>
          </div>
          <div className="progress" aria-hidden="true"><i /></div>
        </section>

        <section className="index" aria-label="In this issue">
          <h2>In this issue</h2>
          <ol onPointerLeave={() => setPeek((p) => ({ ...p, on: false }))}>
            {INDEX.map((r) => (
              <li key={r.n}>
                <a
                  href="#end"
                  className="row"
                  onPointerEnter={() => setPeek({ img: r.img, on: true })}
                  onFocus={() => setPeek({ img: r.img, on: true })}
                  onBlur={() => setPeek((p) => ({ ...p, on: false }))}
                >
                  <span className="n">{r.n}</span>
                  <span className="t">{r.t}</span>
                  <span className="pl">{r.place}</span>
                  <span className="pg">p. {r.p}</span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <footer className="foot" id="end">
          <div className="sign">
            <p>Four issues a year, printed on uncoated paper, posted flat.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="em">Email address</label>
              <div>
                <input id="em" type="email" placeholder="you@somewhere.com" />
                <button type="submit">Subscribe</button>
              </div>
              <small>Demo form. Nothing is sent.</small>
            </form>
          </div>
          <div className="big-mare" aria-hidden="true">
            {'MARE'.split('').map((c, i) => <span key={i}>{c}</span>)}
          </div>
        </footer>
      </main>

      <div ref={peekRef} className={`peek ${peek.on ? 'on' : ''}`} aria-hidden="true">
        <img src={`/img/${peek.img}.webp`} alt="" />
      </div>
    </div>
  )
}
