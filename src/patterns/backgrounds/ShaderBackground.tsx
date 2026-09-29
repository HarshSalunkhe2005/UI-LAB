import { useEffect, useRef, useState } from 'react'

/*
 * One WebGL fragment shader, seven looks: mesh, aurora, swirl, voronoi,
 * flame, halftone, metal. Colours come from a 4-stop palette, and a light
 * dither gives the print-like finish. No dependencies.
 *
 * - Pauses when off screen (IntersectionObserver) and when the tab is hidden.
 * - prefers-reduced-motion: renders one still frame.
 * - Pixel ratio capped at 1.5; the look is soft, so full DPR is wasted work.
 * - Falls back to a CSS gradient of the same palette if WebGL is unavailable.
 */

export type ShaderMode = 'mesh' | 'aurora' | 'swirl' | 'voronoi' | 'flame' | 'halftone' | 'metal'
export type ShaderPreset = { name: string; mode: ShaderMode; colors: [string, string, string, string] }

const MODES: ShaderMode[] = ['mesh', 'aurora', 'swirl', 'voronoi', 'flame', 'halftone', 'metal']

export const PRESETS: ShaderPreset[] = [
  { name: 'Indigo Mesh', mode: 'mesh', colors: ['#07061a', '#312e81', '#7c3aed', '#c4b5fd'] },
  { name: 'Sunset Mesh', mode: 'mesh', colors: ['#1a0612', '#9d174d', '#f97316', '#fde68a'] },
  { name: 'Mint Haze', mode: 'mesh', colors: ['#f5f1e8', '#d8eadf', '#9fd3c7', '#5fa89a'] },
  { name: 'Aurora Veil', mode: 'aurora', colors: ['#03060a', '#0f3d3e', '#22c55e', '#a78bfa'] },
  { name: 'Aurora Ice', mode: 'aurora', colors: ['#020617', '#1e3a5f', '#93c5fd', '#f8fafc'] },
  { name: 'Tide Swirl', mode: 'swirl', colors: ['#020617', '#0c4a6e', '#38bdf8', '#e0f2fe'] },
  { name: 'Rose Swirl', mode: 'swirl', colors: ['#1a0610', '#831843', '#f472b6', '#ffe4e6'] },
  { name: 'Violet Cells', mode: 'voronoi', colors: ['#0b0618', '#4c1d95', '#8b5cf6', '#ede9fe'] },
  { name: 'Amber Cells', mode: 'voronoi', colors: ['#140a02', '#78350f', '#f59e0b', '#fef3c7'] },
  { name: 'Ember Flame', mode: 'flame', colors: ['#050201', '#7f1d1d', '#f97316', '#fef9c3'] },
  { name: 'Azure Flame', mode: 'flame', colors: ['#01030a', '#1e3a8a', '#60a5fa', '#f0f9ff'] },
  { name: 'Halftone Mono', mode: 'halftone', colors: ['#f4f1ea', '#111111', '#111111', '#111111'] },
  { name: 'Halftone Sun', mode: 'halftone', colors: ['#fff4e0', '#ea580c', '#ea580c', '#ea580c'] },
  { name: 'Chrome Melt', mode: 'metal', colors: ['#0a0a0f', '#3f3f46', '#a1a1aa', '#c4b5fd'] },
  { name: 'Chrome Gold', mode: 'metal', colors: ['#120a02', '#78350f', '#d97706', '#fef3c7'] },
  { name: 'Oil Slick', mode: 'metal', colors: ['#020617', '#0f766e', '#c026d3', '#22d3ee'] },
]

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`

const FRAG = `
precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform float u_mode; uniform float u_dither;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0., a = .5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + 17.; a *= .5; } return v; }
vec3 pal(float t){
  t = clamp(t, 0., 1.) * 3.;
  if (t < 1.) return mix(c0, c1, t);
  if (t < 2.) return mix(c1, c2, t - 1.);
  return mix(c2, c3, t - 2.);
}
float warp(vec2 p, float t){
  vec2 q = vec2(fbm(p + t*.05), fbm(p + vec2(5.2, 1.3) - t*.04));
  return fbm(p + 2.2*q);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - .5*u_res) / min(u_res.x, u_res.y) * 2.;
  float t = u_time;
  vec3 col;

  if (u_mode < .5) {                       // mesh
    col = pal(smoothstep(.2, .85, warp(p*1.2, t)));
  } else if (u_mode < 1.5) {               // aurora
    float band = fbm(vec2(p.x*1.2 + t*.04, t*.08));
    float y = uv.y - .55 - (band - .5)*.6;
    float curtain = exp(-abs(y)*5.) * (.55 + .45*sin(p.x*7. + fbm(p*2.5 + t*.1)*6. + t*.4));
    col = mix(c0, pal(.35 + band*.65), clamp(curtain*1.4, 0., 1.));
  } else if (u_mode < 2.5) {               // swirl
    float r = length(p), a = atan(p.y, p.x);
    float b = sin(a*2. + r*5. - t*.35 + fbm(p*1.5 + t*.05)*4.) * .5 + .5;
    col = pal(mix(b, 1. - r*.35, .25));
  } else if (u_mode < 3.5) {               // voronoi
    vec2 g = p*3.; vec2 i = floor(g), f = fract(g);
    float d1 = 8., d2 = 8.; float id = 0.;
    for (int y=-1; y<=1; y++) for (int x=-1; x<=1; x++) {
      vec2 o = vec2(float(x), float(y));
      float h = hash(i + o);
      vec2 pt = o + .5 + .4*sin(t*.4 + 6.2831*vec2(h, fract(h*7.13))) - f;
      float d = dot(pt, pt);
      if (d < d1) { d2 = d1; d1 = d; id = h; } else if (d < d2) { d2 = d; }
    }
    float edge = sqrt(d2) - sqrt(d1);
    col = mix(pal(.2 + id*.6) * (1. - sqrt(d1)*.5), c3, smoothstep(.07, .0, edge));
  } else if (u_mode < 4.5) {               // flame
    float n = fbm(vec2(p.x*2.2, p.y*1.6 - t*1.1)) + .5*fbm(vec2(p.x*5., p.y*4. - t*2.));
    float v = clamp(n*1.25 - uv.y*1.35 + .35, 0., 1.);
    col = pal(pow(v, 1.3));
  } else if (u_mode < 5.5) {               // halftone
    float v = smoothstep(.25, .8, warp(p, t));
    vec2 g = mat2(.707, -.707, .707, .707) * gl_FragCoord.xy / 7.;
    float d = length(fract(g) - .5);
    float r = sqrt(v) * .55;
    float ink = smoothstep(r + .06, r - .06, d);
    col = mix(c0, c1, ink);
  } else {                                 // metal
    float v = warp(p*.9, t*.7);
    float spec = pow(abs(sin(v*14. + t*.15)), 10.);
    col = mix(pal(v), vec3(1.), spec*.55);
  }

  col += (hash(gl_FragCoord.xy + fract(t)) - .5) * u_dither;
  gl_FragColor = vec4(col, 1.);
}`

function hex(c: string) {
  const n = parseInt(c.slice(1), 16)
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function ShaderBackground({
  preset = PRESETS[0],
  speed = 1,
  dither = 0.06,
  className = '',
}: {
  preset?: ShaderPreset
  speed?: number
  dither?: number
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const live = useRef({ preset, speed, dither })
  live.current = { preset, speed, dither }

  useEffect(() => {
    const canvas = ref.current!
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl || gl.isContextLost()) return setFailed(true)

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setFailed(true)
    gl.useProgram(prog)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl.getUniformLocation(prog, n)

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let visible = true
    let t = 12
    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = () => {
      const { preset: pr, dither: di } = live.current
      gl.uniform2f(u('u_res'), canvas.width, canvas.height)
      gl.uniform1f(u('u_time'), t)
      gl.uniform1f(u('u_mode'), MODES.indexOf(pr.mode))
      gl.uniform1f(u('u_dither'), di)
      pr.colors.forEach((c, i) => gl.uniform3fv(u(`c${i}`), hex(c)))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      t += ((now - last) / 1000) * live.current.speed
      last = now
      draw()
      if (visible && !reduced) raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden
      if (visible) start()
    })
    io.observe(canvas)
    const onVis = () => {
      visible = !document.hidden
      if (visible) start()
    }
    document.addEventListener('visibilitychange', onVis)

    resize()
    start()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      // Don't force loseContext(): StrictMode re-runs this effect on the same
      // canvas and would get a dead context back. The browser frees it on unmount.
    }
  }, [])

  if (failed) {
    const [a, b, c] = preset.colors
    return <div className={`h-full w-full ${className}`} style={{ background: `radial-gradient(at 30% 30%, ${c}, ${b} 45%, ${a})` }} aria-hidden />
  }
  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden />
}

export default function ShaderBackgroundDemo() {
  const [preset, setPreset] = useState(PRESETS[0])
  const light = preset.mode === 'halftone' || preset.name === 'Mint Haze'
  return (
    <div className="space-y-4">
      <div className="relative h-80 overflow-hidden rounded-xl border border-border">
        <ShaderBackground preset={preset} />
        <div className={`absolute inset-0 grid place-items-center ${light ? 'text-neutral-900' : 'text-white'}`}>
          <div className="text-center">
            <p className="font-mono text-[11px] tracking-widest uppercase opacity-70">{preset.mode}</p>
            <h3 className="font-display text-5xl italic">{preset.name}</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Shader preset">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            role="radio"
            aria-checked={p === preset}
            onClick={() => setPreset(p)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
              p === preset ? 'border-accent text-fg' : 'border-border text-fg-muted hover:text-fg'
            }`}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${p.colors[1]}, ${p.colors[2]})` }} />
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
