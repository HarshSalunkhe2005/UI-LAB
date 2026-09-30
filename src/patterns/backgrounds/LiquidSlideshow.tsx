import { useEffect, useRef, useState } from 'react'
import { img } from '../three-d/_shared'

/*
 * WebGL liquid-distortion slideshow: two image textures crossfade while a
 * noise field displaces their UVs in opposite directions, strongest mid-
 * transition, so the old picture melts into the new one. Raw WebGL, one
 * fragment shader, no library. Falls back to a plain crossfade without
 * WebGL or under reduced motion.
 */

const SRCS = [0, 1, 2, 3].map((i) => img(i + 1700, 1200, 700))

const VERT = `attribute vec2 p; varying vec2 uv; void main(){ uv = p * .5 + .5; uv.y = 1. - uv.y; gl_Position = vec4(p, 0., 1.); }`
const FRAG = `
precision mediump float; varying vec2 uv;
uniform sampler2D a; uniform sampler2D b; uniform float t; uniform float time;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
void main(){
  float k = n(uv * 4. + time * .2) * 2. - 1.;
  float s = sin(t * 3.14159);
  vec2 d = vec2(k, n(uv * 5. - time * .15) - .5) * .18 * s;
  vec4 ca = texture2D(a, uv + d * t);
  vec4 cb = texture2D(b, uv - d * (1. - t));
  float m = smoothstep(t - .15, t + .15, n(uv * 3.) * .7 + uv.x * .3);
  gl_FragColor = mix(cb, ca, m);
}`

export default function LiquidSlideshow() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [i, setI] = useState(0)
  const [fallback, setFallback] = useState(false)
  const api = useRef<{ go: (n: number) => void } | null>(null)

  useEffect(() => {
    const c = canvas.current!
    const gl = c.getContext('webgl')
    if (!gl || matchMedia('(prefers-reduced-motion: reduce)').matches) return setFallback(true)
    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!
      gl.shaderSource(o, s)
      gl.compileShader(o)
      return o
    }
    const pr = gl.createProgram()!
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(pr)
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return setFallback(true)
    gl.useProgram(pr)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    const U = (n: string) => gl.getUniformLocation(pr, n)
    gl.uniform1i(U('a'), 0)
    gl.uniform1i(U('b'), 1)

    const tex: WebGLTexture[] = SRCS.map((src) => {
      const t = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 24, 255]))
      const im = new Image()
      im.crossOrigin = 'anonymous'
      im.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, t)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        draw()
      }
      im.src = src
      return t
    })

    let from = 0, to = 0, prog = 1, start = 0, raf = 0
    const draw = (time = performance.now()) => {
      c.width = c.clientWidth * Math.min(devicePixelRatio, 1.5)
      c.height = c.clientHeight * Math.min(devicePixelRatio, 1.5)
      gl.viewport(0, 0, c.width, c.height)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex[to])
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, tex[from])
      gl.uniform1f(U('t'), prog)
      gl.uniform1f(U('time'), time / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const tick = (now: number) => {
      prog = Math.min(1, (now - start) / 1400)
      const e = prog < 0.5 ? 4 * prog ** 3 : 1 - (-2 * prog + 2) ** 3 / 2
      const saved = prog
      prog = e
      draw(now)
      prog = saved
      if (saved < 1) raf = requestAnimationFrame(tick)
    }
    api.current = {
      go(n) {
        from = to
        to = n
        start = performance.now()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      },
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  const go = (n: number) => {
    const next = (n + SRCS.length) % SRCS.length
    setI(next)
    api.current?.go(next)
  }

  return (
    <div className="relative h-80 overflow-hidden rounded-xl bg-black" role="region" aria-roledescription="carousel" aria-label="Liquid slideshow">
      {fallback ? (
        SRCS.map((s, k) => <img key={s} src={s} alt="" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0 }} />)
      ) : (
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
      )}
      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <button onClick={() => go(i - 1)} aria-label="Previous slide" className="rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur">←</button>
        <span className="font-mono text-xs text-white" aria-live="polite">{i + 1} / {SRCS.length}</span>
        <button onClick={() => go(i + 1)} aria-label="Next slide" className="rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur">→</button>
      </div>
    </div>
  )
}
