import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * WebGL image gallery on the inside of a cylinder: photo planes wrap around
 * the viewer; drag/wheel spins the ring with inertia; the hovered photo
 * ripples outward from the pointer (vertex shader) and brightens. Each image
 * is a textured, subdivided plane with its own uniforms.
 */

const COUNT = 12
const R = 4.2
const SRCS = Array.from({ length: COUNT }, (_, i) => `/img/${(i * 3) % 48}.webp`)

const vert = /* glsl */ `
uniform float uHover; uniform vec2 uPoint; uniform float uTime;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 p = position;
  float d = distance(uv, uPoint);
  p.z += sin(d * 22.0 - uTime * 6.0) * 0.06 * uHover * exp(-d * 3.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`
const frag = /* glsl */ `
uniform sampler2D uTex; uniform float uHover;
varying vec2 vUv;
void main(){
  vec4 c = texture2D(uTex, vUv);
  gl_FragColor = vec4(c.rgb * (0.72 + uHover * 0.35), 1.0);
}`

function Photo({ tex, angle }: { tex: THREE.Texture; angle: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const [hover, setHover] = useState(false)
  const uniforms = useMemo(() => ({ uTex: { value: tex }, uHover: { value: 0 }, uPoint: { value: new THREE.Vector2(0.5, 0.5) }, uTime: { value: 0 } }), [tex])
  useFrame((s, dt) => {
    uniforms.uTime.value = s.clock.elapsedTime
    uniforms.uHover.value = THREE.MathUtils.damp(uniforms.uHover.value, hover ? 1 : 0, 6, dt)
  })
  return (
    <mesh
      position={[Math.sin(angle) * R, 0, -Math.cos(angle) * R]}
      rotation={[0, -angle, 0]}
      onPointerMove={(e) => e.uv && uniforms.uPoint.value.copy(e.uv)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeGeometry args={[1.6, 2.1, 32, 32]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Ring({ spin }: { spin: React.MutableRefObject<{ v: number; a: number }> }) {
  // Non-suspending load: textures exist immediately and fill in when each image arrives.
  const texs = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return SRCS.map((src) => {
      const t = loader.load(src)
      t.colorSpace = THREE.SRGBColorSpace
      return t
    })
  }, [])
  const g = useRef<THREE.Group>(null!)
  const still = reducedMotion()
  useFrame((_, dt) => {
    spin.current.v *= 0.94
    spin.current.a += spin.current.v + (still ? 0 : dt * 0.06)
    g.current.rotation.y = spin.current.a
  })
  return (
    <group ref={g}>
      {texs.map((t, i) => (
        <Photo key={i} tex={t} angle={(i / COUNT) * Math.PI * 2} />
      ))}
    </group>
  )
}

export default function CurvedGallery() {
  const spin = useRef({ v: 0, a: 0 })
  const drag = useRef<number | null>(null)
  return (
    <div
      className="h-96 cursor-grab touch-pan-y overflow-hidden rounded-xl bg-black active:cursor-grabbing"
      role="img"
      aria-label="Photos wrapped around a 3D cylinder; drag to spin"
      onPointerDown={(e) => (drag.current = e.clientX)}
      onPointerMove={(e) => {
        if (drag.current === null) return
        spin.current.v = (e.clientX - drag.current) * 0.0025
        drag.current = e.clientX
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onWheel={(e) => (spin.current.v += e.deltaY * 0.00015)}
    >
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 0.01], fov: 70 }}>
        <Ring spin={spin} />
      </Canvas>
    </div>
  )
}
