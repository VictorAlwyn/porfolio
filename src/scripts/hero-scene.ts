import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';

// "Neural constellation": nodes in a flattened shell, linked to near neighbours, slowly orbiting.
const PALETTES = {
  normal: ['#5fe1ff', '#f7c64f', '#8f7bff'],
  boss: ['#ff6fb4', '#ff9a4f', '#ff3b5c'],
};

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.85)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

function shell(count: number, rMin: number, rMax: number) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const t = Math.random() * Math.PI * 2;
    const r = rMin + Math.random() * (rMax - rMin);
    const s = Math.sqrt(1 - u * u);
    out.set([r * s * Math.cos(t) * 1.5, r * u * 0.85, r * s * Math.sin(t)], i * 3);
  }
  return out;
}

export function start(canvas: HTMLCanvasElement) {
  const small = innerWidth < 768;
  const count = small ? 70 : 140;
  const linkDist = small ? 2.6 : 2.2;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !small, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 14;
  const group = new Group();
  scene.add(group);
  const sprite = dotTexture();

  const nodes = shell(count, 3.5, 6.5);
  const tint = Array.from({ length: count }, () => Math.floor(Math.random() * 3));
  const nodeColors = new Float32Array(count * 3);
  const nodeGeo = new BufferGeometry();
  nodeGeo.setAttribute('position', new BufferAttribute(nodes, 3));
  nodeGeo.setAttribute('color', new BufferAttribute(nodeColors, 3));
  const nodeMat = new PointsMaterial({
    size: small ? 0.32 : 0.26,
    map: sprite,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(nodeGeo, nodeMat);

  // ponytail: O(n²) neighbour scan, fine for ≤140 nodes built once.
  const pairs: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = nodes[i * 3] - nodes[j * 3];
      const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
      const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < linkDist * linkDist) pairs.push([i, j]);
    }
  }
  const linePos = new Float32Array(pairs.length * 6);
  pairs.forEach(([a, b], k) => {
    linePos.set(nodes.subarray(a * 3, a * 3 + 3), k * 6);
    linePos.set(nodes.subarray(b * 3, b * 3 + 3), k * 6 + 3);
  });
  const lineColors = new Float32Array(pairs.length * 6);
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new BufferAttribute(lineColors, 3));
  const lines = new LineSegments(
    lineGeo,
    new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.3, depthWrite: false, blending: AdditiveBlending }),
  );

  const dustCount = small ? 200 : 500;
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new BufferAttribute(shell(dustCount, 8, 22), 3));
  const dust = new Points(
    dustGeo,
    new PointsMaterial({ size: 0.07, map: sprite, color: '#9aa3d6', transparent: true, opacity: 0.6, depthWrite: false }),
  );

  group.add(lines, points);
  scene.add(dust);

  let boss = document.documentElement.hasAttribute('data-boss');
  function paint() {
    const pal = (boss ? PALETTES.boss : PALETTES.normal).map((c) => new Color(c));
    tint.forEach((t, i) => nodeColors.set([pal[t].r, pal[t].g, pal[t].b], i * 3));
    pairs.forEach(([a, b], k) => {
      lineColors.set(nodeColors.subarray(a * 3, a * 3 + 3), k * 6);
      lineColors.set(nodeColors.subarray(b * 3, b * 3 + 3), k * 6 + 3);
    });
    nodeGeo.attributes.color.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  }
  paint();
  document.addEventListener('rpg:boss', (e) => {
    boss = (e as CustomEvent<boolean>).detail;
    paint();
  });

  let tx = 0;
  let ty = 0;
  addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    },
    { passive: true },
  );

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Sit behind the character card on wide layouts, centred on narrow ones.
    group.position.set(w >= 960 ? 4.5 : 0, w >= 960 ? 0 : -1.5, 0);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  let visible = true;
  let running = false;
  let last = 0;
  function frame(t: number) {
    if (!visible || document.hidden) {
      running = false;
      return;
    }
    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    group.rotation.y += dt * (boss ? 0.35 : 0.07);
    group.rotation.x += (ty * 0.35 - group.rotation.x) * 0.04;
    dust.rotation.y -= dt * 0.01;
    camera.position.x += (tx * 1.6 - camera.position.x) * 0.04;
    camera.lookAt(0, 0, 0);
    nodeMat.size = (small ? 0.32 : 0.26) * (1 + Math.sin(t / 900) * 0.12);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  function play() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    play();
  }).observe(canvas);
  document.addEventListener('visibilitychange', play);

  canvas.classList.add('on');
  play();
}
