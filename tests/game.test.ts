import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS, RELICS, SECTIONS, arcadeUnlocked, award, empty, levelFor, parse, progressFor, xpOf, type State } from '../src/scripts/game.ts';

const play = (events: string[]) => events.reduce((s: State, e) => award(s, e).state, empty());

test('levels and progress', () => {
  assert.equal(levelFor(0), 1);
  assert.equal(levelFor(99), 1);
  assert.equal(levelFor(100), 2);
  assert.equal(progressFor(150), 0.5);
});

test('awards are idempotent', () => {
  const once = award(empty(), 'section:quests');
  assert.equal(once.gained, 10);
  const twice = award(once.state, 'section:quests');
  assert.equal(twice.gained, 0);
  assert.equal(twice.state, once.state);
});

test('unlocking an achievement adds its bonus in the same award', () => {
  const r = award(empty(), 'resume');
  assert.deepEqual(r.newly.map((a) => a.id), ['scholar']);
  assert.equal(r.gained, 100);
});

test('lore master needs three distinct quests', () => {
  const s = play(['quest:a', 'quest:b', 'quest:a']);
  assert.ok(!s.unlocked.includes('lore-master'));
  assert.ok(play(['quest:a', 'quest:b', 'quest:c']).unlocked.includes('lore-master'));
});

test('completionist stays last so one pass sees every other unlock', () => {
  assert.equal(ACHIEVEMENTS.at(-1)!.id, 'completionist');
});

test('collector needs every relic', () => {
  const most = play(RELICS.slice(1).map((r) => `relic:${r}`));
  assert.ok(!most.unlocked.includes('collector'));
  const all = play(RELICS.map((r) => `relic:${r}`));
  assert.ok(all.unlocked.includes('collector'));
});

test('arcade unlocks from collector or the secret, and bonus stage needs a finished run', () => {
  assert.equal(arcadeUnlocked(empty()), false);
  assert.equal(arcadeUnlocked(play(RELICS.map((r) => `relic:${r}`))), true);
  assert.equal(arcadeUnlocked(play(['secret'])), true);
  assert.ok(!play(['secret']).unlocked.includes('bonus-stage'));
  assert.ok(play(['arcade']).unlocked.includes('bonus-stage'));
});

test('full run unlocks completionist and ends at level 10', () => {
  const quests = ['a', 'b', 'c', 'd', 'e', 'f'].map((q) => `quest:${q}`);
  const s = play([...SECTIONS.map((x) => `section:${x}`), ...quests, ...RELICS.map((r) => `relic:${r}`), 'resume', 'contact', 'secret', 'arcade']);
  assert.equal(s.unlocked.length, ACHIEVEMENTS.length);
  assert.equal(s.unlocked.at(-1), 'completionist');
  assert.equal(xpOf(s), 970);
  assert.equal(levelFor(xpOf(s)), 10);
});

test('parse rejects malformed storage', () => {
  assert.deepEqual(parse(null), empty());
  assert.deepEqual(parse('{"events":[1],"unlocked":[]}'), empty());
  assert.deepEqual(parse('not json'), empty());
  assert.deepEqual(parse('{"events":["resume"],"unlocked":["scholar"]}'), { events: ['resume'], unlocked: ['scholar'] });
});
