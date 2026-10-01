import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Procedural spiral galaxy: 30,000 points distributed along logarithmic-ish
 * arms with randomness that grows toward the rim, coloured from a hot core
 * to a cool edge, additive-blended. It slowly rotates and tilts toward the
 * cursor; a vertex-shader twist makes inner stars orbit faster than outer
 * ones (differential rotation).
 */

const COUNT = 30000
const ARMS = 4

const vert = /* glsl */ `
uniform float uTime; attribute vec3 aColor; varying vec3 vColor;
void main(){
  vec3 p = position;
  float r = length(p.xz);
  float a = atan(p.z, p.x) + uTime * (0.6 / (r + 0.3));
  p.xz = vec2(cos(a), sin(a)) * r;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = 2.2 * (8. / -mv.z);
  gl_Position = projectionMatrix * mv;
  vColor = aColor;
}`
const frag = /* glsl */ `
varying vec3 vColor;
void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(vColor, pow(1. - d * 2., 2.)); }`

function Galaxy() {
  const ref = useRef<THREE.Points>(null!)
  const pointer = useWindowPointer()
  const still = reducedMotion()
  const geo = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const inside = new THREE.Color('#ffb36b'), outside = new THREE.Color('#4f46e5')
    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(Math.random(), 1.6) * 5
      const branch = ((i % ARMS) / ARMS) * Math.PI * 2
      const spin = r * 1.1
      const rnd = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35 * (r + 0.4)
      pos[i * 3] = Math.cos(branch + spin) * r + rnd()
      pos[i * 3 + 1] = rnd() * 0.4
      pos[i * 3 + 2] = Math.sin(branch + spin) * r + rnd()
      const c = inside.clone().lerp(outside, r / 5)
      col.set([c.r, c.g, c.b], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    return g
  }, [])
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, dt) => {
    if (!still) uniforms.uTime.value += dt * 0.3
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, 0.5 - pointer.current.y * 0.5, 2, dt)
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, -pointer.current.x * 0.4, 2, dt)
  })
  return (
    <points ref={ref} geometry={geo}>
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export default function SpiralGalaxy() {
  return (
    <div className="h-96 overflow-hidden rounded-xl bg-black" role="img" aria-label="Rotating spiral galaxy of thirty thousand stars, tilting toward the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 3, 7], fov: 50 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <Galaxy />
      </Canvas>
    </div>
  )
}
