import { useRef, useState } from 'react'
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource-variable/hanken-grotesk'
import './styles.css'
import { useSiteScroll } from '../_shared'

/*
 * SPECIMEN: FRAUNCES. A type specimen for an open-source variable font (Fraunces, by Undercase Type, SIL Open Font
 * License). World 19 (Type Specimen). Signature: you can drive the real axes. Weight, optical size, softness and "wonk"
 * change the actual letterforms through font-variation-settings; the page also gives a character set to inspect, a size
 * ladder and a text tester where you can type your own words. Nothing here is an image of type: it is the type.
 */

const SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&?!@%$£€(){}[]/\\;:,.’“”—'.split('')
const LADDER = [12, 16, 20, 28, 40, 56, 80]

export default function SpecimenSite() {
  const root = useRef<HTMLDivElement>(null)
  const [wght, setWght] = useState(560)
  const [opsz, setOpsz] = useState(72)
  const [soft, setSoft] = useState(50)
  const [wonk, setWonk] = useState(1)
  const [italic, setItalic] = useState(false)
  const [glyph, setGlyph] = useState('g')
  const [text, setText] = useState('Sphinx of black quartz, judge my vow.')
  const [size, setSize] = useState(34)
  const [lead, setLead] = useState(1.3)

  useSiteScroll(root, { smooth: false })

  const vs = `'wght' ${wght}, 'opsz' ${opsz}, 'SOFT' ${soft}, 'WONK' ${wonk}`
  const style = { fontVariationSettings: vs, fontStyle: italic ? 'italic' : 'normal' } as const

  return (
    <div className="site-specimen" ref={root}>
      <header className="top">
        <a href="#top" className="logo" style={{ fontVariationSettings: "'wght' 700, 'SOFT' 100, 'WONK' 1" }}>Fraunces</a>
        <nav aria-label="Sections"><a href="#axes">Axes</a><a href="#set">Characters</a><a href="#scale">Sizes</a><a href="#test">Try it</a></nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <p className="meta">Open-source variable serif · SIL Open Font License · by Undercase Type</p>
          <h1 id="h1" style={style} className="big">Fraunces</h1>
          <p className="blurb" style={{ fontVariationSettings: "'wght' 380, 'opsz' 18" }}>A display serif in the “Old Style soft-serif” tradition, with four axes you can set yourself: weight, optical size, softness and a little wonk.</p>
        </section>

        <section className="axes" id="axes" aria-labelledby="h2a">
          <div className="panel">
            <h2 id="h2a">Axes</h2>
            {[
              ['Weight', wght, setWght, 100, 900, 1, 'wght'],
              ['Optical size', opsz, setOpsz, 9, 144, 1, 'opsz'],
              ['Softness', soft, setSoft, 0, 100, 1, 'SOFT'],
            ].map(([l, v, set, min, max, step, tag]) => (
              <div className="ax" key={tag as string}>
                <label htmlFor={`ax-${tag}`}>{l as string} <code>{tag as string}</code> <b>{v as number}</b></label>
                <input id={`ax-${tag}`} type="range" min={min as number} max={max as number} step={step as number} value={v as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} aria-valuetext={`${l as string} ${v as number}`} />
              </div>
            ))}
            <div className="tog">
              <button role="switch" aria-checked={wonk === 1} onClick={() => setWonk(wonk ? 0 : 1)}>Wonk <b>{wonk ? 'On' : 'Off'}</b></button>
              <button role="switch" aria-checked={italic} onClick={() => setItalic(!italic)}>Italic <b>{italic ? 'On' : 'Off'}</b></button>
            </div>
            <pre className="css" tabIndex={0} aria-label="CSS for these settings">{`font-family: 'Fraunces Variable';\nfont-variation-settings: ${vs};${italic ? '\nfont-style: italic;' : ''}`}</pre>
          </div>
          <div className="stage" aria-live="off">
            <p className="glyph" style={style} aria-hidden>{glyph}</p>
            <p className="word" style={style}>Hamburgefonstiv</p>
          </div>
        </section>

        <section className="set" id="set" aria-labelledby="h2s">
          <h2 id="h2s">Characters</h2>
          <p className="hint">Choose one to see it large above. Letters, figures and the punctuation worth checking.</p>
          <div className="grid" role="group" aria-label="Characters">
            {SET.map((c, i) => (
              <button key={i} onClick={() => setGlyph(c)} aria-pressed={glyph === c} aria-label={`Show ${c}`} style={style}>{c}</button>
            ))}
          </div>
        </section>

        <section className="scale" id="scale" aria-labelledby="h2c">
          <h2 id="h2c">Sizes</h2>
          <p className="hint">Optical size adjusts automatically with the font size when <code>font-optical-sizing: auto</code>. Here it follows your slider instead, so you can see the difference.</p>
          <ul>
            {LADDER.map((s) => (
              <li key={s}>
                <span className="px">{s}px</span>
                <span style={{ ...style, fontSize: s, lineHeight: 1.1 }}>Quick brown foxes jump</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="test" id="test" aria-labelledby="h2t">
          <h2 id="h2t">Try your own words</h2>
          <label htmlFor="tx" className="sr-only">Your text</label>
          <textarea id="tx" value={text} onChange={(e) => setText(e.target.value)} rows={3} style={{ ...style, fontSize: size, lineHeight: lead }} />
          <div className="ctl">
            <label htmlFor="sz">Size <b>{size}px</b></label>
            <input id="sz" type="range" min={14} max={96} value={size} onChange={(e) => setSize(Number(e.target.value))} />
            <label htmlFor="ld">Line height <b>{lead.toFixed(2)}</b></label>
            <input id="ld" type="range" min={1} max={2} step={0.05} value={lead} onChange={(e) => setLead(Number(e.target.value))} />
          </div>
        </section>
      </main>
      <footer className="foot">Fraunces is a free font under the SIL Open Font License. This page is an independent specimen made for UI Lab; the typeface belongs to its designers.</footer>
    </div>
  )
}
