import {
  BoxGeometry,
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
import type { Built, Tier, WorldArt } from './world-types.ts';

// The magazine's "photographs": six sculptures flown past in order, one per spread, all drawn as ink-dot halftone.
// Palettes mirror the CSS zone tokens in global.css; the camera stops sit on a line running down -z.
const GAP = 70;
const z = (i: number) => -GAP * i;

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
  group.position.set(0, 3, z(1));
  const radii = [3, 4.6, 6.2, 7.8, 9.4, 11, 12.6];
  radii.forEach((r, i) => {
    const ring = new Mesh(new TorusGeometry(r, 0.55, tier === 2 ? 14 : 8, tier === 2 ? 72 : 40), inkMaterial({ spot: i === 0 ? 1 : 0 }));
    ring.position.z = -i * 0.6;
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
  const group = new Group();
  group.position.set(2, 0, z(2));
  const heights = [11, 9.5, 8.5, 7.5, 6.5, 6];
  const boards = heights.map((h, i) => {
    const geo = new BoxGeometry(3.4, h, 0.6);
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
        const k = i - 2.5;
        b.position.set(k * 4.2 + (local - 0.5) * k * 2.4, 0, -Math.abs(k) * 1.5);
        b.rotation.y = k * 0.12 + (local - 0.5) * 0.25;
      });
    },
  };
}

// A mixing desk: one meter per skill branch, lit segments for skills in it and a small tick where a segment is not lit.
function meters(): Built {
  const counts = dom('#skills .row', (el) => el.querySelectorAll('.chip').length, [11, 7, 8, 10, 6, 3, 6, 5, 6]);
  const peak = Math.max(...counts);
  const group = new Group();
  group.position.set(2, 0, z(3));
  const seg = new BoxGeometry(1.7, 0.5, 1.7);
  const body = new InstancedMesh(seg, inkMaterial(), counts.length * peak);
  const caps = new InstancedMesh(seg, inkMaterial({ spot: 1 }), counts.length);
  const o = new Object3D();
  let n = 0;
  counts.forEach((count, k) => {
    for (let j = 0; j < peak; j++) {
      const lit = j < count;
      o.position.set((k - (counts.length - 1) / 2) * 2.6, j * 0.75, 0);
      o.scale.set(lit ? 1 : 0.3, lit ? 1 : 0.4, lit ? 1 : 0.3);
      o.updateMatrix();
      if (lit && j === count - 1) caps.setMatrixAt(k, o.matrix);
      else body.setMatrixAt(n++, o.matrix);
    }
  });
  body.count = n;
  body.frustumCulled = false;
  caps.frustumCulled = false;
  group.add(body, caps);
  return {
    object: group,
    update: (local) => {
      group.rotation.y = (local - 0.5) * 0.5;
    },
  };
}

// Back issues: one record per role, as thick as the time spent there, newest on top.
function records(tier: Tier): Built {
  const months = dom('[data-months]', (el) => Number((el as HTMLElement).dataset.months), [18, 14, 8, 13, 15, 25, 23, 4, 18, 7, 11]);
  const longest = Math.max(...months);
  const group = new Group();
  group.position.set(0, 0, z(4));
  const disc = new CylinderGeometry(6, 6, 1, tier === 2 ? 72 : 40);
  const label = new CylinderGeometry(2, 2, 1, tier === 2 ? 40 : 24);
  const stack = new InstancedMesh(disc, inkMaterial(), months.length);
  const labels = new InstancedMesh(label, inkMaterial({ spot: 1 }), months.length);
  const o = new Object3D();
  let y = 0;
  [...months].reverse().forEach((m, i) => {
    const h = 0.25 + 1.35 * (m / longest);
    o.position.set(i % 2 ? 0.3 : -0.3, y + h / 2, i % 2 ? -0.2 : 0.2);
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
  group.position.set(2, 4, z(5) - 6);
  group.add(new Mesh(new IcosahedronGeometry(7, tier === 2 ? 5 : 3), inkMaterial({ spot: 1 })));
  [11, 14].forEach((r, i) => {
    const ring = new Mesh(new TorusGeometry(r, 0.12, 6, 90), inkMaterial());
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
    { id: 'hero', cam: [-6, 5.5, z(0) + 34], look: [6, 1, z(0) - 6], palette: { paper: foam, ink, spot: '#ff4a1f' }, build: swell },
    { id: 'about', cam: [4, 4, z(1) + 34], look: [3, 3, z(1)], palette: { paper: '#d6d2c9', ink, spot: '#1f3bff' }, build: aperture },
    { id: 'quests', cam: [-2, 5, z(2) + 32], look: [4, 4, z(2)], palette: { paper: '#a7b4bb', ink, spot: '#c9f23c' }, build: slabs },
    { id: 'skills', cam: [-8, 9, z(3) + 30], look: [3, 3.5, z(3)], palette: { paper: foam, ink, spot: '#1f3bff' }, build: meters },
    { id: 'campaign', cam: [8, 8, z(4) + 30], look: [0, 6, z(4)], palette: { paper: '#7fa29a', ink, spot: '#ff4a1f' }, build: records },
    { id: 'contact', cam: [3, 6, z(5) + 34], look: [2, 4, z(5)], palette: { paper: ink, ink: foam, spot: '#ff4a1f', dark: true }, build: sun },
  ],
};
