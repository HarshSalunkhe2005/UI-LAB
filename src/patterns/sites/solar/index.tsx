import { lazy, Suspense, useCallback, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '@fontsource/anton'
import '@fontsource-variable/bricolage-grotesque'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'
import { CTA_BG, CTA_FG, FLAVORS, STORY_BG, STORY_FG } from './flavors'
import { intro, rig } from './rig'

gsap.registerPlugin(ScrollTrigger)

// three.js is ~1MB: load it after first paint so the splash shows immediately
const Scene = lazy(() => import('./Scene'))

const WORDS = ['ZERO SUGAR', 'REAL FRUIT', 'COLD PRESSED', 'SUN FIRST']
const Spark = () => (
  <svg className="spark" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
)

const reduced = reducedMotion()
const TURNS = Math.PI * 6

const Line = ({ children }: { children: React.ReactNode }) => (
  <span className="mask">
    <span className="line">{children}</span>
  </span>
)

export default function SolarSite() {
  const root = useRef<HTMLDivElement>(null)

  useSiteScroll(root, { lerp: 0.09 })

  const onReady = useCallback(() => {
    root.current?.classList.add('ready')
    gsap.to(intro, { s: 1, ry: 0, duration: reduced ? 0 : 2.2, ease: 'expo.out', delay: 0.25 })
    gsap.to('.hero .line', { yPercent: 0, duration: reduced ? 0 : 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.4 })
    gsap.to('.nav', { y: 0, opacity: 1, duration: 1, delay: 0.9, ease: 'power3.out' })
  }, [])

  useLayoutEffect(() => {
    let watch: () => void = () => {}
    const ctx = gsap.context(() => {
      const el = root.current!
      const sec = (id: string) => el.querySelector<HTMLElement>(`#${id}`)!
      const vh = window.innerHeight
      const hero = sec('hero'), fl = sec('flavors'), story = sec('story'), cta = sec('cta'), page = sec('page')
      const top = (e: HTMLElement) => e.getBoundingClientRect().top + window.scrollY

      // One master timeline. 1 unit of timeline time == 1px of scroll, so every
      // tween is placed at the exact pixel offset of its section.
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', immediateRender: false },
        scrollTrigger: { trigger: page, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })

      // HERO: can drifts from right of centre to dead centre and straightens up
      tl.fromTo(rig, { x: 0.34, y: 0, s: 1.05, rz: -0.18, ry: 0.6, rx: 0 },
        { x: 0, y: 0, s: 1.3, rz: 0, ry: 0, duration: hero.offsetHeight }, top(hero))

      // FLAVORS: sticky stage. Three full turns, label + palette swap once per turn.
      const fh = fl.offsetHeight - vh
      tl.fromTo(rig, { ry: 0 }, { ry: TURNS, ease: 'none', duration: fh }, top(fl))
      tl.fromTo(rig, { flavor: 0 }, { flavor: FLAVORS.length - 0.001, ease: 'none', duration: fh }, top(fl))
      const seg = fh / FLAVORS.length
      for (let i = 1; i < FLAVORS.length; i++) {
        tl.fromTo(
          el,
          { '--bg': FLAVORS[i - 1].bg, '--fg': FLAVORS[i - 1].fg },
          { '--bg': FLAVORS[i].bg, '--fg': FLAVORS[i].fg, ease: 'none', duration: seg * 0.24 },
          top(fl) + seg * i - seg * 0.12,
        )
      }

      // STORY: palette goes cream; can swings left -> centre -> right between the beats
      const [b1, stats, b2] = ['beat1', 'stats', 'beat2'].map(sec)
      const mid = (e: HTMLElement) => top(e) + e.offsetHeight / 2 - vh / 2
      const flEnd = top(fl) + fh
      tl.fromTo(el, { '--bg': FLAVORS[2].bg, '--fg': FLAVORS[2].fg },
        { '--bg': STORY_BG, '--fg': STORY_FG, ease: 'none', duration: vh * 0.6 }, top(story) - vh * 0.5)
      tl.fromTo(rig, { x: 0, s: 1.3, rz: 0, ry: TURNS },
        { x: -0.52, s: 1.15, rz: 0.16, ry: TURNS + 0.9, duration: mid(b1) - flEnd }, flEnd)
      tl.to(rig, { x: 0, s: 1.0, rz: 0, ry: TURNS + 2.4, duration: mid(stats) - mid(b1) }, mid(b1))
      tl.to(rig, { x: 0.52, s: 1.15, rz: -0.14, ry: TURNS + 3.6, duration: mid(b2) - mid(stats) }, mid(stats))

      // CTA: back to centre, upright, one last spin
      tl.fromTo(el, { '--bg': STORY_BG, '--fg': STORY_FG },
        { '--bg': CTA_BG, '--fg': CTA_FG, ease: 'none', duration: vh * 0.6 }, top(cta) - vh * 0.9)
      tl.to(rig, { x: 0, y: -0.5, s: 1.15, rz: 0, ry: TURNS + Math.PI * 2, duration: top(cta) + cta.offsetHeight - vh - mid(b2) }, mid(b2))

      // pad so timeline length == scrollable distance (1 time unit == 1px)
      tl.set({}, {}, page.offsetHeight - vh)

      // text swaps are driven by a data attribute on <html>
      let last = -1
      watch = () => {
        const i = Math.min(FLAVORS.length - 1, Math.max(0, Math.floor(rig.flavor)))
        if (i !== last) {
          last = i
          el.dataset.flavor = String(i)
        }
      }
      gsap.ticker.add(watch)

      // intro starts once the can has rendered its first frame (see onReady)
      gsap.set('.hero .line', { yPercent: 115 })
      gsap.set('.nav', { y: -30, opacity: 0 })

      // reveal-on-scroll lines
      gsap.utils.toArray<HTMLElement>('.rv').forEach((r) => {
        gsap.from(r.querySelectorAll('.line'), {
          yPercent: 115,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: r, start: 'top 85%', once: true },
        })
      })

      // count-up stats
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((n) => {
        const o = { v: 0 }
        gsap.to(o, {
          v: Number(n.dataset.count),
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: n, start: 'top 85%', once: true },
          onUpdate: () => (n.textContent = Math.round(o.v).toString()),
        })
      })
    }, root)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove(watch)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={root} className="site-solar">
      <div className="bg" />
      <div className="loader" aria-hidden="true"><span>SOLAR</span></div>
      <Suspense fallback={null}>
        <Scene reduced={reduced} onReady={onReady} />
      </Suspense>

      <header className="nav">
        <a className="logo" href="#hero">SOLAR</a>
        <nav>
          <a href="#flavors">Flavors</a>
          <a href="#story">Story</a>
          <a className="btn" href="#cta">Get a case</a>
        </nav>
      </header>

      <main id="page">
        <section id="hero" className="hero">
          <div className="giant" aria-hidden="true">SOLAR</div>
          <div className="hero-copy">
            <h1>
              <Line>Sunlight,</Line>
              <Line>bottled.</Line>
            </h1>
            <p><Line>Zero-sugar sparkling soda made from real fruit.</Line></p>
          </div>
          <div className="hero-meta"><Line>355 ml · Aluminium · Infinitely recyclable</Line></div>
          <div className="scroll-cue"><span />Scroll</div>
        </section>

        <section id="flavors" className="flavors">
          <div className="sticky">
            <h2 className="sr-only">Three flavors: {FLAVORS.map((f) => f.name).join(', ')}</h2>
            <div className="giant giant-flavor" aria-hidden="true">
              {FLAVORS.map((f, i) => (
                <span key={f.name} className="gname" data-i={i}>{f.name}</span>
              ))}
            </div>
            <div className="fl-left">
              {FLAVORS.map((f, i) => (
                <div key={f.name} className="fl-copy" data-i={i}>
                  <span className="tag">{f.tag}</span>
                  <p>{f.blurb}</p>
                </div>
              ))}
            </div>
            <div className="fl-right">
              <div className="dots">
                {FLAVORS.map((f, i) => (
                  <span key={f.name} data-i={i}>0{i + 1}</span>
                ))}
              </div>
              <small>Keep scrolling. Three flavors, one spin each.</small>
            </div>
          </div>
        </section>

        <section id="story" className="story">
          <div id="beat1" className="beat beat-r">
            <h2 className="rv"><Line>No sugar.</Line><Line>All fruit.</Line></h2>
            <p className="rv"><Line>We press whole fruit the morning it is picked,</Line><Line>then carbonate it cold so the bubbles stay sharp.</Line></p>
          </div>
          <div id="stats" className="stats">
            <div><b data-count="0">0</b><span>g added sugar</span></div>
            <div><b data-count="100">0</b><span>% real fruit juice</span></div>
            <div><b data-count="12">0</b><span>hours field to can</span></div>
          </div>
          <div id="beat2" className="beat beat-l">
            <h2 className="rv"><Line>Cold, loud,</Line><Line>recyclable.</Line></h2>
            <p className="rv"><Line>Every can is infinitely recyclable aluminium.</Line><Line>Finish it, crush it, bring the sun back around.</Line></p>
          </div>
          <div className="marquee" aria-hidden="true">
            <div>
              {[0, 1].map((k) => (
                <span key={k}>
                  {[...WORDS, ...WORDS].map((w, i) => (
                    <span key={i} className="mw">{w}<Spark /></span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="cta">
          <h2 className="rv"><Line>Taste the sun.</Line></h2>
          <a className="btn big" href="#hero">Order a 12-pack</a>
          <footer>Demo build · Three.js · GSAP ScrollTrigger · Lenis</footer>
        </section>
      </main>
    </div>
  )
}
