import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * 360° product viewer: drag to orbit, auto-rotates when idle, colourway
 * swatches recolour the product, and hotspots pinned to the model explain
 * features. Hotspots are plain HTML outside the canvas: each frame their 3D
 * anchors are projected to screen space, and they fade when facing away. The "product" is a soda can with a
 * CanvasTexture label; replace it with useGLTF('/model.glb') for real ones.
 */

const WAYS = [
  { name: 'Citrus', body: '#f59e0b', text: '#1c1917' },
  { name: 'Berry', body: '#db2777', text: '#fff1f2' },
  { name: 'Mint', body: '#10b981', text: '#052e16' },
]

function label(body: string, text: string) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')!
  g.fillStyle = body
  g.fillRect(0, 0, 1024, 512)
  g.fillStyle = text
  g.font = 'italic bold 150px Georgia, serif'
  g.textAlign = 'center'
  g.fillText('fizz', 512, 300)
  g.font = '600 36px system-ui'
  g.fillText('SPARKLING · 330ML', 512, 380)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Can({ way }: { way: (typeof WAYS)[number] }) {
  const tex = useMemo(() => label(way.body, way.text), [way])
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 2.4, 64, 1, true]} />
        <meshStandardMaterial map={tex} metalness={0.3} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {[1.2, -1.2].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.72, 0.8, 0.12, 64]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

const SPOTS: { label: string; at: [number, number, number]; normal: [number, number, number] }[] = [
  { label: 'Real fruit', at: [0.82, 0.4, 0], normal: [1, 0, 0] },
  { label: 'Resealable top', at: [0, 1.3, 0.3], normal: [0, 0.6, 0.8] },
]

/** Projects hotspot anchors to screen coords every frame and writes them to DOM refs. */
function Hotspots({ els }: { els: React.MutableRefObject<(HTMLSpanElement | null)[]> }) {
  const v = useMemo(() => new THREE.Vector3(), [])
  const n = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    SPOTS.forEach((s, i) => {
      const el = els.current[i]
      if (!el) return
      v.set(...s.at).project(camera)
      n.set(...s.normal)
      const facing = n.dot(camera.position.clone().sub(new THREE.Vector3(...s.at)).normalize())
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`
      el.style.opacity = facing > 0.1 ? '1' : '0'
    })
  })
  return null
}

export default function ProductViewer() {
  const spots = useRef<(HTMLSpanElement | null)[]>([])
  const [w, setW] = useState(0)
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
      <div className="relative h-96 cursor-grab overflow-hidden rounded-xl bg-gradient-to-b from-surface-2 to-bg active:cursor-grabbing" role="img" aria-label={`${WAYS[w].name} soda can, drag to rotate`}>
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0.6, 5.5], fov: 35 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={2} />
          <directionalLight position={[-4, 2, -3]} intensity={0.8} />
          <Can way={WAYS[w]} />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.45} scale={5} blur={2.5} />
          <Hotspots els={spots} />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate={!reducedMotion()} autoRotateSpeed={1.2} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
        {SPOTS.map((s, i) => (
          <span
            key={s.label}
            ref={(el) => { spots.current[i] = el }}
            className="pointer-events-none absolute top-0 left-0 -translate-y-1/2 rounded-full bg-black/70 px-2 py-1 text-[11px] whitespace-nowrap text-white transition-opacity duration-200"
          >
            ● {s.label}
          </span>
        ))}
      </div>
      <div className="space-y-3">
        <h4 className="font-display text-3xl italic">{WAYS[w].name}</h4>
        <p className="text-sm text-fg-muted">Drag to spin. Pick a flavour:</p>
        <div className="flex gap-2" role="radiogroup" aria-label="Flavour">
          {WAYS.map((way, i) => (
            <button key={way.name} role="radio" aria-checked={w === i} aria-label={way.name} onClick={() => setW(i)} className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-bg ${w === i ? 'ring-2 ring-fg' : ''}`} style={{ background: way.body }} />
          ))}
        </div>
      </div>
    </div>
  )
}
