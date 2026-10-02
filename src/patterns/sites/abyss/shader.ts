/* Full-screen fragment shader: the whole ocean is one draw call.
   Inputs: uP (scroll progress 0..1, drives the colour grade and which layers exist), uScroll (px, parallax),
   uPtr (pointer in 0..1, a lantern that lights marine snow), uTime. */

export const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uP;
uniform float uScroll;
uniform vec2 uPtr;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

// colour grade by zone: sunlit -> twilight -> midnight -> abyss -> hadal
vec3 grade(float p) {
  vec3 c0 = vec3(0.30, 0.86, 0.88);
  vec3 c1 = vec3(0.04, 0.42, 0.66);
  vec3 c2 = vec3(0.02, 0.13, 0.32);
  vec3 c3 = vec3(0.008, 0.045, 0.13);
  vec3 c4 = vec3(0.0, 0.01, 0.035);
  vec3 c = mix(c0, c1, smoothstep(0.0, 0.2, p));
  c = mix(c, c2, smoothstep(0.2, 0.42, p));
  c = mix(c, c3, smoothstep(0.42, 0.66, p));
  c = mix(c, c4, smoothstep(0.66, 0.92, p));
  return c;
}

// marine snow: drifting specks in jittered cells, parallax by layer
float snow(vec2 q, float scale, float rate, float seed) {
  vec2 st = q * scale;
  st.y -= uScroll * 0.0011 * scale * rate;
  st.y += uTime * 0.03 * scale * rate;
  vec2 id = floor(st), f = fract(st) - 0.5;
  float h = hash(id + seed);
  vec2 o = (vec2(hash(id + seed + 1.7), hash(id + seed + 3.1)) - 0.5) * 0.6;
  float d = length(f - o);
  float r = 0.025 + 0.05 * hash(id + seed + 9.0);
  return smoothstep(r, 0.0, d) * step(0.55, h);
}

// bioluminescent orbs: slow pulses, cool colours, only deep
vec3 orbs(vec2 q, float scale, float seed, float rate) {
  vec2 st = q * scale;
  st.y -= uScroll * 0.0008 * scale * rate;
  st.x += sin(uTime * 0.2 + seed) * 0.15;
  vec2 id = floor(st), f = fract(st) - 0.5;
  float h = hash(id + seed);
  vec2 o = (vec2(hash(id + seed + 4.3), hash(id + seed + 7.7)) - 0.5) * 0.5;
  float d = length(f - o);
  float pulse = 0.55 + 0.45 * sin(uTime * (0.8 + h * 1.4) + h * 40.0);
  float glow = exp(-d * (9.0 + h * 8.0)) * step(0.72, h) * pulse;
  vec3 col = mix(vec3(0.15, 0.95, 0.85), vec3(0.55, 0.45, 1.0), hash(id + seed + 2.2));
  return col * glow;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 q = (uv - 0.5) * vec2(aspect, 1.0);

  vec3 col = grade(uP);
  // vertical falloff inside the screen: lighter above, darker below
  col *= 0.78 + 0.34 * uv.y;

  // sunlight shafts, fading with depth
  float lightAmt = 1.0 - smoothstep(0.0, 0.34, uP);
  float a = q.x * 2.4 + fbm(vec2(q.x * 1.6, uTime * 0.08)) * 1.6;
  float shafts = pow(max(0.0, sin(a * 5.0 + uTime * 0.25) * 0.5 + 0.5), 3.0) * smoothstep(-0.2, 0.7, uv.y);
  float cau = fbm(q * 3.0 + vec2(uTime * 0.05, -uTime * 0.04));
  col += vec3(0.55, 0.95, 0.9) * (shafts * 0.28 + cau * 0.10) * lightAmt;

  // lantern: a soft pool of light at the pointer once it gets dark
  vec2 pq = (uPtr - 0.5) * vec2(aspect, 1.0);
  float dl = length(q - pq);
  float dark = smoothstep(0.12, 0.5, uP);
  float lantern = exp(-dl * 4.2) * dark;
  col += vec3(0.30, 0.55, 0.62) * lantern * 0.22;

  // marine snow in three depth layers; the lantern makes them bright
  float s = 0.0;
  s += snow(q, 5.0, 0.55, 1.0) * 0.55;
  s += snow(q, 9.0, 1.0, 5.0) * 0.8;
  s += snow(q, 16.0, 1.7, 9.0) * 1.0;
  float snowAmt = 0.35 + 0.65 * smoothstep(0.08, 0.5, uP);
  col += vec3(0.75, 0.9, 0.95) * s * snowAmt * (0.35 + lantern * 5.5) * (0.5 + 0.5 * lightAmt);

  // living light, from the midnight zone down; it gathers toward the pointer
  float deep = smoothstep(0.38, 0.66, uP);
  vec3 b = orbs(q, 3.2, 11.0, 0.7) + orbs(q, 5.5, 23.0, 1.1) * 0.8 + orbs(q, 8.0, 37.0, 1.6) * 0.6;
  col += b * deep * (0.55 + lantern * 2.2);

  // vignette + faint grain
  float v = smoothstep(1.15, 0.25, length(q * vec2(0.8, 1.0)));
  col *= mix(0.55, 1.0, v);
  col += (hash(uv * uRes + uTime) - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`
