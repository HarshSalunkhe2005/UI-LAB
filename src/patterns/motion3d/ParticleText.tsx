import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Particle typography: a word is rasterised to a hidden 2D canvas, every lit
 * pixel becomes a 3D particle "home", and particles spring back home while
 * the cursor blasts them away (inverse-square push on the z=0 plane) with a
 * little depth scatter. No font files: the browser draws the text.
 */

function sample(text: string) {
  const c = document.createElement('canvas')
  c.width = 900
  c.height = 260
  const g = c.getContext('2d')!
  g.fillStyle = '#fff'
  g.font = 'bold 200px Georgia, serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, 450, 135)
  const d = g.getImageData(0, 0, c.width, c.height).data
  const out: number[] = []
  for (let y = 0; y < c.height; y += 4) for (let x = 0; x < c.width; x += 4) if (d[(y * c.width + x) * 4 + 3] > 128) out.push((x - 450) / 110, -(y - 130) / 110)
  return out
}

function Particles({ text }: { text: string }) {
  const homes = useMemo(() => sample(text), [text])
  const n = homes.length / 2
  const pos = useMemo(() => {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) a.set([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4], i * 3)
    return a
  }, [n])
  const vel = useMemo(() => new Float32Array(n * 3), [n])
  const pts = useRef<THREE.Points>(null!)
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const m = useMemo(() => new THREE.Vector3(99, 99, 0), [])
  useFrame(() => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, m)
    for (let i = 0; i < n; i++) {
      const k = i * 3
      const dx = pos[k] - m.x, dy = pos[k + 1] - m.y
      const d2 = dx * dx + dy * dy + 0.05
      const push = d2 < 1.2 ? 0.012 / d2 : 0
      vel[k] += (homes[i * 2] - pos[k]) * 0.02 + dx * push
      vel[k + 1] += (homes[i * 2 + 1] - pos[k + 1]) * 0.02 + dy * push
      vel[k + 2] += -pos[k + 2] * 0.02 + (push ? (Math.random() - 0.5) * 0.02 : 0)
      vel[k] *= 0.88; vel[k + 1] *= 0.88; vel[k + 2] *= 0.88
      pos[k] += vel[k]; pos[k + 1] += vel[k + 1]; pos[k + 2] += vel[k + 2]
    }
    pts.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#c7d2fe" sizeAttenuation transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export default function ParticleText({ text = 'Hello' }: { text?: string }) {
  return (
    <div className="h-80 cursor-crosshair overflow-hidden rounded-xl bg-black" role="img" aria-label={`The word ${text} made of particles that scatter from the cursor`}>
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <Particles text={text} />
      </Canvas>
    </div>
  )
}
