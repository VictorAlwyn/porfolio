import { test } from 'node:test';
import assert from 'node:assert/strict';
import { railT } from '../src/scripts/rail.ts';

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} !== ${b}`);

test('ends of the page land on the ends of the path', () => {
  close(railT(0, 0, 6), 0);
  close(railT(5, 1, 6), 1);
});

test('the camera holds on its stop while a zone is read', () => {
  for (let i = 0; i < 6; i++) for (const p of [0.25, 0.4, 0.75]) close(railT(i, p, 6), i / 5);
  close(railT(2, 0.1, 6, 0.1), 2 / 5);
});

test('a centred zone sits exactly on its stop', () => {
  for (let i = 0; i < 6; i++) close(railT(i, 0.5, 6), i / 5);
});

test('the path is continuous where two zones meet', () => {
  for (let i = 0; i < 5; i++) close(railT(i, 1, 6), railT(i + 1, 0, 6));
});

test('scrolling forward never moves the camera backward', () => {
  let last = -1;
  for (let i = 0; i < 6; i++) {
    for (let p = 0; p <= 1; p += 0.05) {
      const t = railT(i, p, 6);
      assert.ok(t >= last - 1e-12);
      last = t;
    }
  }
});

test('a single-zone page holds the camera still', () => {
  assert.equal(railT(0, 0.7, 1), 0);
});
