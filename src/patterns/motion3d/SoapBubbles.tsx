import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * Soap bubbles: transparent spheres with a custom thin-film shader
 * (iridescent hue shifting with view angle = fresnel), drifting up with a
 * wobble. Click a bubble to pop it: it bursts into a quick ring of droplets
 * and a new bubble respawns at the bottom. Popped count is announced.
 */

const vert = /* glsl */ `
varying vec3 vN; varying vec3 vV; uniform float uTime; uniform float uSeed;
void main(){
  vec3 p = position + normal * sin(position.y * 6. + uTime * 3. + uSeed) * 0.015;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`
const frag = /* glsl */ `
varying vec3 vN; varying vec3 vV; uniform float uTime; uniform float uSeed;
void main(){
  float f = 1. - abs(dot(vN, vV));
  vec3 film = 0.5 + 0.5 * cos(6.2831 * (f * 1.6 + vec3(0., .33, .67) + uTime * .05 + uSeed));
  float a = pow(f, 2.2) * 0.9 + 0.04;
  float spec = pow(max(dot(reflect(-normalize(vec3(.4,.8,.5)), vN), vV), 0.), 60.);
  gl_FragColor = vec4(film + spec, a + spec);
}`

type B = { id: number; x: number; y: number; z: number; r: number; seed: number }
let uid = 0
const spawn = (y = -2.6): B => ({ id: uid++, x: (Math.random() - 0.5) * 6, y, z: (Math.random() - 0.5) * 2, r: 0.25 + Math.random() * 0.4, seed: Math.random() * 10 })

function Bubble({ b, onPop }: { b: B; onPop: (b: B, p: THREE.Vector3) => void }) {
  const ref = useRef<THREE.Mesh>(null!)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: b.seed } }), [b.seed])
  const still = reducedMotion()
  useFrame((s, dt) => {
    uniforms.uTime.value = s.clock.elapsedTime
    if (still) return
    b.y += dt * (0.25 + 0.15 / b.r)
    b.x += Math.sin(s.clock.elapsedTime + b.seed) * dt * 0.2
    ref.current.position.set(b.x, b.y, b.z)
    if (b.y > 3.2) Object.assign(b, spawn())
  })
  return (
    <mesh ref={ref} position={[b.x, b.y, b.z]} onClick={(e) => { e.stopPropagation(); onPop(b, ref.current.position.clone()) }}>
      <sphereGeometry args={[b.r, 48, 48]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  )
}

function Splash({ at, onDone }: { at: THREE.Vector3; onDone: () => void }) {
  const g = useRef<THREE.Group>(null!)
  const t = useRef(0)
  const dirs = useMemo(() => Array.from({ length: 14 }, (_, i) => new THREE.Vector3(Math.cos((i / 14) * Math.PI * 2), Math.sin((i / 14) * Math.PI * 2), (Math.random() - 0.5) * 0.6)), [])
  useFrame((_, dt) => {
    t.current += dt
    g.current.children.forEach((c, i) => c.position.copy(dirs[i]).multiplyScalar(t.current * 1.6))
    g.current.scale.setScalar(Math.max(0.001, 1 - t.current * 2))
    if (t.current > 0.5) onDone()
  })
  return (
    <group ref={g} position={at}>
      {dirs.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
      ))}
    </group>
  )
}

export default function SoapBubbles() {
  const [bubbles, setBubbles] = useState<B[]>(() => Array.from({ length: 12 }, () => spawn(-2.6 + Math.random() * 5.5)))
  const [splashes, setSplashes] = useState<{ id: number; at: THREE.Vector3 }[]>([])
  const [popped, setPopped] = useState(0)
  return (
    <div className="relative">
      <div className="h-96 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-b from-sky-950 to-indigo-950" role="img" aria-label="Iridescent soap bubbles drifting up; click to pop">
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
          {bubbles.map((b) => (
            <Bubble
              key={b.id}
              b={b}
              onPop={(bb, p) => {
                setSplashes((s) => [...s, { id: bb.id, at: p }])
                setBubbles((all) => all.map((x) => (x.id === bb.id ? spawn() : x)))
                setPopped((n) => n + 1)
              }}
            />
          ))}
          {splashes.map((s) => <Splash key={s.id} at={s.at} onDone={() => setSplashes((all) => all.filter((x) => x.id !== s.id))} />)}
        </Canvas>
      </div>
      <p aria-live="polite" className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 font-mono text-xs text-white">popped: {popped}</p>
    </div>
  )
}
