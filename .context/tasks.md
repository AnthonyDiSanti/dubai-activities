# Tasks

- id: 2026-09-12-mimi-alacarte — title: Focus Mimi on à-la-carte dining — owner: Codex — status: done — last update: 2026-09-12
  - Scope: Remove Yūshoku promotion, preserve the restaurant and general booking details, record the ordinary prix-fixe dislike with tasting-menu exception, then publish the correction.
  - Result: All 265 app tests and four Python tests plus release/asset gates pass. Published 522 objects with only the old JavaScript bundle deleted; invalidation `I4GAQQYVNBKEYZLW340ZU0NOWS` completed. Live document/bundles match the build with correct headers; corrected sheet/CTA, no visible Yūshoku, dinner return and console checks pass. No staging or commit.

- id: 2026-09-12-mimi — title: Add and deploy Mimi Kakushi — owner: Codex — status: done — last update: 2026-09-12
  - Scope: Add the approved Japanese dinner candidate, source four venue photos, verify and publish Mimi plus the earlier tapas additions, then complete commit prep. No firsthand outcome inferred.
  - Evidence: Official July à-la-carte and June Yūshoku menus plus the live 12 September SevenRooms option details.
  - Verification: All 265 app tests and four Python tests; lint, TypeScript, build/content/static/photo/strict-attribution audits pass. Desktop/mobile sheet and gallery checks pass.
  - Release: Uploaded 522 objects, removed only the superseded JavaScript bundle, and completed invalidation `I1Q0PUPUV74LFT795QRBD9NW7C`. Sixteen live files match the build with expected headers; live cards, Mimi route/dismissal and console checks pass. Full dirty-tree commit prep complete; no index changes or commit.

- id: 2026-09-12-tapas — title: Add strong Spanish tapas dinners — owner: Codex — status: done — last update: 2026-09-12
  - Result: Added Lola Taberna Española and Salero with official planning evidence, booking routes and seven credited photos. Keep these researched candidates unverified; exclude closed BOCA and Jaleo.
  - Repair: Corrected Sirali’s pre-existing unquoted CSV comma; strict row-width checks and serialization before writes now prevent invalid attribution input from truncating reviewed credits. Four Python regressions are included in `npm run check`.
  - Verification: All 264 app tests and four Python tests pass; full lint/TypeScript/build/content/static/photo/similarity/strict-attribution checks pass. Desktop/mobile sheet and gallery QA confirms loaded photos, both visible search terms, dismissal to dinners, no BOCA card, no overflow and no console errors.
  - Release: Committed in `61e2a79`; published with the completed Mimi release. The earlier climbing work is committed in `f160b85`.

- id: 2026-09-12-climbing-review — title: Reject Mountain Extreme and refresh bouldering alternatives — owner: Codex — status: done — last update: 2026-09-12
  - Follow-up: Add literal climbing/bouldering wording to GoClimb and Rock Republic blurbs for browser Find. All five active/archive climbing records pass rendered-text checks across nine card treatments (45 renders); all 260 tests and full project/asset audits pass after the copy changes. Retain the requirement in the editorial guide.
  - Result: Archived Mountain Extreme with the firsthand setting/chalk/harness verdict and all four photos. GoClimb and Rock Republic already existed; refreshed their DIP 1 locations, practical details and carefully qualified powder-chalk caveats. Boulder Zone remains firsthand liked.
  - Verification: 110 targeted tests and all 260 full-suite tests pass, plus lint, TypeScript, production build, content/static/photo/attribution audits. Browser checks cover the full rejection note, archive return, mobile GoClimb details and Rock Republic sheet.
  - Environment: Preview and tsx audits needed approved execution outside the sandbox because local sockets returned EPERM. All gate stages passed; no verification bypass.
  - Release: Anthony requested deployment and commit prep. Published the unchanged build that passed all 260 tests and full audits; uploaded 511 objects, removed only `assets/index-B0LURyx6.js`, and completed invalidation `I2W0BZ19W4F2DK05UVE56AWIJP`. Live HTML/bundles, three climbing covers and both credit catalogs match the build and expected headers. Browser checks confirm both search terms on all five active/archive cards, Mountain Extreme under Rejected, its full note and return to `#archive`, with no errors. Committed in `f160b85`. Prior Nest/icon work is committed in `6c7991b`.
  - Links: `docs/content-editorial.md`, `docs/activity-planning-sources.md`, `src/data/archive.ts`

- id: 2026-09-09-nest-roof — title: Resolve Nara hero photo mismatch — owner: Codex — status: done — last update: 2026-09-09
  - Result: Confirmed fabric roof construction and a bathroom skylight; retained the accurate cover and corrected blurb, eyebrow, CTA, photo notes, source fragments and fixtures. Recorded primary-source evidence in `docs/activity-planning-sources.md`.
  - Verification: All 259 tests, lint, TypeScript, production build, content/static audits and photo/attribution audits pass. Desktop browser screenshot confirms updated hero copy and unchanged loaded cover. No interaction or image geometry changes; no new responsive gate needed.
  - Release: Deployed 511 objects and removed only `assets/index-DLGbdRZR.js`; invalidation `IIFCVOKM8SX16TKMTOJ0X3CFV` completed. Live HTML, app bundles, Nest cover and attribution catalogs match the build; corrected detail copy and dismissal to `#quiet` pass without console errors. Commit prep includes the existing icon work; index untouched and no commit performed.

- id: 2026-09-07-site-icons — title: Implement approved site icon system — owner: Codex — status: done — last update: 2026-09-07
  - Result: Implemented all twelve chapter icons, current/header accent states, unique per-instance masks, SVG favorite/utility glyphs, darker photo discs and L3 pre-mount/hero loaders. Preserved CrossIcon, share arrow, VerifiedStamp, content, favicon assets and event semantics.
  - Verification: 259 tests and full lint/TypeScript/build/content/static/photo/attribution gates pass. Source-geometry and loader-parity tests; load/error/cache/decode/stale-slide cases; current-only nav and always-lit empty headings. Visually checked supplied chapter preview, 390/1440px layouts, 999/1000px sheets in exact-width frames, and both loader sizes with a delayed real photo; no app console errors.
  - Notes: Browser viewport updates stopped applying reliably after multiple tabs; used isolated same-origin 999/1000px frames for the remaining boundary checks. Temporary QA fixtures and delayed server removed. A concurrent full-guide test timeout passed in isolation and subsequent complete runs without increasing timeouts.
  - Release: Deployed 511 objects; removed only the two superseded app bundles; completed invalidation `I9STWWDV0EXEFPH9EU8FQPVEPG`. Repeated the 259-test release gate and all audits; live HTML/bundles/font/identity/catalog checks match the build. Browser smoke tests cover chapter icons, settled hero loader, E-foil details, centered close control and return to the chapter with no errors.
  - Follow-up: None for release. Commit prep covers the full implementation plus supplied source package and related documentation; no staging or commit performed.
  - Links: `docs/iconography.md`, `docs/branding/site-icons/README.md`

- id: 01K4KA7D2V6N9T3M5R8QXZPFAB — title: Integrate updated favicon v3 — owner: Codex — status: done — last update: 2026-09-06
  - Result: Replaced six runtime images and five retained artwork/source exports with exact supplied v3 bytes; preserved supplier notes and refreshed regeneration guidance. Kept existing relative manifest/HTML links; promoted the scratch package without adding redundant small PNGs to public output.
  - Verification: 11 artwork hash matches, manifest PNG dimensions, 16/32/48 ICO frames, seven exact public-to-build asset matches and four document links. Full 232-test/lint/TypeScript/build/content/static gate passes. Visually inspected supplied 32 px and 512 px exports; no fresh browser check claimed.
  - Release: Uploaded 511 objects with no deletions and completed invalidation `IF3VPNJFCKUXDSB7FEG8X557B7`. Reran the full 232-test release gate and all asset audits. Live HTML/CSS/JavaScript plus seven identity assets match the build with correct MIME/cache headers; browser checks confirmed the dark-rim SVG and activity-to-chapter dismissal.
  - Follow-up: Earlier favicon/proposal work was committed before the September 7 icon-system implementation. No pending work remains for this release.
  - Links: `public/favicon.svg`, `docs/branding/favicon-source/README.md`, `docs/branding/favicon-source/supplied-v3-notes.md`

- id: 01K4K9D3V6N8T2M5R7QXZPFABC — title: Reconcile iconography proposal and assess visual density — owner: Codex — status: superseded — last update: 2026-09-07
  - Result: Expanded the scratch inventory against current components: Share, filter/menu clear states, archive chevrons, Fold all, retry/error and credits coverage; corrected duplicate and nonexistent targets; mapped all 12 chapter keys and suggested distinct visual concepts. Recommended quiet utility icons, navigation-first chapter placement, 22 Core IDs including reuse, and optional rather than universal ornamentation.
  - User direction: Include a loader for slow first loads. Added a Core brand-related loader with pre-mount/first-visible-media, route-aware readiness, cached/error/reduced-motion cases and no all-images blocking gate. Loading bottleneck has not been measured.
  - Verification: Source reconciliation, chapter mapping/count checks and diff hygiene only; no runtime files changed or app tests/deployment needed for the proposal review. No index management performed; subsequent staging belongs to the user.
  - Brief consolidation: At Anthony's request, v3 incorporates all recommendations in one document, including creative direction, visual hierarchy, exact source palette, state styling, placement limits, loader behavior, SVG delivery, pilot sequence and acceptance checks.
  - Follow-up: Superseded by the approved September 7 handoff and implemented site icon system; preserve this earlier proposal as design history.
  - Links: `.context/scratch/iconography.md`

- id: 01K4K8C2V5N7T9M3R6QXZPFABD — title: Make favorites guidance device-neutral — owner: Codex — status: done — last update: 2026-09-06
  - Result: Applied the approved populated note, shortened empty note, and “Choose the heart” empty guidance without changing persistence or sharing behavior. Eight focused favorites tests and the full 232-test/build/content/static/photo/attribution gates pass. Local screenshots and live checks cover both favorites states; test favorites were removed afterward.
  - Release: Uploaded 511 objects, removed only `assets/index-DNssmplY.js`, and completed invalidation `I8SG1PS3PTHOTIHAXFVF0W21VN`. Live HTML, bundles, and seven favicon assets match the build with correct MIME types; favorites/activity/chapter routes pass without console errors.
  - Follow-up: None; deployed and prepared for commit together with the existing favicon changes. Git index untouched.
  - Links: `src/components/FavoritesDialog.tsx`, `src/components/FavoritesDialog.test.tsx`, `docs/site-interactions.md`

- id: 01K4K7H9V2N6T8M3R5QXZPFBAC — title: Incorporate supplied favicon set — owner: Codex (GPT-6) — status: done — last update: 2026-09-06
  - Result: Added SVG/ICO favicons, Apple touch icon, and a relative-path manifest with standard and maskable Android icons. Preserved unused PNG exports and source artwork under `docs/branding/favicon-source/`, completing scratch promotion without discarding supplied files. Passed 232 tests, build/content/static audits, exact comparison of all seven deployed assets, and local browser metadata/SVG checks.
  - Release: Uploaded 511 objects with no deletions after one transient connection-reset retry; completed invalidation `IEQ86COWDSR2HBAPSQ6CI1R5OM`. All release gates pass; live HTML, seven identity assets, CSS, and JavaScript match the tested build with correct MIME types. Production browser metadata, SVG rendering, Ras Al Khor sheet, and animals chapter checks pass with no console errors.
  - Follow-up: None; deployed and prepared for commit with the Git index untouched. No service worker or offline behavior was added.
  - Links: `index.html`, `public/site.webmanifest`, `docs/architecture.md`, `docs/branding/favicon-source/README.md`

- id: 01K4JC8R6V2N9T5M3H7QXZPFAB — title: Center sheet close icons — owner: Codex (GPT-5) — status: done — last update: 2026-09-06
  - Goal: Correct the visibly off-center desktop sheet X and eliminate the same font-metric risk from every circular cross control.
  - Result: Replaced the literal `×` in activity, archive, credits, favorites, and favorite-row removal buttons with one symmetric 16×16 SVG component; centered that fixed geometry through the existing grid containers; retained per-context sizing through one CSS custom property; and added regression assertions that the controls use the shared icon rather than text. The 26 focused dialog tests and complete 232-test/build/content/static-output gate pass. Anthony approved the 1440 px activity rendering; a fresh browser pass then confirmed activity, archive, credits, favorites, and row-removal crosses visually centered with measured 0 px center offsets at 1440 px, preserved exact centering at the 1000 px boundary, and correctly switched to the text Close treatment at 999 px without browser errors.
  - Release: Published 504 objects, removed the two superseded CSS/JavaScript bundles, and completed invalidation `IB8PQMV4IRCX823TV63L57LOST`. Live HTML/CSS/JavaScript match the tested build; production activity/chapter routes pass without console errors and the desktop X remains exactly centered.
  - Follow-up: None; deployed and prepared for commit with the Git index untouched.
  - Links: `src/components/CrossIcon.tsx`, `src/components/ActivityDialog.tsx`, `src/components/ArchiveDialog.tsx`, `src/components/CreditsDialog.tsx`, `src/components/FavoritesDialog.tsx`, `src/styles/tokens-base.css`, `src/styles/dialogs.css`, `src/styles/responsive.css`, `docs/site-interactions.md`

- id: 01K4JB7N3V9R2T6M5H8QXZPFAC — title: Record Lock, Stock & Barrel as tried — owner: Codex (GPT-5) — status: done — last update: 2026-09-06
  - Goal: Confirm whether Lock, Stock & Barrel already exists, then preserve Anthony's mixed firsthand verdict under Tried without promoting it to Tried & liked.
  - Result: Confirmed the venue was absent from the maintained guide and archive; recorded the visited Business Bay branch under Tried with its fun atmosphere, very small dance floor, moderately mingle-friendly crowd, and fun-but-not-great outcome; kept Barsha Heights and JBR outside the verdict; and added a current Renaissance Business Bay sheet with four exact-branch photographs and complete credits. Passed 232 tests, 503 manifest rows, 473 JPEGs, 475 attribution records, and zero similarity candidates. Deployed 504 objects, deleted only `assets/index-DNv7m_MX.js`, completed invalidation `I7SXN3OG8S2TKHNHIOG8NCPLSD`, and verified byte-identical live HTML, CSS, JavaScript, attribution catalogs, and all four gallery images with correct MIME types and a 504-object inventory.
  - Follow-up: Run the 390/1440 px Business Bay archive card and sheet pass when Browser reconnects.
  - Links: `src/data/archive.ts`, `src/data/archive.test.ts`, `src/components/ArchiveDialog.test.tsx`, `docs/content-editorial.md`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K4J8R6N3V9T2M5H7QXZPFBAC — title: Publish recurring and one-off improv — owner: Codex (GPT-5) — status: done — last update: 2026-09-06
  - Goal: Make the existing Courtyard Playhouse recommendation actionable and add Karak After Dark Vol. 3 as a distinct dated improv option, then publish the complete pending release.
  - Result: Enhanced Courtyard with its Monday `This Is Impro & Sing It` and Wednesday audience-scored `Maestro` formats, current September dates, free guest-list caveat, and separate early-arrival rules; added the 10 September Karak mixed bill with AED 89, 19:30 doors, age 10+, first-come seating, late-entry/refund/refreshment constraints, and two current exact-event or exact-venue images with complete credits. Passed 231 tests, 499 manifest rows, 469 JPEGs, 471 attribution records, and zero similarity candidates. Deployed 500 objects, deleted only `assets/index-TF43YLLF.js`, completed invalidation `IEMMFCM54CUHQR2SUZZEJ02FN6`, and verified byte-identical live HTML, CSS, JavaScript, credits, and both new images with correct MIME types.
  - Follow-up: Advance or retire the September comedy dates after they pass, and run the 390/1440 px card and gallery pass when Browser reconnects; the current host rejects its trusted service path before discovery.
  - Links: `src/data/activities.ts`, `src/data/activities.test.ts`, `docs/content-editorial.md`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K4J7C9N2V6T8M3H5QXZPRFBA — title: Add scarce stand-up options — owner: Codex (GPT-5) — status: done — last update: 2026-09-06
  - Goal: Add Joke Hub, Comedy at the Speakeasy, and The Laughter Factory as complementary small-room stand-up choices, then identify the strongest current improv options without publishing an unchosen candidate.
  - Result: Added a weekly purpose-built club, a selected-Sunday speakeasy room, and a short touring run with current dates, prices, admission constraints, booking routes, and six exact-room or exact-event photographs; generated complete visible and machine-readable credits; and passed 228 tests, 497 manifest rows, 467 JPEGs, 469 attribution records, and zero similarity candidates. The improv scan confirmed the existing Courtyard Playhouse card as Dubai's dependable weekly choice and identified the 10 September Karak After Dark Vol. 3 mixed bill as the strongest current one-off; Dubomedy's public calendar was too ambiguous for another card.
  - Follow-up: Advance or retire the dated stand-up entries after their shows, refresh Joke Hub's Saturday list, and run rendered card/gallery QA when Browser reconnects. The complete release was deployed with the later improv work.
  - Links: `src/data/activities.ts`, `src/data/activities.test.ts`, `docs/content-editorial.md`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K4J2V8N6R3T9M5H7QXZPFBAC — title: Add distinct karting options — owner: Codex (GPT-5) — status: done — last update: 2026-09-06
  - Goal: Add Dubai Kartdrome Outdoor and No Grip DXB without duplicating the projected-game role already filled by Chaos Karts.
  - Result: Added Kartdrome high in Adrenaline as the proper 1.2-kilometre lap-racing choice and No Grip later as the two-level drift-control choice; recorded current pricing, session, eligibility, schedule, booking, and safety details; curated four differentiated exact-venue photographs for each with complete visible and machine-readable credits; and passed 224 tests, 491 manifest rows, 461 JPEGs, 463 attribution records, and zero similarity candidates. Fresh rendered QA could not start because the in-app Browser rejected its trusted plugin path before navigation.
  - Follow-up: Run the 390/1440 px card and gallery pass when Browser reconnects. The complete release was deployed with the later improv work.
  - Links: `src/data/activities.ts`, `docs/content-editorial.md`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K4C2S8N6V3T9M5H7QXZPRFBA — title: Add Sirali Dubai — owner: Codex (GPT-5) — status: done — last update: 2026-09-02
  - Goal: Add the strongest current Turkish dinner recommendation after comparing Sirali with CZN Burak.
  - Result: Chose Sirali as the food-first Turkish pick; added current Meera Tower hours, direct OpenTable booking, rolled Adana guidance, FACT's 2025 Best Turkish recognition, and a caveat to reconfirm changeable Friday entertainment; curated four differentiated exact-venue photographs with complete visible and machine-readable credits; and passed 221 tests, 483 manifest rows, 453 JPEGs, 455 attribution records, and zero similarity candidates. Deployed 484 objects, deleted only superseded bundle `assets/index-DLSL8ZhC.js`, completed invalidation `IEET7PO1OX3DNSECPRI9SSMCKW`, and verified byte-identical production HTML, CSS, JavaScript, attribution catalogs, and all four Sirali images with correct MIME types. The in-app Browser rejected its trusted plugin path before navigation, so fresh responsive rendering remains unverified.
  - Follow-up: Reconfirm Friday entertainment when booking and run the 390/1440 px card and gallery pass when Browser reconnects.
  - Links: `src/data/activities.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K41B7R9M2V6T8N4H3QXZPFAC — title: Add Nammos Dubai — owner: Codex (GPT-5) — status: done — last update: 2026-08-30
  - Goal: Add Nammos to the restaurant recommendations with useful current planning context and a complete venue-specific gallery.
  - Result: Added Nammos Dubai to Long dinners as a restaurant-first beach afternoon; recorded the official restaurant, lounge, and beach hours plus direct SevenRooms booking; curated four current exact-venue Four Seasons photographs with complete visible and machine-readable source credits; and passed 221 tests, 479 manifest rows, 449 JPEGs, 451 attribution records, and zero similarity candidates. Deployed 480 objects, deleted only superseded bundle `assets/index-XPKjBv6y.js`, completed invalidation `I9SURPEHQWHAQQPV0KBUZ1E64Z`, and verified byte-identical production HTML, CSS, JavaScript, attribution JSON, and all four Nammos images. The in-app Browser rejected its trusted service dependency before navigation, so fresh responsive rendering remains unverified.
  - Follow-up: Run the 390/1440 px card and gallery pass when Browser reconnects.
  - Links: `src/data/activities.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K416R8N3V7T2C9H5M1QXZPFA — title: Deep-link archive outcome summaries — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Turn each archive summary count into a durable shortcut that reveals only its matching outcome section.
  - Result: Added exact `#archive-verified`, `#archive-tried`, and `#archive-rejected` routes; converted all three count tiles to keyboard-accessible native links with current-location styling; isolated and aligned the selected group on clicks, direct loads, Forward, and activity-sheet return; and retained one-step archive dismissal by replacing the current archive entry. Passed 219 tests, the complete build/content/photo/attribution gates, and 390/1440 px rendered QA with correct group/card counts, zero overflow, and no broken images. Deployed 476 objects, removed only the two superseded bundles, completed invalidation `IELRHRC6T3YW5BOEV0X1MZV1U4`, and verified byte-identical live HTML, CSS, and JavaScript plus both production routes.
  - Follow-up: None.
  - Links: `src/domain/deepLinks.ts`, `src/hooks/useDeepLink.ts`, `src/components/ArchiveDialog.tsx`, `docs/site-interactions.md`

- id: 01K414V8N6R2T9C3H7M5QXZPFA — title: Correct verified venue planning friction — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Make BLU and Amazónico's planning treatment reflect firsthand reality rather than generic advance-booking assumptions.
  - Result: Removed both venues from Plan ahead; made BLU explicitly walk-in friendly with no reservation action and clarified that complimentary tables and bottles target women; retained Amazónico's direct dinner reservation route while noting that a same-day booking worked. Added regression coverage and durable editorial guidance, passed 208 tests plus the 475-row/445-JPEG/447-credit gates, and verified the 36-result Plan ahead filter and both sheets without broken images or overflow at 390 and 1440 px. Deployed 476 objects, deleted only `assets/index-BoLW4PeZ.js`, completed invalidation `IEL97K4CS8PZN1OFM8QCTU9K5J`, and verified byte-identical live HTML/JavaScript plus the production interactions.
  - Follow-up: None.
  - Links: `src/data/activities.ts`, `src/data/activities.test.ts`, `docs/content-editorial.md`, `docs/activity-planning-sources.md`, `docs/site-interactions.md`

- id: 01K410P7M3V9R2T6C8H5QXZBFD — title: Reject The Pods — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Remove The Pods from current recommendations while preserving the decision and all useful planning, photographic, and attribution context.
  - Result: Moved The Pods out of Long dinners and into the fifth Rejected record; stated explicitly that the decision preceded a visit; retained its complete three-photo archive sheet and source credits; generalized the archive framing from exclusively firsthand notes to tried-and-decided outcomes; and guarded the ID from later reintroduction. Passed 208 tests, 475 manifest rows, 445 JPEGs, 447 strict credits, zero similarity candidates, and 390/1440 px browser checks including all three live gallery frames. Deployed 476 objects, deleted only superseded bundle `assets/index-DsiTu_nl.js`, completed invalidation `IBER4ELPDGDIJCVB4YWR8NL0QW`, and verified byte-identical production HTML and JavaScript plus the 476-object inventory.
  - Follow-up: None.
  - Links: `src/data/archive.ts`, `src/data/activities.ts`, `docs/content-editorial.md`, `docs/activity-planning-sources.md`

- id: 01K40Z8N6V2M9T5C3H7Q1XPRAX — title: Add Amritsr Al Karama — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Add the strongest Dubai branch of Anthony's favorite Indian restaurant while keeping cross-market confidence separate from a firsthand local verdict.
  - Result: Chose the established Al Karama branch that Amritsr foregrounds on its main site; added a complete Long dinners card and sheet with branch contacts, menu guidance, explicit Dubai uncertainty, and the conflicting breakfast-start caveat; curated two exact-branch interiors plus two official UAE food images with full visible and machine-readable source credits. The full release passed 208 tests, 475 manifest rows, 445 JPEGs, 447 strict credits, zero similarity candidates, and 390/1440 px Browser QA. Deployed 476 objects, deleted only superseded bundle `assets/index-BLYAGV0B.js`, completed invalidation `I24GPFFAI1SVQ3Y6OWS1N21L7R`, and verified byte-identical production HTML plus the live sheet, lead image, and all four credits.
  - Follow-up: Confirm the early-breakfast start before going; after a Dubai visit, add a firsthand outcome without assuming it from the Bangkok favorite.
  - Links: `src/data/activities.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K40V7N3M8R2T6C9H5Q1XZPFA — title: Add verified BLU Dubai night — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Preserve the successful 40th-birthday club visit as an honest active recommendation with complete planning, archive, and photographic context.
  - Result: Added BLU Dubai high in Nights that go loud and Tried & liked; recorded the Thursday 27 Aug birthday memory, strong crowd balance, complimentary ladies' tables and bottles, solid vibe, and compact bar-ring dance area; added source-backed 21+/hours/dress/reservation guidance and four differentiated official gallery images with complete visible and machine-readable credits. Passed 206 tests, 471 manifest rows, 441 JPEGs, 443 strict credits, zero similarity candidates, and 390/1440 px Browser QA across the sheet, all four photos, the six-card verified filter, and the 13-card archive with no overflow or site-origin console issue.
  - Follow-up: Confirm the current Thursday ladies' arrangement when booking because BLU does not publish it as a permanent offer.
  - Links: `src/data/activities.ts`, `src/data/archive.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K40Q8N6V2M9T5C3H7R1XZPFA — title: Record latest firsthand outcomes — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Promote the latest positive visits accurately, remove Dubai Mall shopping without overgeneralizing the rejection, and retain full planning and photographic context.
  - Result: Marked Brass Monkey, Amazónico, and Ting Irie Tried & liked; reframed Brass Monkey as a fun interactive-game date rather than a deep American-style Barcade; added complete source-backed Amazónico and Ting Irie cards/sheets with eight official images and full credits; and moved Fashion Avenue to a shopping-only Rejected archive record while preserving three active broad-shopping alternatives. Passed 204 tests, 467 manifest rows, 437 JPEGs, 439 strict credits, zero similarity candidates, and 390/1440 px Browser QA with all new sheets/galleries loading and no overflow or site-origin console issues.
  - Follow-up: None.
  - Links: `src/data/activities.ts`, `src/data/archive.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

- id: 01K40H7M2R9V5T1C8Q6N3XZPFA — title: Expand the Plan ahead filter — owner: Codex (GPT-5) — status: done — last update: 2026-08-29
  - Goal: Surface dated events alongside explicit book-ahead activities in the guide's top planning filter.
  - Result: Replaced the narrow Book ahead mode with Plan ahead, backed it with a shared dated-or-`ahead` predicate, retained mutual exclusion with Tried & liked, and left the Favorites sheet's separate Dated events and Book ahead groups intact. Passed 199 tests, the complete build/content/photo/attribution gates, and responsive 390/1440 px Browser QA with 36 qualifying activities across 11 chapters, chronological nightlife dates, no horizontal overflow, and no site-origin console issues.
  - Follow-up: None.
  - Links: `src/domain/activity.ts`, `src/App.tsx`, `src/components/ChapterNavigation.tsx`, `docs/site-interactions.md`

- id: 01K3V6N8R2M5T9C4H7Q1X0ZPFD — title: Add adult arcade nights — owner: Codex (GPT-5) — status: done — last update: 2026-08-27
  - Goal: Add the strongest Dubai arcade nights that combine worthwhile games with a licensed adult atmosphere.
  - Result: Added Brass Monkey City Walk and Triple 777 Business Bay to Nights that go loud with distinct positioning, source-backed facts, candid planning gaps, and four exact-venue photographs each. Preserved the chapter's chronological date order and ideal alternating date-card spacing, generated visible and machine-readable credits for all eight assets, and enforced Wavehouse and BOOM Battle Bar as screened-out choices. Passed 198 tests, 459 manifest rows, 429 JPEGs, 431 strict credit rows, zero similarity candidates, and responsive browser QA. Deployed 460 objects, deleted only superseded bundle `assets/index-B0f5ZSJP.js`, completed invalidation `IE40M3IB98955FJTVG15JEWZGN`, and verified byte-identical live build/catalog/gallery assets plus both production sheets.
  - Follow-up: Recheck Brass Monkey's live closing time and Triple 777's Fun Pass price before visiting.
  - Links: `src/data/activities.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`

Task IDs are ULIDs; keep titles short and human-readable.

## Active
- None

## Paused / Blocked
- None

## Completed (recent; keep last ~10)
- id: 01K3M8R5V2N7T9H4C1X0ZPQABD — title: Remove personalized trip framing — owner: Codex (GPT-5) — status: done — last update: 2026-08-25
  - Goal: Remove the trip-day counter and person-specific naming while preserving the guide's activity, archive, routing, and sharing functionality.
  - Result: Removed the entire arrival banner plus its hook/domain/styles/tests, changed the document and page title to `Dubai activities`, renamed favorites and history namespaces, neutralized the attribution user agent, and added static-output regression checks. The full gate passes 193 tests with clean content/photo/attribution audits. Deployed 452 objects, deleted only two superseded bundles, completed invalidation `IDUDYLBLPP4X5W9KYBK9DYY9QN`, and verified byte-identical live HTML/JS/CSS with the retired strings absent.
  - Follow-up: Existing favorites under the retired browser-local key intentionally do not migrate; shared `#list=` URLs remain compatible. Run the rendered top-of-page check once a Browser backend reconnects.
  - Links: `src/App.tsx`, `src/hooks/useFavorites.ts`, `scripts/audit-site-structure.ts`, `docs/site-interactions.md`
- id: 01K3DGW5R8M2V7N4H9C1X0ZPQA — title: Verify the Soho Garden complex — owner: Codex (GPT-5) — status: done — last update: 2026-08-23
  - Goal: Preserve the positive Soho Garden visit while accurately distinguishing the full three-venue activity from what was open that night.
  - Result: Marked Soho Garden, HIVE and CODE as Tried & liked, kept the combined activity active, and recorded that only SOHO Garden was experienced and delivered solid warehouse-party energy while HIVE and CODE remain untested. Updated archive, filter, sheet, and browser-check expectations; the 213-test full gate and content/photo/attribution audits pass. Deployed 452 objects, deleted only the superseded JavaScript bundle, completed invalidation `I6PVQ29YU8QJH1D7WB5ONBI4XX`, and verified byte-identical live HTML and JavaScript containing the scoped visit note.
  - Follow-up: Judge HIVE and CODE separately if a future visit produces a different firsthand outcome.
  - Links: `src/data/archive.ts`, `src/App.test.tsx`, `docs/site-interactions.md`
- id: 01K3DBR8M5V2T7N9H4C1X0ZPQA — title: Correct the Brunch & Cake branch — owner: Codex (GPT-5) — status: done — last update: 2026-08-23
  - Goal: Correct the archive's firsthand provenance without weakening Anthony's chain-wide rejection.
  - Result: Replaced Wasl 51 copy, hours, link, source ledger, and four-photo gallery with exact Jumeirah Islands Pavilion material; made the verdict explicitly apply to the entire Brunch & Cake chain; added a regression test separating branch provenance from outcome scope. Passed the 212-test full gate plus photo/attribution audits. Deployed 452 objects, deleted only one superseded JavaScript bundle, completed invalidation `I21171JOHBT6JFX4FOWTPFSGS9`, and verified byte-identical live HTML, attribution data, and all four corrected images.
  - Follow-up: None.
  - Links: `src/data/archive.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`
- id: 01K3D8Q6M2V9T4N7H1C5X0ZPRA — title: Unify and complete the archive — owner: Codex (GPT-5) — status: done — last update: 2026-08-23
  - Goal: Make the firsthand archive feel like the main guide, keep outcome text from flattening every preview, complete missing venue galleries, and preserve the existing sheet/history behavior.
  - Result: Reused all nine shared activity-card treatments inside three independently collapsible archive groups, applied the same thumbs-up image stamp to Boulder Zone, moved verdict copy into full sheets, and gave Roberto's, Salmon Guru, and Brunch & Cake four differentiated sourced images each. Passed 211 tests, 451 manifest rows, 421 JPEGs, 423 strict credit rows, and zero similarity candidates. Deployed 452 objects, deleted only two superseded bundles, completed invalidation `ID8K6QDD1ZNTU03VTA01YGCKF2`, and verified byte-identical live HTML/catalog data plus all new lead images.
  - Follow-up: Reconnect or restart the Codex desktop Browser capability and run the 390/1440 px rendered archive pass. The Browser client and localhost policy are valid, but the current host session advertises zero browser backends.
  - Links: `src/components/ArchiveDialog.tsx`, `src/components/ActivityCard.tsx`, `src/data/archive.ts`, `docs/site-interactions.md`
- id: 01K3D4A7R9M2V6T8N1H5X0ZQPC — title: Expand archive outcomes into full sheets — owner: Codex (GPT-5) — status: done — last update: 2026-08-23
  - Goal: Make Tried & decided as useful to browse as the live guide while keeping inactive outcomes out of recommendations and favorites.
  - Result: Replaced the text ledger with responsive outcome cards and durable activity links, added full firsthand verdict sheets for all seven records, restored the credited The Wall, Meowtropolis, and Butterfly Garden galleries, and gave Roberto's, Salmon Guru, and Brunch & Cake honest typographic no-photo records. Direct inactive links close to `#archive`; in-page sheets use Back; archive IDs remain excluded from favorites and the main guide. Passed 209 tests, 439 manifest rows, 409 JPEGs, 411 attribution rows, and zero similarity candidates. Deployed 440 objects, deleted only two superseded bundles, completed invalidation `I3IFR39M6SNQWSH76GIFX6DDX7`, and verified byte-identical live HTML/catalogs plus restored photo responses.
  - Follow-up: Run the 390/1440 px archive-card and photo/no-photo sheet pass when a controllable browser is connected. Roll back from `/tmp/dubai-activities-production-backup.cssH1B/` if needed during the current machine session.
  - Links: `src/data/archive.ts`, `src/components/ArchiveDialog.tsx`, `src/components/ActivityDialog.tsx`, `docs/site-interactions.md`
- id: 01K3CF2M8R7V1N5Q9T4H6X0ZPD — title: Expand firsthand outcomes — owner: Codex (GPT-5) — status: done — last update: 2026-08-23
  - Goal: Preserve merely okay visits separately from recommendations and rejections, while applying Anthony's latest firsthand decisions to the live guide.
  - Result: Added a three-group `#archive` with Tried & liked, Tried, and Rejected outcomes. Moved Meowtropolis to Tried; added Roberto's and Salmon Guru there; added Brunch & Cake and Butterfly Garden to Rejected; removed Meowtropolis and Butterfly Garden from active content plus their eight galleries, manifest/credit rows, and active sourcing fragments. Passed 203 tests, 429 manifest rows, 399 JPEGs, 401 strict credit rows, and zero similarity candidates. Deployed 430 objects, removed only the two superseded bundles and eight intended galleries, completed invalidation `I425QARG64EHJ9EF2BIMQPJ0IV`, and verified byte-identical live bundles/catalogs plus retired-path removal.
  - Follow-up: Run the 390/1440 px archive layout pass when a controllable browser is connected. Roll back from `/tmp/dubai-activities-production-backup.W0mDdM/` if needed during the current machine session.
  - Links: `src/data/archive.ts`, `src/components/ArchiveDialog.tsx`, `docs/site-interactions.md`, `docs/activity-planning-sources.md`
- id: 01K3C7W4M8Q2R6V9N5H1T0XZPD — title: Add Boomah Owl Café — owner: Codex (GPT-5) — status: done — last update: 2026-08-23
  - Goal: Verify the rumored UAE owl café and add it only if the venue is current, distinctive, and represented candidly enough to plan responsibly.
  - Result: Confirmed that the substantiated live-owl venue is Boomah at Al Seef Village Mall in Abu Dhabi, not Dubai. Added a standard animal card with current hours/contact, an unpublished live owl-room price, observation-only guidance, and an explicit welfare caveat separating operator claims from criticism. Curated four exact-venue images, added complete manifest and source-level attribution records, and passed 203 tests, 437 manifest rows, 407 JPEGs, 409 strict credit rows, and zero similarity candidates. Deployed 438 objects, deleted only the superseded JavaScript bundle, completed invalidation `IEW4D0NJEX4GP75Y9IIJB6MCG1`, and verified the live document, bundle, credit catalog, and gallery bytes.
  - Follow-up: Run the 390/1440 px rendered card/sheet pass when a controllable browser is connected; no browser was available on 23 Aug. Recheck the live entry price by phone before making the Abu Dhabi drive.
  - Links: `src/data/activities.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`
- id: 01K38H2M7C4V9N1Q6T5J3X8ZPD — title: Canonicalize the all-open guide — owner: Codex (GPT-5) — status: done — last update: 2026-08-22
  - Goal: Make Open everything produce a copyable URL that reloads the same default all-chapters-open view while matching the guide's existing history behavior.
  - Result: Added explicit `#everything` parsing and navigation that preserves path/query and foreign history state, restores all chapters on direct load or Back/Forward traversal, avoids duplicate entries at the same route, and leaves filter changes out of navigation history. The full gate passes 202 tests. Deployed 434 objects, deleted only the superseded JavaScript bundle, completed invalidation `I4NQH86Z7MYU9BCUPWR9CP4LCV`, and verified byte-identical live HTML and JavaScript plus the route string in production.
  - Follow-up: Run the production Back/Forward interaction check when a controllable browser is connected. Roll back from `/tmp/dubai-activities-production-backup.qzvAgr/` if needed during the current machine session.
  - Links: `src/hooks/useDeepLink.ts`, `src/App.tsx`, `docs/site-interactions.md`
- id: 01K38D7M4C7V2N9Q5T1H3J6XZD — title: Track firsthand activity outcomes — owner: Codex (GPT-5) — status: done — last update: 2026-08-22
  - Goal: Remove The Wall permanently after a negative visit, preserve that decision for future curation, and make the positively experienced Boulder Zone visible and filterable without removing it from the guide.
  - Result: Added the browsable `#archive` Tried & decided ledger, retired The Wall plus its two public/manifest/attribution assets, marked Boulder Zone with an image-contained thumbs-up stamp and a textual sheet callout, added a mutually exclusive Tried & liked filter, and enforced rejected/verified invariants in the content audit. Follow-ups make every Book ahead or Tried & liked filter change reopen all chapters and keep the card marker from consuming or overlapping grid space. The full gate passes 197 tests with 123 activities, 403 JPEGs, 433 manifest rows, and 405 attribution rows. The final release uploaded 434 objects, deleted only two superseded bundles, completed invalidation `I53QJD3WHO0FFMPG2IM4WZ6L49`, and verified byte-identical live HTML, bundles, attribution catalog, current Boulder media, and retired Wall media status.
  - Follow-up: Run the 390/1440 px rendered filter/archive/stamp check when a controllable browser is connected; the browser surface was unavailable on 22 Aug. Roll back from `/tmp/dubai-activities-production-backup.9fRz1T/` if needed during the current machine session.
  - Links: `src/data/archive.ts`, `src/components/ArchiveDialog.tsx`, `src/components/ChapterNavigation.tsx`, `docs/site-interactions.md`
- id: 01K35R8M4C7V2N9Q5T1H3J6XZD — title: Add OPA plate-smashing dinner — owner: Codex (GPT-5) — status: done — last update: 2026-08-20
  - Goal: Verify the rumored Greek plate-smashing dinner and add it only if the current venue, experience, booking path, and photography hold up.
  - Result: Confirmed OPA Dubai at Fairmont Dubai, added it to Long dinners with a direct reservation link and honest plate-allocation/timing caveats, curated four exact-venue images led by the smashing moment, added complete source/creator attribution, and passed 179 tests plus the 435-row photo and 407-row attribution gates. Deployed 436 objects, removed only the superseded JavaScript bundle, completed invalidation `I4KWEITBTS42VAXREN12WYAF89`, and verified byte-identical live assets plus all four public credit entries.
  - Follow-up: Confirm the live entertainment time, included plate quantity, and any extra-stack price when reserving.
  - Links: `src/data/activities.ts`, `docs/activity-planning-sources.md`, `docs/image-manifest.csv`, `docs/photo-attributions.csv`
- id: 01K2Q9M4R7V1N5T8C3H6X0ZPFD — title: Organize saved activities — owner: Codex (GPT-5) — status: done — last update: 2026-08-13
  - Goal: Turn the Favorites sheet into a more useful planning view without changing persistence or sharing contracts.
  - Result: Added chronological dated events with semantic date tiles, separate book-ahead and flexible groups, save-order preservation, native detail links, independent removal, and responsive panel styling. Group headers appear only when at least two categories are populated. Passed the 173-test full gate, deployed 432 objects, completed invalidation `I7HKUQGJBQIWLAFLOVOPP8B7HT`, and verified both single- and multi-category states on production.
  - Links: `src/domain/favorites.ts`, `src/components/FavoritesDialog.tsx`, `docs/site-interactions.md`
- id: 01K2Q4F8N6M1R9T3V7C5H0XZPD — title: Publish complete photo attribution — owner: Codex (GPT-5) — status: done — last update: 2026-08-13
  - Goal: Credit every selected photo visibly and in machine-readable form without turning reuse permission into a deployment gate for the private guide.
  - Result: Added a reviewed 403-row attribution ledger, exact Commons and stock-license metadata, honest creator/source fallbacks, generated compact JSON and JSON-LD, a lazy `#credits` footer sheet, structural audits, 169-test coverage, and responsive rendered QA. Deployed the 432-object build, completed invalidation `I23VTL008EGCX8UOQ0TL261VK3`, and verified byte-identical live data plus mobile/desktop interaction health.
  - Follow-up: Run attribution sync whenever selected manifest rows change; refresh open-license metadata when sources or licenses are rechecked.
  - Links: `docs/photo-attributions.csv`, `scripts/photo-attributions.py`, `src/components/CreditsDialog.tsx`, `docs/photo-assets.md`
- id: 01K2PC8N5R1T7V4Q9H3M6X0ZFD — title: Deploy hero and countdown revision — owner: Codex (GPT-5) — status: done — last update: 2026-08-13
  - Goal: Publish every current hero and countdown change to the existing static production target with a verified rollback path.
  - Result: Captured a fresh 430-object rollback snapshot, passed the 156-test application and 431-row photo gates, uploaded 430 objects, removed only two superseded bundles, completed invalidation `IAJXSIZ8K37Q9IM5J6KG58C9TY`, and passed byte-level, MIME, countdown, carousel-stop, passive-sheet, and direct-link live checks.
  - Follow-up: Superseded by the later attribution standard: visible credits are required, while reuse permission remains acknowledged but non-blocking for this private guide.
  - Links: `.context/knowledge/minisite-deployment.md`, `https://dubai.anthonydisanti.com/`
- id: 01K2PB7M4N9R1T6V3Q5H8C0XZD — title: Simplify hero autoplay controls — owner: Codex (GPT-5) — status: done — last update: 2026-08-13
  - Goal: Remove the redundant Pause/Resume button and let hero pagination own the visitor's manual stop intent.
  - Result: Made every pagination choice stop autoplay for the current page, including the active item, while preserving temporary hover/focus/dialog pauses and reduced-motion behavior.
  - Links: `src/components/HeroCarousel.tsx`, `src/components/HeroCarousel.test.tsx`, `docs/site-interactions.md`
- id: 01K2P9C4V7N1R5T8M3Q6H0XZFD — title: Correct arrival-day countdown — owner: Codex (GPT-5) — status: done — last update: 2026-08-13
  - Goal: Make Thursday-to-Sunday display three days instead of flooring the remaining elapsed hours to two.
  - Result: Replaced the fabricated midnight/elapsed-duration model with Dubai calendar-date arithmetic, added date-relative/day-N copy plus a one-day reunion message, and covered non-midnight, equivalent-zone, Dubai-midnight, invalid-date, and live hook-update boundaries. Deployed the 432-object build, completed invalidation `IBH9S9V4TO18DTVA2NDYIKY8QG`, and verified the current arrival-day label on production.
  - Follow-up: Keep the configuration date-only unless an exact scheduled landing time is supplied.
  - Links: `src/domain/countdown.ts`, `src/config/site.ts`, `src/hooks/useCountdown.test.tsx`, `docs/site-interactions.md`
- id: 01K2P6V9R4M7C1T8N3Q5H0XZFD — title: Expose hero timing and sheet opening — owner: Codex (GPT-5) — status: done — last update: 2026-08-13
  - Goal: Show when the hero will advance and let its passive image/copy surface open the featured activity without requiring the More link.
  - Result: Made the progress fill the single autoplay clock, preserved its position through temporary pause sources, remounted it at zero when the active slide changed, omitted it for reduced motion, and added delegated passive hero opening with control isolation and meaningful focus restoration. The later pagination task made every manual choice a persistent stop; the full gate then reached 156 tests.
  - Follow-up: Superseded by `01K2PB7M4N9R1T6V3Q5H8C0XZD` and deployed by `01K2PC8N5R1T7V4Q9H3M6X0ZFD`.
  - Links: `src/components/HeroCarousel.tsx`, `src/styles/layout.css`, `docs/site-interactions.md`
- id: 01K2JDK9Q6N3V8R1T5M7C4XZHF — title: Deploy the React guide — owner: Codex (GPT-5) — status: done — last update: 2026-08-11
  - Goal: Publish the complete uncommitted React migration to the existing S3/CloudFront production target with a recoverable and verified release.
  - Result: Preserved all 404 prior objects in a temporary rollback snapshot, passed the 143-test application and 431-row photo gates, deployed 430 files, removed 12 intentional stale objects, completed CloudFront invalidation `I2XIJ6R3B2YECOISFTUA7G0RMX`, and verified the live root plus chapter/activity deep links.
  - Follow-up: Superseded by the completed attribution standard and populated real-phone share validation; permission remains intentionally non-blocking for this private guide.
  - Links: `docs/architecture.md`, `.context/knowledge/minisite-deployment.md`, `https://dubai.anthonydisanti.com/`
- id: 01K2J9Q6N3V8R1T5M7C4X0ZHFD — title: Add guide deep links — owner: Codex (GPT-5) — status: done — last update: 2026-08-11
  - Goal: Make every chapter and activity sheet directly linkable without changing the static S3 hosting model or breaking shared favorites.
  - Result: Added native chapter and activity fragments, real navigational anchors, validated URL parsing, Back/Forward sheet state, safe direct-link dismissal, invalid-ID handling, and focus fallback to the owning chapter.
  - Links: `src/domain/deepLinks.ts`, `src/hooks/useDeepLink.ts`, `src/App.tsx`, `docs/site-interactions.md`
- id: 01K2J5R8M4C7V2N9Q1T6H3XZFD — title: Enrich original activity sheets — owner: Codex (GPT-5) — status: done — last update: 2026-08-11
  - Goal: Use the expanded detail-sheet format where practical planning information materially improves an existing recommendation, while keeping dated events current and visually consistent.
  - Result: Added selective facts/advisories to 39 original activities, made every dated sheet show its full trip-year date, gave dated styling precedence, corrected stale schedules/locations/links, dated three workshop series, and retired three unavailable cards plus ten orphaned assets. Current state is 123 activities and 401 JPEGs; 113 tests, all audits, and 390/999/1000/1440 px rendered checks pass.
  - Follow-up: Recheck volatile facts near the trip, especially Ossiano's conflicting status, Formula Rossa, Global Village's opening date, Hatta/Jebel Jais operations, and rotating market dates.
  - Links: `src/data/activities.ts`, `src/components/ActivityDialog.tsx`, `docs/activity-planning-sources.md`, `scripts/audit-activity-content.ts`
- id: 01K2G7M4N8Q1R5T9V3X6Z0C2HD — title: Publish animal chapter — owner: Codex (GPT-5) — status: done — last update: 2026-08-11
  - Goal: Turn Addendum 3 into a selective, final chapter with robust research, candid caveats, differentiated photography, and the existing ordering/treatment rules.
  - Result: Published nine new activities as the 12th and final `Fur, feathers and scales` chapter; added structured facts/advisories and 36 verified JPEGs; promoted Ras Al Khor into the hero; reached 126 activities and 411 activity JPEGs; and passed automated plus 390/1440 px rendered QA.
  - Follow-up: Superseded by the deployed attribution catalog and completed real-phone share validation; permission remains intentionally non-blocking for this private guide.
  - Links: `src/data/activities.ts`, `docs/content-editorial.md`, `docs/image-manifest.csv`, `activities/Dubai Activities Addendum 3 - Wildlife.md`
- id: 01K26TC4V7N9Q2M5R8H1J3X6ZD — title: Expand chapter header toggles — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Let the full chapter heading surface fold or open its section instead of requiring a precise click on the arrow.
  - Result: Made each heading one full-width native accordion button, preserved the controlled panel relationship while collapsed, added keyboard/focus coverage, and verified all four responsive breakpoints.
  - Links: `src/components/ChapterSection.tsx`, `src/styles/layout.css`, `docs/site-interactions.md`
- id: 01K26R8M4C7V2N9Q5T1H3J6XZD — title: Replace the custom runtime with React — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Treat the generated custom framework as a behavior specification and replace it with a maintainable Vite, React, and strict-TypeScript client that deploys as static S3 assets.
  - Result: Removed the custom runtime and duplicate entry points; added typed React components, domain rules, accessible dialogs, self-hosted fonts, public-photo delivery, 63 tests, production audits, and four-viewport browser QA.
  - Links: `src/App.tsx`, `src/components/`, `src/domain/`, `src/data/activities.ts`, `docs/architecture.md`
- id: 01K22V6N9C4R7M2X5Q8F1H3JZD — title: Standardize the static site architecture — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Turn the single-file prototype into a conventional static site without adding a framework or build step.
  - Result: Split CSS, application logic, content data, and generated runtime into focused assets; replaced all inline styles with semantic classes; retained only the runtime-required one-line adapter; and added static plus four-viewport regression checks.
  - Superseded by: `01K26R8M4C7V2N9Q5T1H3J6XZD`; this was an intermediate boundary, not the target architecture.
  - Links: `docs/architecture.md`, `docs/site-interactions.md`
- id: 01K22P8XH7M4C9V6N2R5T1Z3QW — title: Refine activity recommendations — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Reconsider chapter and hero promotion order, preserve chronological visual spacing for dated events, and remove invented first-person opinions from every activity.
  - Result: Re-ranked all 11 chapters, rewrote 117 blurbs and CTAs in a warm expert-friend voice, promoted Skydive into a six-image hero sequence, and added automated content/order verification plus four-viewport browser QA.
  - Links: `src/data/activities.ts`, `src/domain/activity.ts`, `scripts/audit-activity-content.ts`, `docs/content-editorial.md`
- id: 01K22M3W6R9B4N8Q5T1Y7C2HXF — title: Gate favorites sharing by capability — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Preserve native sharing wherever the browser supports the exact payload, using a recognizable control rather than an ambiguous arrow.
  - Result: Kept Copy as the primary action, added a capability-gated curved-arrow share button at every viewport, retained shared-link restoration, verified mobile and desktop layouts, and completed a populated real-phone share-and-reopen test on 2026-08-13.
  - Links: `src/components/FavoritesDialog.tsx`, `src/domain/favorites.ts`, `docs/site-interactions.md`
- id: 01K22JKR8E1F7XQ3P4M9V6D2AZ — title: Improve activity sheet interactions — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Open sheets from the full non-action card surface and make the gallery larger, clearer, and easier to dismiss.
  - Result: Added delegated card opening, full-viewport desktop details with a sticky in-sheet X, responsive media, whole-image forward navigation, direct photo pills, Escape support, and desktop/mobile browser coverage.
  - Links: `src/components/ActivityCard.tsx`, `src/components/ActivityDialog.tsx`, `docs/site-interactions.md`
- id: 01K22F7Q80Y7DM9VSMR1Z4X8CJ — title: Resolve high-value photo gaps — owner: Codex (GPT-5) — status: done — last update: 2026-08-07
  - Goal: Replace weak imagery, fill the most important missing requests, add differentiated frames, and give every remaining miss an explicit editorial disposition.
  - Result: Added or improved 10 local photos; canonical manifest has 377 selected assets and no active gaps.
  - Links: `docs/image-manifest.csv`, `docs/photo-assets.md`
