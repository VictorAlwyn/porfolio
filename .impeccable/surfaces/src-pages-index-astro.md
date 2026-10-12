---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/quests/[slug].astro","src/pages/404.astro"]
---

# Surface brief: portfolio (home, quest pages, 404)

## Scope and mode
Experience. Whole site: `/`, `/quests/<slug>`, `/404`. Redesign: keep product truth, content, function and SEO/AI plumbing; the old neon-pixel look is anti-reference.

## Audience, job, proof
Recruiters and hiring managers, plus founders and clients, equally. Job: know who Alwyn is, see shipped AI work, make contact (email, GitHub, resume). Proof is the real resume data in `src/data/resume.ts`; no screenshots or portrait yet, so project art is authored and lights up automatically when `image` / `profile.portrait` are set. Nothing is invented.

## Chosen direction and memorable moment
Surf-mag layout desk (catalog id design-canon-raygun-layout-desk), chosen by the user over the rolled direction. Memorable moment: the press run. Each spread arrives like a sheet off a two-colour press (black plate first, spot plate a beat late and out of register, then settling), and scroll velocity re-slips the spot plate. Hidden items are registration marks.

Carried from the round's raises, kept small: chapter numbers double as hotkeys 1 to 5; locked relics and achievements print as empty slots; each campaign record's thickness is its real tenure.

## Unresolved
Final font files (League Gothic, Archivo) must resolve through the Astro fonts API. Per-zone sculpture details and the arcade's falling items are decided at build, inside this contract.

## Direction contract

THESIS: One issue of a surf-culture music magazine, laid out by someone who treats collisions as craft, where a continuous halftone 3D "photograph" is flown by scroll and type is printed straight through it. It refuses the neon game HUD and the centred headline over a card grid.

OWN-WORLD: Uncoated stock grounds (foam #F3EFE6, sun bleach #D6D2C9, salt haze #A7B4BB, sea glass #7FA29A), dense ink #111 for all text, three spots (heat #FF4A1F, cobalt #1F3BFF, chartreuse #C9F23C), one per spread and only on its loudest fragment. League Gothic compressed caps for display, Archivo for body and tracked caps labels. Hairline 1px panel grid with side rails; no radii, no shadows, no glow. Flat ink blocks for buttons, overprint (multiply) for active states. Crop and registration marks as chrome. The 3D is ink-dot halftone sculpture at 45 degrees over stock, grain baked in the shader.

STORY: In one viewport a first-time visitor reads the name, the role, the best work and how to reach him, without playing. Scrolling then flies five spreads (signal swell, feature slabs, mixing-desk faders, a stack of records, a sun). Registration marks hidden on the pages and a 60-second press-run bonus game reward curiosity, and they leave by emailing, opening GitHub or taking the resume.

FIRST VIEWPORT: 1440 by 900, three columns on hairlines. Top bar: wordmark, chapter tabs 1 to 5, issue folio (level and XP), achievements. Centre (about 56%): ALWYN over TABLATIN in League Gothic, each line roughly a third of the viewport height, second line in heat orange, lines overlapping by about 8%, the halftone swell filling the lower right and the type multiplied straight through it; beneath, the role line, a one-sentence pitch, then an orange "Email me" block and an outlined "Resume" button. Left rail (about 22%): current issue facts and the crest. Right rail (about 22%): "Best work" 01 to 03 linking the main quests. Mobile: one column, name at full width, swell behind, buttons, then best work.

FORM: Dealt challenger design-canon-raygun-layout-desk, user-chosen over the roll's assigned index 3. Seed key 74a467c2. Signature interaction: the press run, with registration slip tied to scroll velocity.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
