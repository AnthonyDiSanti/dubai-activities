# Handoff

## Current State
- What works: A Vite + React + strict-TypeScript implementation now owns activity data, domain rules, cards, dialogs, favorites, chapter navigation, countdown behavior, and responsive styles. React is a bundled dependency; `vite.config.ts` emits prefix-portable static output to `dist/` with `base: './'`.
- What works: Canonical photography now lives in `public/photos/`, which Vite copies unchanged to `dist/photos/`. The manifest, similarity, sourcing, and photo-count tools default to that path and `src/data/activities.ts`.
- What works: Every selected asset has a row in `docs/photo-attributions.csv`. The build publishes compact JSON for a lazy footer credits sheet and Schema.org JSON-LD for machines; `#credits`, Back/Forward, direct-link dismissal, retry, focus restoration, and responsive close controls are covered.
- What works: Content now spans 12 chapters, 124 activities, six hero slides, and 405 contiguous activity JPEGs. Dated entries retain chronological, maximally dispersed rendering; every dated sheet adds its full trip-year Date automatically, and dated styling wins when an item is also book-ahead.
- What works: Long dinners now includes OPA Dubai with a direct reservation route, source-backed planning facts, candid plate-allocation and timing caveats, and a four-image exact-venue gallery led by the plate-smashing experience.
- What works: Thirty-nine original activities now use selective source-backed facts and candid advisories for eligibility, timing, inclusions, booking terms, temporary status, or travel logistics. Terra Solis, the pre-arrival cyanotype session, and RAW's sold-out class were retired with their ten gallery assets instead of left as misleading watch-list cards.
- What works: Favorites preserve `naima.favs.v1` and `#list=` sharing while validating unknown, duplicate, and malformed input. The sheet separates chronological dated events, undated book-ahead activities, and flexible ideas; group headers appear only when at least two categories are populated. Saved rows link directly to their sheets while removal stays independent. Clipboard failures are represented honestly, native share remains capability-gated, and the production payload passed a populated real-phone share-and-reopen test.
- What works: Chapters and sheets have durable native fragments (`#animals`, `#activity-rasalkhor`). Main navigation and labeled activity destinations are real anchors; URL validation, direct loads, Back/Forward reopening, safe direct-link dismissal, invalid IDs, filter relaxation, and owning-chapter focus fallback are covered.
- What works: The hero's passive image, shade, and copy surfaces open the active sheet while Save and detail links remain independent. A three-pixel progress track is the single seven-second autoplay clock, freezes and resumes with hover/focus/dialog state, stops permanently after any pagination choice, and is omitted for reduced motion. The redundant Pause/Resume button is gone.
- What works: The arrival bar uses destination-calendar arithmetic in `Asia/Dubai`, so Thursday-to-Sunday remains three days throughout Dubai's Thursday regardless of the viewer's browser timezone. Date-only configuration avoids inventing a landing hour: Saturday says one day, Sunday says today, Monday reads “Tonight, it's you + me” as trip day 1, and Tuesday begins the visible numbered sequence at day 2.
- What works: Each chapter heading is a full-width native accordion button, so its title, open space, and arrow share one pointer target while retaining keyboard activation, focus visibility, and a persistent ARIA panel relationship.
- What works: The former `src/index.html`, `src/js/`, custom template language, runtime evaluator, global namespaces, and CDN boot dependencies are gone. Root `index.html` plus `src/main.tsx` is the only application entry point.
- What works: `npm run check` passes 179 tests, strict TypeScript, typed ESLint, the production build, content integrity, and static-output inspection. Photo audits pass all 435 manifest rows and 405 JPEGs with zero similarity candidates; strict attribution audit passes all 407 selected assets with no warnings.
- What works: Browser QA covers the established 390, 999, 1000, and 1440 px interaction gate. The current production pass confirms the arrival bar still reads “I land today” on the configured Dubai arrival date with zero horizontal overflow. Earlier live coverage confirms conditional Favorites headings, chronological date treatment, responsive sheets, saved-row navigation, and complete credits behavior.
- What works: Production is live at `https://dubai.anthonydisanti.com/` through stack `minisite-dubai-anthonydisanti-com-36364597` and CloudFront distribution `EU943ZSJ1FOAO`. The OPA release uploaded 436 objects, removed only the superseded JavaScript bundle, completed invalidation `I4KWEITBTS42VAXREN12WYAF89`, and serves byte-identical `index.html` and lead OPA photo with the expected MIME types. The live credit catalog contains all four OPA entries, and a fresh 432-object pre-release rollback snapshot remains at `/tmp/dubai-activities-production-backup.Bkguez/` for the current machine/session.
- What works: Canonical docs now describe the React source boundaries, interaction invariants, public-photo workflow, static build contract, S3/CloudFront deployment policy, and the 2026-08-11 primary-source ledger behind volatile planning facts.
- What works: Addendum 3 is implemented as the final `Fur, feathers and scales` chapter with nine new activities in conservation-first order: Ras Al Khor, Falcon Hospital, Turtle Rehabilitation, Platinum Heritage, Vibrissae, Camel Farm, Butterfly Garden, Meowtropolis, and Fluffin. Ras Al Khor replaces Balloon in the hero; Green Planet and SeaWorld remain in their previously reviewed chapters.
- What’s in progress: None. OPA is implementation-complete, fully verified, and deployed.
- What’s broken / flaky: None currently known. Some photos still have no documented reuse grant, which Anthony accepts for this private, noncommercial toy site; the public credits acknowledge creators or sources without claiming permission.

## Local Environment
- `AGENTS.local.md` records a machine-only npm workaround: prefix npm commands with `npm_config_cache=/tmp/dubai-activities-npm-cache` because the default cache contains root-owned files. Do not promote this override into shared setup documentation.

## Next Steps (ordered)
1. Run a rendered `#activity-opa` mobile/desktop smoke check when the in-app Browser surface is available; this release's byte, MIME, bundle-content, photo, and credit-catalog checks are complete.
2. Improve the Minisite release path to apply the documented per-path cache headers and retain old fingerprinted bundles until the new document has propagated.
3. Recheck volatile operating facts near the trip. Resolve Ossiano's conflicting live-site/partner-notice status, advance ARTE after 29 August, add Global Village's exact opening when published, and verify Formula Rossa plus Hatta/Jebel Jais operations.
4. After the September 5, 2026 ATB event, replace the deferred candid request if a strong attributable frame appears; reassess Ossiano's two deferred gallery requests once its operating status is unambiguous.

## Quick Verify
- Application gate: `npm run check`
- Content/assets: `npm run audit:content && npm run audit:photos && npm run audit:attributions`
- Post-build structure: `npm run audit:site` (also included after build in `npm run check`)
- Final hygiene: `git diff --check`

## Recent Updates (keep last ~15; prune older)
- 2026-08-20 — Codex (GPT-5) — Deployed the OPA addition, completed CloudFront invalidation `I4KWEITBTS42VAXREN12WYAF89`, and verified the live document, bundle, lead photo, MIME types, object inventory, and four credit entries.
- 2026-08-20 — Codex (GPT-5) — Verified OPA Dubai's active plate-smashing dinner experience, added a candid planning sheet and direct booking route, curated four exact-venue images, recorded full visible and machine-readable attribution, and passed the 179-test plus 435-row release gates.
- 2026-08-16 — Codex (GPT-5) — Deployed the reunion-day countdown, completed CloudFront invalidation, and verified the configured arrival-day label on production.
- 2026-08-16 — Codex (GPT-5) — Added a one-Dubai-day reunion message as trip day 1, with the visible numbered sequence beginning at day 2 on the following date.
- 2026-08-13 — Codex (GPT-5) — Deployed the single-group Favorites refinement, completed CloudFront invalidation, and verified both one- and three-category states on production.
- 2026-08-13 — Codex (GPT-5) — Suppressed the lone visible Favorites group header while retaining semantic region labeling and multi-group organization.
- 2026-08-13 — Codex (GPT-5) — Deployed the organized Favorites release, completed CloudFront invalidation, and passed byte-level, header, mobile, desktop, grouping, and detail-routing verification on production.
- 2026-08-13 — Codex (GPT-5) — Organized Favorites into chronological dated, book-ahead, and flexible groups; added native saved-item detail links; and recorded the successful real-phone share test.
- 2026-08-13 — Codex (GPT-5) — Deployed the complete photo-attribution release, completed CloudFront invalidation, and passed byte-level, MIME, catalog, routing, responsive, and console verification on production.
- 2026-08-13 — Codex (GPT-5) — Added complete visible and machine-readable photo attribution, a generated 403-row credit pipeline, durable `#credits` routing, strict coverage audits, and responsive browser QA.
- 2026-08-13 — Codex (GPT-5) — Deployed the hero, pagination-stop, and Dubai-countdown revision; completed invalidation and passed byte-level plus live interaction verification.
- 2026-08-13 — Codex (GPT-5) — Removed the hero Pause/Resume control and made every pagination choice stop autoplay for the current page.
- 2026-08-13 — Codex (GPT-5) — Replaced elapsed-hour arrival counting with explicit Dubai calendar dates and added timezone/midnight regression coverage.
- 2026-08-13 — Codex (GPT-5) — Made the full passive hero surface open its sheet and replaced the hidden interval with a visible, pause-aware progress clock.
- 2026-08-11 — Codex (GPT-5) — Deployed the verified 430-file build to `dubai.anthonydisanti.com`, completed CloudFront invalidation, and passed byte-level plus live deep-link smoke checks.
- 2026-08-11 — Codex (GPT-5) — Added native chapter and activity deep links with real anchors, browser-history synchronization, safe direct-sheet closing, focus fallback, and favorites-hash compatibility.
- 2026-08-11 — Codex (GPT-5) — Enriched 39 original sheets with selective planning detail, corrected stale dates/links/operations, retired three unavailable cards and ten assets, and added post-arrival/date-treatment regression gates.
- 2026-08-11 — Codex (GPT-5) — Published the final nine-card animal chapter, added 36 verified gallery images and structured planning detail, promoted Ras Al Khor into the hero, and completed the full automated plus rendered gate.
- 2026-08-11 — Codex (GPT-5) — Reviewed the wildlife addendum, verified the named venues and seasonal caveats, and recommended a curated 12th chapter rather than scattering animal-first activities.
- 2026-08-07 — Codex (GPT-5) — Expanded every chapter heading into one accessible full-width fold/open control and verified pointer activation across all responsive breakpoints.
- 2026-08-07 — Codex (GPT-5) — Completed the React/Vite cutover, removed the generated runtime and duplicate entry points, self-hosted fonts, and passed the full static plus four-viewport production gate.
- 2026-08-07 — Codex (GPT-5) — Superseded the custom component runtime with a build-time-only Vite, React, and strict-TypeScript architecture targeting static S3 output.
- 2026-08-07 — Codex (GPT-5) — Migrated photo tooling and canonical documentation to public assets, production build audits, and explicit S3/CloudFront delivery rules.
- 2026-08-07 — Codex (GPT-5) — Split the former no-build page into semantic CSS, application, data, and runtime assets as an intermediate migration step.
