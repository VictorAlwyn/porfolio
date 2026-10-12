import { Color, ColorManagement, ShaderMaterial, Vector2, Vector3 } from 'three';

// Hex colours are written straight to the framebuffer so the 3D inks match the CSS tokens exactly.
ColorManagement.enabled = false;

// Shared by every ink material: the engine mutates these once and all sculptures follow.
export const uniforms = {
  uPaper: { value: new Color('#f3efe6') },
  uInk: { value: new Color('#111111') },
  uSpot: { value: new Color('#ff4a1f') },
  uMul: { value: 1 },
  uSlip: { value: 0 },
  uTime: { value: 0 },
  uCell: { value: 8 },
  uLight: { value: new Vector3(-0.55, 0.75, 0.6).normalize() },
  // Screens lighten with distance, like atmosphere in a print, so only the sculpture you are at is drawn.
  uFog: { value: new Vector2(46, 92) },
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vN;
  varying float vDist;
  void main() {
    vec3 pos = position;
    vec3 nrm = normal;
    mat4 m = modelMatrix;
    #ifdef USE_INSTANCING
      m = m * instanceMatrix;
    #endif
    #ifdef SWELL
      float t = uTime * 0.55;
      float a = pos.x * 0.18 + t;
      float b = pos.x * 0.07 - pos.z * 0.11 + t * 0.7;
      float c = pos.z * 0.23 + t * 1.3;
      pos.y += sin(a) * 1.6 + sin(b) * 2.4 + sin(c) * 0.7;
      float dx = cos(a) * 0.18 * 1.6 + cos(b) * 0.07 * 2.4;
      float dz = -cos(b) * 0.11 * 2.4 + cos(c) * 0.23 * 0.7;
      nrm = normalize(vec3(-dx, 1.0, -dz));
    #endif
    vN = normalize(mat3(m) * nrm);
    vec4 mv = viewMatrix * m * vec4(pos, 1.0);
    vDist = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// One screen per ink: black key at 45 degrees, spot at 15 degrees and nudged by the scroll slip, like a two-colour press.
const fragmentShader = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uInk;
  uniform vec3 uSpot;
  uniform vec3 uLight;
  uniform float uMul;
  uniform float uSlip;
  uniform float uCell;
  uniform float uSpotAmt;
  uniform vec2 uFog;
  varying vec3 vN;
  varying float vDist;

  float screenDist(vec2 fc, float ang) {
    float s = sin(ang);
    float c = cos(ang);
    vec2 p = mat2(c, -s, s, c) * fc / uCell;
    return length(fract(p) - 0.5) * 2.0;
  }
  float dots(float cov, float d) {
    if (cov < 0.02) return 0.0;
    if (cov > 0.97) return 1.0;
    float r = 1.3 * sqrt(max(cov, 0.0));
    float w = 2.0 / uCell;
    return 1.0 - smoothstep(r - w, r + w, d);
  }
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    float lam = max(dot(normalize(vN), uLight), 0.0);
    float shade = pow(1.0 - lam, 1.35);
    // On dark paper the ink is the light, so the lit side carries the dots, like a negative print.
    float tone = mix(1.0 - shade, shade, uMul);
    vec2 fc = gl_FragCoord.xy;
    // Dots never merge into solid: headlines are printed through these sculptures and must stay readable.
    float fade = (1.0 - smoothstep(uFog.x, uFog.y, vDist)) * 0.58;
    float ink = dots(tone * fade, screenDist(fc, 0.785398));
    vec2 off = vec2(3.0 + uSlip * 14.0, -2.0 - uSlip * 7.0);
    float spot = dots(clamp(lam * 0.95, 0.0, 1.0) * uSpotAmt * fade, screenDist(fc - off, 0.261799));

    vec3 col = uPaper;
    col = mix(col, mix(uSpot, col * uSpot, uMul), spot);
    col = mix(col, uInk, ink);
    col -= (hash(fc * 0.5) - 0.5) * 0.04;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function inkMaterial(opts: { swell?: boolean; spot?: number } = {}) {
  return new ShaderMaterial({
    uniforms: { ...uniforms, uSpotAmt: { value: opts.spot ?? 0 } },
    defines: opts.swell ? { SWELL: '' } : {},
    vertexShader,
    fragmentShader,
  });
}
