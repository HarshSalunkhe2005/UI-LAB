import { useEffect, useRef, useState } from 'react'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import { reducedMotion, useSiteScroll } from '../_shared'
import { createEngine, type Engine } from './engine'

/*
 * KESTREL K-1: a tape deck with a working sound. World 11 (Hi-Fi Deck).
 * Signature: the product is the page. Press play and a generated loop runs through a tape stage (saturation,
 * roll-off, wobble) you can switch out to hear the difference; the VU needles read the real signal, the reels turn,
 * the counter counts. No audio file exists; WebAudio only starts after you press a button, at a low level.
 */

const reduced = reducedMotion()
const FINISHES = [
  { id: 'charcoal', name: 'Charcoal', note: 'Powder-coated steel' },
  { id: 'walnut', name: 'Walnut', note: 'Oiled American walnut' },
  { id: 'cream', name: 'Cream', note: 'Stoved enamel' },
] as const

function Vu({ value, label }: { value: number; label: string }) {
  const a = -48 + value * 96
  return (
    <figure className="vu" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <svg viewBox="0 0 160 100" aria-hidden>
        {Array.from({ length: 11 }, (_, i) => {
          const t = ((-48 + i * 9.6) * Math.PI) / 180
          const r1 = 70, r2 = i > 7 ? 56 : 62
          return <line key={i} x1={80 + Math.sin(t) * r1} y1={92 - Math.cos(t) * r1} x2={80 + Math.sin(t) * r2} y2={92 - Math.cos(t) * r2} className={i > 7 ? 'tick hot' : 'tick'} />
        })}
        <text x="14" y="22" className="vu-txt">VU</text>
        <g style={{ transform: `rotate(${a}deg)`, transformOrigin: '80px 92px', transition: 'transform 80ms linear' }}>
          <line x1="80" y1="92" x2="80" y2="26" className="needle" />
        </g>
        <circle cx="80" cy="92" r="5" className="hub" />
      </svg>
    </figure>
  )
}

export default function TapeSite() {
  const root = useRef<HTMLDivElement>(null)
  const eng = useRef<Engine | null>(null)
  const raf = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [tape, setTape] = useState(true)
  const [level, setLevel] = useState(5)
  const [tone, setTone] = useState(7)
  const [vu, setVu] = useState<[number, number]>([0, 0])
  const [secs, setSecs] = useState(0)
  const [finish, setFinish] = useState<(typeof FINISHES)[number]['id']>('charcoal')

  useSiteScroll(root, { smooth: false })

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [playing])
  useEffect(() => () => {
    cancelAnimationFrame(raf.current)
    eng.current?.close()
  }, [])
  useEffect(() => eng.current?.setLevel(level / 10), [level])
  useEffect(() => eng.current?.setTone(tone / 10), [tone])
  useEffect(() => eng.current?.setTape(tape), [tape])

  const play = () => {
    if (!eng.current) {
      eng.current = createEngine()
      eng.current.setLevel(level / 10)
      eng.current.setTone(tone / 10)
      eng.current.setTape(tape)
    }
    eng.current.start()
    setPlaying(true)
    const buf = new Uint8Array(eng.current.analyser.fftSize)
    let sm = 0
    const read = () => {
      eng.current!.analyser.getByteTimeDomainData(buf)
      let peak = 0
      for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128)
      sm = Math.max(peak * 2.6, sm * 0.88)
      const v = Math.min(1, sm)
      setVu([v, Math.min(1, v * (0.88 + Math.random() * 0.2))])
      raf.current = requestAnimationFrame(read)
    }
    read()
  }
  const stop = () => {
    eng.current?.stop()
    cancelAnimationFrame(raf.current)
    setPlaying(false)
    setVu([0, 0])
  }
  const toggle = () => (playing ? stop() : play())

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName === 'BODY') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <div className="site-tape" data-finish={finish} ref={root}>
      <header className="top">
        <a className="logo" href="#top">KESTREL<span>AUDIO</span></a>
        <nav aria-label="Sections">
          <a href="#deck">The deck</a>
          <a href="#why">Why tape</a>
          <a href="#specs">Specs</a>
          <a href="#own" className="buy-sm">Own one</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <div className="hero-copy">
            <p className="kicker">Model K-1 · Cassette deck</p>
            <h1 id="h1">Warm is a<br />mechanism.</h1>
            <p className="lede">A cassette deck rebuilt around one idea: the sound of tape is saturation, roll-off and a little wobble, and you should be able to switch each of them on.</p>
            <a className="cta" href="#deck">Try it below</a>
          </div>
        </section>

        <section className="deck-sec" id="deck" aria-labelledby="h2d">
          <h2 id="h2d" className="sr-only">The K-1, playable</h2>
          <div className="deck">
            <div className="window">
              <div className={`cassette ${playing ? 'run' : ''}`} aria-hidden>
                <div className="reel l"><i /><i /><i /></div>
                <div className="reel r"><i /><i /><i /></div>
                <div className="label">SIDE A · 92 BPM</div>
              </div>
              <div className="counter" role="timer" aria-label={`Tape counter ${mm} minutes ${ss} seconds`}>{mm}:{ss}</div>
            </div>
            <div className="meters"><Vu value={vu[0]} label="Left level" /><Vu value={vu[1]} label="Right level" /></div>
            <div className="transport" role="group" aria-label="Transport">
              <button className={`key ${playing ? 'down' : ''}`} onClick={toggle} aria-pressed={playing}>{playing ? 'Stop' : 'Play'}</button>
              <button className="key rec" disabled aria-label="Record (not on the demo)">Rec</button>
              <button className="key" onClick={() => setSecs(0)}>Reset</button>
            </div>
            <div className="controls">
              <label className="fader">Level
                <input type="range" min={0} max={10} value={level} onChange={(e) => setLevel(Number(e.target.value))} aria-valuetext={`${level} of 10`} />
                <span>{level}</span>
              </label>
              <label className="fader">Tone
                <input type="range" min={0} max={10} value={tone} onChange={(e) => setTone(Number(e.target.value))} aria-valuetext={`${tone} of 10`} />
                <span>{tone}</span>
              </label>
              <button className={`tapeswitch ${tape ? 'on' : ''}`} role="switch" aria-checked={tape} onClick={() => setTape((t) => !t)}>
                <span className="lamp" aria-hidden />Tape stage <b>{tape ? 'ON' : 'OFF'}</b>
              </button>
            </div>
          </div>
          <p className="deck-note">{reduced ? 'Reduced motion is on: the reels stay still, but the sound and meters work.' : 'Press Play (or Space). A generated loop at a low level. Switch the tape stage on and off while it runs.'}</p>
        </section>

        <section className="why" id="why" aria-labelledby="h2w">
          <h2 id="h2w">Three things make tape sound like tape.</h2>
          <ol>
            <li><h3>Saturation</h3><p>Loud peaks are rounded, not clipped. The signal bends at the top, which adds quiet harmonics and makes drums feel glued.</p></li>
            <li><h3>Roll-off</h3><p>The highest frequencies fade out. It is the reason old recordings feel soft instead of tired.</p></li>
            <li><h3>Wobble</h3><p>Transport speed drifts by a fraction of a percent. Held notes move, very slightly, the way a voice does.</p></li>
          </ol>
        </section>

        <section className="specs" id="specs" aria-labelledby="h2s">
          <h2 id="h2s">Specifications</h2>
          <dl>
            <div><dt>Heads</dt><dd>Three, hard permalloy</dd></div>
            <div><dt>Wow &amp; flutter</dt><dd>0.06% WRMS</dd></div>
            <div><dt>Frequency response</dt><dd>30 Hz to 18 kHz, Type II</dd></div>
            <div><dt>Noise reduction</dt><dd>Dolby B, C</dd></div>
            <div><dt>Outputs</dt><dd>RCA line, 6.3 mm headphone</dd></div>
            <div><dt>Weight</dt><dd>5.4 kg</dd></div>
          </dl>
        </section>

        <section className="own" id="own" aria-labelledby="h2o">
          <h2 id="h2o">Choose a finish.</h2>
          <div className="finishes" role="radiogroup" aria-label="Finish">
            {FINISHES.map((f) => (
              <button key={f.id} role="radio" aria-checked={finish === f.id} className={`sw ${f.id} ${finish === f.id ? 'on' : ''}`} onClick={() => setFinish(f.id)}>
                <span className="chip" aria-hidden />
                <b>{f.name}</b>
                <small>{f.note}</small>
              </button>
            ))}
          </div>
          <p className="price">£1,490 <small>Made to order · 10 weeks</small></p>
          <a className="cta" href="#top">Reserve a K-1</a>
        </section>
      </main>
      <footer className="foot">A fictional audio company. The K-1 does not exist; the loop is generated in your browser.</footer>
    </div>
  )
}
