import { useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Cursor lens: the picture is shown greyscale and dim everywhere except a
 * square lens that follows the cursor, where it is full colour, slightly
 * magnified, RGB-split at the edges and outlined. One full-screen quad, one
 * fragment shader; the lens position eases toward the pointer each frame.
 */

const frag = /* glsl */ `
uniform sampler2D uTex; uniform vec2 uMouse; uniform float uAspect; uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 d = (vUv - uMouse) * vec2(uAspect, 1.0);
  float size = 0.17;
  float box = max(abs(d.x), abs(d.y));
  float inside = 1.0 - smoothstep(size - 0.004, size, box);
  float edge = smoothstep(size - 0.012, size - 0.004, box) * inside;
  vec2 zoomUv = uMouse + (vUv - uMouse) * 0.75;
  float shift = 0.004 + edge * 0.02;
  vec3 lens = vec3(texture2D(uTex, zoomUv + vec2(shift, 0.)).r, texture2D(uTex, zoomUv).g, texture2D(uTex, zoomUv - vec2(shift, 0.)).b);
  vec3 base = texture2D(uTex, vUv).rgb;
  float g = dot(base, vec3(0.299, 0.587, 0.114)) * 0.55;
  vec3 col = mix(vec3(g), lens, inside) + edge * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`
const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`

function Lens() {
  const { pointer, size } = useThree()
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load('/img/7.webp')
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  const uniforms = useMemo(() => ({ uTex: { value: tex }, uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uAspect: { value: 1 }, uTime: { value: 0 } }), [tex])
  useFrame((s, dt) => {
    uniforms.uAspect.value = size.width / size.height
    uniforms.uTime.value = s.clock.elapsedTime
    const m = uniforms.uMouse.value
    m.x = THREE.MathUtils.damp(m.x, pointer.x * 0.5 + 0.5, 10, dt)
    m.y = THREE.MathUtils.damp(m.y, pointer.y * 0.5 + 0.5, 10, dt)
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  )
}

export default function SquareLens() {
  return (
    <div className="h-96 cursor-none overflow-hidden rounded-xl" role="img" aria-label="Greyscale photo with a colour lens square following the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]}>
        <Lens />
      </Canvas>
    </div>
  )
}
