import { CATCH_Y, DURATION, PLAYER_W, create, parseScore, step, type Run } from './arcade.ts';

const KEY = 'alwyn-rpg-arcade-best';
const W = 480;
const H = 600;
let bound = false;

const readBest = () => {
  try {
    return parseScore(localStorage.getItem(KEY));
  } catch {
    return 0;
  }
};

export function init(dialog: HTMLDialogElement, onFinish: (score: number) => void) {
  if (bound) return;
  bound = true;

  const $ = <T extends HTMLElement>(id: string) => dialog.querySelector<T>(`#${id}`)!;
  const canvas = $<HTMLCanvasElement>('arc-canvas');
  const g = canvas.getContext('2d')!;
  canvas.width = W * 2;
  canvas.height = H * 2;
  g.scale(2, 2);
  const [start, scoreEl, timeEl, bestEl, result] = ['arc-start', 'arc-score', 'arc-time', 'arc-best', 'arc-result'].map((id) => $(id));

  let best = readBest();
  let run: Run | null = null;
  let raf = 0;
  let last = 0;
  let left = false;
  let right = false;
  let target: number | undefined;

  bestEl.textContent = String(best);

  function draw() {
    const s = getComputedStyle(dialog);
    const fg = s.getPropertyValue('--fg').trim();
    const stock = s.getPropertyValue('--stock').trim();
    const spot = s.getPropertyValue('--spot').trim();
    g.fillStyle = stock;
    g.fillRect(0, 0, W, H);
    g.strokeStyle = fg;
    g.fillStyle = fg;
    g.lineWidth = 1;
    g.strokeRect(0.5, 0.5, W - 1, H - 1);
    g.beginPath();
    g.moveTo(W / 2, 24);
    g.lineTo(W / 2, 56);
    g.moveTo(W / 2 - 16, 40);
    g.lineTo(W / 2 + 16, 40);
    g.stroke();
    if (!run) return;

    for (const it of run.items) {
      const x = it.x * W;
      const y = it.y * H;
      if (it.bad) {
        g.fillStyle = fg;
        g.beginPath();
        g.arc(x, y, 13, 0, Math.PI * 2);
        g.fill();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          g.beginPath();
          g.moveTo(x + Math.cos(a) * 11, y + Math.sin(a) * 11);
          g.lineTo(x + Math.cos(a) * 19, y + Math.sin(a) * 19);
          g.stroke();
        }
      } else {
        g.fillStyle = spot;
        g.fillRect(x - 12, y - 15, 24, 30);
        g.strokeRect(x - 12.5, y - 15.5, 25, 31);
        g.beginPath();
        for (const dy of [-6, 0, 6]) {
          g.moveTo(x - 7, y + dy);
          g.lineTo(x + 7, y + dy);
        }
        g.stroke();
      }
    }
    const bw = PLAYER_W * W;
    const bx = run.px * W - bw / 2;
    const by = CATCH_Y * H;
    g.fillStyle = fg;
    g.fillRect(bx, by, bw, 14);
    g.fillStyle = spot;
    g.fillRect(bx + bw / 2 - 18, by - 5, 36, 5);
  }

  function tick(t: number) {
    if (!run) return;
    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    step(run, dir, (t - last) / 1000, dir === 0 ? target : undefined);
    last = t;
    scoreEl.textContent = String(run.score);
    timeEl.textContent = String(Math.ceil(DURATION - run.t));
    draw();
    if (!run.over) {
      raf = requestAnimationFrame(tick);
      return;
    }
    const final = run.score;
    if (final > best) {
      best = final;
      try {
        localStorage.setItem(KEY, String(best));
      } catch {}
      bestEl.textContent = String(best);
    }
    result.textContent = `Press run complete. Final score ${final}. Best ${best}.`;
    start.textContent = 'Play again';
    onFinish(final);
  }

  function begin() {
    cancelAnimationFrame(raf);
    run = create(Date.now());
    target = undefined;
    result.textContent = '';
    start.textContent = 'Restart';
    last = performance.now();
    raf = requestAnimationFrame(tick);
    canvas.focus();
  }

  function reset() {
    cancelAnimationFrame(raf);
    run = null;
    left = right = false;
    scoreEl.textContent = '0';
    timeEl.textContent = String(DURATION);
    result.textContent = '';
    start.textContent = 'Start';
    draw();
  }

  const key = (down: boolean) => (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') left = down;
    else if (k === 'arrowright' || k === 'd') right = down;
    else return;
    if (run && !run.over) e.preventDefault();
  };
  dialog.addEventListener('keydown', key(true));
  dialog.addEventListener('keyup', key(false));

  const follow = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    target = (e.clientX - r.left) / r.width;
  };
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    follow(e);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (run && !run.over) follow(e);
  });

  start.addEventListener('click', begin);
  dialog.addEventListener('close', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (run && !run.over) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  });
  reset();
}
