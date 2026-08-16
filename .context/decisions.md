# Decisions

Record decisions with enough context that a future agent can understand "why".
Keep newest decisions at the top (reverse chronological order).
Decider format: `Anthony` for human decisions, `Codex (model: gpt-5.2-codex)` for agent decisions.

## 2026-08-13 — Organize Favorites by planning urgency
- Decider: Anthony and Codex (model: gpt-5.2-codex)
- Decision: Divide the favorites sheet into Dated events, Book ahead, and Everything else. Give dated status precedence, sort those events chronologically, preserve save order elsewhere, and make each saved item a native detail link while keeping removal independent.
- Rationale: A flat saved list captures interest but does little to help turn it into a plan. Calendar commitments and scarce reservations need to surface before flexible ideas, and direct sheet access removes the need to hunt for an activity again.
- Alternatives considered: Keep one list with inline badges; group by chapter; sort every group editorially; duplicate dated-and-ahead activities in two sections.
- Consequences / follow-ups: Dated favorites appear exactly once with a semantic date tile. Empty groups are omitted, and the lone remaining visible group header is suppressed when only one category is populated. Semantic region labels remain available, the copied/shared favorite order remains unchanged, and modified clicks retain native link behavior.

## 2026-08-13 — Credit every deployed photo without making permission a release gate
- Decider: Anthony
- Decision: Keep the private personal guide's existing photo set, publish a lightweight footer credits sheet, and expose matching compact JSON plus Schema.org JSON-LD. Record the exact creator and license where available; otherwise credit the identified creator or recorded source without implying permission or endorsement.
- Rationale: The site is a private toy for Anthony and Naima with no profit or promotion, so rights clearance is not proportionate as a deployment gate. Creators still deserve visible, durable credit, especially where Creative Commons terms specify it.
- Alternatives considered: Block releases until every reuse right is documented; hide credits in source metadata only; add a credit link to every activity sheet; build a searchable or collapsed credits directory.
- Consequences / follow-ups: `docs/photo-attributions.csv` is the reviewed one-row-per-asset ledger. Generated JSON powers the flat footer sheet, generated JSON-LD provides machine-readable attribution, and `#credits` is a durable route. Structural coverage is audited, but unknown creators fall back to source-level credit and do not block deployment. New selected photos must be synchronized into the ledger in the same content change.

## 2026-08-13 — Stop hero autoplay through pagination
- Decider: Anthony
- Decision: Remove the separate Pause/Resume control and make any hero pagination choice permanently stop autoplay for the current page.
- Rationale: Pagination already expresses the visitor's intent to take control of the carousel, making a neighboring pause button redundant.
- Alternatives considered: Keep both controls; pause only while a pagination button retains focus; resume automatically after a manual selection.
- Consequences / follow-ups: Choosing the active item freezes the current progress position, while choosing another item starts that slide with a stopped empty fill. Hover, focus, and dialogs remain temporary pauses, and a reload starts autoplay again.

## 2026-08-13 — Count arrival by Dubai calendar dates
- Decider: Anthony and Codex (model: GPT-5)
- Decision: Calculate the arrival label from the difference between Dubai calendar dates rather than flooring elapsed 24-hour blocks. Keep the configured landing target date-only until an actual scheduled time is known.
- Rationale: Thursday to Sunday is three ordinary calendar days even when fewer than 72 elapsed hours remain. The earlier duration calculation produced “2 days” later on Thursday and its midnight arrival timestamp invented hour-level certainty the source data does not contain.
- Alternatives considered: Change `Math.floor` to `Math.ceil`; retain a fabricated midnight arrival and switch to hours on Saturday; use the visitor's local date fields.
- Consequences / follow-ups: `Asia/Dubai` is an explicit configuration boundary. Saturday reads “1 day until I land,” Sunday stays “I land today,” Monday uses “Tonight, it's you + me” as trip day 1, and Tuesday begins the visible numbered sequence at day 2. If an exact flight arrival time is later supplied, model it separately rather than encoding it as an assumed midnight.

## 2026-08-13 — Make the hero surface and timer visible
- Decider: Anthony
- Decision: Let any passive hero image or copy surface open the featured activity sheet, and place a thin left-to-right progress track directly below the image whose completed fill advances the carousel.
- Rationale: The prior slide looked broadly interactive but required a precise More-button click, while its seven-second automatic change had no visible timing cue. A shared visual clock makes both behaviors discoverable.
- Alternatives considered: Wrap the whole slide in a link; add a second overlay button; keep an independent JavaScript interval beside a decorative animation.
- Consequences / follow-ups: Keep Save and detail anchors independently operable and retain a real link as the keyboard path. The fill animation is the rotation clock, pauses and resumes at the same position with interaction/dialog state, remounts at zero when the active slide changes, and is omitted with reduced motion. The later pagination-stop decision governs manual selection.

## 2026-08-11 — Publish through the existing Minisite stack
- Decider: Anthony
- Decision: Deploy the complete current `dist/` build to `https://dubai.anthonydisanti.com/` through the owned S3/CloudFront Minisite stack, while retaining a pre-release object snapshot and explicitly carrying the unresolved photo-rights issue as post-release risk.
- Rationale: The user explicitly requested deployment of the finished guide and the application, content, photo, and live-browser gates were green. The private-origin CloudFront stack already serves the site and is the narrowest established production path.
- Alternatives considered: Stop deployment until every photo right and Creative Commons attribution is cleared; create a new hosting target; hand-sync S3 with a new cache policy during this release.
- Consequences / follow-ups: The deployment instruction authorizes this release but does not establish reuse permission or satisfy attribution conditions. Resolve the active rights/credits task urgently. Until Minisite supports atomic ordering and per-path headers, snapshot the unversioned bucket before material releases, dry-run every deploy, wait for the returned invalidation, and verify the live document and deep links.

## 2026-08-11 — Use native fragments as the guide's deep-link contract
- Decider: Anthony and Codex (model: GPT-5)
- Decision: Link chapters with their existing bare section keys (`#animals`), link sheets with namespaced stable activity IDs (`#activity-rasalkhor`), and retain `#list=` unchanged for shared favorites. Make chapter and labeled activity destinations real anchors, while synchronizing ordinary activation with controlled React state and native session history.
- Rationale: Native fragments work on static S3 hosting, remain readable and copyable, require no SPA rewrite, and give Back/Forward meaningful sheet behavior without adding a router dependency. Namespacing activities prevents collisions with chapter keys.
- Alternatives considered: Query-style hash parameters such as `#chapter=animals`; path routes requiring CloudFront rewrites; a separate share button in every sheet; rewriting the URL during passive scroll.
- Consequences / follow-ups: Only explicit chapter/sheet navigation writes history. Direct sheet dismissal replaces the fragment with its owning chapter; app-opened sheets use Back. Unknown or retired IDs fail closed, local favorites remain authoritative outside `#list=`, and new activity/chapter IDs must remain durable public identifiers. This supersedes the earlier choice to keep labeled detail actions as buttons; the noninteractive card wrapper and its embedded-action exclusion remain unchanged.

## 2026-08-11 — Enrich sheets only where planning detail changes the decision
- Decider: Codex (model: GPT-5)
- Decision: Add structured facts and one candid advisory to 39 original activities where eligibility, timing, inclusions, booking terms, temporary status, or travel logistics can prevent a bad outing. Show a full Date row automatically for dated activities and give the dated card treatment precedence over book-ahead styling. Retire Terra Solis, the pre-arrival cyanotype session, and RAW's sold-out undated class instead of keeping misleading cards alive with warnings.
- Rationale: The expanded sheet is valuable when it answers a real planning question, but a compulsory grid on all 123 activities would bury the editorial voice in filler. Consistent calendar treatment preserves the requested chronology and visual spacing; removal is more honest when no actionable booking exists.
- Alternatives considered: Add facts to every activity; keep inactive cards as watch-list entries; retain an inferred 2026 Global Village opening day; show dated-and-ahead activities with book-ahead styling; silently generalize expired workshops.
- Consequences / follow-ups: `ARRIVAL_DATE_KEY` and the content audit reject pre-arrival dated items; facts are capped at four and advisories at 240 characters. Current source evidence lives in `docs/activity-planning-sources.md`. Future schedule/price reviews must update data and the ledger together, while activity retirement removes its public assets and manifest/source-fragment rows in lockstep.

## 2026-08-11 — Lead the animal chapter with conservation experiences
- Decider: Codex (model: GPT-5)
- Decision: Publish nine animal activities in the final chapter, ordered Ras Al Khor, Falcon Hospital, Turtle Rehabilitation, Platinum Heritage, Vibrissae, Camel Farm, Butterfly Garden, Meowtropolis, and Fluffin. Promote Ras Al Khor into the hero in place of Balloon.
- Rationale: Ras Al Khor and the Turtle Project are the most distinctive low-impact Dubai experiences, Falcon Hospital adds meaningful cultural and clinical substance, and Ras has the strongest new lead photograph. Alternating the three genuine book-ahead cards at positions 2, 4, and 6 preserves the page's visual rhythm.
- Alternatives considered: Lead with the addendum's café ranking; keep every new activity out of the hero; mark the 1 October safari reopening as a dated event; move existing Green Planet and SeaWorld cards.
- Consequences / follow-ups: Keep the new chapter last and leave existing reviewed activities in their original chapters. Maintain current operational caveats in structured facts and advisories. Before public deployment, resolve reuse rights for editorial/listing photographs and provide deployed attribution for Creative Commons assets.

## 2026-08-11 — Add only worthwhile animal activities in a final chapter
- Decider: Anthony
- Decision: Add the animal material as the final chapter so previous reviewers can identify it immediately. Exclude crocodile experiences, inactive or dubious venues, and weak experiences; build complete cards and detail sheets for the surviving activities, with uncertainty stated candidly rather than hidden.
- Rationale: The addendum is a research pool, not a publishing quota. A separate final chapter preserves the earlier reading order, while strong practical detail and clear caveats make the selected experiences useful without pretending every current fact is equally certain.
- Alternatives considered: Insert the chapter near related existing categories; move Green Planet and SeaWorld into it; publish every plausible or monitor-only venue; include Dubai Crocodile Park.
- Consequences / follow-ups: Keep the new chapter last, but classify an activity elsewhere when another chapter better expresses its primary promise. Launch with active, differentiated café, camel, wildlife, and conservation experiences; omit Crocodile Park, Safari Park, The Cat Café Arjan, the rescue meetup, PETME, and other low-confidence options. Keep true dated events chronological and visually dispersed; represent ongoing seasonal openings as availability, not one-day events.

## 2026-08-07 — Use the full chapter heading as its accordion control
- Decider: Anthony
- Decision: Make each visible chapter heading one full-width native button whose entire surface folds or opens the corresponding activity panel. Keep the arrow decorative and retain `aria-expanded` plus `aria-controls` on the button.
- Rationale: The former small arrow target made a prominent section header look interactive without behaving interactively across most of its surface. A single native control aligns the visual affordance, touch target, pointer behavior, and keyboard behavior.
- Alternatives considered: Add a click handler to a nonsemantic wrapper around the existing arrow button; preserve separate heading and arrow controls; turn the header into a custom keyboard target.
- Consequences / follow-ups: Keep the controlled panel wrapper mounted while collapsed so the ARIA reference remains valid, but unmount its cards to avoid retaining the full activity tree. The focus outline is inset so it remains visible against mobile viewport edges.

## 2026-08-07 — Replace the generated runtime with a static React build
- Decider: Anthony and Codex (GPT-5)
- Decision: Treat the custom component runtime and template as an executable behavior specification, then replace them with Vite, React, and strict TypeScript. Bundle React at build time, emit relative assets to `dist/`, keep photos under `public/photos/`, preserve hash-based favorites sharing, and deploy the result without a backend to S3/CloudFront.
- Rationale: The generated runtime is first-party framework code without its source of truth. Preserving or rewriting that framework would retain template compilation, global namespaces, CDN boot dependencies, and `new Function` complexity that this single application does not need. Standard typed modules and focused React components make behavior, accessibility, tests, and deployment independently verifiable.
- Alternatives considered: Keep the generated runtime as vendor code; reconstruct and maintain the custom framework; preserve the no-build split indefinitely; introduce a server-rendered framework or runtime backend.
- Consequences / follow-ups: `npm run build` is now required before deployment. S3 receives only `dist/`; Vite uses `base: './'`, public photos retain stable URLs, and Web Share/Clipboard require HTTPS. Every legacy runtime entry point has been removed; pure editorial/browser rules remain covered by Vitest plus content, photo, and static-output audits.

## 2026-08-07 — Separate static concerns without adding a build step
- Status: Superseded the same day by “Replace the generated runtime with a static React build.”
- Decider: Anthony and Codex (GPT-5)
- Decision: Keep the custom-component runtime and direct static hosting, but split the page into a semantic stylesheet, application factory, activity-data API, generated vendor runtime, and a slim HTML shell. Keep only the one-line inline component adapter that the runtime's `textContent` contract requires.
- Rationale: The project has outgrown a self-contained prototype, while its size and deployment model still do not justify a framework or bundler. External assets make presentation, behavior, content, and vendor code independently navigable and testable.
- Alternatives considered: Preserve the single file; add a framework/build tool; point `data-dc-script` at an external file; mechanically move styles while retaining inline declarations.
- Consequences / follow-ups: This intermediate structure improved separation but retained the generated runtime and its CSP limitations. The superseding React decision replaces both the runtime and its historical structure audit.

## 2026-08-07 — Rank recommendations without inventing a narrator
- Decider: Anthony and Codex (GPT-5)
- Decision: Rewrite every activity blurb and CTA as warm, concrete guidance with no first-person narrator. Rank undated activities by recommendation strength and visual variety; sort and evenly interleave dated cards through a shared helper. Feature The Nest, teamLab, Balloon, elrow, Skydive the Palm, and La Perle in that order.
- Rationale: The page can feel intimate through useful specificity and second-person guidance without presenting generated preferences or experiences as Anthony's. Centralizing the dated merge makes chronology and spacing testable, while the hero sequence balances candidate quality, photography, and distinct visual stories across the wrap.
- Alternatives considered: Preserve the existing copy and only remove obvious pronouns; keep Old Dubai in the hero; promote more festival imagery; manually position dated entries in the source array.
- Consequences / follow-ups: `npm run audit:content` guards activity count, displayed first-person language, dates, rendered spacing, hero references, and gallery files. Source order controls only undated rank; dated declarations should remain chronological for readability.

## 2026-08-07 — Gate native favorites sharing by capability
- Decider: Anthony and Codex (GPT-5)
- Decision: Keep `Copy as a message` as the primary favorites export. Add a recognizable curved-arrow native-share control at every viewport when `navigator.share` exists and `navigator.canShare`, when present, accepts the exact payload.
- Rationale: Native capability detection is a more accurate availability rule than an assumed mobile/desktop boundary, while the curved icon fixes the prior diagonal arrow's ambiguity.
- Alternatives considered: Restrict native sharing below 1000 px; remove native sharing entirely; expose a second copy-link action.
- Consequences / follow-ups: Shared URLs continue to use `#list=` and restore the recipient's favorites. Unsupported browsers remain copy-only. Responsive QA should verify capability-based visibility without opening the OS share sheet; payload changes need a manual native-handoff test.

## 2026-08-07 — Separate card surfaces from embedded actions
- Decider: Anthony and Codex (GPT-5)
- Decision: Let the shared card wrapper open details only when the click did not originate inside an anchor or button. Keep the existing labeled detail buttons as the keyboard path instead of assigning button semantics to a wrapper containing interactive descendants.
- Rationale: The full visual card becomes easy to open without breaking Save, booking, Site, Map, or Instagram controls or creating invalid nested interactive semantics.
- Alternatives considered: Add an overlay button to every treatment; stop propagation separately on every action; convert each card wrapper into a button.
- Consequences / follow-ups: New card actions must remain anchors/buttons or be added to the exclusion selector. Browser QA should sample every rendered treatment.

## 2026-08-07 — Make gallery navigation forward-first and responsive
- Decider: Anthony and Codex (GPT-5)
- Decision: Use the complete image as the next-photo control, make every indicator a direct-access button, and expand only the desktop media width while keeping prose at 760 px.
- Rationale: The primary gesture becomes discoverable and consistent, backward navigation remains explicit, and photography gains space without making descriptive copy hard to read.
- Alternatives considered: Keep invisible edge zones; add permanent arrow overlays; widen the entire sheet copy column.
- Consequences / follow-ups: Desktop details fill the viewport and use a sticky in-sheet X plus Escape dismissal; mobile keeps its rounded sheet, backdrop, and text Close. Pills expose labels plus one `aria-current` state.

## 2026-08-07 — Resolve missing imagery editorially
- Decider: Anthony and Codex (GPT-5)
- Decision: Preserve factual sourcing status and add a separate `disposition` field: `selected`, `waived`, `defer_until_event`, `defer_until_reopen`, or `active_gap`. Complete this pass with no active gaps.
- Rationale: A failed ancillary request is different from a meaningful unresolved gap, and neither should be confused with a selected asset.
- Alternatives considered: Blanket-fill all 35 requests; delete unfulfilled rows; use generic or generated substitutes.
- Consequences / follow-ups: Twenty-five ancillary requests are explicitly waived, ATB waits for its September event, and two Ossiano requests wait for the post-refurbishment venue.

## 2026-08-07 — Prefer differentiated story beats over image quotas
- Decider: Anthony and Codex (GPT-5)
- Decision: Fill seven high-value original requests, replace two weak frames, and add one unrequested Electric Pawn Shop live-action image. Do not add more UNTOLD, elrow, or other already-saturated festival imagery.
- Rationale: The selected additions repair real narrative gaps—people, action, performance, or venue context—while the major festivals already have strong multi-image coverage.
- Alternatives considered: Add more visually dramatic festival photos; preserve the dated Ski Dubai and watermarked Mleiha images.
- Consequences / follow-ups: Every changed gallery now has three differentiated photos; future-event context is labeled rather than presented as an exact event candid.
