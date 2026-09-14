# Decisions

## 2026-09-14 — Add Miss Lily’s as an untried Jamaican dinner
- Decider: Anthony
- Decision: Add Miss Lily’s because Ting Irie is a loved benchmark and the Jamaican dinner/music atmosphere looks similar. Keep the two adjacent in Long dinners; retain Ting Irie’s verified status and leave Miss Lily’s unverified until visited.
- Evidence: Current official Dubai menu, FAQ and location pages; conflicting hours require direct confirmation. Source details live in the planning ledger.

## 2026-09-13 — Add two tried-and-liked happy hours near work
- Decider: Anthony
- Decision: Add CityMax (Brew House, Business Bay) and Mama Shelter as distinct Tried & liked choices near the MultiBank office. Preserve CityMax’s friendly approached crowd, occasional music and well-executed pub food/pizza, and Mama’s quiet classy atmosphere, attractive crowd, lounge seat and proactive ordering guidance. Keep both searchable by MultiBank and happy hour, without Plan ahead.
- Naming: Anthony confirmed the branch and requested the everyday display name **Citymax**; retain Brew House at Citymax Business Bay in location details.
- Evidence: User-supplied visits/proximity and explicit confirmation of Brew House at Citymax Business Bay; current Mama calendar; exact Brew House booking listing. Old Citymax/Playbook links are stale, so avoid fixed pub deals/music schedules. Eight source-credited venue photos added; details live in the editorial/source docs.

## 2026-09-13 — Recommend the Creek Harbour café pair as one outing
- Decider: Anthony
- Decision: Combine Cat Café Vibrissae and Fluffin under the retained `vibrissae` ID and mark the pair Tried & liked after visiting both. Keep Vibrissae’s slightly-better-than-Meowtropolis-but-not-amazing verdict and Fluffin’s fun-but-child-oriented character. The across-the-street pairing, marina and nearby food justify the combined recommendation; Meowtropolis stays Tried.
- Implementation: Retain all eight original photographs, alternating cats/dogs with per-image sources intact. Remove the standalone `fluffin` entry. Preserve separate admission/booking details and distinguish Fluffin’s 21:00 last dog-area entry / 22:00 close from café hours. Sources are in `docs/activity-planning-sources.md`.

## 2026-09-13 — Preserve Brass Monkey’s firsthand food verdict
- Decider: Anthony
- Decision: Add really good bar food to the City Walk recommendation and retain the specific nacho portion, bar-qualified lamb chops, and literally fall-off-the-bone BBQ ribs in the firsthand note. This supplements the existing liked visit; it does not establish a new visit date.

## 2026-09-12 — Prefer à-la-carte dining over ordinary prix fixe
- Decider: Anthony
- Decision: Remove Yūshoku promotion from Mimi Kakushi while retaining the venue as an à-la-carte dinner candidate. Ordinary fixed-price menus are disliked; tasting menus remain an exception.
- Supersedes: The original Mimi addition’s set-menu emphasis. Keep source research for provenance and the four-photo gallery; do not infer rejection of the restaurant.

## 2026-09-12 — Add and publish Mimi Kakushi
- Decider: Anthony
- Decision: Add Mimi Kakushi after approval of its look and menu, alongside the already-committed Lola/Salero additions. Publish through the existing Minisite stack; prepare all current changes for commit without staging or committing.
- Rationale: Same-night booking evidence supports current operation, but it is not a visit or persistent availability promise. Keep Yūshoku as the venue’s fixed-price dinner package with a shared dessert, fee and optional supplements; preserve standard dining and booking caveats.

## 2026-09-12 — Expand dinner choices around tapas
- Decider: Anthony (preference), Codex (source-backed selection)
- Decision: Add Lola Taberna Española and Salero as distinct, untested Spanish tapas candidates. Favor classic sharing plates and flamenco respectively; keep both cuisine/search terms in each blurb.
- Evidence: Current operator pages support Lola and Salero. Anthony correctly flagged BOCA’s 31 March 2026 DIFC closure; remove its unshipped card and photos, retaining only a reopening watch note. No reopening or new address was confirmed. Exclude closed Jaleo too; their stale live pages and awards are not operating-status evidence. Sources and photo provenance are recorded in the canonical ledgers.
- Maintenance: New photos exposed an existing malformed Sirali CSV note; fix the note and reject bad row widths before sync or generation. Serialize a complete ledger before opening its destination to preserve reviewed credits on invalid input.

## 2026-09-12 — Keep both climbing search terms on bouldering cards
- Decider: Anthony
- Decision: Every bouldering gym must visibly include both “climbing” and “bouldering” on its card, including archived cards. Keep the words in the blurb, not only detail facts or metadata, so browser Find can locate either term.

## 2026-09-12 — Reject Mountain Extreme and retain the existing DIP candidates
- Decider: Anthony (firsthand rejection), Codex (source-backed refresh)
- Decision: Keep Mountain Extreme inactive despite very well-set routes; preserve the liquid-chalk restriction, grip/reapplication problems and Petzl-only exception for personal top-rope harnesses as visit observations. Retain its gallery and detail route.
- Release: Anthony authorized publication on 12 September; the climbing review and both card-search terms are deployed and live-verified through the existing Minisite stack. Commit prep covers all pending changes; no staging or commit.
- Rationale: GoClimb and Rock Republic already exist and are in DIP 1, not DIFC. Refresh their exact locations and planning fields without duplicates or invented firsthand approval. Rock Republic prefers liquid chalk without publishing a powder ban; GoClimb retail stock is not proof of permission on its walls. Preserve contact-first caveats until current usage is confirmed.

## 2026-09-09 — Correct The Nest description instead of sourcing a nonexistent glass roof
- Decider: Codex (source-backed correction prompted by Anthony’s photo mismatch report)
- Decision: Keep the accurate existing sunset cover and five-photo gallery. Anthony authorized deployment on September 9; the correction is now published. Describe dune-shaped suites and outdoor stargazing; remove the glass-roof claims from runtime copy, fixtures, manifest and retained source fragments.
- Evidence: Nara specifies front windows and a private deck; the architect specifies fabric over steel. The interior image is a bathroom with a small skylight. See `docs/activity-planning-sources.md` for the linked evidence.

## 2026-09-07 — Implement the supplied site icon design system
- Decider: Anthony (design scope), Codex (integration details)
- Decision: Implement the approved chapter pictograms, SVG favorite/utility controls, darker photo discs and L3 pre-mount/hero loaders. Promote the complete supplied package to `docs/branding/site-icons/`; retain original provenance and ship only inline drawing geometry.
- Rationale: The newer high-fidelity handoff is the final placement contract, including always-lit chapter headings. Follow its heavier 0.66 hollow heart rather than the stale thinner SVG export; add the specified loud-wave glow omitted by that export.
- Consequences: Per-instance mask IDs prevent repeated chapter renderings from interfering. Loading feedback ends on current-image decode/load/failure, never an all-photo gate or timer. Existing CrossIcon/share/verified artwork and interactions stay intact. See `docs/iconography.md`. Anthony subsequently requested deployment on September 7; the complete implementation is now published through the existing Minisite stack.

Record decisions with enough context that a future agent can understand "why".
Keep newest decisions at the top (reverse chronological order).
Decider format: `Anthony` for human decisions, `Codex (model: gpt-5.2-codex)` for agent decisions.

## 2026-09-06 — Include first-load feedback in the iconography proposal
- Decider: Anthony (loader requirement); Codex (recommended presentation, pending design approval)
- Decision: Include a loader in the Core inventory because initial loading can feel slow. Recommend one restrained first-view loading motif, transitioning to local media feedback while text/navigation remain usable; do not wait for the whole photo library.
- Rationale: The source has an empty initial React mount, a high-priority hero image and lazy card images, but no measured cold-load diagnosis. Feedback should reflect real readiness and failure without adding delay or pretending to improve transfer speed.
- Consequences: `.context/scratch/iconography.md` records route/cached/error/reduced-motion acceptance cases. This is a planning decision, not implemented loading behavior or approval for a site-wide neon rollout.

## 2026-09-06 — Keep favorites guidance device-neutral
- Decider: Anthony
- Decision: Use “Saved here, just for you — share them whenever you like” for populated favorites, its shorter first sentence for the empty note, and “Choose the heart” guidance ending “we’ll keep it here for you.”
- Rationale: The same sheet serves laptops and phones; its copy should not assume a phone or touch input. “Here” preserves a light reference to browser-local saving without suggesting account sync.
- Consequences: Copy and accessible-description coverage change; persistence, sharing payloads, and input behavior remain unchanged.

## 2026-09-06 — Publish the useful favicon subset and retain its sources
- Decider: Anthony and Codex (GPT-6)
- Decision: Use the supplied SVG and multi-size ICO, Apple touch icon, and three manifest PNGs. Retain the standalone small PNG exports and original source artwork under documentation instead of publishing redundant files.
- Rationale: The ICO already includes 16/32/48 px variants; relative document and manifest paths preserve prefix deployment. The existing site theme color matches the supplied artwork.
- Consequences: Seven public assets cover browser and home-screen identity; no additional runtime or offline behavior. Preserve supplied image bytes and provenance when maintaining the set.

## 2026-09-06 — Center circular cross controls with geometry, not typography
- Decider: Anthony and Codex (GPT-5)
- Decision: Replace every literal multiplication-sign glyph used by a circular close or remove control with one shared, symmetric `CrossIcon` SVG. Center its fixed view box through the existing grid layout and vary only the icon size through `--cross-icon-size`.
- Rationale: The previous `×` was centered as a typographic box, but its visible strokes inherited font-specific baseline and side-bearing asymmetry. That made desktop sheet controls look off-center even when their CSS alignment was mathematically correct.
- Alternatives considered: Nudge each glyph with transforms; assign a different font; adjust line-height separately for each sheet; change only the activity-sheet button.
- Consequences / follow-ups: Activity, archive, credits, favorites, and favorite-row removal controls now share one glyph-independent shape. Keep accessible names on the parent buttons. Anthony approved the desktop rendering; local 1000/1440 px checks and the deployed 1440 px activity sheet confirm optical centering and zero center offset. Release invalidation `IB8PQMV4IRCX823TV63L57LOST` completed successfully.

## 2026-09-06 — Keep the Lock, Stock & Barrel outcome specific to Business Bay
- Decider: Anthony and Codex (GPT-5)
- Decision: Record the Business Bay Lock, Stock & Barrel under Tried, not Tried & liked or the active guide. Preserve the fun atmosphere, very small dance floor, and only moderately mingle-friendly crowd as the outcome of that branch visit, and do not extend the verdict to Barsha Heights or JBR.
- Rationale: Anthony identified the visited branch after the initial archive entry. The night was fun but not great enough to recommend, and branch-specific room and crowd observations should remain attached to the room that produced them.
- Alternatives considered: Keep the record brand-wide; generalize the Business Bay verdict across the chain; mark the venue Tried & liked; return it to active nightlife recommendations.
- Consequences / follow-ups: Tried contains four entries and the complete archive contains 15 cards. The sheet now uses the current Renaissance Business Bay Hotel address and hours plus four Business Bay-only photographs. The 504-object production release completed invalidation `I7SXN3OG8S2TKHNHIOG8NCPLSD`; Barsha Heights and JBR remain unevaluated.

## 2026-09-06 — Separate recurring and one-off improv
- Decider: Anthony and Codex (GPT-5)
- Decision: Enrich the existing Courtyard Playhouse recommendation as Dubai's dependable recurring improv room, and add Karak After Dark Vol. 3 as a separate dated mixed bill at The Junction. Make Courtyard's free guest-list uncertainty and Monday/Wednesday arrival rules explicit; keep Karak's paid 10 September slot, audience-suggestion format, and event-specific restrictions bounded to the current edition.
- Rationale: Courtyard provides the closest repeatable small-room improv rhythm, while Karak supplies a scarce one-off with a different venue and a looser blend of improv, comedy, and music. Treating both as independent cards adds genuine choice without duplicating the same experience.
- Alternatives considered: Add a second Courtyard card for Maestro; replace the existing Courtyard entry with one current date; treat Karak as evergreen; omit Karak because Courtyard already covers improv; add Dubomedy without a current public improv date.
- Consequences / follow-ups: The active guide now contains 134 activities, 469 JPEGs, and 42 Plan ahead results. The complete karting, stand-up, and improv release was deployed on 6 September through invalidation `IEMMFCM54CUHQR2SUZZEJ02FN6`. Refresh Courtyard's current guest-list dates and advance or retire Karak after 10 September; preserve the two-image event/venue gallery and complete credits while the dated card remains active.

## 2026-09-06 — Keep three scarce stand-up formats
- Decider: Anthony and Codex (GPT-5)
- Decision: Add Joke Hub by Mad Cat Comedy, Comedy at the Speakeasy, and The Laughter Factory to `Genuinely strange` as separate recommendations. Position Joke Hub as the recurring purpose-built room, the Speakeasy as the smallest atmospheric show, and The Laughter Factory as a short touring bill of established international comics.
- Rationale: Dubai's public stand-up calendar is sparse enough that limited showings make choice valuable, while the three additions still serve meaningfully different nights rather than padding the catalog with interchangeable listings.
- Alternatives considered: Add only Joke Hub; merge Mad Cat's rooms into one generic card; omit the touring bill; treat every comedy event as a single evergreen recommendation.
- Consequences / follow-ups: The active guide contained 133 activities and 467 JPEGs at this decision point, and Plan ahead contained 40 activities. Keep the dated Speakeasy and Laughter Factory cards current, refresh Joke Hub's recurring Saturday calendar, and preserve the six-image exact-room or exact-event gallery and credits. The later same-day improv decision added Karak After Dark and enriched Courtyard Playhouse separately.

## 2026-09-06 — Keep three karting formats distinct
- Decider: Anthony and Codex (GPT-5)
- Decision: Add Dubai Kartdrome Outdoor and No Grip DXB to `Adrenaline` while retaining Chaos Karts in `Genuinely strange`. Position Kartdrome as the proper lap-racing choice, No Grip as the drift-control choice, and Chaos Karts as the projected-game choice.
- Rationale: Each venue rewards a different thing—clean racing lines, controlled slides, or interaction with a projected game world—so all three clear the guide's differentiation bar without becoming a list of interchangeable kart tracks.
- Alternatives considered: Add only one conventional kart venue; replace Chaos Karts; group every kart experience in one chapter; add more family or seasonal tracks without a distinct format.
- Consequences / follow-ups: The active guide now contains 130 activities and 461 JPEGs. Keep Kartdrome's live-calendar caveat and No Grip's walk-in scarcity treatment current, preserve both four-image exact-venue galleries and credits, and require any future kart venue to add a new format or clearly displace an existing pick.

## 2026-09-02 — Prefer Sirali for the Turkish dinner slot
- Decider: Anthony and Codex (GPT-5)
- Decision: Add Sirali Dubai to `Long dinners` as the guide's food-first Turkish restaurant instead of CZN Burak. Lead with shared mezze, stone-oven breads, charcoal grilling, and the rolled Adana; keep Friday live entertainment as a reconfirm-before-booking detail rather than a permanent promise.
- Rationale: Sirali combines a current official menu and booking route with FACT's 2025 Best Turkish recognition, while CZN Burak's appeal is more strongly tied to theatrical presentation. The guide already has several show-led dinners, so Sirali adds the more differentiated meal-first option.
- Alternatives considered: Add CZN Burak for spectacle; add both Turkish restaurants; omit a Turkish specialist; wait for a firsthand visit before publishing either.
- Consequences / follow-ups: The active guide now contains 128 activities and 453 JPEGs. Sirali is not marked Tried & liked or Plan ahead without firsthand evidence of scarcity. Keep the four-image exact-venue gallery and credits synchronized, reconfirm Friday entertainment when reserving, and record a firsthand outcome after visiting.

## 2026-08-30 — Add Nammos as a restaurant-first beach afternoon
- Decider: Anthony and Codex (GPT-5)
- Decision: Add Nammos Dubai to `Long dinners` with the restaurant as the primary experience and the beach and lounge as extensions of the same outing. Keep the three areas' official hours separate, link directly to SevenRooms, and use four current exact-venue Four Seasons images.
- Rationale: Nammos is more useful here as a long Mediterranean lunch that can continue toward evening than as a generic beach-club card. The separate operating clocks materially affect whether a restaurant reservation delivers the beach experience a visitor expects.
- Alternatives considered: Put Nammos under nightlife; describe only the beach club; treat a reservation as automatic access to every area; add the venue without local photography or planning context.
- Consequences / follow-ups: The active guide now contains 127 activities and 449 JPEGs. Nammos is not marked Tried & liked and does not enter Plan ahead without evidence of genuine booking friction. The addition was deployed on 30 Aug 2026; confirm which area the reservation covers when the beach is part of the plan and run responsive gallery QA when Browser reconnects.

## 2026-08-29 — Deep-link archive outcome summaries
- Decider: Anthony and Codex (GPT-5)
- Decision: Make the three archive summary counts native links to `#archive-verified`, `#archive-tried`, and `#archive-rejected`. Each outcome route keeps only its matching group open and scrolls it beneath the sticky toolbar. Replace the current archive history entry when selecting an outcome rather than pushing another sheet entry.
- Rationale: Counts should provide useful navigation and copyable state, while the URL must reproduce the visible archive view. Replacing the archive entry preserves the established one-step close behavior; Forward still restores the selected outcome after closing an archive opened from the guide.
- Alternatives considered: Use buttons without URLs; push one history entry per summary selection; leave every group open after jumping; encode the selection as component-only state.
- Consequences / follow-ups: `#archive` remains the all-open route, the three status suffixes are validated exactly, and unknown archive suffixes are ignored. Direct loads and activity-sheet return paths reconstruct the isolated group. Ordinary summary clicks remain history-aware in place, while modified clicks and copied links stay native.

## 2026-08-29 — Reserve Plan ahead for genuine advance friction
- Decider: Anthony
- Decision: Treat BLU Dubai as a normal walk-in and Amazónico as a same-day reservation rather than classifying either venue under Plan ahead. Keep Amazónico's direct reservation route, remove BLU's booking route, and state that BLU's complimentary tables and bottles are aimed at women rather than a prerequisite for the mixed group.
- Rationale: Firsthand experience established the actual planning burden more accurately than generic venue scarcity language. Plan ahead is useful only when it distinguishes activities that need meaningful lead time; same-day logistics and optional perks should not dilute it.
- Alternatives considered: Keep both venues under Plan ahead; keep BLU's booking link as an optional action; remove Amazónico's reservation route entirely; infer that the ladies' table arrangement should be booked for the full group.
- Consequences / follow-ups: BLU and Amazónico no longer carry `ahead`, reducing the current Plan ahead result to 36 activities. BLU's sheet directs visitors to walk in on Thursday, while Amazónico still links to CoverManager and candidly says dinner requires a reservation that worked same-day. This supersedes BLU's earlier direct-reservation follow-up without changing either venue's Tried & liked status.

## 2026-08-29 — Reject The Pods before a visit
- Decider: Anthony
- Decision: Remove The Pods from active `Long dinners` recommendations and retain it under Rejected with its complete planning sheet, three-photo gallery, and credits. Record the decision as pre-visit screening rather than firsthand experience.
- Rationale: The private glass-pod concept did not look compelling enough to clear the guide's recommendation bar, and another reviewer independently rejected it. Keeping a durable record prevents a future refresh from restoring a weak candidate while preserving enough context to understand what was considered.
- Alternatives considered: Keep it active because the venue is current; delete it and its assets entirely; describe it as a negative visit; retain only a name in the archive without a full sheet.
- Consequences / follow-ups: `thepods` is an explicit content-audit exclusion and remains a valid `#activity-thepods` archive route. Rejected records may represent either a visit or a deliberate pre-visit decision, so their note and shared UI copy must not imply firsthand experience when none occurred.

## 2026-08-29 — Add Amritsr Al Karama as an unverified cross-market favorite
- Decider: Anthony and Codex (model: GPT-5)
- Decision: Add Amritsr to `Long dinners` using its established Al Karama branch, not JLT. Preserve Anthony's strong preference for the brand's Bangkok restaurants as the reason to try it, but do not mark the unvisited Dubai branch Tried & liked.
- Rationale: Amritsr's main site still foregrounds Al Karama as its Dubai address, and Karama's neighborhood-food identity makes the branch a stronger guide fit than a tower location. A chain-level favorite is meaningful curation evidence, but it is not proof that a different kitchen executes at the same level.
- Alternatives considered: Choose the JLT branch; call Al Karama a flagship without explicit operator wording; mark the activity verified from Bangkok experience; omit the cross-market preference; wait until after a Dubai visit to add it.
- Consequences / follow-ups: The card states that the Dubai kitchen is untested, includes the official 06:00-versus-09:00 start-time conflict, and uses four source-credited official images. Confirm early-breakfast hours before going, then record the local outcome separately after a visit.

## 2026-08-29 — Preserve BLU Dubai as a proven Thursday club
- Decider: Anthony
- Decision: Add BLU Dubai to `Nights that go loud` and Tried & liked after a strong 40th-birthday visit on Thursday, 27 August 2026. Preserve the great crowd balance, solid vibe, complimentary ladies' tables and bottles, and compact dance area around the bar as candid firsthand guidance.
- Rationale: The visit was a memorable success for the full group, and BLU cleared the guide's bar as a repeatable club recommendation. The compact dance area is a real limitation, while the ladies-first table policy materially shaped the unusually good ratio and should not be erased from the planning advice.
- Alternatives considered: Record the birthday only in the archive; omit the ladies' arrangement; present the table perk as guaranteed every Thursday; publish BLU without the dance-floor caveat.
- Consequences / follow-ups: BLU stays active with a verified stamp, a four-photo official gallery, and a direct reservation route. Tried & liked now spans six activities across three chapters. Treat complimentary tables and bottles as event- and guest-list-dependent, and confirm the current Thursday offer before relying on it.

## 2026-08-29 — Promote three firsthand favorites and reject Dubai Mall shopping
- Decider: Anthony
- Decision: Mark Brass Monkey, Amazónico Dubai, and Ting Irie as Tried & liked. Describe Brass Monkey as a fun date built around interactive games rather than a deep American-style Barcade. Add Amazónico and Ting Irie as robust active dinner recommendations with sourced four-photo galleries. Remove Fashion Avenue from active content and preserve it as a rejected Dubai Mall shopping record; do not generalize that rejection to unrelated activities inside the mall.
- Rationale: All three positive decisions come from firsthand visits: Brass Monkey was fun despite the format mismatch, Amazónico served the best food of the Dubai trip so far, and Ting Irie served the best Jamaican food Anthony has ever had with strong atmosphere. Dubai Mall itself proved too crowded to recommend for shopping, while the guide still has credible broad shopping options elsewhere.
- Alternatives considered: Keep Brass Monkey unverified because it is not a true Barcade; leave the restaurants as favorites without active cards; delete Fashion Avenue without an archive record; reject every activity located in Dubai Mall; research a replacement mall despite existing Ibn Battuta, Fashion Dome, and Outlet Village coverage.
- Consequences / follow-ups: The verified filter now spans five active activities across three chapters. Fashion Avenue remains sheet-ready under Rejected with its existing gallery and credits. Keep Ibn Battuta Mall, Fashion Dome, and The Outlet Village active, and assess every Dubai Mall activity separately from the shopping verdict.

## 2026-08-29 — Treat dated events as plan-ahead activities
- Decider: Anthony
- Decision: Rename the guide's top-level Book ahead filter to Plan ahead and include the union of fixed-date events and activities with explicit `ahead` guidance. Keep Tried & liked mutually exclusive and leave the Favorites sheet's Dated events and Book ahead groups separate.
- Rationale: A dated event requires planning even when its ticketing or reservation friction is not separately encoded. Filtering those events out hid the most time-sensitive activities from the planning view.
- Alternatives considered: Add `ahead` copy to every dated event; keep the narrower Book ahead label; merge dated and book-ahead Favorites into one group.
- Consequences / follow-ups: `isPlanAheadActivity` is the shared predicate for the guide filter. Dated cards retain their calendar treatment and chronological ordering, every filter change still reopens all visible chapters, and Favorites keeps its more detailed three-way organization.

## 2026-08-27 — Add two complementary adult arcade nights
- Decider: Anthony and Codex (model: gpt-5.6-sol)
- Decision: Add Brass Monkey City Walk and Triple 777 Business Bay to `Nights that go loud`, ranking Brass Monkey as the stronger arcade-first recommendation and Triple 777 later as the neon 21+ option that runs until 03:00. Give each a complete four-photo gallery and a candid sheet covering current planning gaps.
- Rationale: Both satisfy the requested combination of real arcade play and alcohol while serving distinct nights. Brass Monkey has the deeper destination-arcade identity; Triple 777 makes more sense for drinks, live sport, and late rematches.
- Alternatives considered: Add only Brass Monkey; promote HUSHH instead of Triple 777; restore Wavehouse for machine count; broaden the brief to BOOM Battle Bar.
- Consequences / follow-ups: Keep both cards in the nightlife chapter and preserve the alternating dated-event rhythm. Do not restore Wavehouse or BOOM Battle Bar without an explicit reversal. HUSHH remains a screened but unpublished Downtown alternative. Recheck Brass Monkey's conflicting official hours and Triple 777's unpublished package price before visiting.

## 2026-08-27 — Narrow the adult-arcade shortlist
- Decider: Anthony and Codex (model: gpt-5.6-sol)
- Decision: Exclude Wavehouse because its Atlantis setting and programming are too family-focused, and exclude BOOM Battle Bar because competitive pub games do not satisfy the arcade brief. Keep HUSHH at Social Distrikt under consideration as a licensed late-night social-gaming bar; Brass Monkey remains the stronger choice when arcade depth is the priority.
- Rationale: The target experience is an adult night out with alcohol and a worthwhile arcade, not merely a venue that happens to combine children, bowling, or bar games. HUSHH clears the atmosphere and drinks requirements with 15-plus arcade machines, four duckpin lanes, AR darts, and digital shuffleboard, but its cabinet selection is smaller than a destination arcade.
- Alternatives considered: Keep Wavehouse for its 70-plus machines; keep BOOM as a broader activity bar; treat HUSHH as a full arcade without qualification; publish every plausible option.
- Consequences / follow-ups: Do not add Wavehouse or BOOM during a later arcade refresh unless Anthony reverses this decision. If HUSHH is promoted, present it honestly as a polished Downtown barcade/date-night option rather than Dubai's deepest arcade, verify live individual-game pricing, and source an exact-venue gallery and credits in the same change.

## 2026-08-25 — Remove the personalized trip framing
- Decider: Anthony
- Decision: Remove the arrival/day banner and every active-site reference to the former personalized name. Use `Dubai activities` as the neutral document/page title, rename internal browser-state identifiers, and start favorites under `dubai-activities.favs.v1` without migrating the retired namespace.
- Rationale: The guide should remain useful without carrying trip-day framing or person-specific branding in its visible interface or production bundle.
- Alternatives considered: Hide only the banner; retain personalized internal identifiers; keep a one-release favorites migration shim.
- Consequences / follow-ups: The hero becomes the first visible content, existing browser-local favorites under the retired key reset, and shared `#list=` URLs remain compatible. `TRIP_START_DATE_KEY` survives only as the neutral freshness boundary for dated recommendations. The static-output audit rejects a regression of the retired name or countdown code.

## 2026-08-23 — Verify the Soho Garden complex with a scoped visit note
- Decider: Anthony
- Decision: Mark the combined Soho Garden, HIVE and CODE activity as Tried & liked, while recording that only SOHO Garden was open and personally experienced during the visit.
- Rationale: SOHO Garden delivered solid warehouse-party energy and earned the combined destination a place among proven choices, but the archive must not imply that HIVE or CODE has been tested.
- Alternatives considered: Verify only a newly split SOHO Garden card; leave the combined activity unverified; claim the whole complex was experienced.
- Consequences / follow-ups: The active combined card gains the same verified marker, filter presence, and sheet callout as Boulder Zone. HIVE and CODE remain explicitly untested until a future visit provides firsthand evidence.

## 2026-08-23 — Separate the visited Brunch & Cake branch from the chain verdict
- Decider: Anthony
- Decision: Record Jumeirah Islands Pavilion as the Brunch & Cake location actually visited, while retaining Rejected as a chain-wide outcome because the experience was bad enough to rule out every branch.
- Rationale: Firsthand provenance should identify the exact experience, while the archive should also preserve the full scope of Anthony's decision so another branch is not accidentally proposed later.
- Alternatives considered: Keep the incorrect Wasl 51 record; reject only Jumeirah Islands; create separate records for every branch.
- Consequences / follow-ups: The neutral preview, operating details, link, and four-photo gallery are exact to Jumeirah Islands. The firsthand sheet note explicitly applies the verdict to the entire chain, and future research must treat every Brunch & Cake location as rejected.

## 2026-08-23 — Favor repair-and-redeploy over rollback snapshots
- Decider: Anthony
- Decision: Treat `dubai.anthonydisanti.com` as an intentionally low-stakes vacation toy. Keep the build, audit, dry-run, invalidation wait, and live-verification gates, but do not create S3 rollback snapshots before releases; fix and redeploy if a regression reaches the site.
- Rationale: Snapshot ceremony costs more than the downtime risk warrants for a private, backend-free guide with a fast deterministic build and deploy loop.
- Alternatives considered: Snapshot the unversioned bucket before every release; enable S3 versioning; add atomic release infrastructure before further content work.
- Consequences / follow-ups: Review dry-run deletions carefully and never deploy a hand-edited `dist/`. The bucket remains unversioned and Minisite remains non-atomic by accepted design; verification failures trigger a new tested release rather than rollback.

## 2026-08-23 — Reuse the live guide's card grammar in the archive
- Decider: Anthony and Codex (model: gpt-5.6-sol)
- Decision: Render all firsthand outcomes with the shared `ActivityCard` system inside independently collapsible, initially open archive groups. Keep previews activity-focused, reserve the firsthand verdict for the sheet, use the same image-contained thumbs-up stamp for verified records, and maintain complete galleries for every current inactive record.
- Rationale: A parallel archive-card language made the archive feel like a ledger and repeated nearly identical outcome text. Shared cards preserve visual hierarchy and useful venue context while the group and sheet still communicate the decision.
- Alternatives considered: Refine the custom archive cards; show verdict copy in every preview; return inactive records to the guide; keep zero-photo typographic records indefinitely.
- Consequences / follow-ups: Archive cards use unique DOM anchors and omit favorite controls, while sheet deep links and history behavior remain unchanged. New archive records should carry neutral planning copy plus a sourced gallery in the same change whenever venue-specific media exists.

## 2026-08-23 — Keep inactive outcomes as full archive records
- Status: Expanded by “Reuse the live guide's card grammar in the archive” on 23 Aug 2026.
- Decider: Anthony and Codex (model: gpt-5.2-codex)
- Decision: Present Tried & decided as a visual card collection and let every outcome open a durable `#activity-<id>` detail sheet. Keep inactive activities out of recommendations and favorites, but retain useful existing galleries with full attribution; use an intentional typographic card and sheet when no honest local gallery exists.
- Rationale: A name-and-note ledger preserves the verdict but loses the visual and factual context that makes the main guide useful. The archive should be genuinely browsable without blurring the distinction between a historical record and an active recommendation.
- Alternatives considered: Keep the text-only ledger; return inactive items to the main guide with negative badges; require new photography for every archived venue; create a second incompatible sheet component and URL grammar.
- Consequences / follow-ups: `ARCHIVE_ACTIVITY_DETAILS` carries inactive sheet data, while active verified records reuse live activity data. Archived sheets expose the firsthand verdict and date, omit favorite controls, and close direct links to `#archive`; opening from the archive uses normal history so Back restores the collection. Existing The Wall, Meowtropolis, and Butterfly Garden galleries return to the production payload and credit catalog. Roberto's, Salmon Guru, and Brunch & Cake remain honest zero-photo records until suitable photography is deliberately sourced.

## 2026-08-23 — Preserve merely tried places as a third firsthand outcome
- Decider: Anthony
- Decision: Expand the firsthand archive to three outcomes: `verified` for places tried and liked, `tried` for places that were acceptable but did not earn a recommendation, and `rejected` for places deliberately ruled out. Only verified activities stay in the main guide; Tried and Rejected remain browsable in `#archive` without appearing as recommendations.
- Rationale: A neutral firsthand visit is useful evidence but should not be forced into either a recommendation or a harsh rejection. Keeping all three outcomes in one ledger makes the guide honest and prevents later research from restoring places that already proved merely average.
- Alternatives considered: Keep merely okay places active without a marker; classify every neutral visit as rejected; add a second archive route; show inactive Tried cards in the main guide.
- Consequences / follow-ups: Meowtropolis, Roberto's, and Salmon Guru appear under Tried. The Wall, Brunch & Cake, and Butterfly Garden appear under Rejected. Content audits require both inactive statuses to stay out of `ITEMS`, while the existing Tried & liked filter remains verified-only. The later full-record decision restores useful historical galleries without restoring the activities to recommendations.

## 2026-08-23 — Add Boomah as a candid Abu Dhabi animal experience
- Decider: Anthony and Codex (model: gpt-5.2-codex)
- Decision: Add Boomah Owl Café to the final animal chapter after Camel Farm, while naming its Abu Dhabi location plainly and exposing the captive-owl welfare trade-off. Keep it a standard card rather than book-ahead because the venue does not require reservations; direct visitors to confirm the unpublished live owl-room price before driving.
- Rationale: Boomah is current, visually distinctive, and the only live-owl café substantiated by official UAE sources. The similarly named Dubai listings are ordinary cafés without live owls. The experience remains contentious, so a useful guide must distinguish the operator's claims about supervision, controlled rooms, limited interaction, and rest from independent criticism of handling captive owls.
- Alternatives considered: Mislabel Boomah as a Dubai venue; omit it entirely because of the welfare objection; add the unrelated OWL Café in Al Garhoud; present the former AED 70 price as current; classify it as a scarce reservation.
- Consequences / follow-ups: Keep Boomah below the conservation-led activities and after Camel Farm, with observation through the glass presented as a legitimate lower-contact option. Recheck hours and price before the Abu Dhabi drive. Maintain four exact-venue images with visible and machine-readable source credit; replace or enrich the credits if named photographers become available.

## 2026-08-22 — Represent the all-open guide with `#everything`
- Decider: Anthony
- Decision: Clicking Open everything pushes `#everything`. Parsing that route explicitly opens all chapters on direct load, Back, or Forward. Repeating the action at `#everything` does not create another entry; filters continue changing view state without creating navigation history. A fragment-free first load still defaults to every chapter open.
- Rationale: A copied URL should reproduce the visible expansion state, and explicit chapter navigation already participates in session history. A fragment-free history entry proved ambiguous because route synchronization correctly interpreted it as no navigation instruction and therefore could not restore the all-open state after Back/Forward.
- Alternatives considered: Leave the chapter fragment in place; use a fragment-free pushed entry; remove the fragment with `replaceState`; push history for filters whenever they expand all chapters.
- Consequences / follow-ups: `src/domain/deepLinks.ts` recognizes `#everything`, and `src/hooks/useDeepLink.ts` preserves the current path, query, and unrelated history state while navigating to it. The App route synchronizer owns reopening all chapters. Browser QA should confirm the production traversal when a controllable browser is connected.

## 2026-08-22 — Preserve firsthand outcomes separately from candidate research
- Status: Expanded by “Preserve merely tried places as a third firsthand outcome” on 23 Aug 2026.
- Decider: Anthony
- Decision: Keep one durable firsthand ledger with `verified` and `rejected` outcomes. Verified activities remain in the active guide with a date-stamp-style thumbs-up over the card image, a textual `Tried & liked` sheet callout, and an exclusive filter; rejected activities leave active content and production galleries but remain visible in the footer's `Tried & decided` archive.
- Rationale: A positive visit is stronger evidence than editorial research and should make a recommendation easier to find, while an explicit rejection must survive later content refreshes so a weak activity cannot quietly return.
- Alternatives considered: Remove rejected activities without a record; mix verified status into favorites; keep rejected cards in the main guide with a warning; maintain separate unconnected lists for tried and rejected places.
- Consequences / follow-ups: `src/data/archive.ts` is the canonical outcome ledger. Content audits require rejected IDs to be inactive and verified IDs to stay active. A rejection removes its selected public photos, manifest/attribution rows, and active image-work rows in lockstep; a verified entry gains an image-contained card stamp, a sheet callout, and the sticky filter without changing favorites. Changing either planning filter expands every chapter so the new result set never inherits a collapsed navigation state.

## 2026-08-20 — Add OPA without inventing a plate-stack promise
- Decider: Anthony and Codex (model: gpt-5.2-codex)
- Decision: Add OPA Dubai to Long dinners as a book-ahead dinner-show activity, led by an exact plate-smashing photograph and supported by a four-image venue-specific gallery. State that plate smashing is part of the experience, but do not promise a stack size, included quantity, or add-on price that the current venue pages do not publish.
- Rationale: OPA's current official site confirms the Fairmont Dubai restaurant, live entertainment, and plate smashing, making it a strong match for Anthony's long-standing interest. Its booking path is live, but the official sources leave the plate allocation and closing time partly ambiguous.
- Alternatives considered: Omit OPA until the number of plates is published; present plate smashing as a guaranteed stack; place it under Odd little worlds instead of dinner experiences.
- Consequences / follow-ups: Keep the card in Long dinners, ask about plate quantity and entertainment timing when reserving, and retain the explicit floor-only safety guidance. Recheck the venue's live schedule and plate policy before booking.

## 2026-08-13 — Organize Favorites by planning urgency
- Decider: Anthony and Codex (model: gpt-5.2-codex)
- Decision: Divide the favorites sheet into Dated events, Book ahead, and Everything else. Give dated status precedence, sort those events chronologically, preserve save order elsewhere, and make each saved item a native detail link while keeping removal independent.
- Rationale: A flat saved list captures interest but does little to help turn it into a plan. Calendar commitments and scarce reservations need to surface before flexible ideas, and direct sheet access removes the need to hunt for an activity again.
- Alternatives considered: Keep one list with inline badges; group by chapter; sort every group editorially; duplicate dated-and-ahead activities in two sections.
- Consequences / follow-ups: Dated favorites appear exactly once with a semantic date tile. Empty groups are omitted, and the lone remaining visible group header is suppressed when only one category is populated. Semantic region labels remain available, the copied/shared favorite order remains unchanged, and modified clicks retain native link behavior.

## 2026-08-13 — Credit every deployed photo without making permission a release gate
- Decider: Anthony
- Decision: Keep the private personal guide's existing photo set, publish a lightweight footer credits sheet, and expose matching compact JSON plus Schema.org JSON-LD. Record the exact creator and license where available; otherwise credit the identified creator or recorded source without implying permission or endorsement.
- Rationale: The site is a private personal toy with no profit or promotion, so rights clearance is not proportionate as a deployment gate. Creators still deserve visible, durable credit, especially where Creative Commons terms specify it.
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
- Status: The snapshot requirement was superseded by “Favor repair-and-redeploy over rollback snapshots” on 23 Aug 2026.
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
