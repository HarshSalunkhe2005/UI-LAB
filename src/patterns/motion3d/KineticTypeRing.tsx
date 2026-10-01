import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Kinetic typography: three bands of text wrapped around open cylinders,
 * spinning in alternating directions at different speeds around a central
 * glossy object, while the stack tilts toward the cursor. Each band is a
 * repeating CanvasTexture (wrapS = Repeat), so the text loops seamlessly.
 */

function bandTex(text: string, fg: string, bg: string) {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = bg
  g.fillRect(0, 0, 2048, 128)
  g.fillStyle = fg
  g.font = 'bold 84px system-ui, sans-serif'
  g.textBaseline = 'middle'
  const unit = `${text} ✦ `
  let x = 0
  while (x < 2048) {
    g.fillText(unit, x, 68)
    x += g.measureText(unit).width
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const BANDS = [
  { text: 'DESIGN', fg: '#0a0a0a', bg: '#facc15', y: 0.75, speed: 0.4 },
  { text: 'MOTION', fg: '#ffffff', bg: '#7c3aed', y: 0, speed: -0.55 },
  { text: 'CODE', fg: '#0a0a0a', bg: '#22d3ee', y: -0.75, speed: 0.3 },
]

function Ring() {
  const g = useRef<THREE.Group>(null!)
  const bands = useRef<(THREE.Mesh | null)[]>([])
  const texs = useMemo(() => BANDS.map((b) => bandTex(b.text, b.fg, b.bg)), [])
  const pointer = useWindowPointer()
  const still = reducedMotion()
  useFrame((_, dt) => {
    if (!still) bands.current.forEach((m, i) => m && (m.rotation.y += dt * BANDS[i].speed))
    g.current.rotation.z = THREE.MathUtils.damp(g.current.rotation.z, -0.25 - pointer.current.x * 0.25, 3, dt)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, 0.25 - pointer.current.y * 0.3, 3, dt)
  })
  return (
    <group ref={g}>
      {BANDS.map((b, i) => (
        <mesh key={b.text} ref={(el) => { bands.current[i] = el }} position={[0, b.y, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.62, 96, 1, true]} />
          <meshStandardMaterial map={texs[i]} side={THREE.DoubleSide} roughness={0.6} />
        </mesh>
      ))}
      <mesh>
        <torusKnotGeometry args={[0.45, 0.16, 160, 24]} />
        <meshPhysicalMaterial color="#e5e7eb" metalness={1} roughness={0.12} clearcoat={1} />
      </mesh>
    </group>
  )
}

export default function KineticTypeRing() {
  return (
    <div className="h-96 overflow-hidden rounded-xl bg-[#111]" role="img" aria-label="Rings of text reading design, motion, code spinning around a chrome knot">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.5} />
        <pointLight position={[-3, 0, 2]} intensity={20} color="#f472b6" />
        <Ring />
      </Canvas>
    </div>
  )
}
