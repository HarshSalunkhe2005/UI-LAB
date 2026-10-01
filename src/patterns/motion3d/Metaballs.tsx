import { useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * Raymarched metaballs: six blobs orbit lazily and one follows the cursor;
 * where they meet they melt together (smooth-min of sphere SDFs). Lit with a
 * fresnel rim and an iridescent palette. Everything happens in one fragment
 * shader on a full-screen quad, so it scales to any size at constant cost.
 */

const frag = /* glsl */ `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse;
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5*(b-a)/k, 0., 1.); return mix(b, a, h) - k*h*(1.-h); }
float map(vec3 p){
  float d = length(p - vec3(uMouse * vec2(2.2, 1.3), 0.)) - 0.55;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec3 c = vec3(sin(uTime*0.5 + fi*1.7)*1.6, cos(uTime*0.4 + fi*2.3)*0.9, sin(uTime*0.3 + fi)*0.6);
    d = smin(d, length(p - c) - (0.35 + 0.08*sin(fi*3.)), 0.55);
  }
  return d;
}
vec3 normal(vec3 p){ vec2 e = vec2(0.002, 0.); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx))); }
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;
  vec3 ro = vec3(0., 0., 4.), rd = normalize(vec3(uv, -1.6));
  float t = 0.; float hit = 0.;
  for (int i = 0; i < 80; i++) { float d = map(ro + rd*t); if (d < 0.001) { hit = 1.; break; } t += d; if (t > 10.) break; }
  vec3 col = vec3(0.03, 0.03, 0.06);
  if (hit > 0.) {
    vec3 p = ro + rd*t; vec3 n = normal(p);
    float fres = pow(1. - max(dot(n, -rd), 0.), 3.);
    vec3 irid = 0.5 + 0.5*cos(6.2831*(vec3(0.0, 0.33, 0.67) + n.y*0.5 + fres + uTime*0.05));
    float diff = max(dot(n, normalize(vec3(0.5, 0.8, 0.6))), 0.);
    col = irid * (0.25 + diff*0.6) + fres*0.8;
  }
  gl_FragColor = vec4(col, 1.);
}`
const vert = /* glsl */ `void main(){ gl_Position = vec4(position.xy, 0., 1.); }`

function Balls() {
  const { pointer, size, gl } = useThree()
  const still = reducedMotion()
  const uniforms = useMemo(() => ({ uRes: { value: new THREE.Vector2() }, uTime: { value: 3 }, uMouse: { value: new THREE.Vector2() } }), [])
  useFrame((_, dt) => {
    uniforms.uRes.value.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio())
    if (!still) uniforms.uTime.value += dt
    uniforms.uMouse.value.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.12)
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  )
}

export default function Metaballs() {
  return (
    <div className="h-96 overflow-hidden rounded-xl" role="img" aria-label="Iridescent liquid metaballs merging, one follows the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.25]}>
        <Balls />
      </Canvas>
    </div>
  )
}
