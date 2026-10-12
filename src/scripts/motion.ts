import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { rail } from './rail.ts';

gsap.registerPlugin(ScrollTrigger);

// Zone tracking runs for everyone: it drives the page colour, the camera and sound, not only animation.
const root = document.documentElement;
const zones = gsap.utils.toArray<HTMLElement>('[data-zone]');
rail.ids = zones.map((z) => z.dataset.zone!);
// The active zone is the last one whose top has passed the viewport centre. Reading positions directly, rather than trigger
// edges, stays correct at exactly the top and bottom of the page and after a jump straight to either.
const clamp01 = gsap.utils.clamp(0, 1);
let shown = '';
function locate() {
  const mid = innerHeight / 2;
  let i = 0;
  zones.forEach((el, k) => {
    if (el.getBoundingClientRect().top <= mid) i = k;
  });
  const r = zones[i].getBoundingClientRect();
  rail.index = i;
  rail.local = clamp01((mid - r.top) / r.height);
  if (rail.ids[i] === shown) return;
  shown = rail.ids[i];
  root.dataset.zone = shown;
  document.dispatchEvent(new CustomEvent('rpg:zone', { detail: shown }));
}
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: locate, onRefresh: locate });
locate();

// The camera reaches a stop by the time its heading has scrolled into view: about 440px of flight, whatever the zone's height.
const measure = () => (rail.dwell = zones.map((el) => gsap.utils.clamp(0.1, 0.4, 440 / el.offsetHeight)));
measure();
ScrollTrigger.addEventListener('refresh', measure);

// Opening a <details> changes section heights, which moves every zone boundary below it.
addEventListener('toggle', (e) => e.target instanceof HTMLDetailsElement && ScrollTrigger.refresh(), true);

// Reduced-motion users get the static, fully visible page: nothing below runs for them.
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const below = (el: Element) => el.getBoundingClientRect().top > innerHeight * 0.92;
  const wipe = { from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'expo.out', clearProps: 'clipPath' } };

  // The press run: the black plate lays down first, left to right, like a roller.
  gsap.utils.toArray<HTMLElement>('[data-press]').filter(below).forEach((el) => {
    gsap.fromTo(el, wipe.from, { ...wipe.to, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  gsap.utils.toArray<HTMLElement>('[data-press-group]').filter(below).forEach((group) => {
    gsap.fromTo(group.children, wipe.from, { ...wipe.to, stagger: 0.1, scrollTrigger: { trigger: group, start: 'top 88%', once: true } });
  });

  // Tenure bars grow from their left edge once their row is on the page.
  gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  // The spot plate lands a beat late and out of register, then settles.
  const plates = gsap.utils.toArray<HTMLElement>('[data-spot]');
  plates.forEach((el) => {
    const arrive = { x: -18, y: 10, duration: 1.2, delay: 0.25, ease: 'expo.out' };
    gsap.from(el, below(el) ? { ...arrive, scrollTrigger: { trigger: el, start: 'top 90%', once: true } } : arrive);
  });

  // Scroll speed slips the spot plate further out of register; it settles when you stop reading.
  let target = 0;
  let shown = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => (target = gsap.utils.clamp(-1, 1, self.getVelocity() / 2600)),
  });
  const tick = () => {
    rail.slip += (target - rail.slip) * 0.14;
    target *= 0.88;
    if (Math.abs(rail.slip) < 0.004) rail.slip = 0;
    if (rail.slip === shown) return;
    shown = rail.slip;
    for (const el of plates) el.style.translate = `${3 + shown * 10}px ${-2 - shown * 5}px`;
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    rail.slip = 0;
  };
});
