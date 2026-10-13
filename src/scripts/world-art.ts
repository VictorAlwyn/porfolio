import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  Object3D,
  PlaneGeometry,
  TorusGeometry,
} from 'three';
import { inkMaterial, uniforms } from './ink.ts';
import type { Built, Tier, WorldArt, ZoneArt } from './world-types.ts';

const GAP = 70;
const z = (i: number) => -GAP * i;

const beside = (cx: number, y: number, i: number, lookY = y): Pick<ZoneArt, 'cam' | 'look'> => ({
  cam: [cx - 8, y, z(i) + 34],
  look: [cx - 4.7, lookY, z(i)],
});

const hairlines = (geo: BoxGeometry) => {
  const lines = new LineBasicMaterial();
  lines.color = uniforms.uInk.value;
  return new LineSegments(new EdgesGeometry(geo), lines);
};

const dom = (selector: string, pick: (el: Element) => number, fallback: number[]) => {
  const found = [...document.querySelectorAll(selector)].map(pick);
  return found.length ? found : fallback;
};

function swell(tier: Tier): Built {
  const geo = new PlaneGeometry(150, 90, tier === 2 ? 170 : 90, tier === 2 ? 64 : 36);
  geo.rotateX(-Math.PI / 2);
  const mesh = new Mesh(geo, inkMaterial({ swell: true, spot: 0.85 }));
  mesh.position.set(0, -2, z(0) - 12);
  mesh.frustumCulled = false;
  return { object: mesh };
}

function aperture(tier: Tier): Built {
  const group = new Group();
  group.position.set(7, 4.2, z(1));
  [1, 1.8, 2.6, 3.4, 4.2, 5].forEach((r, i) => {
    const ring = new Mesh(new TorusGeometry(r, 0.32, tier === 2 ? 14 : 8, tier === 2 ? 72 : 40), inkMaterial({ spot: i === 0 ? 1 : 0 }));
    ring.position.z = -i * 0.5;
    group.add(ring);
  });
  return {
    object: group,
    update: (local, time) => {
      group.rotation.y = -0.4 + local * 0.9;
      group.rotation.x = 0.12 + Math.sin(time * 0.4) * 0.03;
    },
  };
}

function slabs(): Built {
  const n = dom('#quests .cell', () => 1, [1, 1, 1, 1, 1, 1]).length;
  const span = 10.25 / (n - 1);
  const mid = (n - 1) / 2;
  const group = new Group();
  group.position.set(-4, 0, z(2));
  const boards = Array.from({ length: n }, (_, i) => 8.5 - (4 * i) / (n - 1)).map((h, i) => {
    const geo = new BoxGeometry(Math.min(2, span * 0.97), h, 0.4);
    geo.translate(0, h / 2, 0);
    const board = new Group();
    board.add(new Mesh(geo, inkMaterial({ spot: i % 2 === 0 ? 0.9 : 0 })), hairlines(geo));
    group.add(board);
    return board;
  });
  return {
    object: group,
    update: (local) => {
      boards.forEach((b, i) => {
        const k = i - mid;
        b.position.set(k * span + (local - 0.5) * k * 1.2, 0, -Math.abs(k));
        b.rotation.y = k * 0.12 + (local - 0.5) * 0.25;
      });
    },
  };
}

function meters(): Built {
  const counts = dom('#skills .row', (el) => el.querySelectorAll('.chip').length, [11, 7, 8, 10, 6, 3, 6, 5, 6]);
  const peak = Math.max(...counts);
  const step = 0.85;
  const group = new Group();
  group.position.set(5, 0, z(3));
  const unit = new BoxGeometry(1, 1, 1);
  unit.translate(0, 0.5, 0);
  const bars = new InstancedMesh(unit, inkMaterial(), counts.length);
  const caps = new InstancedMesh(unit, inkMaterial({ spot: 1 }), counts.length);
  const o = new Object3D();
  const edge = new EdgesGeometry(new BoxGeometry(0.9, peak * step, 0.9));
  const source = edge.attributes.position.array;
  const ghost = new Float32Array(source.length * counts.length);
  counts.forEach((count, k) => {
    const x = (k - (counts.length - 1) / 2) * 1.2;
    o.position.set(x, 0, 0);
    o.scale.set(0.9, count * step, 0.9);
    o.updateMatrix();
    bars.setMatrixAt(k, o.matrix);
    o.position.y = count * step;
    o.scale.set(1.12, 0.38, 1.12);
    o.updateMatrix();
    caps.setMatrixAt(k, o.matrix);
    for (let i = 0; i < source.length; i += 3) {
      ghost[k * source.length + i] = source[i] + x;
      ghost[k * source.length + i + 1] = source[i + 1] + (peak * step) / 2;
      ghost[k * source.length + i + 2] = source[i + 2];
    }
  });
  const lines = new LineSegments(new BufferGeometry().setAttribute('position', new BufferAttribute(ghost, 3)), new LineBasicMaterial());
  (lines.material as LineBasicMaterial).color = uniforms.uInk.value;
  bars.frustumCulled = caps.frustumCulled = lines.frustumCulled = false;
  group.add(lines, bars, caps);
  return {
    object: group,
    update: (local) => {
      group.rotation.y = (local - 0.5) * 0.5;
    },
  };
}

function records(tier: Tier): Built {
  const months = dom('[data-months]', (el) => Number((el as HTMLElement).dataset.months), [18, 14, 8, 13, 15, 25, 23, 4, 18, 7, 11]);
  const longest = Math.max(...months);
  const group = new Group();
  group.position.set(-3, 0, z(4));
  const disc = new CylinderGeometry(2.6, 2.6, 1, tier === 2 ? 72 : 40);
  const label = new CylinderGeometry(0.9, 0.9, 1, tier === 2 ? 40 : 24);
  const stack = new InstancedMesh(disc, inkMaterial(), months.length);
  const labels = new InstancedMesh(label, inkMaterial({ spot: 1 }), months.length);
  const o = new Object3D();
  let y = 0;
  [...months].reverse().forEach((m, i) => {
    const h = 0.25 + 1.35 * (m / longest);
    o.position.set(i % 2 ? 0.15 : -0.15, y + h / 2, i % 2 ? -0.1 : 0.1);
    o.rotation.set(0, i * 0.35, 0);
    o.scale.set(1, h, 1);
    o.updateMatrix();
    stack.setMatrixAt(i, o.matrix);
    o.position.y = y + h + 0.03;
    o.scale.set(1, 0.06, 1);
    o.updateMatrix();
    labels.setMatrixAt(i, o.matrix);
    y += h + 0.35;
  });
  stack.frustumCulled = labels.frustumCulled = false;
  group.add(stack, labels);
  return {
    object: group,
    update: (local) => {
      group.rotation.y = local * 2.2;
    },
  };
}

function sun(tier: Tier): Built {
  const group = new Group();
  group.position.set(5.2, 2.2, z(5));
  group.add(new Mesh(new IcosahedronGeometry(3.4, tier === 2 ? 5 : 3), inkMaterial({ spot: 1 })));
  [5, 6.4].forEach((r, i) => {
    const ring = new Mesh(new TorusGeometry(r, 0.07, 6, 90), inkMaterial());
    ring.rotation.set(1.2 + i * 0.5, 0.3, i * 0.8);
    group.add(ring);
  });
  return {
    object: group,
    update: (local, time) => {
      group.rotation.y = time * 0.08 + local * 0.8;
    },
  };
}

const ink = '#111111';
const foam = '#f3efe6';

export const art: WorldArt = {
  boss: { paper: ink, ink: foam, spot: '#c9f23c', dark: true },
  zones: [
    { id: 'hero', cam: [-2, 5.5, z(0) + 34], look: [-2, 5, z(0)], palette: { paper: foam, ink, spot: '#ff4a1f' }, build: swell },
    { id: 'about', ...beside(7, 4.2, 1), palette: { paper: '#d6d2c9', ink, spot: '#1f3bff' }, build: aperture },
    { id: 'quests', ...beside(-4, 4.5, 2, 4.2), palette: { paper: '#a7b4bb', ink, spot: '#c9f23c' }, build: slabs },
    { id: 'skills', ...beside(5, 5, 3, 7.2), palette: { paper: foam, ink, spot: '#1f3bff' }, build: meters },
    { id: 'campaign', ...beside(-3, 6.5, 4, 6), palette: { paper: '#7fa29a', ink, spot: '#ff4a1f' }, build: records },
    { id: 'contact', ...beside(4, 4.5, 5), palette: { paper: ink, ink: foam, spot: '#ff4a1f', dark: true }, build: sun },
  ],
};
