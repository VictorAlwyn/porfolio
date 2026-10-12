import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reduced-motion users get static, fully visible content: nothing here runs for them.
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      y: 44,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.09,
      ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-timeline]').forEach((list) => {
    gsap.from(list, {
      '--progress': 0,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true },
    });
  });
});
