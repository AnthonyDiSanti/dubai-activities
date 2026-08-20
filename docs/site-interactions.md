# Site interactions

## Entry point and state ownership

The root `index.html` loads `src/main.tsx`, which mounts `src/App.tsx` inside `AppErrorBoundary` and React Strict Mode and imports `src/styles/index.css`. `App` composes the hero, chapter navigation, activity sections, favorites, details, and photo credits. It owns chapter/filter/dialog selection; focused hooks own countdown, favorites persistence, reduced-motion preference, current-chapter tracking, and lazy attribution loading. The root error boundary keeps a reload path visible if an unexpected render failure escapes component tests.

Activity data is compiled from `src/data/activities.ts`. Pure transformations and URL rules live under `src/domain/`; UI must not recreate those rules in component-local view models. See [architecture.md](architecture.md) for build and S3 boundaries.

Use Vite for local interaction work:

```sh
npm run dev
```

Use `npm run build && npm run preview` for a production-output check. A plain file server pointed at `src/` is not a valid development path.

## Arrival countdown

The arrival bar counts Dubai calendar dates, not completed 24-hour periods. `ARRIVAL_DATE_KEY` and `TRIP_TIME_ZONE` in `src/config/site.ts` are therefore passed separately into the countdown domain rule: Thursday through Sunday reads `3 days until I land` throughout Thursday in Dubai, Saturday reads `1 day until I land`, and Sunday reads `I land today` regardless of the viewer's browser timezone. The trip only records a landing date, not a scheduled time, so do not reintroduce hour-level claims or imply that arrival has happened partway through Sunday. The next Dubai date shows `Tonight, it's you + me` and counts as trip day 1; the following date begins the visible numbered sequence at day 2.

`src/hooks/useCountdown.ts` refreshes the label every 30 seconds so a Dubai midnight transition appears without a reload. Tests must include a non-midnight Thursday instant and a UTC instant on either side of Dubai midnight; exact-midnight-only cases will not catch elapsed-duration regressions.

## Hero carousel

- Exactly one of the six featured activities is rendered as the active slide.
- The lead image is decorative because the activity name and description are adjacent.
- Clicking or tapping any passive image, shade, or copy surface opens the active activity sheet. Save and the two detail links keep their independent native behavior; the wrapper itself is not a button because it contains interactive descendants.
- Pagination uses full activity names and reports the selected control through `aria-current`.
- A thin visual-only progress track sits between the image and pagination. Its fill is the autoplay clock: completing the seven-second animation advances the slide.
- Automatic rotation runs only when at least two slides exist. The progress animation pauses at its current position while the pointer or keyboard focus is inside the carousel or while a dialog is open, then resumes the same cycle.
- Reduced-motion visitors receive neither automatic rotation nor the animated progress track; the manual selectors remain available.
- Choosing any pagination item permanently stops autoplay for the current page. Choosing the active item freezes the current fill; choosing another slide remounts its fill at zero. There is no separate Pause/Resume control, and the pagination navigation carries a screen-reader instruction that explains its stop behavior.
- Hero Save is a true toggle with an activity-specific accessible name and `aria-pressed`.
- A passive pointer opening focuses the existing More link before opening so modal dismissal restores a meaningful hero control without adding another tab stop.

## Chapter navigation

The sticky chapter bar and desktop sidebar are two presentations of the same state. Chapter destinations are real links whose `href` matches the native section fragment, such as `#animals`; ordinary activation focuses that chapter while modified clicks, long-press, copy-link, and open-in-new-tab remain browser-native. Links identify the current section, report expansion state, and target the corresponding section. The mobile menu reports `aria-expanded`, closes on Escape or selection, and contains Open everything/Fold all actions.

Each in-page chapter heading is one full-width native button. Clicking anywhere across its header, or activating it from the keyboard, folds or opens that chapter; the arrow is only a visual state indicator.

“Book ahead” filters activities before chapter ordering. Chapters with no matching activities disappear from the guide and both navigation surfaces. Choosing one chapter folds the others and scrolls to that section; reduced-motion users receive an immediate rather than smooth scroll.

Explicit chapter navigation updates the fragment and creates one history entry. Loading, Back, or Forward to a chapter fragment expands it before aligning the section under the sticky bar. Accordion toggles and passive scrolling never rewrite the URL or pollute history.

Current-chapter tracking initializes on mount, updates at most once per animation frame during scroll/resize, and uses the last section crossing the 120 px sticky-header line.

## Activity cards

Each activity is rendered inside `.activity-card` with one of the explicit treatments documented in [content-editorial.md](content-editorial.md). Clicking an image or another noninteractive card surface opens details at photo 1. The wrapper ignores clicks originating in an anchor or button, so Save, booking, Site, Map, Instagram, and semantic detail controls retain their own behavior.

Every card has the stable native target `activity-<activity-id>`, and each labeled detail action links to `#activity-<activity-id>`. Ordinary activation opens the sheet in-page; modified clicks and browser copy-link behavior expose the same durable URL. Hero detail actions use the identical fragment.

Do not turn the wrapper into a button or add `role="button"`: cards contain nested links and buttons. The labeled detail buttons remain the keyboard-accessible opening path. Favorite buttons stop propagation, expose the activity name, and report their pressed state.

## Modal behavior

Favorites, activity details, and photo credits use the shared native-dialog wrapper in `src/components/Modal.tsx`. Only one dialog can be selected at a time.

- `showModal()` supplies modal semantics and makes the rest of the document inert.
- Opening focuses the sheet panel and locks document scrolling.
- Backdrop click and native Escape cancellation flow through React state.
- The backdrop is pointer-only and excluded from tab order; each sheet keeps a visible close control, including the favorites X.
- Closing restores the previous scroll style and returns focus to the connected trigger.
- A sheet loaded directly from a URL has no trigger, so closing replaces its fragment with the owning chapter and focuses that chapter's accordion control.
- Each dialog is named by its visible heading and, where useful, described by visible copy.

Keep new modal interactions inside this shared boundary instead of adding document-level key or focus handlers to individual sheets.

## Photo credits

The footer exposes one lightweight `Photo credits` link. Ordinary activation opens the full credits sheet and writes `#credits`; modified clicks and copied links remain native. Back closes an in-page sheet, Forward reopens it, and dismissing a directly loaded `#credits` URL removes only that fragment while preserving the path and query.

Credits are deliberately complete and flat rather than searchable or collapsed. They follow manifest order, group exact duplicate statements within an activity, and show every selected image through a photo-slot label. Creator, source, exact license, and modification disclosure appear when known. When creator or license research is incomplete, the recorded source remains visible and the introduction explicitly avoids implying permission or endorsement.

`src/hooks/usePhotoAttributions.ts` fetches `photo-attributions.json` only while the sheet is requested and caches a validated catalog for later opens. Loading, failure, and retry are visible states. The public JSON-LD graph is separately advertised from `index.html`; neither generated file is hand-edited.

## Detail sheet and gallery

- Mobile sheets begin 60 px below the viewport top. The gallery is 270 px tall, the drag handle and text Close control are visible, and the X is hidden.
- At the 1000 px desktop breakpoint, the sheet becomes a full-viewport detail view. Its gallery grows to `clamp(460px, 58vh, 620px)`, the media container expands to the 1180 px page width, and copy stays capped at 760 px for readability.
- Desktop provides a sticky in-sheet toolbar with an X. Mobile keeps backdrop and text Close dismissal.
- The complete image is the forward control. Clicking or pressing it advances one photo and wraps to the first.
- The pills below the image are buttons that jump directly to any photo. Exactly one reports the active state.
- The Save control is layered above the image control and must not advance the gallery.
- Opening a different activity cannot inherit the previous activity's photo index.
- Opening a sheet pushes its activity fragment. Back closes it, Forward reopens it, and X, Escape, backdrop, and mobile Close share the same URL-aware dismissal path.
- A dated activity starts the fact grid with its full Date and trip year. Every sheet then shows When and Where, followed by one to four source-backed `facts` supplied by the activity. A `Worth knowing` advisory appears only when a caveat materially changes planning or expectations.

## Favorites and sharing

Favorites use the existing `naima.favs.v1` storage key. Both stored and shared IDs are validated against current activity IDs, deduplicated, and kept in insertion order. A present `#list=` hash takes precedence over local state and the validated result becomes the local list; malformed storage falls back to an empty list instead of breaking render.

The favorites sheet turns the saved list into three mutually exclusive planning groups. Dated events come first and sort globally by their ISO date key, including a visible semantic date tile. Undated activities with `ahead` guidance follow in save order, then every remaining favorite in save order. A dated activity appears only in Dated events even when it also needs advance booking. Empty groups are omitted, and the remaining group's visible heading is also omitted when every favorite falls into that one category; its semantic region label remains available to assistive technology.

Each saved row is a native `#activity-<id>` detail link across its thumbnail/date and copy area. Ordinary activation closes Favorites and opens that activity sheet; copied links and modified/new-tab activation remain native. The separate remove button never opens details. Desktop uses a contained panel while mobile retains the bottom sheet, and copy/share actions stay after the organized list.

**Copy as a message** copies a human-readable list of activity names and chapters. Success and failure have different labels and are announced through a polite status region; clipboard absence or rejection must never claim success.

Browsers that support the Web Share API for the exact payload receive the curved-arrow **Share favorites** control at every viewport. Its URL contains `#list=<activity-ids>` and preserves the current path and query. Unsupported browsers remain copy-only. Treat native share cancellation as expected; automated QA should stub the API rather than invoke the operating-system sheet.

The current production payload and origin passed a populated real-phone share-and-reopen test on 13 August 2026. Repeat that manual handoff when the payload structure or hosting origin changes.

Interactive controls use a shared high-contrast `:focus-visible` ring. Do not suppress it when adding a new card action, navigation control, or dialog button.

## Browser verification

Check at 390×844, 999×800, 1000×800, and 1440×900:

1. Confirm six hero slides and one complete seven-second progress/rotation cycle. Verify hover/focus/dialog freeze-and-resume, permanent stop after choosing both the active and a different pagination item, no separate Pause/Resume control, and no autoplay/progress under reduced motion.
2. Click the hero image, shade, title, and blurb; confirm each opens the active sheet once. Confirm Save, CTA, More, and pagination do not trigger the passive slide action and that closing a passive-opened sheet restores the More link.
3. Click passive surfaces in all standard, dated, and ahead card treatments; confirm the correct sheet opens at photo 1.
4. Click Save and every external-action shape; confirm they do not open a sheet.
5. Exercise chapter selection, fold/open all, Escape menu dismissal, and the book-ahead filter.
6. Confirm the 999/1000 px boundary changes from rounded bottom sheet to full-viewport details without horizontal overflow.
7. Click the left, center, and right of the gallery image; each click should advance exactly once.
8. Advance the six-image gallery through its last photo, confirm wrap, then jump backward and forward with pills.
9. Confirm gallery Save does not advance; test desktop X, Escape, backdrop, mobile Close, initial focus, scroll lock, and trigger-focus restoration.
10. Test favorites with valid, unknown, duplicate, malformed-storage, and empty-list inputs. Verify dated/book-ahead/everything-else grouping, chronological date order, native row links, independent removal, honest Copy success/failure, and capability-gated Share at every width.
11. Check keyboard navigation, visible focus, console output, final image loads, and centered crops.
12. Paste `#animals`, `#activity-rasalkhor`, and `#credits` into a fresh tab. Verify the owning chapter, direct-link focus fallback, exact URL, Back/Forward reopening, invalid-ID no-op, and unchanged `#list=` restoration.
13. Open Photo credits from the footer. Confirm the full 407-asset catalog is readable, external creator/source/license links are present, the loading/error states do not affect the guide, the sticky X and mobile bottom Close work, and focus returns to the footer link.

Finish with:

```sh
npm run check
npm run audit:photos
npm run audit:attributions
```

Repeat the populated real-phone native-share handoff before deployment whenever the payload or hosting origin changes.
