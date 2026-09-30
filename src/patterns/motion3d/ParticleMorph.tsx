import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * 4,000 particles that morph between shapes (sphere → cube → torus knot →
 * wave plane). Every target shape is a Float32Array of the same length;
 * each frame positions ease toward the active target with a per-particle
 * delay, so the morph ripples. The cloud rotates toward the cursor.
 */

const N = 4000

function targets() {
  const sphere = new Float32Array(N * 3)
  const cube = new Float32Array(N * 3)
  const knot = new Float32Array(N * 3)
  const wave = new Float32Array(N * 3)
  const g = Math.PI * (3 - Math.sqrt(5))
  const k = new THREE.TorusKnotGeometry(1.1, 0.35, 200, 20).attributes.position
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    sphere.set([Math.cos(g * i) * r * 1.6, y * 1.6, Math.sin(g * i) * r * 1.6], i * 3)
    const f = i % 6, u = Math.random() * 2 - 1, v = Math.random() * 2 - 1, s = 1.2
    const face = [[s, u * s, v * s], [-s, u * s, v * s], [u * s, s, v * s], [u * s, -s, v * s], [u * s, v * s, s], [u * s, v * s, -s]][f]
    cube.set(face, i * 3)
    const j = i % k.count
    knot.set([k.getX(j), k.getY(j), k.getZ(j)], i * 3)
    const gx = (i % 80) / 79 - 0.5, gz = Math.floor(i / 80) / (N / 80) - 0.5
    wave.set([gx * 4, Math.sin(gx * 8) * 0.3 + Math.cos(gz * 8) * 0.3, gz * 3], i * 3)
  }
  return [sphere, cube, knot, wave]
}

const NAMES = ['Sphere', 'Cube', 'Knot', 'Wave']

function Cloud({ shape }: { shape: number }) {
  const all = useMemo(targets, [])
  const pts = useRef<THREE.Points>(null!)
  const pos = useMemo(() => all[0].slice(), [all])
  const delay = useMemo(() => Float32Array.from({ length: N }, () => Math.random()), [])
  const since = useRef(0)
  const last = useRef(shape)
  const pointer = useWindowPointer()
  const still = reducedMotion()
  useFrame((_, dt) => {
    if (last.current !== shape) {
      last.current = shape
      since.current = 0
    }
    since.current += dt
    const tgt = all[shape]
    for (let i = 0; i < N; i++) {
      if (!still && since.current < delay[i] * 0.8) continue
      const a = still ? 1 : 1 - Math.exp(-dt * 5)
      for (let c = 0; c < 3; c++) pos[i * 3 + c] += (tgt[i * 3 + c] - pos[i * 3 + c]) * a
    }
    pts.current.geometry.attributes.position.needsUpdate = true
    pts.current.rotation.y = THREE.MathUtils.damp(pts.current.rotation.y, pointer.current.x * 0.8 + (still ? 0 : since.current * 0.05), 3, dt)
    pts.current.rotation.x = THREE.MathUtils.damp(pts.current.rotation.x, -pointer.current.y * 0.4, 3, dt)
  })
  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#a5b4fc" sizeAttenuation transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export default function ParticleMorph() {
  const [shape, setShape] = useState(0)
  return (
    <div className="relative h-96 rounded-xl bg-black">
      <div className="h-full" role="img" aria-label={`Particle cloud shaped as a ${NAMES[shape]}`}>
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <Cloud shape={shape} />
        </Canvas>
      </div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2" role="radiogroup" aria-label="Particle shape">
        {NAMES.map((n, i) => (
          <button key={n} role="radio" aria-checked={shape === i} onClick={() => setShape(i)} className={`rounded-full px-3 py-1 text-xs ${shape === i ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
