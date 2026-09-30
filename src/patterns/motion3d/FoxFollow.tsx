import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * A fox that chases the cursor around a floor. Each frame the pointer is
 * raycast onto the ground plane (y = 0) to get a world-space target; the fox
 * turns toward it along the shortest angle, moves at walk or run speed
 * depending on distance, and crossfades between its baked Survey / Walk /
 * Run clips. Its head bone also glances at the target.
 *
 * Model: Fox.glb from Khronos glTF-Sample-Assets. Model CC0 (PixelMannen),
 * rigging & animation CC-BY 4.0 (tomkranis, @AsoboStudio, @scurest).
 */

const URL = '/models/fox.glb'
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

function Fox() {
  const root = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF(URL)
  const { actions } = useAnimations(animations, root)
  const { camera, pointer, raycaster } = useThree()
  const target = useRef(new THREE.Vector3())
  const current = useRef<'Survey' | 'Walk' | 'Run'>('Survey')
  const head = useMemo(() => scene.getObjectByName('b_Head_05'), [scene])
  const still = reducedMotion()

  useEffect(() => {
    actions.Survey?.play()
  }, [actions])

  const swap = (next: 'Survey' | 'Walk' | 'Run') => {
    if (current.current === next) return
    actions[current.current]?.fadeOut(0.25)
    actions[next]?.reset().fadeIn(0.25).play()
    current.current = next
  }

  useFrame((_, dt) => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, target.current)
    target.current.clamp(new THREE.Vector3(-4, 0, -2.5), new THREE.Vector3(4, 0, 2.5))
    const pos = root.current.position
    const to = target.current.clone().sub(pos)
    const dist = to.length()
    if (dist > 0.3) {
      const want = Math.atan2(to.x, to.z)
      let diff = want - root.current.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      root.current.rotation.y += diff * Math.min(1, dt * 6)
      const running = dist > 2.2 && !still
      const speed = still ? 0 : running ? 3.2 : 1.2
      pos.addScaledVector(to.normalize(), Math.min(dist, speed * dt))
      swap(still ? 'Survey' : running ? 'Run' : 'Walk')
    } else swap('Survey')
    if (head) head.rotation.y += THREE.MathUtils.clamp(Math.atan2(to.x, to.z) - root.current.rotation.y, -0.6, 0.6) * 0.5
  })

  return (
    <group ref={root}>
      <primitive object={scene} scale={0.026} />
    </group>
  )
}

export function FoxFollow({ className = 'h-96' }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="3D fox that walks and runs toward the cursor on a floor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 4.2, 6], fov: 40 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <color attach="background" args={['#0f1a14']} />
        <fog attach="fog" args={['#0f1a14', 8, 16]} />
        <hemisphereLight args={['#fef3c7', '#14532d', 1.4]} />
        <directionalLight position={[4, 8, 3]} intensity={1.6} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1f3d2b" roughness={1} />
        </mesh>
        <gridHelper args={[30, 30, '#2f5a40', '#24452f']} position={[0, 0.01, 0]} />
        <Suspense fallback={null}>
          <Fox />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(URL)

export default function FoxFollowDemo() {
  return (
    <div>
      <FoxFollow />
      <p className="mt-2 text-center font-mono text-xs text-fg-muted">move the cursor over the field · far = run, near = walk</p>
    </div>
  )
}
