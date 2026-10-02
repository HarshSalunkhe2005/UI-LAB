import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { FLAVORS } from './flavors'
import { makeLabel } from './label'
import { intro, pointer, rig } from './rig'

const R = 0.62
const BODY_H = 2.0
const HALF = BODY_H / 2

const v = (x: number, y: number) => new THREE.Vector2(x, y)

// Shoulder -> neck -> rim -> recessed lid, as a lathe profile.
const TOP_PROFILE = [
  v(R, HALF), v(R - 0.012, HALF + 0.05), v(R - 0.05, HALF + 0.11), v(R - 0.1, HALF + 0.16),
  v(R - 0.13, HALF + 0.19), v(R - 0.135, HALF + 0.215), v(R - 0.13, HALF + 0.235), v(R - 0.145, HALF + 0.255),
  v(R - 0.17, HALF + 0.25), v(R - 0.18, HALF + 0.2), v(R - 0.2, HALF + 0.185), v(0.001, HALF + 0.185),
]

const BOTTOM_PROFILE = [
  v(R, -HALF), v(R - 0.012, -HALF - 0.05), v(R - 0.05, -HALF - 0.1), v(R - 0.1, -HALF - 0.14),
  v(R - 0.14, -HALF - 0.15), v(R - 0.18, -HALF - 0.12), v(R - 0.22, -HALF - 0.05), v(R - 0.3, -HALF - 0.025),
  v(0.001, -HALF - 0.01),
]

function Can({ onReady }: { onReady: () => void }) {
  const group = useRef<THREE.Group>(null!)
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null!)
  const gl = useThree((s) => s.gl)
  const [labels, setLabels] = useState<THREE.CanvasTexture[] | null>(null)
  const shown = useRef(-1)

  useEffect(() => {
    let alive = true
    const aniso = gl.capabilities.getMaxAnisotropy()
    Promise.all([
      document.fonts.load('100px Anton'),
      document.fonts.load('600 40px "Bricolage Grotesque Variable"'),
    ]).then(() => {
      if (!alive) return
      setLabels(FLAVORS.map((f) => makeLabel(f, aniso)))
      shown.current = 0
      // wait two frames so the first render (shader compile + texture upload) happens hidden
      requestAnimationFrame(() => requestAnimationFrame(onReady))
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl])

  const metal = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#d9dde2', metalness: 1, roughness: 0.22, side: THREE.DoubleSide }),
    [],
  )
  const topGeo = useMemo(() => new THREE.LatheGeometry(TOP_PROFILE, 96), [])
  const botGeo = useMemo(() => new THREE.LatheGeometry(BOTTOM_PROFILE, 96), [])

  const cur = useRef({ x: rig.x, y: rig.y, s: rig.s, rx: 0, ry: 0, rz: rig.rz })

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const { viewport, clock } = state
    const k = 9
    const c = cur.current
    const narrow = viewport.width / viewport.height < 0.9

    c.x = THREE.MathUtils.damp(c.x, narrow ? 0 : rig.x, k, dt)
    c.y = THREE.MathUtils.damp(c.y, rig.y + (narrow ? 0.12 : 0), k, dt)
    c.s = THREE.MathUtils.damp(c.s, rig.s, k, dt)
    c.rx = THREE.MathUtils.damp(c.rx, rig.rx + pointer.y * 0.18, 5, dt)
    c.ry = THREE.MathUtils.damp(c.ry, rig.ry + pointer.x * 0.35, 5, dt)
    c.rz = THREE.MathUtils.damp(c.rz, rig.rz, k, dt)

    const unit = Math.min(viewport.height / 5.0, viewport.width / 2.3)
    const t = clock.elapsedTime
    g.position.set((c.x * viewport.width) / 2, c.y + Math.sin(t * 1.2) * 0.04, 0)
    g.scale.setScalar(c.s * unit * intro.s)
    g.rotation.set(c.rx, c.ry + intro.ry, c.rz + Math.sin(t * 0.9) * 0.015)

    const idx = Math.min(FLAVORS.length - 1, Math.max(0, Math.floor(rig.flavor)))
    if (labels && matRef.current && idx !== shown.current) {
      shown.current = idx
      matRef.current.map = labels[idx]
      matRef.current.needsUpdate = true
    }
  })

  if (!labels) return null

  return (
    <group ref={group}>
      {/* printed body */}
      <mesh>
        <cylinderGeometry args={[R, R, BODY_H, 128, 1, true]} />
        <meshPhysicalMaterial
          ref={matRef}
          map={labels[0]}
          color="#ffffff"
          metalness={0.55}
          roughness={0.3}
          clearcoat={0.8}
          clearcoatRoughness={0.18}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh geometry={topGeo} material={metal} />
      <mesh geometry={botGeo} material={metal} />
      {/* pull tab */}
      <group position={[0.02, HALF + 0.19, 0.0]}>
        <RoundedBox args={[0.34, 0.012, 0.17]} radius={0.006} position={[0.04, 0.01, 0.08]} material={metal} />
        <mesh position={[-0.06, 0.004, -0.09]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#14161a" metalness={0.8} roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function Rig() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return null
}

export default function Scene({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <Environment resolution={512} frames={1}>
            <color attach="background" args={['#15110e']} />
            <Lightformer form="rect" intensity={6} position={[0, 5, 3]} scale={[10, 2.5, 1]} rotation-x={Math.PI / 2.4} />
            <Lightformer form="rect" intensity={3.5} position={[-5, 0.5, 2]} scale={[1.2, 8, 1]} rotation-y={Math.PI / 2.4} />
            <Lightformer form="rect" intensity={3.5} position={[5, 0.5, 2]} scale={[1.2, 8, 1]} rotation-y={-Math.PI / 2.4} />
            <Lightformer form="ring" intensity={2.2} position={[0, 0, -6]} scale={9} color="#ffd9b0" />
            <Lightformer form="rect" intensity={1.5} position={[0, -5, 2]} scale={[8, 1.5, 1]} rotation-x={-Math.PI / 2.4} />
          </Environment>
          <Can onReady={onReady} />
          {!reduced && (
            <Sparkles count={70} scale={[9, 6, 3]} size={4} speed={0.35} opacity={0.55} color="#ffffff" position={[0, 0, -1]} />
          )}
        </Suspense>
        <Rig />
      </Canvas>
    </div>
  )
}
