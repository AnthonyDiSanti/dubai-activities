# Site iconography

## Design source and scope

The approved handoff is retained intact in [branding/site-icons/README.md](branding/site-icons/README.md), alongside its SVGs, chapter preview, HTML design board, and board dependencies. The package was promoted from `.context/scratch/design_handoff_site_icons/`. Original exports retain their embedded provenance metadata; runtime components transcribe only drawing geometry, not the board runtime or large metadata payloads. These reference files are not copied into `dist/`.

This handoff supersedes the earlier scratch proposal for implemented placements. All twelve chapter headings are lit, not navigation-only. Activity content, branding favicons, the share arrow, `VerifiedStamp`, and the existing symmetric `CrossIcon` are unchanged.

Two source discrepancies are reconciled explicitly:

- `HeartIcon` uses the README's heavier 0.66 inner cutout (`M12 17.65`), also present as `i-heart-h` on the board, rather than the older 0.70 cutout in `ui/heart.svg`.
- The loud icon's sound-wave layer reads `--acg` to fulfill the handoff's glow contract; its export omitted that filter. Geometry is unchanged.

## Components and styling

- `src/components/HeartIcon.tsx`: 24-grid evenodd hollow ring or solid fill, shared outer edge. Hero 20px, photo cards/detail 18px, inline favorites 16px. Favorite-counter heart reuses the solid shape. All seven photo-disc treatments use ink at .72 and paper border at .3; existing boxes, positioning, blur, rose color and toggle semantics remain.
- `UiIcon.tsx`: 16-grid check, menu, arrow-right and filled arch chevron. Utilities use the existing 1.75 round stroke convention; the chevron has no stroke. Active filter/menu clearing reuses `CrossIcon`. Icons are decorative and never supply the accessible name.
- `ChapterIcon.tsx`: exact chapter geometry in a typed switch; each render uses `useId()` for private masks. Chapter keys alone are not sufficient IDs because sidebar, menu and section can coexist.
- `src/styles/icons.css`: sizes, neutral/hover/current colors, multi-hue accent maps, control alignment and chevron transforms. Loaded before `responsive.css` to preserve existing breakpoint overrides. Sidebar/mobile icon insets reserve 20px plus a 10px label gap without increasing row line height. Mobile labels follow the supplied 13px Karla spec. Section headings use 28px icons and a 14px baseline-aligned gap.
- Current navigation icons receive `data-lit="true"` from the same state that sets their links' `aria-current="location"`. Neutral bodies are paper at .62; hover/focus is paper without accents. Current icons are paper plus their accent layers. Section icons are always lit, including collapsed or empty sections. Archive outcome headings use the chevron but no invented chapter pictogram.
- Chapter glow is 2.5px in navigation and 3px in headings. Cooking uses cyan/pink; getgood uses pink/gold/cyan; all other mappings are in the source brief and CSS. Text colors remain independent of icon colors.

## Loading contract

`index.html` contains a real first-paint placeholder inside `#root`: inline L3 artwork, critical CSS, warm dotted ground, a 64px mark, and “Getting the guide ready…” in Space Mono. Its font URL is processed into a relative hashed Vite asset. React replaces this placeholder on mount; it does not wait for the complete photo collection or add a forced delay.

`HeroPhoto.tsx` owns only the active hero photo's readiness. The parent keys it by photo URL so a new slide starts independently. A 40px `SiteLoader` and “Loading photo…” appear over the existing striped placeholder while the image loads/decodes. Load and error listeners plus a `complete`/`naturalWidth` check handle already-cached success and failure. Decode rejection also ends the cue. Cleanup prevents a previous slide's decode promise from clearing the next slide's loader. Pending images are transparent until ready; no timer, percentage, or all-image gate is introduced. This gives honest feedback, not an asserted download-speed improvement.

`src/styles/loader.css` supplies the same critical rules embedded in the document. The 14/86 dash traces a pathLength=100 arch over 2.2 seconds; the tube stays at .35 opacity. Reduced motion disables the trace and parks it at -28.5; it also disables the chevron transition. If a future placement is smaller than 32px, set `--ld-glow: none` there; current uses are 40/64px.

The static-site audit permits inline styles only in the named `boot-loader-styles` block and the root placeholder SVG. It still rejects other inline styles, executable inline scripts and legacy runtime markup, and validates the built critical font URL alongside HTML asset references.

## Verification and maintenance

`Icons.test.tsx` compares all twelve drawings, utility paths and both loader copies with the retained exports, checks unique mask references, validates the heavier heart and guards critical-CSS parity. `HeroPhoto.test.tsx` covers load/error, cached success/failure, decode resolve/reject, Strict Mode and stale-slide completion. Navigation/section tests guard current-only navigation accents and always-lit collapsed empty headings; existing interaction tests retain toggle/routing coverage.

Run `npm run check`, `npm run audit:photos`, `npm run audit:attributions`, and `git diff --check`. Browser checks should cover 390, 999, 1000 and 1440px, favorite states, all chapter hues, mobile-menu visibility, unchanged ring/disc sizes, keyboard focus and no horizontal overflow. Compare the supplied chapter preview with the actual site. For slow-photo checks, use an isolated temporary test page rendering the real `HeroPhoto` and a localhost delayed-image response; remove both afterward. A static copy of the root placeholder can verify first paint without artificially delaying the production app.
