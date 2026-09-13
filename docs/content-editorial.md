# Activity content and editorial ordering

`src/data/activities.ts` is the canonical source for the six featured hero IDs, chapter labels, activity metadata, recommendation rank, and gallery counts. Pure ordering and card-treatment rules live in `src/domain/activity.ts`; React components consume those typed results without maintaining a second content model.

## Editorial voice

Write as a well-informed close friend: warm, direct, and specific about how to make an outing work. Second-person guidance is welcome, but activity copy must not invent a narrator's tastes, memories, plans, relationship, or skill level. Confirmed site-level personal facts belong in explicit configuration such as `src/config/site.ts`, never buried in generated prose.

- Avoid first-person language in chapter names and visitor-facing activity fields.
- Ground enthusiasm in something concrete: setting, format, timing, scale, atmosphere, or a useful trade-off.
- Prefer a practical recommendation over generic praise. Say when to go, what to pair, what to book, or why one option suits a particular mood.
- Keep `blurb` compact enough for cards while giving each activity a distinct reason to exist.
- Keep `cta` short, active, and specific to the experience.
- Preserve factual qualifiers in `when`, `where`, `ahead`, `facts`, `advisory`, and `dated`; do not turn uncertain or future details into claims.
- Use `facts` for compact, source-backed planning details and `advisory` for one caveat that materially changes the visit. Attribute an operator's welfare claim rather than presenting it as independent verification.
- Keep facts selective: one to four unique labels, no restatement of automatic Date/When/Where/Book ahead rows, and no filler added merely because the sheet supports a grid. Keep the single advisory under 240 characters.

The primary-source snapshot behind the expanded planning fields lives in [activity-planning-sources.md](activity-planning-sources.md). Update the ledger whenever a structured claim changes; prices, schedules, temporary closures, and availability are intentionally treated as reviewable facts rather than timeless copy.

The content audit scans every displayed copy field, including structured fact labels and values. Link paths are intentionally excluded because URL strings can contain coincidental first-person tokens.

## Tried and decided outcomes

`src/data/archive.ts` is the durable ledger for places Anthony has personally tried or deliberately ruled out. Use `verified` only after a positive firsthand visit: the activity stays in `ITEMS` and gains a visible marker plus access through the Tried & liked filter. Use `tried` when a place was acceptable but did not earn a recommendation. Use `rejected` after either a negative visit or an explicit pre-visit decision; the archive note must state which basis applies so screening is never presented as firsthand experience. Both inactive outcomes leave `ITEMS` but retain an `ARCHIVE_ACTIVITY_DETAILS` record for their full sheet. Archive blurbs, eyebrows, schedules, and facts describe the activity itself in the same expert-guide voice as active content; the separate archive note and sheet callout own the decision. Preserve or source a contiguous gallery with canonical manifest and attribution rows whenever honest venue-specific imagery is available. Use `photos: 0` and the typographic fallback only when no such gallery exists.

Do not infer an outcome from generated editorial copy, ratings, source research, or a favorite. The ledger records user-supplied experience or explicit curation decisions, while the main guide continues to use the warm expert-friend voice without pretending generated opinions are firsthand.

The Pods is the canonical pre-visit example: it stays sheet-ready under Rejected with its existing gallery and source-backed planning context, while its note states that the decision came from review rather than a visit.

A preference established at another branch or in another city may justify adding a local candidate, but it does not verify that local kitchen. Name the cross-market reason in the active card, keep the exact local branch out of `ARCHIVE_ENTRIES`, and state clearly that it still needs a visit. Amritsr Al Karama follows this rule: the Bangkok restaurants supply the benchmark, while the Dubai branch remains untested.

Lock, Stock & Barrel is the canonical branch-scoped nightlife outcome. Keep the record tied to Business Bay and preserve the sheet advisory that its dance-floor and crowd observations do not apply to the separate Barsha Heights or JBR locations. Its gallery must depict Business Bay only; never let chain-wide operator copy turn one branch visit into a verdict on every room.

## Chapter ordering and treatments

Array position is the recommendation rank for undated activities within a chapter. `orderChapterItems` applies the shared dated-event rule:

1. Extract entries with `dated` metadata.
2. Sort them chronologically by the ISO `dated.on` value, retaining source order for a tie.
3. Distribute them as evenly as possible through the ranked undated entries.

This keeps date-stamped cards chronological and prevents them from forming a repetitive block. Moving a dated declaration around the source array does not choose its rendered slot; changing the undated rank or the set of dated entries does. Keep dated declarations themselves in chronological source order for readability.

Card treatment precedence is dated, book-ahead, intentional no-photo fallback, then the repeating standard sequence `bleed`, `letter`, `top`, `slab`, `columns`, `bite`. A dated activity keeps the shared calendar treatment even when it also carries `ahead`; the sheet still exposes the booking warning. The standard counter resets for each chapter and for each archive outcome group, and it does not advance for a special treatment. All current active and archive activities have local photography, so the no-photo fallback is not active.

Use `ahead` for genuinely high-friction planning such as mandatory advance contact, scarce inventory, or a seasonal closure—not merely because a reservation is available. An ongoing seasonal reopening belongs in `when`, `ahead`, or `advisory`; reserve `dated` for a specific event date or bounded event range.

Every `dated.on` value must be on or after the local `TRIP_START_DATE_KEY` in `src/config/site.ts`. Advance a recurring event to its next verified occurrence, remove an expired one-off, and leave a seasonal opening undated until the operator publishes an exact day. Retiring an activity also means removing its selected gallery files, canonical manifest rows, and active image-work fragment rows; history remains available in Git and the source ledger.

## Climbing gym choices

Every bouldering gym must include the literal words **climbing** and **bouldering** in its visible card blurb so browser Find can locate it with either term. This applies to active and archived cards; detail-only facts, image alt text, links, and hidden keywords do not satisfy it.

Mountain Extreme is rejected after the 12 September 2026 visit despite very well-set routes. Keep the liquid-chalk-only restriction, the firsthand grip/reapplication problems, and the Petzl-only exception for personal top-rope harnesses in its decision record. Preserve its four-photo archived sheet and describe the venue neutrally; do not restore it as the default all-round climbing recommendation.

Boulder Zone remains the firsthand liked option. GoClimb and Rock Republic were already active candidates; both are in Dubai Investment Park 1 (DIP), not DIFC, and neither has a firsthand verdict. Keep their separate existing IDs and galleries. Rock Republic's published terms prefer liquid to powder and welcome personal chalk bags; GoClimb sells powdered chalk but does not explicitly publish permission to use it on its walls. Preserve the dated source evidence and contact-first chalk caveats rather than declaring either gym powder-approved.

## Restaurant menu preferences

Anthony dislikes ordinary prix-fixe/set menus; tasting menus are the exception. Favor à-la-carte ordering when available and distinguish a chef’s tasting progression from a fixed-price starter/main/dessert package. A disliked package does not reject the restaurant itself.

## Mimi Kakushi

Keep Mimi Kakushi high in Long dinners as a Japanese date-night candidate approved from its atmosphere and menu, without inferring a firsthand verdict. Focus the card and booking CTA on à-la-carte sharing plates. Anthony explicitly rejected the Yūshoku package; omit its promotion, pricing and format from the public card while retaining the dated research in the source ledger. Preserve the restaurant’s dress, age and cancellation details. Same-night availability observed on 12 September supports inclusion but must not become an evergreen promise or a Plan ahead marker. The operator’s dated holiday kitchen hours are not a permanent last-order rule. See [activity-planning-sources.md](activity-planning-sources.md).

## Spanish tapas dinners

Anthony explicitly loves tapas. Keep Lola Taberna Española and Salero in Long dinners with literal “Spanish” and “tapas” in their visible blurbs. Lola leads for a relaxed classic-tapas evening; Salero adds a scheduled flamenco dinner at Kempinski Mall of the Emirates. These are researched candidates, not firsthand verified visits. Preserve Lola’s missing Monday schedule and Salero’s separation between restaurant and performance hours. BOCA closed its DIFC venue on 31 March 2026 and has no verified reopening; exclude it until a dated reopening and current address are confirmed. Current evidence and the closed Jaleo exclusion live in [activity-planning-sources.md](activity-planning-sources.md).

For restaurant additions, check recent closure/relocation announcements explicitly as well as operator menus and hours. A live website, booking link or current-year award does not establish current operation; both BOCA and Jaleo retained misleading old pages after closure.

## Adult arcade nights

Keep both selected adult game bars in `Nights that go loud`. A firsthand visit established Brass Monkey City Walk as a fun date built around mini basketball, bowling, darts, and quick interactive games—not a deep American-style Barcade cabinet collection. The firsthand food follow-up praises really good bar food: nachos too large for three people to finish, lamb chops good for a bar, and BBQ ribs so tender they cannot be picked up without falling off the bone. Keep the overall food verdict in the card and the dish details in its firsthand note. It stays ahead of Triple 777 because the date worked in practice; Triple 777 follows later as the neon, later-running 21+ alternative. Each card should remain candid about format and live package details the venue does not publish.

Wavehouse is intentionally excluded because its Atlantis setting and programming skew too family-focused, while BOOM Battle Bar is an activity bar rather than a meaningful arcade. HUSHH at Social Distrikt remains a screened but unpublished option: consider it only if a future refresh needs a polished Downtown barcade with fewer cabinets than Brass Monkey.

## Karting formats

Keep the three published karting experiences distinct instead of treating them as interchangeable track options. Chaos Karts stays in `Genuinely strange` because the projected hazards and game world are the point. Dubai Kartdrome Outdoor ranks high in `Adrenaline` as the conventional racing choice, where a 1.2-kilometre floodlit circuit and lap time reward cleaner lines. No Grip DXB follows in `Adrenaline` as a control exercise built around holding a slide on a two-level indoor track rather than racing laps.

Do not add another Dubai karting venue unless it contributes a materially different format or clearly beats one of these three at its existing job. Recheck Kartdrome's live track calendar before leaving and preserve No Grip's `ahead` treatment while its operator continues to warn that walk-in sessions can sell out.

## Small-room comedy

Keep the three stand-up entries in `Genuinely strange` because their sparse calendars make choice more useful than a single winner. Joke Hub ranks as the closest match for a permanent Greenwich Village-style room: a purpose-built, close-audience space with a rotating local bill every Saturday. Comedy at the Speakeasy is the selected-Sunday bar-room alternative, while The Laughter Factory is the short monthly tour for a more polished international bill.

Do not flatten those formats into generic “stand-up in Dubai” cards. Preserve current dates in each sheet, use `dated` for the bounded Speakeasy and Laughter Factory runs, and advance or retire those dates once they pass. Keep Joke Hub evergreen but refresh its current-date fact and retain the start-time discrepancy until Mad Cat and Platinumlist agree.

Keep Courtyard Playhouse and Karak After Dark separate for the same reason. Courtyard is the dependable recurring improv room: Monday `This Is Impro & Sing It` and Wednesday audience-scored `Maestro`, both free but guest-list-first with no guaranteed seat. Karak After Dark is a dated, paid mixed bill at The Junction that combines improv, comedy, and music around audience suggestions. Refresh Courtyard's current dates as a living schedule; retire or advance Karak after its bounded 10 September event rather than turning it into an unsupported evergreen card.

## Firsthand club nights

Keep BLU Dubai high among the evergreen options in `Nights that go loud`. The 27 August 2026 Shutdown visit proved the Thursday crowd, hip-hop programming, and table-led energy strong enough for a major celebration. Stay candid that dancing happens mainly in the open space around the central bar rather than on a large dedicated floor. Complimentary tables and bottles for women materially shaped the successful crowd balance, but they are not part of the planning burden for a mixed group: a normal walk-in worked and BLU must not carry `ahead` guidance or a reservation CTA.

Keep Lock, Stock & Barrel Business Bay in Tried rather than the active guide or Tried & liked. The visit found a fun atmosphere, but its very small dance floor and only moderately mingle-friendly crowd made the overall night fun rather than great. Treat Barsha Heights and JBR as unevaluated rather than inheriting the Business Bay outcome.

Amazónico requires a dinner reservation, but the firsthand visit secured one on the same day. Keep the direct booking route and state that same-day evidence in the advisory, but do not use `ahead`: reservation availability alone is not enough to classify an activity as Plan ahead.

## Dubai Mall shopping boundary

Fashion Avenue is rejected as an active shopping recommendation because a firsthand Dubai Mall visit found the tourist-crowd intensity miserable. Keep the former card under Rejected so it cannot drift back during a refresh. The decision applies to shopping at Dubai Mall, not to unrelated in-mall activities such as ARTE Museum or House of Hype. Preserve independent shopping coverage through Ibn Battuta Mall, Fashion Dome at Mall of the Emirates, and The Outlet Village unless each is evaluated on its own merits.

## Final animal chapter

`Fur, feathers and scales` is intentionally the twelfth and final chapter so it remains visibly new to readers of the earlier guide. Its curated order is:

`rasalkhor` → `falconhospital` → `turtlerehab` → `platinumcamel` → `vibrissae` → `camelfarm` → `boomah` → `fluffin`

The order leads with the most distinctive conservation experiences and strongest photography, keeps the three real book-ahead treatments at positions 2, 4, and 6, and places the venues with thinner public operating detail later. None is a true dated event. Butterfly Garden and Meowtropolis moved to the firsthand archive after real visits; Crocodile Park, Dubai Safari Park, The Cat Café Arjan, rescue meetups, and redundant or low-confidence venues remain outside the published roster.

## Hero carousel

The featured list lives in the `HERO` constant in `src/data/activities.ts`. The current sequence is:

`nest` → `teamlab` → `rasalkhor` → `elrow` → `skydive` → `laperle`

The selection favors recommendation quality and photography, moving from intimate desert to immersive art, a wild wetland against the skyline, nightlife spectacle, iconic Dubai action, and live performance. Ras Al Khor gives the new chapter one conservation-first feature while removing the former second quiet-desert image. A hero activity must have at least three local gallery images, including a valid `-01.jpg` lead frame. Judge every replacement at mobile and desktop crops and avoid near-duplicate visual stories merely because a gallery is large.

## Verification

After changing activities, chapters, dates, heroes, or photo counts, run:

```sh
npm run audit:content
python3 scripts/audit-photo-manifest.py
```

The TypeScript audit checks chapter and activity IDs, required copy, first-person language, links, structured-fact/advisory limits, real and post-arrival ISO dates, chronological rendered order, optimal dated-card separation, hero references, active gallery depth, archive/detail invariants, retired IDs, and the one-to-one relationship between active-plus-archive photo counts and JPEGs in `public/photos/`.
