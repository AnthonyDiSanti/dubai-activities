# Handoff: site iconography — hearts, control glyphs, chapter pictograms, loader

Repo: AnthonyDiSanti/dubai-activities (main). Read the current source before editing; everything below references it by file and class. One package, one pass — the parts are independent, install them in any order.

## Overview
Everything approved in the icon design review that follows the new favicon:

**Part A — controls**
1. **Darker photo discs** — every circular favorite button over a photo gets a `.72` ground and `.3` border.
2. **SVG hearts** — the `♡` / `♥` text glyphs in `FavoriteButton` become one `HeartIcon` with two states.
3. **Utility control glyphs** — the text glyphs `✓ ✕ ☰ ▸ ▾ →` in ChapterNavigation.tsx, ChapterSection.tsx and the AheadCard CTA become 16-grid inline SVGs matching `CrossIcon`. `CrossIcon`, the share arrow and the `VerifiedStamp` thumb stay as they are.

**Part B — chapters**
4. **Twelve chapter pictograms** — 24-grid inline SVGs, `currentColor` body, neon accent details that light when the chapter is current. Sidebar (20 px), mobile chapter menu (20 px), section headers (28 px, always lit).
5. **Loader** — the favicon's arch with a tracing neon dash: pre-mount cue in `index.html` and inside the hero's striped placeholder while a photo is pending.

Not in scope: icons on activity cards or CTAs beyond the ones named; any change to copy, layout or colours elsewhere.

## About the design files
`Dubai Icon Board.dc.html` is the **design reference built in HTML** — the whole exploration, newest turn on top (open it in a browser; `support.js` and `uploads/` are its dependencies). It is not production code. Locked picks: hearts and control glyphs `#1a`/`#2a`/`#2e`; chapter icons are the ones listed in "The twelve" below; loader is L3 (`#3a`). Everything else on the board is an exploration that was not chosen.

`preview-chapters.html` shows the twelve pictograms in every state on the site's ink — compare your build against it.

## Fidelity
**High-fidelity.** Path data, colours, sizes and states are final. Match them exactly. Recreate inside the existing React + CSS patterns (`CrossIcon.tsx` is the model: a tiny component returning inline SVG, sized by a CSS custom property).

## Files
- `ui/heart.svg`, `ui/heart-filled.svg` — 24-grid hearts (Part A §2).
- `ui/check.svg`, `ui/menu.svg`, `ui/arrow-right.svg`, `ui/chevron.svg` — 16-grid control glyphs (Part A §3; `close` is the existing `CrossIcon`).
- `chapters/<key>.svg` — one per chapter, keys = `CHAPTERS[].key` in `src/data/activities.ts`; `chapters/sprite.svg` — same twelve as `<symbol id="ch-<key>">`.
- `loader/loader-L3.svg`, `loader/loader.css`.
- `preview-chapters.html` — visual check for Part B.
- `Dubai Icon Board.dc.html` (+ `support.js`, `uploads/`) — design reference.

---

# Part A — controls

## 1. Favorite-button discs over photos

Files: `src/styles/cards.css`, `src/styles/layout.css`, `src/styles/dialogs.css`.

Apply to every circular favorite button that sits over imagery — `.favorite-button--hero`, `--bleed`, `--corner`, `--top`, `--slab`, `--type`, `--detail`:

```css
background: rgba(22, 17, 14, .72);      /* was .45 / .5 / .6 */
border: 1px solid rgba(244, 239, 230, .3); /* was .22–.26 */
```

Keep every existing size (38 / 36 / 34px), position, `backdrop-filter` and `border-radius`. The two inline (non-disc) buttons — `.favorite-button--inline`, `.favorite-button--ahead-inline` — have no disc; leave them.

## 2. HeartIcon

New file `src/components/HeartIcon.tsx`, modelled on `CrossIcon.tsx`:

```tsx
export function HeartIcon({ filled = false }: { readonly filled?: boolean }) {
  return (
    <svg aria-hidden="true" className="heart-icon" focusable="false" viewBox="0 0 24 24">
      {filled ? (
        <path fill="currentColor" d="M12 20.4 C10.6 19.1 3 13.9 3 8.9 C3 5.9 5.2 3.8 7.9 3.8 C9.6 3.8 11.1 4.7 12 6.1 C12.9 4.7 14.4 3.8 16.1 3.8 C18.8 3.8 21 5.9 21 8.9 C21 13.9 13.4 19.1 12 20.4 Z" />
      ) : (
        <path fill="currentColor" fillRule="evenodd" d="M12 20.4 C10.6 19.1 3 13.9 3 8.9 C3 5.9 5.2 3.8 7.9 3.8 C9.6 3.8 11.1 4.7 12 6.1 C12.9 4.7 14.4 3.8 16.1 3.8 C18.8 3.8 21 5.9 21 8.9 C21 13.9 13.4 19.1 12 20.4 Z M12 17.65 C11.08 16.79 6.06 13.36 6.06 10.06 C6.06 8.08 7.51 6.69 9.29 6.69 C10.42 6.69 11.41 7.28 12 8.21 C12.59 7.28 13.58 6.69 14.71 6.69 C16.49 6.69 17.94 8.08 17.94 10.06 C17.94 13.36 12.92 16.79 12 17.65 Z" />
      )}
    </svg>
  );
}
```

- The hollow state is a **filled evenodd ring** (outer heart + inner heart scaled 0.66 about (12, 12.3)). Ring width ≈ 3.1 units → 2.6px at 20px, 2.3px at 18px. It is deliberately heavier than CrossIcon's 1.75 stroke because it is drawn in rose, which has less contrast than paper.
- Both states share the outer path, so toggling never moves the edge.

CSS (tokens-base.css, next to `.cross-icon`):

```css
.heart-icon {
  display: block;
  width: var(--heart-icon-size, 18px);
  height: var(--heart-icon-size, 18px);
  pointer-events: none;
}
```

Sizes per container — set `--heart-icon-size` on the button class:

| Button | disc | heart |
|---|---|---|
| `.favorite-button--hero` | 38 | 20px |
| `--bleed`, `--slab`, `--detail` | 36 | 18px |
| `--corner`, `--top`, `--type` | 34 | 18px |
| `--inline`, `--ahead-inline` (no disc) | — | 16px |

Replace `<span aria-hidden="true">{isFavorite ? '\u2665' : '\u2661'}</span>` with `<HeartIcon filled={isFavorite} />` in `ActivityCard.tsx` (FavoriteButton), `HeroCarousel.tsx`, and the detail sheet's favorite button. Colour stays `var(--rose)` in both states via `.favorite-button { color: var(--rose) }`. Keep `aria-pressed`, the `aria-label` text and `stopPropagation` exactly as they are. Remove the `font-size` declarations that only existed to size the glyph.

## 3. Utility control glyphs

All on a **16-unit grid, stroke 1.75, round caps and joins, `fill: none`, `stroke: currentColor`** — identical conventions to `.cross-icon`. Suggested: one `UiIcon.tsx` with a `name` prop, or one component per glyph; either way size with `--ui-icon-size` and `display: block`, `pointer-events: none`, `aria-hidden`, `focusable="false"`.

| name | path data | replaces | where |
|---|---|---|---|
| `check` | `M3 8.6 C4.6 8.6 5.6 11.6 6.8 11.6 C8.4 11.6 10 5.2 13 4.6` | `✓` | ChapterNavigation.tsx — inactive "Tried & liked" filter |
| `close` | existing `CrossIcon` | `✕` | ChapterNavigation.tsx — active filter pills and open mobile-menu button |
| `menu` | `M3 4.5 H13 M3 8 H13 M3 11.5 H9.5` | `☰` | ChapterNavigation.tsx — "Chapters" mobile menu button |
| `arrow-right` | `M3 8 H12.5 M9.2 4.6 L12.8 8 L9.2 11.4` | `→` (`&rarr;`) | ActivityCard.tsx AheadCard `.card--ahead__primary` |
| `chevron` | filled, no stroke: `M3.5 12.5 V9.6 C3.5 8.3 4.2 7.4 5 6.8 L8 4.2 L11 6.8 C11.8 7.4 12.5 8.3 12.5 9.6 V12.5 Z` with `fill: currentColor` | `▸` / `▾` | ChapterSection.tsx `.chapter__toggle-icon` (also used by ArchiveDialog groups) |

Chevron orientation: the path points **up** as drawn. Folded (`aria-expanded="false"`) = `transform: rotate(90deg)` (points right); expanded = `rotate(180deg)` (points down). Transition `transform .2s ease` is fine; none under `prefers-reduced-motion`.

Sizes:

| Placement | icon size | layout |
|---|---|---|
| Filter pills (`.chapter-bar__filter`, 10.5px Karla 600) | 12px; the active-pill `CrossIcon` at 10px | `display: inline-flex; align-items: center; gap: 5px` |
| Mobile menu button (`.chapter-bar__menu-button`) | 12px | gap 6px |
| Chapter toggle ring (`.chapter__toggle-icon`, 34px) | 13px | already `display: grid; place-items: center` |
| Ahead-card CTA (`.card--ahead__primary`, 11px Karla 700) | 12px | `display: inline-flex; align-items: center; gap: 5px` |

Text labels stay; only the glyph characters are removed from the strings (`'\u2715 Plan ahead'` → icon + `Plan ahead`, etc.). Existing `aria-label`s already carry the meaning, so no new accessible names are needed. Colours are inherited from the existing pill/ring rules; no glow, no new colours.

## Interactions & behaviour
Unchanged. Favorites toggle, filters and accordions keep their handlers, `aria-pressed` / `aria-expanded` and focus rings. Hit areas do not shrink — the icons are children of the existing buttons.

## Design tokens used
- `--ink #16110e`, `--paper #f4efe6`, `--gold #e9a94b`, `--gold-light #f2c079`, `--rose #d98c7a` (all existing).
- Disc ground `rgba(22,17,14,.72)`, disc border `rgba(244,239,230,.3)`.
- Icon grids: hearts 24, utilities 16. Stroke 1.75 (utilities), 1.75 (CrossIcon, unchanged).

## Acceptance
- Hero, bleed, corner, top, slab, type and detail favorite buttons show the darker disc; unsaved heart is a hollow ring, saved is solid; both rose.
- No `♡ ♥ ✓ ✕ ☰ ▸ ▾ →` characters remain in the rendered UI (`Fold all` / `Open everything` / `Close` text stays).
- Check at 390, 1000 and 1440px: pill heights unchanged, chapter toggle ring unchanged, ahead-card CTA baseline aligned.
- Keyboard focus rings, `aria-pressed`, `aria-expanded` unchanged; reduced motion disables the chevron rotation transition.

---

# Part B — chapter pictograms and loader

## The twelve

| key | chapter | accent variables (lit colour) | what lights |
|---|---|---|---|
| loud | Nights that go loud | --ac #35e0ff | speaker; the two sound waves light |
| strange | Genuinely strange | --ac #35e0ff | wide eye; the iris lights |
| dinners | Long dinners | --ac #ff4fa3 | isometric table, candle at the far corner, two plates on the near sides; the flame lights |
| takehome | Things worth taking home | --ac #35e0ff | cut gemstone; the crown lights |
| cooking | Cooking and drinking | --ac #35e0ff, --ac2 #ff4fa3 | open pot; steam (--ac, blue) and flames (--ac2, red) light |
| getgood | Something to get good at | --ac #ff4fa3, --ac2 #e9a94b, --ac3 #35e0ff | mortarboard; inset outline (--ac, red), sparkle (--ac2, gold), tassel ball (--ac3, blue) light |
| adrenaline | Adrenaline | --ac #ff4fa3 | speedometer; needle and redline light |
| rides | Rides and slides | --ac #ff4fa3 | Ferris wheel; all six gondolas light red |
| wandering | Wandering and buying things | --ac #e9a94b | shopping bag; three cut sparkles and the handle light |
| quiet | Quiet and dark | --ac #35e0ff | two dunes at night; the big star lights |
| elsewhere | Whole days elsewhere | --ac #35e0ff | car; the windows light |
| animals | Fur, feathers and scales | --ac #35e0ff | kitten; the grin and inner ears light |

Hues: **blue** `#35e0ff` · **red** `#ff4fa3` · **gold** `#e9a94b` (= `--gold`). Body colour is always `currentColor`.

## States (the contract)

Every icon is drawn once and driven entirely by CSS custom properties — no per-state SVG:

| state | how |
|---|---|
| neutral | `color: rgba(244,239,230,.62)` (the sidebar's existing text colour). Accent vars unset → accent shapes fall back to `currentColor` or `transparent` (cut-outs stay cut). |
| hover / focus | `color: var(--paper)`. Still no accent vars. |
| current (`aria-current`) | `color: var(--paper)` **plus** the icon's accent vars from the table, each with its glow: `--acg: drop-shadow(0 0 2.5px <same colour>)` (`--acg2`, `--acg3` likewise). |

The SVGs read `var(--ac, currentColor)`, `var(--ac, transparent)`, `var(--ac2, …)`, `var(--ac3, var(--ac2, …))` and `filter: var(--acg, none)` — so setting the variables on the wrapping element is all that switches state. At 28 px in section headers use `drop-shadow(0 0 3px …)`.

Suggested CSS (tokens-base.css):

```css
.chapter-icon { display: block; width: var(--chapter-icon-size, 20px); height: var(--chapter-icon-size, 20px); flex: none; pointer-events: none; }
.chapter-sidebar__item[aria-current="true"] .chapter-icon,
.chapter__header .chapter-icon { color: var(--paper); }
/* per-chapter accents, applied only in the current/header case */
[data-chapter="loud"][aria-current="true"] .chapter-icon,      .chapter__header[data-chapter="loud"] .chapter-icon      { --ac: #35e0ff; --acg: drop-shadow(0 0 2.5px #35e0ff); }
[data-chapter="strange"] … { --ac: #35e0ff; … }
[data-chapter="dinners"] … { --ac: #ff4fa3; … }
[data-chapter="takehome"] … { --ac: #35e0ff; … }
[data-chapter="cooking"] … { --ac: #35e0ff; --ac2: #ff4fa3; --acg: drop-shadow(0 0 2.5px #35e0ff); --acg2: drop-shadow(0 0 2.5px #ff4fa3); }
[data-chapter="getgood"] … { --ac: #ff4fa3; --ac2: #e9a94b; --ac3: #35e0ff; --acg: …; --acg2: …; --acg3: …; }
[data-chapter="adrenaline"] … { --ac: #ff4fa3; … }
[data-chapter="rides"] … { --ac: #ff4fa3; … }
[data-chapter="wandering"] … { --ac: #e9a94b; … }
[data-chapter="quiet"] … { --ac: #35e0ff; … }
[data-chapter="elsewhere"] … { --ac: #35e0ff; … }
[data-chapter="animals"] … { --ac: #35e0ff; … }
```

A cleaner alternative is a `CHAPTER_ACCENTS` map next to `CHAPTERS` in `activities.ts` and inline `style={{'--ac': …}}` on the wrapper when current — either is fine; keep the values.

## Component
Model on `CrossIcon.tsx`: one `ChapterIcon({ chapter, size })` returning the inline SVG for that key (a switch over the twelve, or import the sprite once and `<use href="#ch-{key}">`). `aria-hidden="true"`, `focusable="false"`; the chapter name next to it is the accessible label. `preserveAspectRatio` default; never stretch.

Masks use `maskUnits="userSpaceOnUse"` over the 24-unit box; keep them inside each SVG's `<defs>` (or the sprite's) so ids don't collide — if you inline all twelve on one page, the ids are already unique.

## Sizes
- Sidebar and mobile menu rows: 20 px, `gap: 10px` before the 13 px Karla label, vertically centred. Rows keep their current height.
- Section headers: 28 px, baseline-aligned with the Cormorant title, `gap: 14px`; always lit.
- Never below 16 px.

## Loader (L3)
The favicon's arch with its red tube at 35% and a full-brightness 14-unit dash tracing the outline once every 2.2 s (`stroke-dasharray: 14 86` on `pathLength="100"`). Inner artwork (dunes, moon, star) is static.

- **Pre-mount**: inline `loader/loader-L3.svg` + the `@keyframes trace` rule directly in `index.html` inside `#root`'s placeholder, centred on `--ink` with the existing dotted texture, label "Getting the guide ready…" in Space Mono 9px/.2em gold beneath. React replaces it on mount — no fade needed.
- **Hero photo pending**: same SVG at 40 px, centred inside the hero's `.media-placeholder` stripes, with the existing "Loading photo…" label. Remove on image `load` or `error` — never on a timer.
- Reduced motion: `loader.css` parks the dash at the apex (`--ld-anim: none; --ld-off: -28.5`). Nothing else changes.
- Size variables: `--tube` (tube opacity, .35), `--tr` (dash colour, #ff4fa3), `--ld-glow` (set to `none` below 32 px).

## Acceptance
- Sidebar + mobile menu: twelve icons at 20 px, neutral rows at 62% paper, hover paper, current row paper with that chapter's accent(s) glowing; text colours unchanged.
- Section headers: icon at 28 px, lit, for every chapter including archived-empty ones.
- The pot lights two hues, the cap three; every other icon one.
- No layout shift in rows; keyboard focus rings unchanged.
- Loader animates on first paint before the bundle, and inside the hero placeholder while the first photo decodes; static under reduced motion.
- `preview-chapters.html` and the site look the same at 24/48.
