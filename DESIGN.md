---
name: Alwyn Tablatin Portfolio
description: One issue of a surf-culture music magazine, laid out on a desk, with a halftone 3D photograph flown by scroll and condensed type printed straight through it.
colors:
  foam: "#f3efe6"
  sun-bleach: "#d6d2c9"
  salt-haze: "#a7b4bb"
  sea-glass: "#7fa29a"
  ink: "#111111"
  heat: "#ff4a1f"
  heat-text: "#e8380b"
  cobalt: "#1f3bff"
  chartreuse: "#c9f23c"
typography:
  display:
    fontFamily: "League Gothic, sans-serif"
    fontSize: "clamp(3.4rem, 1.2rem + 10.5vw, 9.5rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0"
  masthead:
    fontFamily: "League Gothic, sans-serif"
    fontSize: "clamp(5.5rem, 31cqi, 17rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "0"
  headline:
    fontFamily: "League Gothic, sans-serif"
    fontSize: "clamp(1.9rem, 1.5rem + 1.4vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0"
  button:
    fontFamily: "League Gothic, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  none: "0"
spacing:
  gutter: "clamp(16px, 3.4vw, 48px)"
  shoulder: "56px"
  masthead-height: "56px"
  spread-pad: "clamp(56px, 8vw, 112px)"
  max-width: "1440px"
components:
  button:
    backgroundColor: "{colors.foam}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "52px"
  button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.foam}"
  button-primary:
    backgroundColor: "{colors.heat}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.foam}"
  panel:
    backgroundColor: "{colors.foam}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  chip:
    backgroundColor: "{colors.foam}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "3px 9px"
  numeral-block:
    backgroundColor: "{colors.heat}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "40px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.foam}"
    rounded: "{rounded.none}"
    padding: "14px 20px"
---

# Design System: Alwyn Tablatin Portfolio

## Overview

**Creative North Star: "The Surf-Mag Layout Desk"**

The site is one issue of a surf-culture music magazine, laid out by someone who treats collisions as craft. A continuous halftone 3D "photograph" sits behind the page and is flown by scroll, one sculpture per spread, and the type is printed straight through it. Everything is uncoated stock, dense ink and one loud spot colour per spread. Panels are hairline-ruled, square and flat. Nothing glows, floats or rounds.

Density is editorial: monumental condensed caps against small, quiet Archivo reading text, divided by 1px ink rules like a layout grid. The RPG vocabulary (quests, XP, levels, campaign log) stays in the copy and the game mechanics stay in the product, but they are dressed as magazine furniture: an issue folio, chapter numbers, index rows, registration marks. The look must never read as cartoonish or childish (PRODUCT.md). The previous neon-pixel game HUD look is the anti-reference.

The one authored motion moment is the press run: each spread arrives like a sheet off a two-colour press, black plate first, spot plate a beat late and out of register, then settling.

**Key Characteristics:**
- Four uncoated stocks, one ink, three spots, one spot per spread.
- League Gothic caps at monumental scale, grain baked into the glyphs; Archivo for everything read.
- 1px ink hairlines are the only structure. No radii, no shadows, no glow.
- Small copy always sits on an opaque stock plate when it overlaps the 3D layer.
- Halftone ink-dot 3D at 45 degrees with the spot screen at 15 degrees.
- Static and complete when motion or WebGL is unavailable.

## Colors

Warm uncoated paper stocks carry near-black ink, with one hot spot per spread that only ever appears on the loudest fragment. Colours are written straight into the WebGL framebuffer (colour management off) so the 3D inks match the CSS tokens exactly.

### Primary
- **Heat** (`{colors.heat}`): spot for the hero, campaign and contact spreads. Fill and display-size use only; on foam it is not small-text legible.
- **Heat Text** (`{colors.heat-text}`): the darker heat used where heat is set as large display text on foam (the second masthead line). Only the hero maps it to the text role.
- **Cobalt** (`{colors.cobalt}`): spot for About and Skills. Legible as text on bleach and foam, and as a fill with foam text.
- **Chartreuse** (`{colors.chartreuse}`): spot for Quests, and for every spread in boss mode. Fill only on light stocks.

### Neutral
- **Foam** (`{colors.foam}`): default stock (hero, skills); also the text colour on ink.
- **Sun Bleach** (`{colors.sun-bleach}`): About stock.
- **Salt Haze** (`{colors.salt-haze}`): Quests stock.
- **Sea Glass** (`{colors.sea-glass}`): Campaign stock.
- **Ink** (`{colors.ink}`): all text on light stocks, every hairline, the Contact and boss-mode stock.

### Per-zone tokens (set on both the page root and the spread)

| zone | stock | fg | spot | on-spot | spot-text |
|---|---|---|---|---|---|
| hero | foam | ink | heat | ink | heat-text |
| about | sun-bleach | ink | cobalt | foam | cobalt |
| quests | salt-haze | ink | chartreuse | ink | ink |
| skills | foam | ink | cobalt | foam | cobalt |
| campaign | sea-glass | ink | heat | ink | ink |
| contact | ink | foam | heat | ink | heat |
| boss mode | ink | foam | chartreuse | ink | chartreuse |

`--stock` and `--spot` are registered custom properties and transition over 0.7s, so the page ground and spot cross-fade as the active spread changes. The active spread is the last one whose top has passed the viewport centre.

### Named Rules
**The One Spot Rule.** Each spread has exactly one spot colour, used on its loudest fragments (numeral blocks, primary button, highlighted headline word, primary skill row, XP fill). A second spot on the same spread is a defect.

**The Spot-Text Rule.** The spot is text only where `--spot-text` says so. Heat is never small text on foam, and on haze and glass neither chartreuse nor heat is text at all; those zones map spot-text to ink and the spot appears as a fill with ink on it. Always pair a fill with `--on-spot`.

**The Pure Spot Rule.** On haze, glass, ink and in boss mode the spot plate prints with normal blend so the spot stays pure. Multiply (overprint) is reserved for foam and bleach, where it deepens against the stock and the 3D beneath.

**The Boss Inversion Rule.** Boss mode swaps the whole system to ink stock, foam text and chartreuse spot, overriding every zone.

## Typography

**Display Font:** League Gothic (sans-serif fallback), weight 400, uppercase
**Body Font:** Archivo (system-ui fallback), 400/500/600/700
**Label Font:** Archivo 600, tracked caps

**Character:** A compressed poster face against a plain grotesque. League Gothic is only ever uppercase and tight; Archivo does the reading and the small labels, so the page has loud and quiet and nothing in between.

### Hierarchy
- **Masthead** (League Gothic 400, `clamp(5.5rem, 31cqi, 17rem)`, 0.86): the ALWYN / TABLATIN pair, sized to the hero column container. The second line overlaps the first by `-0.2em`, indents `0.04em`, and takes the spot-text colour. This exceeds ordinary display scale on purpose: the world requires monumental condensed type.
- **Display / spread title** (League Gothic 400, `clamp(3.4rem, 1.2rem + 10.5vw, 9.5rem)`, 0.86): one per spread, with the grain mask baked into the glyphs. Headlines run across both columns of the spread on wide screens.
- **Headline** (League Gothic, `clamp(1.9rem, 1.5rem + 1.4vw, 2.6rem)`, 0.95): campaign records, quest names (2.4 to 3.6rem), skill group heads (2.4rem).
- **Button / numerals** (League Gothic, 1.45rem for buttons, 1.7 to 2.6rem inside numeral blocks and stats).
- **Body** (Archivo 400, `clamp(1rem, 0.96rem + 0.2vw, 1.0625rem)`, 1.6, tabular numerals): lede capped at 62ch, bio at 70ch.
- **Label** (Archivo 600, 0.72rem, 0.14em tracking, uppercase): folio, side-heads, toast, metadata. The chapter nav and chips run slightly larger at 0.78rem.

### Named Rules
**The Grain Rule.** Display type carries a 240px fractal-noise alpha mask so it reads as ink on stock, not vector fill.

**The Two Voices Rule.** Display face for headlines, numerals and buttons; Archivo for everything else. No third family, no system display face.

## Layout

A magazine spread grid. Every spread starts with a 1px ink top rule and `clamp(56px, 8vw, 112px)` vertical padding inside a 1440px max wrap with a fluid gutter (`clamp(16px, 3.4vw, 48px)`). From 900px a 56px "shoulder" column carries a vertical side-head with a left hairline, and content takes the right. From 1100px the content owns the left 62% and the right 38% is deliberately an open window onto the 3D sculpture; titles and `.wide` blocks span both.

The hero is three columns on hairlines from 1000px: left rail about 17% (issue facts, crest, GitHub, chapter contents), centre masthead, right rail about 22% ("Best work" 01 to 03). Below 1000px it collapses to one column: name at full width, swell behind, pitch plate, buttons, then best work; the contents list hides.

The masthead is a sticky 56px bar of ruled cells: wordmark, chapter tabs (native popover menu below 900px), folio with level and XP track, achievements. Breakpoints actually used: 700, 760, 900, 960, 1000, 1100px. Rhythm is hairline-ruled rows with 14 to 24px internal padding and `clamp(28px, 4vw, 56px)` between a title and its content. Interactive targets are at least 44px.

Chapter numbers double as hotkeys 1 to 5. Tenure on campaign records is shown as bar length.

## Elevation & Depth

There is no elevation. Depth comes from three things: the fixed 3D halftone layer behind the page, opaque stock plates that separate small copy from it, and a fixed paper-fibre overlay (alpha 0.1, one quad). Panels have no shadows, no glow and no blur. The only shadow-like value is the focus halo, a 3px stock-coloured ring beside a 3px ink outline, which keeps focus visible over the dots.

### Named Rules
**The Plate Rule.** Never set small copy directly on the 3D layer. Anything below headline size that overlaps the canvas sits on an opaque (or 88% stock on the hero pitch) plate with a hairline. Headlines may print straight through the sculptures because the dot coverage is capped at 0.58 and never merges into solid.

**The Flat Rule.** No box-shadow, text-shadow, glow, blur or gradient fills for decoration.

## Shapes

Square. Radius is 0 everywhere. Structure is the 1px ink hairline (`1px solid var(--fg)`), used as top rules, row dividers, panel borders and cell grids. Dashed hairlines (1px dashed) mark empty or unearned slots. Level and tenure bars are 10 to 12px tall bordered tracks with flat fills. The crest is a solid 76px ink square with a display initial. Relics are 48px registration marks (crosshair circles), outline only, and fill with the spot once found.

## Components

### Buttons
- **Shape:** square, 1px ink border, 52px minimum height, 12px 22px padding.
- **Default:** opaque stock fill, ink text, League Gothic 1.45rem uppercase.
- **Primary:** spot fill, on-spot text, ink border.
- **Hover:** ink inversion on both (fg background, stock text), 0.18s. Focus is the 3px ink outline with stock halo.

### Panels / Containers
Flat stock fill with a 1px ink border; no radius, no shadow. Lists and boards are ruled grids: quest board cells share borders, the skill index and campaign log are ruled rows with outer left/right rules.

### Chips
Stock fill, 1px ink border, 3px 9px padding, 0.78rem. On a spot-filled row the chip goes transparent with a currentColor border.

### Numeral blocks
Square spot fills with on-spot League Gothic numerals: quest numbers (40px), best-work numbers (56px), chapter tab numbers, level badges. They are the main carrier of the spread's spot.

### Index / ledger rows
Skill groups and campaign records are ruled rows: a headline column (about 28% / 13rem) and a detail column. The primary skill row inverts to spot fill. Campaign rows end in a tenure bar; a dashed top rule marks the tutorial record. Quests use a lead cell with a greyscale-contrast image area (16/9), side rows and a whole-card link through the heading.

### Navigation
Ruled cells in the sticky masthead. Chapter tabs are 0.78rem tracked caps with a 4px ink underline that grows to full width on the active zone; hover inverts to ink. Chapter numbers are spot blocks. Below 900px the list is a native popover anchored under the bar.

### Registration marks (relics) and locked slots
Hidden collectibles are drawn as registration marks, not icons. Locked achievements print as dashed empty slots; unlocked ones fill.

### Toast
A square ink block with foam label text, top-right under the masthead, sliding in. On phones it takes the masthead for a few seconds instead of covering the page.

### The press run (motion)
Black plate: elements marked for the press wipe in left to right with `clip-path: inset(0 100% 0 0)` to full over 0.9s, `expo.out`, once per element, staggered 0.1s for groups. Spot plate: arrives 18px left and 10px low, 0.25s late, 1.2s `expo.out`, and settles to a resting register of `translate(3px, -2px)`. Scroll velocity (divided by 2600, clamped to plus or minus 1, smoothed at 0.14) pushes the plate by up to 10px right and 5px up beyond rest (measured about 8px and 4px in a fast scroll) and it returns within about 1.8s of stopping. Tenure bars grow from the left. Camera dwell: the camera reaches each stop after about 440px of scroll (dwell clamped 0.1 to 0.4 of the spread), holds while reading, and leaves in the last stretch. Reduced motion gets a static, complete page with a static halftone backdrop; so does no-WebGL.

### The 3D photographs
Halftone ink shader: black key screen at 45 degrees, spot screen at 15 degrees offset by (3px, -2px) plus slip, cell size 8, ink coverage capped at 0.58 and faded with distance (fog 46 to 92) so only the nearby sculpture reads, paper grain at 0.04. On dark stock the lit side carries the dots (negative print). Six sculptures flown in order, palettes mirroring the zone tokens: signal swell (hero), aperture rings (about), feature slabs (quests), mixing-desk channels with faders (skills; bar height equals branch depth), record stack (campaign; one record per role, thickness equals tenure), ringed sun on ink (contact). Two quality tiers: tier 1 on coarse pointers, widths under 900px, 4 or fewer cores or 4GB or less memory (DPR 1.25, 30fps, lower mesh density, no antialias); tier 2 otherwise (DPR 2, 60fps).

## Do's and Don'ts

### Do:
- **Do** give each spread one spot and use it on numeral blocks, the primary button, one headline word and the XP fill.
- **Do** put every piece of small copy that overlaps the 3D layer on an opaque stock plate with a hairline.
- **Do** keep hairlines at 1px in `--fg`, and use dashed hairlines for empty or locked slots.
- **Do** invert to ink on hover for buttons, tabs and rows.
- **Do** switch to normal blend for the spot on haze, glass, ink and boss mode; keep multiply on foam and bleach.
- **Do** use spot-text only where the zone table allows it, and `--on-spot` on every spot fill.
- **Do** let the masthead and spread titles be monumental and overlap; keep the grain mask on display type.
- **Do** keep all content in the DOM and the page complete without WebGL or motion.

### Don't:
- **Don't** use radii, box-shadows, text-shadows, glow, blur or gradient decoration.
- **Don't** set small copy straight on the canvas.
- **Don't** stack an eyebrow or kicker label above a heading.
- **Don't** use more than one spot colour on a spread, or heat as small text on foam, or chartreuse or heat as text on haze or glass.
- **Don't** add a third typeface, a system display face, or icon-font or glyph icons; icons are drawn SVG.
- **Don't** return to neon, pixel or game-HUD styling, or a centred headline over a card grid.
- **Don't** make the 3D dots merge to solid under headlines.
