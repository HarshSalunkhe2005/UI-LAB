import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import '@fontsource-variable/unbounded'
import '@fontsource-variable/hanken-grotesk'
import './styles.css'
import { reducedMotion } from '../_shared'
import Lenis from 'lenis'
import { fragment, vertex } from './shader'

const reduced = reducedMotion()

/* Scroll fraction at which each zone's text sits, paired with its real depth in metres.
   Between stops depth is interpolated linearly, so the counter always agrees with the words on screen. */
const ZONES = [
  { f: 0.0, m: 0, name: 'Sunlight', title: 'Abyss', body: 'Ten thousand nine hundred metres of ocean, and nobody lives at the top of it. Scroll to descend.', side: 'l' },
  { f: 0.2, m: 200, name: 'Twilight', title: 'The light gives up.', body: 'Below 200 metres there is too little sun for plants to grow. What is left is a blue that gets darker every metre.', side: 'r' },
  { f: 0.42, m: 1000, name: 'Midnight', title: 'No sun reaches here.', body: 'At 1,000 metres the dark is complete. Many animals make their own light, to hunt, to hide and to talk.', side: 'l' },
  { f: 0.66, m: 4000, name: 'Abyss', title: 'Cold, still, crushing.', body: 'Water just above freezing, soft mud for a floor, and pressure hundreds of times what you feel at the surface.', side: 'r' },
  { f: 0.9, m: 10935, name: 'Hadal', title: 'Challenger Deep.', body: 'The deepest known point in the ocean. The pressure is more than a thousand times the surface. Something still glows.', side: 'l' },
]
const TOTAL_SVH = 760 // page height in svh; text blocks are positioned along it

function metersAt(p: number) {
  for (let i = 0; i < ZONES.length - 1; i++) {
    const a = ZONES[i]
    const b = ZONES[i + 1]
    if (p <= b.f) return a.m + ((p - a.f) / (b.f - a.f)) * (b.m - a.m)
  }
  return ZONES[ZONES.length - 1].m
}
const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export default function AbyssSite() {
  const root = useRef<HTMLDivElement>(null)
  const canvasHost = useRef<HTMLDivElement>(null)
  const meter = useRef<HTMLSpanElement>(null)
  const zoneLabel = useRef<HTMLSpanElement>(null)
  const marker = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = reduced ? null : new Lenis({ lerp: 0.075 })
    const host = canvasHost.current!
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
    const cap = matchMedia('(max-width: 800px)').matches ? 1.25 : 1.6
    renderer.setPixelRatio(Math.min(devicePixelRatio, cap))
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uP: { value: 0 },
      uScroll: { value: 0 },
      uPtr: { value: new THREE.Vector2(0.5, 0.5) },
    }
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment })
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight)
      const b = renderer.getDrawingBufferSize(new THREE.Vector2())
      uniforms.uRes.value.copy(b)
    }
    resize()
    addEventListener('resize', resize)

    const ptr = { x: 0.5, y: 0.5 }
    const onMove = (e: PointerEvent) => {
      ptr.x = e.clientX / innerWidth
      ptr.y = 1 - e.clientY / innerHeight
    }
    addEventListener('pointermove', onMove)

    // smoothed state
    let p = 0
    let sy = 0
    let m = 0
    let last = performance.now()
    let raf = 0
    let lastZone = -1
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      lenis?.raf(now)
      const max = document.documentElement.scrollHeight - innerHeight
      const target = max > 0 ? scrollY / max : 0
      const k = 1 - Math.exp(-dt * 5)
      p += (target - p) * k
      sy += (scrollY - sy) * k
      m += (metersAt(target) - m) * k

      uniforms.uTime.value += dt * (reduced ? 0.25 : 1)
      uniforms.uP.value = p
      uniforms.uScroll.value = sy
      uniforms.uPtr.value.x += (ptr.x - uniforms.uPtr.value.x) * (1 - Math.exp(-dt * 6))
      uniforms.uPtr.value.y += (ptr.y - uniforms.uPtr.value.y) * (1 - Math.exp(-dt * 6))
      renderer.render(scene, camera)

      // ink flips from deep navy (bright water) to pale (dark water) so text is readable at every depth
      const t = Math.min(1, Math.max(0, (p - 0.02) / 0.16))
      const mixc = (a: number[], b: number[]) => a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')
      const rs = root.current!.style
      rs.setProperty('--fg', `rgb(${mixc([5, 38, 54], [232, 246, 246])})`)
      rs.setProperty('--muted', `rgba(${mixc([5, 38, 54], [232, 246, 246])},0.78)`)
      rs.setProperty('--glow', `rgb(${mixc([0, 92, 104], [94, 242, 221])})`)
      rs.setProperty('--rail', `rgba(${mixc([5, 38, 54], [232, 246, 246])},0.4)`)

      if (meter.current) meter.current.textContent = fmt(m)
      if (marker.current) marker.current.style.top = `${Math.min(1, Math.max(0, p)) * 100}%`
      let z = 0
      ZONES.forEach((zn, i) => {
        if (target >= zn.f - 0.07) z = i
      })
      if (z !== lastZone && zoneLabel.current) {
        lastZone = z
        zoneLabel.current.textContent = ZONES[z].name
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    // text blocks surface and sink as they cross the viewport
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('in', e.isIntersecting)), { rootMargin: '-18% 0px -18% 0px' })
    document.querySelectorAll('.zone').forEach((el) => io.observe(el))

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      lenis?.destroy()
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={root} className="site-abyss">
      <div ref={canvasHost} className="sea" aria-hidden="true" />

      <aside className="gauge" aria-label="Depth gauge">
        <div className="readout">
          <span ref={meter}>0</span><small>m</small>
          <em ref={zoneLabel}>Sunlight</em>
        </div>
        <div className="rail" aria-hidden="true">
          {ZONES.map((z) => (
            <i key={z.name} style={{ top: `${z.f * 100}%` }}><b>{z.name}</b></i>
          ))}
          <div ref={marker} className="mk" />
        </div>
      </aside>

      <main style={{ height: `${TOTAL_SVH}svh` }}>
        {ZONES.map((z, i) => (
          <section key={z.name} className={`zone ${z.side} ${i === 0 ? 'first' : ''}`} style={{ top: `${(z.f * (TOTAL_SVH - 100)).toFixed(1)}svh` }}>
            <div className="inner">
              <p className="depth">{fmt(z.m)} m · {z.name}</p>
              {i === 0 ? <h1>{z.title}</h1> : <h2>{z.title}</h2>}
              <p className="body">{z.body}</p>
              {i === 0 && <p className="hint">Move the pointer. Your lantern lights the snow.</p>}
            </div>
          </section>
        ))}

        <section className="zone end" style={{ top: `${TOTAL_SVH - 100}svh` }}>
          <button onClick={() => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}>Return to the surface</button>
          <p className="fine">Demo site. Depth figures are approximate.</p>
        </section>
      </main>
    </div>
  )
}
