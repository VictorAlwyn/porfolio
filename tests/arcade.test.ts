import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATCH_Y, DURATION, create, parseScore, step } from '../src/scripts/arcade.ts';

const play = (seed: number) => {
  const run = create(seed);
  const log: string[] = [];
  for (let i = 0; i < 70 * 60; i++) log.push(...step(run, i % 90 < 45 ? 1 : -1, 1 / 60));
  return { run, log };
};

test('a seed replays the same run', () => {
  const a = play(7);
  const b = play(7);
  assert.equal(a.run.score, b.run.score);
  assert.deepEqual(a.log, b.log);
  assert.notEqual(play(8).log.join(), a.log.join());
});

test('the run ends exactly once at sixty seconds and then stops', () => {
  const { run, log } = play(3);
  assert.equal(log.filter((e) => e === 'end').length, 1);
  assert.equal(run.t, DURATION);
  assert.deepEqual(step(run, 1, 0.016), []);
});

test('catching a sheet scores and builds the combo, a blot resets it', () => {
  const run = create(1);
  run.spawn = 99;
  run.items.push({ x: run.px, y: CATCH_Y - 0.001, bad: false });
  assert.deepEqual(step(run, 0, 0.01), ['catch']);
  assert.equal(run.score, 10);
  assert.equal(run.combo, 2);
  run.items.push({ x: run.px, y: CATCH_Y - 0.001, bad: true });
  assert.deepEqual(step(run, 0, 0.01), ['hit']);
  assert.equal(run.combo, 1);
  assert.equal(run.score, 0);
});

test('a missed sheet breaks the combo', () => {
  const run = create(1);
  run.spawn = 99;
  run.combo = 4;
  run.px = 0.1;
  run.items.push({ x: 0.9, y: 1.04, bad: false });
  assert.deepEqual(step(run, 0, 0.05), ['miss']);
  assert.equal(run.combo, 1);
});

test('the roller stays on the page', () => {
  const run = create(1);
  for (let i = 0; i < 200; i++) step(run, 1, 0.05);
  assert.ok(run.px <= 0.9 + 1e-9);
});

test('parseScore rejects anything that is not a whole sane score', () => {
  for (const bad of [null, 'abc', '-5', '12.5', '1e309', '', '9999999999']) assert.equal(parseScore(bad), 0);
  assert.equal(parseScore('420'), 420);
});
