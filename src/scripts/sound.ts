// Web Audio only, no audio files. Loaded on demand and silent until the visitor turns it on.
type Note = [freq: number, seconds: number, wave?: OscillatorType];

const NOTES: Record<string, Note[]> = {
  xp: [[660, 0.08]],
  collect: [[880, 0.06], [1320, 0.12]],
  level: [[523, 0.09], [659, 0.09], [784, 0.2]],
  achievement: [[784, 0.09], [988, 0.09], [1319, 0.24]],
  catch: [[740, 0.05]],
  hit: [[150, 0.16, 'sawtooth']],
  end: [[392, 0.1], [523, 0.1], [659, 0.28]],
};

// One root note per spread, in the key of a low hum; boss mode drops everything a fourth.
const ROOT: Record<string, number> = { hero: 110, about: 123.47, quests: 98, skills: 130.81, campaign: 87.31, contact: 82.41 };

const root = document.documentElement;
let ctx: AudioContext | undefined;
let master: GainNode;
let hum: OscillatorNode[] = [];
let filter: BiquadFilterNode;
let on = false;
let boss = root.hasAttribute('data-boss');
let zone = root.dataset.zone ?? 'hero';

const pitch = () => (boss ? 0.75 : 1);

function tune(glide: number) {
  if (!ctx) return;
  const f = (ROOT[zone] ?? 110) * pitch();
  hum.forEach((o, i) => o.frequency.setTargetAtTime(f * (i ? 1.004 : 1), ctx!.currentTime, glide));
  filter.frequency.setTargetAtTime(boss ? 190 : 380, ctx.currentTime, glide);
}

function play(name: string) {
  if (!ctx || !on) return;
  let t = ctx.currentTime;
  for (const [freq, len, wave = 'triangle'] of NOTES[name] ?? []) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = wave;
    o.frequency.value = freq * pitch();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + len + 0.03);
    t += len;
  }
}

function build() {
  const c = new AudioContext();
  master = c.createGain();
  master.gain.value = 0;
  master.connect(c.destination);
  filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  const bed = c.createGain();
  bed.gain.value = 0.045;
  filter.connect(bed).connect(master);
  hum = [0, 1].map(() => {
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.connect(filter);
    o.start();
    return o;
  });
  ctx = c;
  tune(0);

  document.addEventListener('rpg:xp', (e) => {
    const d = (e as CustomEvent<{ event: string; levelUp: boolean; achievements: number }>).detail;
    play(d.achievements ? 'achievement' : d.levelUp ? 'level' : d.event.startsWith('relic:') ? 'collect' : 'xp');
  });
  document.addEventListener('rpg:sfx', (e) => play((e as CustomEvent<string>).detail));
  document.addEventListener('rpg:zone', (e) => {
    zone = (e as CustomEvent<string>).detail;
    tune(0.8);
  });
  document.addEventListener('rpg:boss', (e) => {
    boss = (e as CustomEvent<boolean>).detail;
    tune(0.4);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) void c.suspend();
    else if (on) void c.resume();
  });
  return c;
}

export function set(next: boolean) {
  on = next;
  if (next) {
    ctx ??= build();
    void ctx.resume();
    master.gain.setTargetAtTime(0.6, ctx.currentTime, 0.2);
  } else if (ctx) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    setTimeout(() => {
      if (!on) void ctx?.suspend();
    }, 500);
  }
}
