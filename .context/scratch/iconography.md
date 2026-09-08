# Dubai activities — iconography design and delivery brief (v3)

Historical proposal: the approved September 7 design handoff and implementation now live in `docs/branding/site-icons/` and `docs/iconography.md`. Their final artwork and placement rules supersede the recommendations below where they differ.

Reviewed against the live source on 6 September 2026 and consolidated at Anthony's request to include the complete recommendations and style guidance. This document is self-contained: use its inventory, visual direction, loader contract and acceptance checks together. It is not approval to generate artwork or change the site.

## Recommendation

The chapter family is about right; the proposed simultaneous rollout is too aggressive. Keep the favicon's family resemblance, filled silhouettes, neon pink/red, cyan and sand, preserve coral and the Google Maps/Instagram marks, and design one pictogram for each of the 12 chapters. Use neon as a recurring accent, not a treatment applied to every control. Anthony explicitly requested a loader after this review because first load can feel slow: include it in the core set, with a first-view readiness contract below.

Separate **asset completeness** from **placement density**. Build a coherent vocabulary, but introduce it through quiet replacements of existing UI glyphs and a small chapter-icon pilot. Do not add an icon just because there is a label to put it beside.

Priority below is a recommendation, not an implementation commitment:

- **Core:** include in the coordinated family; retain existing geometry where it already works.
- **P2:** a real use or useful extension, but only place it after the pilot proves worthwhile.
- **Defer:** no current need, or a separate feature/branding decision.
- **Keep/reuse:** covered without commissioning a new drawing.

Sizes refer to visible artwork, not button hit areas. Hover, focus, selected and disabled appearances are component states, not separate exported files.

## 1. Brand

| ID | Current target | Size | Recommendation / reconciliation |
|---|---|---|---|
| `mark` | Browser tab, Apple/Android home screens, manifest | 16–512 | Integrated source: favicon v3, board 14a-4, with dark window backing/rim and 89% inner scale. Preserve supplied geometry/provenance; source and tile-scale notes are in `docs/branding/favicon-source/`. Deployment state is tracked in the handoff. |
| `mark-lockup` | Potential visible masthead, footer signature, or social preview | Composition-specific | Defer. The page opens directly on photography and has no visible text masthead to simply replace. Social preview artwork is a separate deliverable, not an icon; evaluate footer-only branding first. |

## 2. Functional UI inventory

| ID | Targets / current representation | Visible sizes to test | States / recommendation |
|---|---|---|---|
| `heart` | Unsaved toggle in hero, every active card treatment, detail gallery | 16 / 20 / 24 | Core. Pair with `heart-filled`; preserve an unmistakably hollow unsaved state even if the outline is constructed as a filled path. No glow needed. |
| `heart-filled` | Saved toggle and floating favorites counter | 16 / 20 / 24 | Core. Same silhouette as `heart`, filled coral when saved. Drawer title currently has no heart: do not add one by default. |
| `close` | Activity, archive, credits, favorites, favorite-row removal; also active Plan ahead/Tried & liked filter clear and open mobile-menu Close | 11 / 14 / 15 / 16 / 20 | Core, mostly reuse. Circular controls already use the approved symmetric `CrossIcon` SVG; only toolbar clear/menu controls still use text crosses. Preserve optical centering, button boxes and mobile text Close controls. No neon decoration or glow on Xs. |
| `chevron` | Main chapter and archive outcome accordions | 16 / 20 | Core. Right = folded, down = expanded; reuse one geometry by rotation. Do not confuse expansion with current chapter. “More” already works as text; an extra chevron there is unnecessary. |
| `check` | Inactive Tried & liked filter, liked detail callout; possible future copy-success adornment | 16 / 20 | Core. This means liked/success, not merely visited. Active filters currently show the clear X; preserve that affordance unless deliberately redesigning the component. Keep success text. |
| `chapters` | Mobile chapter-menu button's existing hamburger | 16 / 20 | Core. Closed = menu glyph, open = `close` plus Close label. Never replace the chapter name with an unexplained pictogram. |
| `arrow-right` | Existing arrows in dated/book-ahead ticket CTAs | 16 / 20 | Core. Replace only existing arrow slots initially; do not append to every primary button or combine with `external`. No mandatory hover motion. |
| `share` | Favorites' existing curved-arrow Web Share button | 20 / 21 / 24 | Core; missing from v1. Match or reuse the existing recognizable filled arrow. Keep capability gating and the accessible name; not every browser shows it. |
| `plan-ahead` | Optional addition beside Plan ahead; reuse for book-ahead banner and dated/book-ahead favorites group labels if later warranted | 16 / 20 | P2. One calendar/reservation family, not separate near-identical `book-ahead` art. A dated event and a reservation requirement still need their distinct text. |
| `copy` | Optional addition to Copy as a message | 16 / 20 | P2. Use `check` only after actual success; preserve failure/cancel feedback and text labels. No phone silhouette. |
| `expand-all` | Open everything in desktop sidebar and mobile menu | 16 / 20 | P2. Existing action is not a two-way toggle; do not invent automatic icon swapping to collapse. |
| `collapse-all` | Existing, separate Fold all action in the mobile menu | 16 / 20 | P2; omitted from v1. Pair visually with `expand-all`, but do not introduce a new desktop action as part of icon work. |
| `info` | Optional Worth knowing advisory marker | 16 / 20 | P2. Keep it quiet and retain the label. Not every advisory is a warning; do not introduce severity that the content does not express. |
| `retry` | Credits Try again and fatal-error Reload actions | 16 / 20 | P2; omitted from v1. One circular arrow can cover both, with their different labels retained. |
| `error` | Credits failure, fatal page error; optional copy/share failure adornment | 16 / 20 / 32 | P2; omitted from v1. Operational failure, not the Rejected editorial status. Keep message and recovery action; never rely on red alone. |
| `external` | Booking/venue links and credits source links | 14 / 16 | Defer. Most venue actions are external, so repeating this across 134 activities would add little information. If introduced, reserve it for genuinely ambiguous destinations, not Maps/Instagram or every CTA. |

All interactive icons need keyboard-focus parity with hover. Saved/pressed, expanded, current-location, copied/error and disabled states must remain semantically distinct. An icon asset does not create a new interaction or justify removing visible labels.

## 3. Status and card marks

| ID | Targets | Visible sizes to test | Recommendation / semantic guardrail |
|---|---|---|---|
| `status-tried-liked` | Existing image-contained thumbs-up stamp; optional archive summary/group adornment | 16 / 20 glyph; 28 / 40 badge composition | Core. Existing SVG already works; align weight only if needed. Tilted square is a CSS container, not baked into the icon. Preserve distinction between personal favorites (heart) and firsthand approval (thumb). |
| `status-tried` | Merely Tried archive summary, group and outcome label | 20 / 24; 28 / 40 composition | P2, downgraded from v1 Core. Consider a neutral horizontal dash in a stable badge, always with Tried text. Avoid a check or heart: the visit was not an endorsement. Do not repeat at every possible placement. |
| `status-rejected` | Rejected archive summary, group and outcome label | 20 / 24; 28 / 40 composition | P2, downgraded from v1 Core. Consider a restrained slash in a circle, not a close X or failure warning. Avoid thumbs-down as the default: some entries were ruled out before visiting. |
| `book-ahead` | Coral reservation banner | 16 / 20 | Reuse `plan-ahead` if this placement is approved. No additional master. Keep the existing text-only banner initially. |
| `date-stamp` | Dated card and favorites date tiles | HTML/CSS component | Keep. Preserve real text/semantic dates and rotation/borders in CSS. No generated date numerals or image per event. |

The three archive outcomes should be evaluated together. Their labels and counts already do the work; adding three marks is optional, not a completeness requirement for the initial release.

## 4. Chapter pictograms — all 12 covered

Design the complete family, then pilot placement. The directions below are starting concepts, not finalized artwork. All 12 are Core inventory. Use 24 px for navigation; prepare a 40 px optical variant for comparison, but do not assume every header needs it.

| ID | Source chapter key | Chapter | Suggested concept / distinction to preserve |
|---|---|---|---|
| `ch-nights-loud` | `loud` | Nights that go loud | Speaker with one sound-wave cutout; more nightlife than a cocktail glass. |
| `ch-genuinely-strange` | `strange` | Genuinely strange | One impossible geometric object; leave room for immersive art, comedy and unusual experiences rather than only aliens or magic. |
| `ch-long-dinners` | `dinners` | Long dinners | Plate and fork as a single balanced silhouette; dining, not food preparation. |
| `ch-take-home` | `takehome` | Things worth taking home | Hand holding a small handmade bowl; making a keepsake, not retail shopping. |
| `ch-cooking-drinking` | `cooking` | Cooking and drinking | Mixing bowl and spoon; hands-on preparation, distinct from the plate/fork. |
| `ch-get-good-at` | `getgood` | Something to get good at | Ascending steps with one small spark; practice and progression, not a medal claiming mastery or a single sport. |
| `ch-adrenaline` | `adrenaline` | Adrenaline | Compact falling figure/wing or speed-led silhouette; test against rides for immediate distinction. Avoid default lightning also being used for nightlife. |
| `ch-rides-slides` | `rides` | Rides and slides | A clear looping track or curling slide; engineered amusement, not another speed bolt. |
| `ch-wandering-buying` | `wandering` | Wandering and buying things | A shaded market arcade; walking and browsing, not the craft-hand symbol. Avoid copying the favicon's exact window silhouette. |
| `ch-quiet-dark` | `quiet` | Quiet and dark | Crescent over a low dune; quiet/night association, with a much simpler silhouette than the brand mark. |
| `ch-whole-days` | `elsewhere` | Whole days elsewhere | A road bending toward a mountain/horizon; day-trip distance, not an airplane implying flights. |
| `ch-fur-feathers-scales` | `animals` | Fur, feathers and scales | One feather paired with a simple track if legible; avoid a zoo cage or a paw alone implying only pets. Simplify rather than fit three animals into 24 px. |

Navigation states: default, hover/focus and current-location. Accordion expansion is separately represented by `chevron`; several chapters can be expanded at once. Do not illuminate all 12 just because Open everything is active.

Potential placements: desktop sidebar and mobile chapter menu first; section headers second, only if the comparison supports them. Do not repeat chapter pictograms on every activity card, favorite row, credit group and sticky current-chapter label by default. Text names remain authoritative because several chapters are deliberately poetic, not universal categories.

## 5. Secondary destinations

| ID | Targets | Size | Recommendation |
|---|---|---|---|
| `ch-tried-decided` | Footer archive link, archive heading, zero-photo decision-record fallback | 20 / 24 / 40 | P2. It is an archive destination, not a thirteenth chapter; prefer a small ledger/history motif, not a fourth verdict. Reuse for a photo-less decision record if needed, rather than showing a broken-camera error. |
| `photo-credits` | Footer Photo credits link and credits heading | 20 / 24 / 40 | P2; missing counterpart to archive decoration. Consider a small image/byline motif. If one footer destination gets a mark, evaluate both together; leave the long attribution list unadorned. |

## 6. Loading, empty and media states

| ID / slot | Actual current behavior | Recommendation |
|---|---|---|
| `loader` | Initial document currently has an empty React root; opening hero has a high-priority image but no readiness indicator. Credits have an explicit loading state. | Core, explicitly requested by Anthony. Design a compact brand-related loading motif: static mark plus a gently moving arc/short neon trace, 32 / 48 px, with a 16 / 20 px simplified version for credits or the currently visible detail photo. CSS animation and static reduced-motion variant; no separate SMIL/fallback system. See readiness contract below. |
| `image-placeholder` | Hero/cards/detail already have warm diagonal CSS placeholders, not blank boxes. Photo-load failure has no dedicated icon/handler. | Keep CSS. An explicit broken-image/retry experience is a separate behavior change; do not commission a fallback picture and imply failures are handled. |
| `empty-favourites` | Existing device-neutral text and dashed panel | P2 composition, reuse `heart` at roughly 40–48 px if needed. Do not commission an independent 64–96 px illustration for the first release or overwhelm the concise guidance. |
| `empty-filter` | Chapters with no matching activities are omitted by `App.tsx`; there is no empty chapter component. | Defer. Do not introduce empty chapter panels to create a home for this asset. Revisit only with a real global no-results/search feature; text and Clear filters would come first. |
| `carousel-dot` | Detail gallery uses CSS dots/dash with larger buttons; the hero uses labeled selectors and a progress track. | Keep CSS, not an SVG deliverable. Preserve existing hit areas and selected-state semantics. No separate active/inactive files. |
| `gallery-next` / `gallery-previous` | Photo itself advances; detail dots provide direct selection. No arrow-button pair currently exists. | Defer new controls. If a later accessibility/usability design adds arrows, reuse `chevron` with directional orientation and descriptive labels. No new pictogram family. |

### First-load feedback contract — included, behavior still to implement

Anthony reports slow first loads. Source inspection confirms the initial HTML mount is empty, only the currently active hero photo is rendered at high priority, and card photos are already lazy-loaded. No network trace was collected here, so image transfer, JavaScript startup and font timing have not been isolated as the cause.

- Preferred presentation: a small branded loader on the warm ground before the app paints, followed by the same motif in the opening photo's placeholder only while that photo is pending. Render titles, navigation and actions as soon as they are usable. Do not keep the whole guide behind a full-screen animation while an image finishes.
- The earliest loading cue must be available without waiting for the main React bundle or downloading a new raster asset. Reconcile that with the static HTML shell during implementation; a React-only spinner cannot explain the pre-JavaScript blank interval.
- Scope readiness to the initial route. Root entry concerns the opening hero; a direct activity link concerns that sheet's first image. A direct archive/credits/chapter link must not wait for an unrelated offscreen hero. Avoid replaying the page loader on chapter changes or every automatic hero transition.
- End pending-image feedback on successful display readiness or an explicit failure outcome; handle already-cached images and decode failures too. Never wait for all 473 photos, all gallery frames, `window.load`, or a made-up minimum animation duration. No invented percentage for an unmeasured workload.
- Keep reserved media dimensions and current quiet CSS placeholders below the fold. At most the currently attended image needs the small indicator; dozens of spinning cards would look broken and distract from reading.
- Failure must lead to honest fallback/retry or reload guidance, not an infinite spinner. Slow loading may surface a delayed explanatory message while the rest of the guide stays usable; it must not be falsely marked complete because a timer elapsed.
- Use a restrained status label such as “Getting the guide ready…” before mount and “Loading photo…” only for actual media loading. Avoid repeated screen-reader announcements for every card; reduced motion gets a static mark with the same meaningful text.
- Before shipping, measure a cold-cache slow-network load and compare first content/hero rendering before and after. Check cached/instant loads, a failed hero, a failed bundle, a direct sheet link and reduced motion. The loader clarifies waiting; reducing image bytes or changing delivery would be separately justified performance work, not a claimed benefit of the animation.

## 7. Deliberate non-targets

- Google Maps and Instagram SVGs remain untouched.
- Keep hero pagination labels, autoplay progress, date tiles, numeric archive/favorites counts, borders, button rings and focus rings as HTML/CSS.
- No icon per activity, venue, fact label, date, price, eligibility condition, or booking provider. Metadata remains selective text; it does not need a second pictorial taxonomy.
- No back-to-top, search, location tracking, notification bell, user account, settings, download, theme switch, or new carousel playback controls: these are not current features.
- No wholesale recoloring of the site to match the favicon. Existing warm gold, cream and coral remain the interface foundation.

## 8. Delivery and acceptance brief

### Creative direction and visual hierarchy

Aim for a warm, editorial travel guide with a distinctive neon signature—not a dashboard, an arcade interface, or a collection of miniature logos. The favicon establishes family resemblance, not a requirement to copy its full color palette and glow into every asset.

Photography and activity names remain the primary attraction. Chapter headings organize the page; utility controls support actions. Icons should clarify this hierarchy rather than become another competing layer alongside the existing date stamps, coral reservation banners, firsthand badges and brand links.

Use simple, recognizable silhouettes, deliberate negative space and consistent perceived weight. At small sizes, remove secondary details instead of thinning them. Give chapter pictograms character through shape; avoid relying on a different color for every chapter. Preserve the existing typography, spacing and warm surface treatments rather than redesigning those to accommodate the icon set.

### Two related visual families

- Utility icons: quiet, mostly single-color, familiar silhouettes. Use `currentColor`; coral heart state stays coral. Match perceived weight rather than forcing a decorative two-color fill into every X/check/arrow.
- Chapter/brand pictograms: filled shapes with negative-space cuts and at most one accent in addition to the base. The favicon can retain its richer palette; every small icon need not repeat all its colors.
- Neon is an optional CSS treatment outside the asset. Default to no glow on tiny controls, status badges, card actions or placeholders. The single first-load motif can carry a subtle neon accent without pulsing the whole screen. A restrained current-navigation accent can establish the motif; section-header glow is a pilot variant, not the default across 12 open chapters.

### Palette and state styling

These are the current source colors, not a new theme. Keep UI colors token-driven; new artwork must work in monochrome as well as its accent treatment.

| Role | Existing color | Use |
|---|---|---|
| Site ground / panel | `#16110e` / `#1f1813` | Retain the warm dark surroundings; do not introduce a new black or blue-black theme. |
| Paper / primary warm accent | `#f4efe6` / `#e9a94b` | Default utility and navigation vocabulary, according to the existing component color. Gold hover/focus accent remains `#f2c079`. |
| Coral | `#d98c7a` | Retain the current saved-heart and reservation accents; do not silently replace coral with neon pink. |
| Favicon neon pink/red | `#ff4fa3` | Optional chapter or loader accent, not a universal default or a new meaning for errors. |
| Favicon cyan | `#35e0ff` | Alternative chapter or loader accent; not a second simultaneous glow on the same small icon. |
| Favicon sand / shaded sand | `#d9a23a` / `#b07f2f` | Brand-family reference for pictograms; utility gold stays the existing UI token. Small pictograms need not use both shades. |

- Default utility state: one inherited color, no glow. Hover and keyboard focus may brighten the existing color; keep the visible focus ring independent of any glow.
- Saved heart: fill changes as well as color, with the same outside silhouette. Never use a heart to communicate Tried & liked or a checked icon to communicate merely Tried.
- Current chapter: one restrained accent plus the existing current-location treatment. Expanded chapters still use a rotated chevron; expansion alone does not trigger neon.
- Loader: static brand-related body with a gently moving arc or short trace while work is actually pending. No flashing, theatrical full-screen reveal, or forced wait so the animation can finish.
- No new fixed glow radius or animation timing is prescribed before the pilot. Choose those at rendered size on real surfaces; the solid shape must remain legible with every effect disabled.

### Placement restraint

| Surface | Initial recommendation | Do not add by default |
|---|---|---|
| Desktop sidebar / mobile chapter menu | One pictogram beside each chapter name; quiet defaults and a restrained current-location accent | Icon-only navigation or all-open neon illumination |
| Chapter headers | Keep text and the existing accordion affordance initially; compare a few 40 px pictograms in the pilot | Glowing pictograms beside every open heading |
| Activity cards and detail actions | Replace existing heart, check, arrow or close slots without increasing their number | Chapter pictograms per card, extra arrows on every CTA, or decorative fact-label icons |
| Favorites | Quiet heart/remove/share family and the existing readable copy | A new title icon plus a large empty-state illustration plus glowing action buttons |
| Archive and credits | Preserve labels/counts; assess any optional destination or outcome marks as coordinated groups | Repeating the same status at summary, heading and card level merely because artwork exists |
| Loading | One compact first-view cue, then local feedback for the attended image if needed | A spinner on every card or a gate waiting for the full photo library |

The practical density rule is replacement before addition. A complete asset library does not mean every supported placement should be enabled. Introduce one decorative layer at a time so its effect on the existing design can be judged.

### Vector handoff

- Individual editable SVG masters and an inventory mapping IDs to meanings, sizes, placements and reuse aliases. Prefer those as the single source of truth; generate any sprite mechanically if integration needs it, rather than maintain two hand-edited copies. Existing React/CSS infrastructure needs no new icon package just to render these.
- Utility masters on a consistent grid; keep the already-tested 16-unit `CrossIcon` geometry unless a replacement is proven equally centered. Chapter 24 px and 40 px optical variants may share a normalized grid; annotate their intended display sizes.
- Judge filled outlines, negative-space gaps and narrow bridges at actual output size. A 1.5-unit feature on a 24-unit grid becomes less than a pixel at the existing 11 px remove control; a grid-only minimum is not sufficient.
- Keep transparent backgrounds, no hard-coded button circles, and no baked glow in new UI masters. Prefix any SVG definition IDs so repeated instances cannot collide. Do not strip provenance from the supplied favicon assets.
- Record matching optical bounds and centering, not only identical view boxes. Pair heart states without shape jumps; keep any tiny-size simplifications deliberate.
- Deliver a contact sheet on the actual dark panel, warm paper/gold ticket backgrounds and representative busy photos, including monochrome/no-glow versions. Do not create a broad light-theme requirement: the site has no theme switch.

### Integration checks (future implementation, not performed by this proposal)

- Keep accessible names on buttons/links; adjacent decorative SVGs are hidden from assistive technology and non-focusable. Keep `aria-pressed`, `aria-expanded`, `aria-current`, text error/success feedback and visible focus rings.
- A 16 px picture must not shrink its existing control's clickable area. Preserve the recently verified circular-X centering, mobile text Close, and independent Save/remove actions.
- Verify at 390, 999, 1000 and 1440 px, especially the crowded mobile filter row and long chapter names. Compare on real cards with heart, firsthand badge, date/book-ahead treatment and Maps/Instagram present together.
- Check keyboard focus, touch without hover, reduced motion, monochrome/forced colors and selected states without relying on color or glow alone. Loader motion is tied to real pending work and has a static alternative; no unrelated decorative looping pulse or obligatory hover-slide.
- Pilot default/no-glow versus one-accent/current-nav treatment. If icons attract more attention than activity photography or headings, reduce saturation/size/placement before adding more.

## 9. Commissioning and rollout

Core inventory: **22 IDs** — 12 chapter pictograms, eight utility IDs (`heart`, `heart-filled`, `close`, `chevron`, `check`, `chapters`, `arrow-right`, `share`), one liked-status mark and the requested `loader`. This is not 22 entirely new drawings: Close, Share and the thumbs-up already have SVG geometry worth retaining; the loader can reuse simplified brand geometry. The delivered brand mark is separate. States, reuse aliases and CSS components are not extra bespoke icons.

The original v1 table actually listed 37 rows (24 P1, eight P2, four optional, one done), not its stated 40. Use the mapped inventory rather than the old total for a generation estimate; optical variants and composites must be costed explicitly.

Recommended sequence:

1. Create a small style proof: one heart pair, the loader in moving/static forms, three contrasting chapter concepts (nightlife, handmade keepsakes, wildlife), and the existing close/thumb/share controls alongside them. Compare real placements before commissioning the rest.
2. Complete all 12 chapter designs for consistency, replace existing UI glyphs quietly, and initially place chapter icons in navigation only. Retain existing working SVGs where they fit. Implement the requested first-view loading feedback against measured readiness, not an all-images gate.
3. Compare a header-icon version on a few chapters. If it materially improves recognition, expand it; do not also add glowing card marks, toolbar ornaments and empty-state illustrations in the same pass.
4. Add P2 placements only to solve an observed need. Archive outcome marks can form a later coherent trio; universal external arrows and large empty illustrations are not required to finish the set. The explicitly requested loader is already in Core.

Evidence: `src/components/{ActivityCard,ActivityDialog,ArchiveDialog,CreditsDialog,FavoritesDialog,HeroCarousel,ChapterNavigation,ChapterSection,CrossIcon}.tsx`, `src/App.tsx`, `src/data/activities.ts`, `src/styles/{tokens-base,layout,cards,dialogs,responsive}.css`, and `docs/site-interactions.md`. No icon artwork was generated and no live UI was changed for this review.
