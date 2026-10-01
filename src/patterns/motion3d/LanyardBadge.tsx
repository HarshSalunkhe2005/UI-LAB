import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/*
 * Hanging conference badge on a lanyard. The strap is a Verlet rope (12
 * points, distance constraints solved a few times per frame); the card hangs
 * from the last point and swings with gravity and inertia. Grab the card and
 * fling it: it follows the pointer on the z=0 plane while dragged, then the
 * rope physics takes over. No physics library.
 */

const SEG = 12
const LEN = 0.17

function badgeTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 720
  const g = c.getContext('2d')!
  const grd = g.createLinearGradient(0, 0, 512, 720)
  grd.addColorStop(0, '#312e81')
  grd.addColorStop(1, '#0f172a')
  g.fillStyle = grd
  g.fillRect(0, 0, 512, 720)
  g.fillStyle = '#c7d2fe'
  g.font = '600 34px system-ui'
  g.fillText('UI LAB CONF 2026', 40, 80)
  g.fillStyle = '#ffffff'
  g.font = 'bold 92px Georgia, serif'
  g.fillText('Harsh', 40, 470)
  g.font = '40px system-ui'
  g.fillStyle = '#a5b4fc'
  g.fillText('Speaker · Frontend', 40, 530)
  g.fillStyle = '#818cf8'
  g.beginPath()
  g.arc(256, 260, 110, 0, Math.PI * 2)
  g.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Badge() {
  const tex = useMemo(badgeTexture, [])
  const pts = useMemo(() => Array.from({ length: SEG }, (_, i) => ({ p: new THREE.Vector3(0, 2 - i * LEN, 0), o: new THREE.Vector3(0, 2 - i * LEN, 0) })), [])
  const card = useRef<THREE.Group>(null!)
  const line = useMemo(() => new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#f472b6' })), [])
  const dragging = useRef(false)
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => {
    const up = () => (dragging.current = false)
    addEventListener('pointerup', up)
    return () => removeEventListener('pointerup', up)
  }, [])

  useFrame((_, dt) => {
    const step = Math.min(dt, 1 / 30)
    for (let i = 1; i < SEG; i++) {
      const pt = pts[i]
      const v = pt.p.clone().sub(pt.o).multiplyScalar(0.985)
      pt.o.copy(pt.p)
      pt.p.add(v).add(new THREE.Vector3(0, -9.8 * step * step, 0))
    }
    if (dragging.current) {
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(plane, hit)
      pts[SEG - 1].p.lerp(hit, 0.5)
    }
    for (let k = 0; k < 6; k++) {
      pts[0].p.set(0, 2, 0)
      for (let i = 0; i < SEG - 1; i++) {
        const a = pts[i].p, b = pts[i + 1].p
        const delta = b.clone().sub(a)
        const diff = (delta.length() - LEN) / delta.length()
        const off = delta.multiplyScalar(0.5 * diff)
        if (i > 0) a.add(off)
        b.sub(off)
      }
    }
    line.geometry.setFromPoints(pts.map((x) => x.p))
    const end = pts[SEG - 1].p
    const prev = pts[SEG - 2].p
    card.current.position.copy(end)
    card.current.rotation.z = Math.atan2(end.x - prev.x, prev.y - end.y)
    card.current.rotation.y = THREE.MathUtils.damp(card.current.rotation.y, (end.x - pts[SEG - 1].o.x) * 8, 4, dt)
  })

  return (
    <>
      <primitive object={line} />
      <group ref={card}>
        <group position={[0, -0.75, 0]} onPointerDown={(e) => { e.stopPropagation(); dragging.current = true }}>
          <RoundedBox args={[1.05, 1.48, 0.03]} radius={0.06}>
            <meshPhysicalMaterial color="#1e1b4b" clearcoat={1} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.017]}>
            <planeGeometry args={[0.98, 1.38]} />
            <meshStandardMaterial map={tex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <torusGeometry args={[0.06, 0.015, 8, 24]} />
            <meshStandardMaterial color="#d4d4d8" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </>
  )
}

export default function LanyardBadge() {
  return (
    <div className="h-[28rem] cursor-grab touch-none active:cursor-grabbing" role="img" aria-label="Conference badge hanging on a lanyard that swings and can be dragged">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0.3, 5], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 5]} intensity={2} />
        <Badge />
      </Canvas>
      <p className="-mt-6 text-center font-mono text-xs text-fg-muted">grab the badge and fling it</p>
    </div>
  )
}
