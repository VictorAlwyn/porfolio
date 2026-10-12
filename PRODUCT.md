# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two audiences, weighted equally: recruiters and hiring managers evaluating Alwyn for senior AI engineer roles, and founders or clients looking for someone to build an AI product. Both skim first. Each should leave by emailing, opening GitHub or downloading the resume.

## Product Purpose
A personal portfolio for Alwyn Victor Tablatin, Senior Full-Stack AI Engineer. A visitor should understand who he is, see proof of shipped AI work and make contact. Success is an email, a GitHub visit or a resume download. Standing out in the developer and design community is a secondary goal.

## Positioning
Alwyn has 8+ years of shipping for teams in the United States, Canada and the United Kingdom, and has worked on AI products since 2024 (LLM workflows, AI agents, voice agents). His resume lists "World", a Three.js 3D gamified live-streaming experience built at Moment House, so a gamified 3D portfolio is work he has shipped professionally, not a borrowed gimmick.

## Operating Context
Static Astro site deployed on Vercel. Visitors arrive on laptops and phones, including mid-range Android. The site includes a per-project page for each of six projects, a 404 page, `llms.txt`, `robots.txt` and a sitemap.

## Capabilities and Constraints
- All content lives in `src/data/resume.ts` and must stay in the DOM: crawlable, readable by assistive technology and available without playing.
- SEO and AI plumbing must be preserved: JSON-LD, canonical URLs, sitemap, `llms.txt` and the per-project pages at `/quests/<slug>`.
- Stack: Astro, Three.js and GSAP, all already installed. No new runtime dependency without a reason.
- Existing game mechanics stay: XP, levels, an achievements dialog, a Konami-code and crest-tap "boss mode", and progress saved in localStorage.
- Confirmed additions to build: hidden collectibles, opt-in synthesized sound (muted by default) and an unlockable mini-game of about 60 seconds with a local high score.
- Scrolling is the main control. One continuous 3D world sits behind the page and scrolling moves the camera through zones, one per section.

## Brand Commitments
- Keep the RPG vocabulary in the copy: quests, XP, levels, campaign log, "join the party".
- Keep the existing game mechanics (see above).
- The site must not read as cartoonish or childish.

## Evidence on Hand
- `src/data/resume.ts`: profile, 11 roles, education, 9 skill groups and 6 projects.
- `public/resume.pdf` and `public/og.png`.
- No project screenshots, portrait, testimonials, client logos or metrics beyond the resume facts exist yet. None may be invented. The user will supply project screenshots and a portrait later, so the site must look complete without them and pick them up automatically when the `image` fields and a portrait path are set.

## Product Principles
1. Readable before playable: name, role, best work and contact are available in the first viewport without playing.
2. The game rewards curiosity and never gates information.
3. Proof over claims: show shipped work, not adjectives.
4. Fast on a mid-range phone.
5. Reduced-motion and no-WebGL visitors get a complete site, not a lesser one.

## Accessibility & Inclusion
- Reduced motion gets a static but complete experience.
- Keyboard and screen-reader users can collect items and play the mini-game.
- Sound is off by default and opt-in.
- Interactive targets are at least 44px.
