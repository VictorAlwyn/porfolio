import { CatmullRomCurve3, Color, LinearSRGBColorSpace, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { gsap } from 'gsap';
import { rail, railT } from './rail.ts';
import { uniforms } from './ink.ts';
import { art } from './world-art.ts';
import type { Palette, Tier } from './world-types.ts';

const nav = navigator as Navigator & { deviceMemory?: number };
const tier: Tier = matchMedia('(pointer: coarse)').matches || innerWidth < 900 || nav.hardwareConcurrency <= 4 || (nav.deviceMemory ?? 8) <= 4 ? 1 : 2;
// Phones render at lower resolution and frame rate, and go to sleep sooner after the last input.
const CFG = tier === 1 ? { dpr: 1.25, frame: 1000 / 30, sleep: 2500, slow: 0.045 } : { dpr: 2, frame: 1000 / 60, sleep: 10000, slow: 0.022 };

export function start(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, antialias: tier === 2, alpha: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  let dpr = Math.min(devicePixelRatio, CFG.dpr);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 300);

  const used = rail.ids.map((id) => art.zones.find((z) => z.id === id) ?? art.zones[0]);
  const built = new Map([...new Set(used)].map((z) => [z, z.build(tier)]));
  built.forEach((b) => scene.add(b.object));
  const n = used.length;
  const camCurve = n > 1 ? new CatmullRomCurve3(used.map((z) => new Vector3(...z.cam))) : null;
  const lookCurve = n > 1 ? new CatmullRomCurve3(used.map((z) => new Vector3(...z.look))) : null;
  const here = new Vector3();
  const gaze = new Vector3();

  const root = document.documentElement;
  let boss = root.hasAttribute('data-boss');
  const paletteFor = (i: number): Palette => (boss ? art.boss : (used[i] ?? used[0]).palette);
  function ink(p: Palette, instant = false) {
    const to = { duration: instant ? 0 : 0.7, ease: 'power2.out', overwrite: true };
    for (const [target, hex] of [
      [uniforms.uPaper.value, p.paper],
      [uniforms.uInk.value, p.ink],
      [uniforms.uSpot.value, p.spot],
    ] as const) {
      const c = new Color(hex);
      gsap.to(target, { r: c.r, g: c.g, b: c.b, ...to });
    }
    gsap.to(uniforms.uMul, { value: p.dark ? 0 : 1, ...to });
  }
  ink(paletteFor(rail.index), true);

  let px = 0;
  let py = 0;
  const fine = matchMedia('(pointer: fine)').matches;
  const calmQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let calm = calmQuery.matches;
  let hidden = document.hidden;
  let paused = false;
  let running = false;
  let cur = 0;
  let last = 0;
  let lastInput = performance.now();
  let slow = 0;
  let tx = 0;
  let ty = 0;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // On wide screens the sculpture sits in the open right-hand window beside the content column.
    if (w / h > 1.25) camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    uniforms.uCell.value = 8 * dpr;
    kick();
  }

  function frame(t: number) {
    if (hidden || paused || calm) {
      running = false;
      return;
    }
    if (t - last < CFG.frame - 2) {
      requestAnimationFrame(frame);
      return;
    }
    const dt = Math.min((t - (last || t)) / 1000, 0.05);
    last = t;

    const target = railT(rail.index, rail.local, n);
    cur += (target - cur) * (1 - Math.exp(-dt * 5));
    const moving = Math.abs(target - cur) > 0.0003 || rail.slip !== 0;

    if (camCurve && lookCurve) {
      camCurve.getPoint(cur, here);
      lookCurve.getPoint(cur, gaze);
    } else {
      here.set(...used[0].cam);
      gaze.set(...used[0].look);
    }
    if (fine) {
      px += (tx * 1.4 - px) * 0.05;
      py += (ty * 0.8 - py) * 0.05;
      here.x += px;
      here.y -= py;
    }
    camera.position.copy(here);
    camera.lookAt(gaze);

    uniforms.uTime.value += dt;
    uniforms.uSlip.value = rail.slip;
    used.forEach((z, i) => {
      const b = built.get(z)!;
      const near = Math.abs(i - rail.index) <= 1;
      b.object.visible = near;
      if (near) b.update?.(i < rail.index ? 1 : i > rail.index ? 0 : rail.local, uniforms.uTime.value);
    });
    renderer.setClearColor(uniforms.uPaper.value);
    renderer.render(scene, camera);

    // Frames that keep missing budget while the camera moves cost resolution once, never quality twice.
    if (moving && dt > CFG.slow && ++slow > 30 && dpr > 1) {
      dpr = 1;
      renderer.setPixelRatio(1);
      resize();
    }
    if (!moving && performance.now() - lastInput > CFG.sleep) {
      running = false;
      return;
    }
    requestAnimationFrame(frame);
  }

  function kick() {
    lastInput = performance.now();
    if (running || hidden || paused || calm) return;
    running = true;
    last = 0;
    requestAnimationFrame(frame);
  }

  new ResizeObserver(resize).observe(canvas);
  addEventListener('scroll', kick, { passive: true });
  addEventListener('keydown', kick);
  addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
      kick();
    },
    { passive: true },
  );
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    kick();
  });
  document.addEventListener('rpg:pause', (e) => {
    paused = (e as CustomEvent<boolean>).detail;
    kick();
  });
  document.addEventListener('rpg:zone', (e) => {
    ink(paletteFor(rail.ids.indexOf((e as CustomEvent<string>).detail)));
    kick();
  });
  document.addEventListener('rpg:boss', (e) => {
    boss = (e as CustomEvent<boolean>).detail;
    ink(paletteFor(rail.index));
    kick();
  });
  calmQuery.addEventListener('change', () => {
    calm = calmQuery.matches;
    canvas.classList.toggle('on', !calm);
    kick();
  });
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    canvas.classList.remove('on');
    hidden = true;
  });

  resize();
  // Compile every sculpture's shaders while all of them are visible, so scrolling never stalls on a first draw.
  renderer.compileAsync(scene, camera).then(() => {
    canvas.dataset.tier = String(tier);
    canvas.classList.add('on');
    root.dataset.world = 'on';
    kick();
  });
}
