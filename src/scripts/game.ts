// Pure game rules, no DOM. Events are strings like "section:quests", "quest:olivia-ai", "resume", "contact", "secret".
// Each event awards XP once; achievements are derived from the events seen so far.

export type State = { events: string[]; unlocked: string[] };

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  test: (events: string[], unlocked: string[]) => boolean;
};

export const SECTIONS = ['about', 'quests', 'skills', 'campaign', 'contact'];
export const XP_PER_LEVEL = 100;
export const ACHIEVEMENT_XP = 50;
const EVENT_XP: Record<string, number> = { section: 10, quest: 25, resume: 50, contact: 50, secret: 50 };

const kind = (event: string) => event.split(':')[0];
const questCount = (events: string[]) => events.filter((e) => kind(e) === 'quest').length;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Discover every area of the map.',
    icon: '🧭',
    test: (ev) => SECTIONS.every((s) => ev.includes(`section:${s}`)),
  },
  { id: 'quest-reader', title: 'Quest Reader', description: 'Open your first quest.', icon: '📜', test: (ev) => questCount(ev) >= 1 },
  { id: 'lore-master', title: 'Lore Master', description: 'Read three quests.', icon: '📚', test: (ev) => questCount(ev) >= 3 },
  { id: 'scholar', title: 'Scholar', description: 'Grab the resume scroll.', icon: '🎓', test: (ev) => ev.includes('resume') },
  { id: 'recruiter', title: 'Party Recruiter', description: 'Reach out by email or GitHub.', icon: '🤝', test: (ev) => ev.includes('contact') },
  {
    id: 'secret-finder',
    title: 'Secret Finder',
    description: 'An old-school cheat code… or a lot of taps on the crest.',
    icon: '🕹️',
    test: (ev) => ev.includes('secret'),
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Unlock every other achievement.',
    icon: '🏆',
    // ponytail: relies on being last in this list so one pass sees every other unlock.
    test: (_ev, un) => ACHIEVEMENTS.every((a) => a.id === 'completionist' || un.includes(a.id)),
  },
];

export const empty = (): State => ({ events: [], unlocked: [] });

export const xpOf = (s: State) =>
  s.events.reduce((sum, e) => sum + (EVENT_XP[kind(e)] ?? 0), 0) + s.unlocked.length * ACHIEVEMENT_XP;

export const levelFor = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

export const progressFor = (xp: number) => (xp % XP_PER_LEVEL) / XP_PER_LEVEL;

export function award(s: State, event: string): { state: State; gained: number; newly: Achievement[] } {
  if (s.events.includes(event)) return { state: s, gained: 0, newly: [] };
  const events = [...s.events, event];
  const unlocked = [...s.unlocked];
  const newly: Achievement[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!unlocked.includes(a.id) && a.test(events, unlocked)) {
      unlocked.push(a.id);
      newly.push(a);
    }
  }
  const state = { events, unlocked };
  return { state, gained: xpOf(state) - xpOf(s), newly };
}

// Storage is user-controlled, so only accept the exact shape we write.
export function parse(raw: string | null): State {
  try {
    const v = JSON.parse(raw ?? '');
    const strings = (x: unknown): x is string[] => Array.isArray(x) && x.every((i) => typeof i === 'string');
    if (strings(v?.events) && strings(v?.unlocked)) return { events: v.events, unlocked: v.unlocked };
  } catch {}
  return empty();
}
