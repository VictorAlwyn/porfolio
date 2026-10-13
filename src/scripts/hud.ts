import { ACHIEVEMENTS, RELICS, SECTIONS, arcadeUnlocked, award, empty, levelFor, parse, progressFor, xpOf, type State } from './game';

const KEY = 'alwyn-rpg-v1';
const load = (): State => {
  try {
    return parse(localStorage.getItem(KEY));
  } catch {
    return empty();
  }
};
const save = (s: State) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
};

let state = load();
const $ = (id: string) => document.getElementById(id);
const dialog = $('achievements') as HTMLDialogElement | null;
const arcade = $('arcade') as HTMLDialogElement | null;
const emit = (name: string, detail?: unknown) => document.dispatchEvent(new CustomEvent(name, { detail }));

function render() {
  const xp = xpOf(state);
  const level = levelFor(xp);
  const maxed = state.unlocked.length === ACHIEVEMENTS.length;
  for (const id of ['xp-level', 'xp-sr', 'dlg-level']) $(id)!.textContent = String(level);
  $('dlg-xp')!.textContent = String(xp);
  $('xp-fill')!.style.transform = `scaleX(${maxed ? 1 : progressFor(xp)})`;
  document.querySelectorAll<HTMLElement>('[data-ach]').forEach((li) => {
    const on = state.unlocked.includes(li.dataset.ach!);
    li.toggleAttribute('data-unlocked', on);
    li.querySelector('.ach-state')!.textContent = on ? 'Unlocked' : 'Locked';
  });
  document.querySelectorAll<HTMLButtonElement>('.relic').forEach((b) => {
    const got = state.events.includes(b.dataset.xp!);
    b.hidden = false;
    b.toggleAttribute('data-got', got);
    b.setAttribute('aria-disabled', String(got));
    b.setAttribute('aria-label', got ? 'Registration mark collected' : 'Hidden registration mark (optional game): collect');
  });
  const open = arcadeUnlocked(state);
  $('arcade-open')!.hidden = !open;
  $('arcade-hint')!.hidden = open;
}

let toastTimer: ReturnType<typeof setTimeout>;
function toast(msg: string) {
  const el = $('toast')!;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3600);
}

function pop(text: string) {
  const el = $('xp-pop')!;
  el.textContent = text;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

function grant(event: string) {
  const before = levelFor(xpOf(state));
  const hadArcade = arcadeUnlocked(state);
  const r = award(state, event);
  if (!r.gained) return;
  state = r.state;
  save(state);
  render();
  pop(`+${r.gained} XP`);
  const level = levelFor(xpOf(state));
  const parts = r.newly.map((a) => `${a.title} unlocked`);
  if (event.startsWith('relic:')) parts.unshift(`Registration mark ${state.events.filter((e) => e.startsWith('relic:')).length}/${RELICS.length}`);
  if (!hadArcade && arcadeUnlocked(state)) parts.push('Bonus stage unlocked');
  if (level > before) parts.push(`Level up! LV ${level}`);
  if (parts.length) toast(parts.join(' · '));
}

function secret() {
  const on = document.documentElement.toggleAttribute('data-boss');
  emit('rpg:boss', on);
  const had = state.events.includes('secret');
  grant('secret');
  if (had) toast(on ? 'Boss mode on: the black issue' : 'Boss mode off');
}

function modal(d: HTMLDialogElement | null) {
  if (!d) return;
  d.showModal();
  emit('rpg:pause', true);
}
[dialog, arcade].forEach((d) => d?.addEventListener('close', () => emit('rpg:pause', !!document.querySelector('dialog[open]'))));

render();

const quest = document.body.dataset.quest;
if (quest) grant(`quest:${quest}`);

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      grant(`section:${(e.target as HTMLElement).dataset.section}`);
      io.unobserve(e.target);
    }
  },
  { rootMargin: '0px 0px -40% 0px' },
);
document.querySelectorAll('[data-section]').forEach((el) => io.observe(el));

let taps = 0;
let tapTimer: ReturnType<typeof setTimeout>;
document.addEventListener('click', (e) => {
  const target = e.target as Element;
  const xpEl = target.closest<HTMLElement>('[data-xp]');
  if (xpEl) grant(xpEl.dataset.xp!);
  if (target.closest('[data-secret]')) {
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => (taps = 0), 1500);
    if (++taps >= 7) {
      taps = 0;
      secret();
    }
  }
});

const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let pos = 0;
addEventListener('keydown', (e) => {
  if (arcade?.open) return;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  pos = key === konami[pos] ? pos + 1 : key === konami[0] ? 1 : 0;
  if (pos === konami.length) {
    pos = 0;
    secret();
  }
});

addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat || document.querySelector('dialog[open]')) return;
  if ((e.target as Element).closest('input, textarea, select, [contenteditable]')) return;
  const id = SECTIONS[Number(e.key) - 1];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView();
  else location.assign(`/#${id}`);
});

$('xp-open')?.addEventListener('click', () => modal(dialog));
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
$('xp-reset')?.addEventListener('click', () => {
  state = empty();
  save(state);
  render();
  toast('Progress reset. Fresh save file!');
});

$('arcade-open')?.addEventListener('click', async () => {
  dialog?.close();
  modal(arcade);
  const m = await import('./arcade-ui.ts');
  m.init(arcade!, () => grant('arcade'));
  $('arc-start')?.focus();
});
arcade?.addEventListener('close', () => $('xp-open')?.focus());

const nav = $('site-nav');
nav?.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a') && nav.matches(':popover-open')) nav.hidePopover();
});
