import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { rail } from './rail.ts';

gsap.registerPlugin(ScrollTrigger);

// Zone tracking runs for everyone: it drives the page colour, the camera and sound, not only animation.
const root = document.documentElement;
const zones = gsap.utils.toArray<HTMLElement>('[data-zone]');
rail.ids = zones.map((z) => z.dataset.zone!);
if (rail.ids[0]) root.dataset.zone = rail.ids[0];

// ScrollTrigger treats "exactly at the end" as having left, so the last zone ends just past the bottom of the page.
const last = zones.length - 1;
zones.forEach((el, i) =>
  ScrollTrigger.create({
    trigger: el,
    start: 'clamp(top center)',
    end: i === last ? () => ScrollTrigger.maxScroll(window) + 2 : 'clamp(bottom center)',
    onUpdate: (st) => {
      if (!st.isActive) return;
      rail.index = i;
      rail.local = st.progress;
    },
    onToggle: (st) => {
      if (!st.isActive) return;
      rail.index = i;
      rail.local = st.progress;
      root.dataset.zone = rail.ids[i];
      document.dispatchEvent(new CustomEvent('rpg:zone', { detail: rail.ids[i] }));
    },
  }),
);

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
