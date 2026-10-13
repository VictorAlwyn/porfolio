export const DURATION = 60;
export const PLAYER_W = 0.2;
export const CATCH_Y = 0.9;
const SPEED = 1.1;
const SCORE_KEY_MAX = 1e6;

export type Item = { x: number; y: number; bad: boolean };
export type Run = { t: number; score: number; combo: number; px: number; items: Item[]; spawn: number; rng: number; over: boolean };
export type ArcadeEvent = 'catch' | 'hit' | 'miss' | 'end';

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function create(seed: number): Run {
  return { t: 0, score: 0, combo: 1, px: 0.5, items: [], spawn: 0.5, rng: seed >>> 0, over: false };
}

function next(run: Run) {
  run.rng = (run.rng + 0x6d2b79f5) >>> 0;
  let z = run.rng;
  z = Math.imul(z ^ (z >>> 15), z | 1);
  z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
  return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
}

export function step(run: Run, dir: number, dt: number, targetX?: number): ArcadeEvent[] {
  if (run.over) return [];
  const events: ArcadeEvent[] = [];
  const h = Math.min(dt, 0.05);
  run.t = Math.min(DURATION, run.t + h);
  const p = run.t / DURATION;

  if (targetX === undefined) run.px += dir * SPEED * h;
  else run.px += clamp(targetX - run.px, -SPEED * 2 * h, SPEED * 2 * h);
  run.px = clamp(run.px, PLAYER_W / 2, 1 - PLAYER_W / 2);

  run.spawn -= h;
  while (run.spawn <= 0) {
    run.items.push({ x: 0.05 + next(run) * 0.9, y: -0.05, bad: next(run) < lerp(0.28, 0.4, p) });
    run.spawn += lerp(0.9, 0.35, p);
  }

  const fall = lerp(0.35, 0.75, p) * h;
  run.items = run.items.filter((it) => {
    it.y += fall;
    if (it.y >= CATCH_Y && it.y <= CATCH_Y + 0.06 && Math.abs(it.x - run.px) <= PLAYER_W / 2 + 0.02) {
      if (it.bad) {
        run.combo = 1;
        run.score = Math.max(0, run.score - 20);
        events.push('hit');
      } else {
        run.score += 10 * run.combo;
        run.combo = Math.min(5, run.combo + 1);
        events.push('catch');
      }
      return false;
    }
    if (it.y > 1.05) {
      if (!it.bad) {
        run.combo = 1;
        events.push('miss');
      }
      return false;
    }
    return true;
  });

  if (run.t >= DURATION) {
    run.over = true;
    events.push('end');
  }
  return events;
}

export function parseScore(raw: string | null): number {
  const n = Number(raw);
  return raw !== null && /^\d+$/.test(raw) && Number.isSafeInteger(n) && n < SCORE_KEY_MAX ? n : 0;
}
